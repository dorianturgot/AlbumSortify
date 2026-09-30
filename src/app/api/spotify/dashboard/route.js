import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchSavedAlbums, fetchNewReleases, fetchTopArtists, fetchArtistAlbums } from "@/lib/spotify";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch saved albums and top artists (short, medium, long term)
    const [savedAlbums, shortTermArtists, mediumTermArtists, longTermArtists] = await Promise.all([
      fetchSavedAlbums(session.user.id),
      fetchTopArtists(session.user.id, 50, "short_term"),
      fetchTopArtists(session.user.id, 50, "medium_term"),
      fetchTopArtists(session.user.id, 50, "long_term")
    ]);

    // Combine and deduplicate artists
    const uniqueArtistsMap = new Map();
    [...(shortTermArtists.items || []), ...(mediumTermArtists.items || []), ...(longTermArtists.items || [])].forEach(artist => {
      if (!uniqueArtistsMap.has(artist.id)) {
        uniqueArtistsMap.set(artist.id, artist);
      }
    });
    
    // Convert back to array (can be up to 100 artists)
    const allTopArtists = Array.from(uniqueArtistsMap.values());

    // Batch requests to avoid rate limits (Promise.all is fine for ~100 requests, but let's be safe)
    const artistAlbumsPromises = allTopArtists.map(artist => 
       fetchArtistAlbums(session.user.id, artist.id).catch(() => null)
    );
    const artistAlbumsResults = await Promise.all(artistAlbumsPromises);

    let personalizedReleases = [];
    const seenAlbumNames = new Set();

    artistAlbumsResults.forEach(res => {
       if (res && res.items && res.items.length > 0) {
           // Spotify returns them sorted by release date. Let's check the first few.
           for (const album of res.items) {
               // Spotify groups EPs and Singles both as "single". We filter out 1-2 track singles.
               const isSingle = album.album_type === "single" && album.total_tracks < 3;
               
               if (!seenAlbumNames.has(album.name) && !isSingle) {
                   seenAlbumNames.add(album.name);
                   personalizedReleases.push(album);
                   // We only care about the very last release per artist to ensure diversity
                   break;
               }
           }
       }
    });

    // Sort all gathered releases by release_date (newest first)
    personalizedReleases.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
    
    // Filter by 3 months, but if that gives less than 25, just keep the top 25 newest anyway
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    let recentReleases = personalizedReleases.filter(a => new Date(a.release_date || 0) >= threeMonthsAgo);
    
    if (recentReleases.length < 25) {
      recentReleases = personalizedReleases.slice(0, 25);
    } else {
      recentReleases = recentReleases.slice(0, 25);
    }

    return NextResponse.json({
      savedAlbums: savedAlbums.items?.map(i => i.album) || [],
      newReleases: recentReleases,
      topArtists: (longTermArtists.items || []).slice(0, 20) // Display top 20 long-term artists on the UI
    });
  } catch (error) {
    console.error("Failed to fetch dashboard widgets from Spotify:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}

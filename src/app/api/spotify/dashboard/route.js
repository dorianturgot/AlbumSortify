import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchSavedAlbums, fetchNewReleases, fetchTopArtists, fetchArtistAlbums } from "@/lib/spotify";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch saved albums and top artists (short term and long term)
    const [savedAlbums, shortTermArtists, longTermArtists] = await Promise.all([
      fetchSavedAlbums(session.user.id),
      fetchTopArtists(session.user.id, 50, "short_term"),
      fetchTopArtists(session.user.id, 50, "long_term")
    ]);

    // Combine and deduplicate artists
    const uniqueArtistsMap = new Map();
    [...(shortTermArtists.items || []), ...(longTermArtists.items || [])].forEach(artist => {
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

    // 3 months ago threshold
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    artistAlbumsResults.forEach(res => {
       if (res && res.items && res.items.length > 0) {
           // Spotify returns them sorted by release date. Let's check the first few.
           for (const album of res.items) {
               // Only consider actual albums or single releases, not compilations usually, but let's keep it simple
               if (!seenAlbumNames.has(album.name)) {
                   const releaseDate = new Date(album.release_date || 0);
                   if (releaseDate >= threeMonthsAgo) {
                       seenAlbumNames.add(album.name);
                       personalizedReleases.push(album);
                   } else {
                       // Since they are sorted by date, if this one is too old, the rest are too old as well.
                       break; 
                   }
               }
           }
       }
    });

    // Sort all gathered releases by release_date (newest first)
    personalizedReleases.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));

    return NextResponse.json({
      savedAlbums: savedAlbums.items?.map(i => i.album) || [],
      newReleases: personalizedReleases.slice(0, 20), // Keep up to 20 recent releases
      topArtists: (longTermArtists.items || []).slice(0, 20) // Display top 20 long-term artists on the UI
    });
  } catch (error) {
    console.error("Failed to fetch dashboard widgets from Spotify:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}

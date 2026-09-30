import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchSavedAlbums, fetchTopArtists, fetchArtistAlbums, fetchFollowedArtists } from "@/lib/spotify";

// Global cache for heavy new releases computation
const newReleasesCache = new Map();

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // We always fetch saved albums (fast, 1 request) to keep it real-time
    const savedAlbumsExt = await fetchSavedAlbums(session.user.id, 50).catch(() => null);

    const cacheKey = session.user.id;
    const cachedReleases = newReleasesCache.get(cacheKey);
    let recentReleases = [];
    let topArtistsForUI = [];

    // Cache the heavy "New Releases" computation for 30 minutes
    if (cachedReleases && Date.now() - cachedReleases.timestamp < 1000 * 60 * 30) {
      recentReleases = cachedReleases.data;
      topArtistsForUI = cachedReleases.topArtists;
    } else {
      // Fetch top artists and followed artists
      const [shortTermArtists, mediumTermArtists, longTermArtists, followedArtistsRes] = await Promise.all([
        fetchTopArtists(session.user.id, 50, "short_term").catch(() => null),
        fetchTopArtists(session.user.id, 50, "medium_term").catch(() => null),
        fetchTopArtists(session.user.id, 50, "long_term").catch(() => null),
        fetchFollowedArtists(session.user.id, 50).catch(() => null)
      ]);

      // Combine and deduplicate artists from all these sources
      const uniqueArtistsMap = new Map();

      const addArtist = (artist) => {
        if (artist && artist.id && !uniqueArtistsMap.has(artist.id)) {
          uniqueArtistsMap.set(artist.id, artist);
        }
      };

      [...(shortTermArtists?.items || []), ...(mediumTermArtists?.items || []), ...(longTermArtists?.items || [])].forEach(addArtist);
      
      if (followedArtistsRes && followedArtistsRes.artists && followedArtistsRes.artists.items) {
        followedArtistsRes.artists.items.forEach(addArtist);
      }

      if (savedAlbumsExt && savedAlbumsExt.items) {
        savedAlbumsExt.items.forEach(item => {
          if (item.album && item.album.artists) {
            item.album.artists.forEach(addArtist);
          }
        });
      }
      
      // Convert back to array and limit to max 80 artists to avoid network overload
      const allTopArtists = Array.from(uniqueArtistsMap.values()).slice(0, 80);

      // Batch requests to fetch their latest albums
      const artistAlbumsPromises = allTopArtists.map(artist => 
         fetchArtistAlbums(session.user.id, artist.id).catch(() => null)
      );
      const artistAlbumsResults = await Promise.all(artistAlbumsPromises);

      let personalizedReleases = [];
      const seenAlbumNames = new Set();

      artistAlbumsResults.forEach(res => {
         if (res && res.items && res.items.length > 0) {
             for (const album of res.items) {
                 const isSingle = album.album_type === "single" && album.total_tracks < 3;
                 
                 if (!seenAlbumNames.has(album.name) && !isSingle) {
                     seenAlbumNames.add(album.name);
                     personalizedReleases.push(album);
                     break;
                 }
             }
         }
      });

      personalizedReleases.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
      
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      recentReleases = personalizedReleases.filter(a => new Date(a.release_date || 0) >= threeMonthsAgo);
      if (recentReleases.length < 25) {
        recentReleases = personalizedReleases.slice(0, 25);
      } else {
        recentReleases = recentReleases.slice(0, 25);
      }

      topArtistsForUI = (longTermArtists?.items || []).slice(0, 20);

      // Save to cache
      newReleasesCache.set(cacheKey, { 
        timestamp: Date.now(), 
        data: recentReleases,
        topArtists: topArtistsForUI
      });
    }

    return NextResponse.json({
      savedAlbums: savedAlbumsExt?.items?.slice(0, 20).map(i => i.album) || [],
      newReleases: recentReleases,
      topArtists: (longTermArtists?.items || []).slice(0, 20) // Display top 20 long-term artists on the UI
    });
  } catch (error) {
    console.error("Failed to fetch dashboard widgets from Spotify:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}

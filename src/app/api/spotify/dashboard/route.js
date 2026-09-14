import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchSavedAlbums, fetchNewReleases, fetchTopArtists } from "@/lib/spotify";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [savedAlbums, newReleases, topArtists] = await Promise.all([
      fetchSavedAlbums(session.user.id),
      fetchNewReleases(session.user.id),
      fetchTopArtists(session.user.id)
    ]);

    return NextResponse.json({
      savedAlbums: savedAlbums.items?.map(i => i.album) || [],
      newReleases: newReleases.albums?.items || [],
      topArtists: topArtists.items || []
    });
  } catch (error) {
    console.error("Failed to fetch dashboard widgets from Spotify:", error);
    return NextResponse.json({ error: "Failed to fetch Spotify data" }, { status: 500 });
  }
}

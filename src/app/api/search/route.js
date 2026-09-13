import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { searchSpotify } from "@/lib/spotify";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "album";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const results = await searchSpotify(session.user.id, query, type, limit);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Spotify search failed" }, { status: 500 });
  }
}

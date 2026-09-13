import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, artist, pictureUrl, url, releaseDate, spotifyId, totalTracks, listId } = body;

  if (!listId || !spotifyId) {
    return NextResponse.json({ error: "listId and spotifyId are required" }, { status: 400 });
  }

  // Verify list ownership
  const list = await prisma.albumList.findUnique({ where: { id: listId } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const album = await prisma.album.create({
      data: {
        name,
        artist,
        pictureUrl,
        url,
        releaseDate,
        spotifyId,
        totalTracks,
        listId,
      },
    });
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Could not add album. Maybe it already exists in the list." }, { status: 500 });
  }
}

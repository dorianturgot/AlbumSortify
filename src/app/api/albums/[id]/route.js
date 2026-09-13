import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
    include: { list: true },
  });

  if (!album) return NextResponse.json({ error: "Album not found" }, { status: 404 });
  if (album.list.userId !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.album.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete album" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lists = await prisma.albumList.findMany({
    where: { userId: session.user.id },
    include: { albums: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(lists);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, color } = await req.json();

  if (!name || !color) {
    return NextResponse.json({ error: "Name and color are required" }, { status: 400 });
  }

  try {
    const list = await prisma.albumList.create({
      data: {
        name,
        color,
        userId: session.user.id,
      },
    });
    return NextResponse.json(list, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Could not create list" }, { status: 500 });
  }
}

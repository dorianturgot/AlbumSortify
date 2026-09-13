import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const list = await prisma.albumList.findUnique({
    where: { id },
    include: { albums: true },
  });

  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  return NextResponse.json(list);
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, color } = await req.json();

  const list = await prisma.albumList.findUnique({ where: { id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const updatedList = await prisma.albumList.update({
      where: { id },
      data: { name, color },
    });
    return NextResponse.json(updatedList);
  } catch (error) {
    return NextResponse.json({ error: "Could not update list" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const list = await prisma.albumList.findUnique({ where: { id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.albumList.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not delete list" }, { status: 500 });
  }
}

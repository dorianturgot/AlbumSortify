import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { fetchCurrentlyPlaying } from "@/lib/spotify";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await fetchCurrentlyPlaying(session.user.id);
    return NextResponse.json(data || { is_playing: false });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

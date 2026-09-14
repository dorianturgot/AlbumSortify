import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GlobalSearch from "@/components/GlobalSearch";
import DashboardLists from "./DashboardLists";
import SpotifyDashboardWidgets from "./SpotifyDashboardWidgets";

export default async function Dashboard({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const resolvedParams = await searchParams;
  const sortOrder = resolvedParams?.sort === "asc" ? "asc" : "desc";

  const lists = await prisma.albumList.findMany({
    where: { userId: session.user.id },
    include: { albums: { orderBy: { createdAt: 'asc' } } },
  });

  lists.sort((a, b) => {
    const aTime = a.albums.length > 0 ? new Date(a.albums[a.albums.length - 1].createdAt).getTime() : new Date(a.createdAt).getTime();
    const bTime = b.albums.length > 0 ? new Date(b.albums[b.albums.length - 1].createdAt).getTime() : new Date(b.createdAt).getTime();
    
    return sortOrder === "desc" ? bTime - aTime : aTime - bTime;
  });

  return (
    <div className="space-y-16">
      <GlobalSearch userLists={lists} />

      <section>
        <DashboardLists lists={lists} />
      </section>

      <SpotifyDashboardWidgets userLists={lists} />
    </div>
  );
}

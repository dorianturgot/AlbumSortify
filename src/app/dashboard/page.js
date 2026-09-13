import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CreateListForm from "./CreateListForm";
import AlbumCarousel from "@/components/AlbumCarousel";
import GlobalSearch from "@/components/GlobalSearch";
import SearchArtists from "@/components/SearchArtists";
import SortListsButton from "./SortListsButton";
import DashboardLists from "./DashboardLists";
import { fetchSavedAlbums, fetchNewReleases, fetchTopArtists } from "@/lib/spotify";
import { FaMusic, FaCompactDisc, FaStar } from "react-icons/fa";

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

  let savedAlbums = { items: [] };
  let newReleases = { albums: { items: [] } };
  let topArtists = { items: [] };

  try {
    savedAlbums = await fetchSavedAlbums(session.user.id);
    newReleases = await fetchNewReleases(session.user.id);
    topArtists = await fetchTopArtists(session.user.id);
  } catch (error) {
    console.error("Failed to fetch from Spotify:", error);
  }

  return (
    <div className="space-y-16">
      <GlobalSearch userLists={lists} />

      <section>
        <DashboardLists lists={lists} />
      </section>

      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaCompactDisc className="text-white" /> Latest saved albums
        </h2>
        <AlbumCarousel items={savedAlbums.items?.map(i => i.album) || []} userLists={lists} />
      </section>

      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaStar className="text-yellow-400" /> New releases
        </h2>
        <AlbumCarousel items={newReleases.albums?.items || []} userLists={lists} />
      </section>

      <section className="pb-10">
        <h2 className="text-2xl font-bold mb-6">Your top artists</h2>
        <div className="flex overflow-x-auto space-x-6 pb-6 invisible-scrollbar">
          {topArtists.items?.map((artist) => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="flex flex-col items-center group flex-none">
              <div className="relative mb-3 inline-block">
                <img 
                  src={artist.images[0]?.url} 
                  alt={artist.name} 
                  className="w-36 h-36 rounded-full object-cover shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300" 
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <span className="text-sm font-bold text-gray-200 group-hover:text-green-400 transition-colors">{artist.name}</span>
            </Link>
          ))}
        </div>
        <SearchArtists />
      </section>
    </div>
  );
}

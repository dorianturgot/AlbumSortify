import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaCompactDisc, FaSearch } from "react-icons/fa";
import ListActions from "./ListActions";
import SearchAlbums from "./SearchAlbums";
import DeleteListButton from "./DeleteListButton";
import EditListButton from "./EditListButton";
import ShareListButton from "./ShareListButton";
import SortableCollection from "./SortableCollection";

export default async function ListPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  const list = await prisma.albumList.findUnique({
    where: { id },
    include: { albums: true },
  });

  if (!list) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl">Error retrieving the list.</p>
        <Link href="/" className="text-blue-400 mt-4 inline-block">Back to home</Link>
      </div>
    );
  }

  const isOwner = session?.user?.id === list.userId;
  const lastAlbum = list.albums.length > 0 ? list.albums[list.albums.length - 1] : null;

  return (
    <div className="space-y-10">

      <div 
        className="relative rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-end min-h-[300px] ring-1 ring-inset ring-white/10"
        style={{
          backgroundColor: list.color,
          backgroundImage: lastAlbum ? `url(${lastAlbum.pictureUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href={session ? "/dashboard" : "/"} className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <FaArrowLeft className="mr-2" /> Back
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-xl mb-2 tracking-tight line-clamp-2">
              {list.name}
            </h1>
            <p className="text-white/80 font-medium text-lg flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-2"><FaCompactDisc /> {list.albums.length} {list.albums.length === 1 ? "album" : "albums"}</span>
              <span className="text-white/50 hidden sm:inline">•</span>
              <span className="text-white/70 text-base">Created on {new Date(list.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <ShareListButton listId={list.id} listName={list.name} />
            {isOwner && (
              <>
                <EditListButton listId={list.id} initialName={list.name} initialColor={list.color} />
                <DeleteListButton listId={list.id} />
              </>
            )}
          </div>
        </div>
      </div>


      {isOwner && (
        <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl ring-1 ring-inset ring-white/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaSearch className="text-green-400" /> Add an album
          </h2>
          <SearchAlbums listId={list.id} />
        </section>
      )}


      <SortableCollection initialAlbums={list.albums} isOwner={isOwner} />
    </div>
  );
}

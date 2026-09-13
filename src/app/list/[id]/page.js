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
            <p className="text-white/80 font-medium text-lg flex items-center gap-2">
              <FaCompactDisc /> {list.albums.length} {list.albums.length > 1 ? "albums" : "album"}
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


      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl ring-1 ring-inset ring-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaCompactDisc className="text-blue-400" /> Collection
        </h2>
        {list.albums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50 text-lg">This list is empty. {isOwner ? "Search for an album above to add it!" : ""}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {list.albums.map((album) => (
              <div key={album.id} className="relative group cursor-pointer">
                <Link href={album.url} target="_blank" rel="noreferrer" className="block">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={album.pictureUrl} 
                      alt={album.name} 
                      className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <h4 className="font-bold text-xs sm:text-sm truncate text-white group-hover:text-green-400 transition-colors">{album.name}</h4>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{album.artist}</p>
                  </div>
                </Link>
                {isOwner && <ListActions albumId={album.id} />}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

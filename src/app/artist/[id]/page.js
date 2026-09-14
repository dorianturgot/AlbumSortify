import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchArtist, fetchArtistAlbums } from "@/lib/spotify";
import Link from "next/link";
import { FaArrowLeft, FaMusic } from "react-icons/fa";
import AddAlbumButton from "@/components/AddAlbumButton";

export default async function ArtistPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const { id } = await params;
  
  let artist = null;
  let albumsData = null;

  try {
    artist = await fetchArtist(session.user.id, id);
    albumsData = await fetchArtistAlbums(session.user.id, id);
  } catch (err) {
    console.error("Error fetching artist data:", err);
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl">Error retrieving artist information.</p>
        <Link href="/dashboard" className="text-blue-400 mt-4 inline-block">Back to dashboard</Link>
      </div>
    );
  }


  const uniqueAlbums = [];
  const seenNames = new Set();
  for (const album of albumsData.items) {
    if (!seenNames.has(album.name)) {
      seenNames.add(album.name);
      uniqueAlbums.push(album);
    }
  }

  return (
    <div className="space-y-10">

      <div 
        className="relative rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden flex flex-col justify-end min-h-[300px] ring-1 ring-inset ring-white/10"
        style={{
          backgroundColor: '#181818',
          backgroundImage: artist.images[0] ? `url(${artist.images[0].url})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <FaArrowLeft className="mr-2" /> Back
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-xl mb-2 tracking-tight line-clamp-2">
              {artist.name}
            </h1>
            <p className="text-white/80 font-medium text-lg flex items-center gap-2">
              <span className="capitalize">{artist.genres?.join(", ")}</span>
            </p>
          </div>
        </div>
      </div>


      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl ring-1 ring-inset ring-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaMusic className="text-green-400" /> Discography ({uniqueAlbums.length})
        </h2>
        
        {uniqueAlbums.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No albums found for this artist.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
            {uniqueAlbums.map((album) => (
              <div key={album.id} className="relative group cursor-pointer">
                <Link href={album.uri || `spotify:album:${album.id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={album.images[0]?.url} 
                      alt={album.name} 
                      className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>
                  <div className="mt-2 sm:mt-3">
                    <h4 className="font-bold text-xs sm:text-sm truncate text-white group-hover:text-green-400 transition-colors">{album.name}</h4>
                    <p className="text-[10px] sm:text-xs text-white/60 truncate">{album.release_date?.substring(0, 4)}</p>
                  </div>
                </Link>
                <AddAlbumButton album={album} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

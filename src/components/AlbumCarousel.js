"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AddAlbumButton from "./AddAlbumButton";

export default function AlbumCarousel({ items, userLists = [] }) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  if (!items || items.length === 0) return <p className="text-gray-400">Aucun album trouvé.</p>;

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex space-x-4 py-4 cursor-grab active:cursor-grabbing">
        {items.map((album) => (
          <div key={album.id} className="flex-none w-36 sm:w-40 group relative">
            <Link href={album.uri || `spotify:album:${album.id}`} draggable="false">
              <div className="relative">
                <img 
                  src={album.images[0]?.url} 
                  alt={album.name} 
                  draggable="false"
                  className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-md shadow-lg group-hover:opacity-75 transition-opacity pointer-events-none" 
                />
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-sm truncate text-gray-100">{album.name}</h4>
                <p className="text-xs text-gray-400 truncate">{album.artists.map(a => a.name).join(", ")}</p>
              </div>
            </Link>
            <AddAlbumButton album={album} userLists={userLists} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSortAmountDown, FaCompactDisc } from "react-icons/fa";
import ListActions from "./ListActions";

export default function SortableCollection({ initialAlbums, isOwner }) {
  const [sortMethod, setSortMethod] = useState("date-desc");

  // Create a copy to avoid mutating the prop
  const sortedAlbums = [...initialAlbums].sort((a, b) => {
    switch (sortMethod) {
      case "date-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "album":
        return a.name.localeCompare(b.name);
      case "year-desc":
        return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
      case "year-asc":
        return new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0);
      default:
        return 0;
    }
  });

  return (
    <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl ring-1 ring-inset ring-white/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCompactDisc className="text-blue-400" /> Collection
        </h2>
        
        {initialAlbums.length > 0 && (
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            <FaSortAmountDown className="text-white/50 text-sm" />
            <select
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
              className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer appearance-none outline-none"
            >
              <option value="date-desc" className="bg-[#181818]">Recently Added</option>
              <option value="artist" className="bg-[#181818]">Artist (A-Z)</option>
              <option value="album" className="bg-[#181818]">Album (A-Z)</option>
              <option value="year-desc" className="bg-[#181818]">Release Year (Newest)</option>
              <option value="year-asc" className="bg-[#181818]">Release Year (Oldest)</option>
            </select>
          </div>
        )}
      </div>

      {initialAlbums.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">This list is empty. {isOwner ? "Search for an album above to add it!" : ""}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
          {sortedAlbums.map((album) => (
            <div key={album.id} className="relative group cursor-pointer animate-in fade-in zoom-in duration-300">
              <Link href={`spotify:album:${album.spotifyId}`} className="block">
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
  );
}

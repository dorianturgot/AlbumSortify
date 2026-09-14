"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AlbumCarousel from "@/components/AlbumCarousel";
import SearchArtists from "@/components/SearchArtists";
import { FaCompactDisc, FaStar } from "react-icons/fa";

export default function SpotifyDashboardWidgets({ userLists }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-16 animate-pulse">
        <section className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10">
          <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-none w-36 sm:w-40 h-48 bg-white/5 rounded-md"></div>
            ))}
          </div>
        </section>
        <section className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10">
          <div className="h-8 w-64 bg-white/10 rounded mb-6"></div>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-none w-36 sm:w-40 h-48 bg-white/5 rounded-md"></div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaCompactDisc className="text-white" /> Latest saved albums
        </h2>
        <AlbumCarousel items={data.savedAlbums} userLists={userLists} />
      </section>

      <section className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <FaStar className="text-yellow-400" /> New releases
        </h2>
        <AlbumCarousel items={data.newReleases} userLists={userLists} />
      </section>

      <section className="pb-10">
        <h2 className="text-2xl font-bold mb-6">Your top artists</h2>
        <div className="flex overflow-x-auto space-x-6 pb-6 invisible-scrollbar">
          {data.topArtists.map((artist) => (
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

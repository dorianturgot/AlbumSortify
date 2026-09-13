"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaSpinner } from "react-icons/fa";

export default function SearchArtists() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=artist`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.artists?.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an artist..."
          className="w-full bg-white/5 text-white rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-[#1db954] border border-white/10 transition-shadow placeholder-gray-400"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <FaSpinner className="animate-spin text-[#1db954]" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="flex overflow-x-auto space-x-6 py-6 invisible-scrollbar">
          {results.map((artist) => (
            <Link key={artist.id} href={`/artist/${artist.id}`} className="flex flex-col items-center group flex-none">
              <div className="relative mb-3 inline-block">
                <img 
                  src={artist.images?.[0]?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(artist.name) + "&background=282828&color=fff"} 
                  alt={artist.name} 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300" 
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <span className="text-sm font-bold text-gray-200 group-hover:text-green-400 transition-colors truncate w-28 text-center">{artist.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

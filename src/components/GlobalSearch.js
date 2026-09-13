"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import AlbumCarousel from "@/components/AlbumCarousel";

export default function GlobalSearch({ userLists }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.albums?.items || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mb-12 bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaSearch className="text-green-500" />
        Search for an album
      </h2>
      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an album..."
          className="w-full bg-white/10 text-white rounded-full pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#1db954] border border-white/5 transition-shadow text-lg placeholder-white/40"
        />
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <FaSearch className="text-white/40 text-xl" />
        </div>
        
        {/* Search button / loader inside the input */}
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="bg-[#1db954] hover:bg-green-600 text-white p-2 rounded-full transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-300">Search results</h3>
          <AlbumCarousel items={results} userLists={userLists} />
        </div>
      )}
    </div>
  );
}

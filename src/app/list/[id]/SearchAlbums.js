"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchAlbums({ listId }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
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
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleAddAlbum = async (album) => {
    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: album.name,
        artist: album.artists.map((a) => a.name).join(", "),
        pictureUrl: album.images[0]?.url || "",
        url: album.external_urls.spotify,
        releaseDate: album.release_date,
        spotifyId: album.id,
        totalTracks: album.total_tracks,
        listId: listId,
      }),
    });

    if (res.ok) {
      setResults([]);
      setQuery("");
      router.refresh(); // Refresh page to show new album
    } else {
      alert("Error or album already in list.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for an album..."
          className="flex-1 bg-black/20 text-white rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 border border-white/10 transition-shadow"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin">
          {results.map((album) => (
            <div key={album.id} className="flex-none w-32 relative group">
              <img 
                src={album.images[0]?.url} 
                alt={album.name} 
                className="w-32 h-32 object-cover rounded shadow-md" 
              />
              <div className="mt-2 text-center">
                <h4 className="font-bold text-xs truncate">{album.name}</h4>
                <p className="text-xs text-gray-400 truncate">{album.artists[0]?.name}</p>
              </div>
              <button 
                onClick={() => handleAddAlbum(album)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-green-500 text-white rounded-full p-2 transition-opacity shadow-lg"
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

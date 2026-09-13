"use client";

import { useState, useEffect } from "react";
import { FaSpotify, FaMusic } from "react-icons/fa";

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchPlaying = async () => {
      try {
        const res = await fetch("/api/player/currently-playing");
        if (res.ok) {
          const data = await res.json();
          if (data && data.is_playing && data.item) {
            setTrack(data.item);
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
          }
        }
      } catch (error) {
      }
    };

    fetchPlaying();
    const interval = setInterval(fetchPlaying, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (!isPlaying || !track) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center gap-3 bg-white/5 border border-[#1db954]/20 px-4 py-2 rounded-full backdrop-blur-md">
      <FaSpotify className="text-[#1db954] text-xl animate-pulse" />
      <img 
        src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url} 
        alt="Album cover" 
        className="w-8 h-8 rounded-sm shadow-sm"
      />
      <div className="flex flex-col justify-center max-w-[150px] lg:max-w-[200px]">
        <span className="text-xs text-[#1db954] font-bold uppercase tracking-wider mb-[2px]">Currently Playing</span>
        <div className="text-sm font-semibold text-white truncate leading-none">
          {track.name}
        </div>
        <div className="text-xs text-gray-400 truncate leading-none mt-1">
          {track.artists?.map(a => a.name).join(", ")}
        </div>
      </div>
      <div className="flex items-center justify-center gap-[2px] ml-1">
        <span className="w-1 h-3 bg-[#1db954] animate-[bounce_1s_infinite] rounded-full"></span>
        <span className="w-1 h-4 bg-[#1db954] animate-[bounce_1.2s_infinite_0.1s] rounded-full"></span>
        <span className="w-1 h-2 bg-[#1db954] animate-[bounce_0.8s_infinite_0.2s] rounded-full"></span>
      </div>
    </div>
  );
}

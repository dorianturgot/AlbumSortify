"use client";

import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";

const LATEST_UPDATE_ID = "update_2026_09_14"; // Change this ID when adding a new update

const UPDATES = [
  {
    id: "update_2026_09_14",
    date: "14 Sep 2026",
    title: "⚡ Improved 'New Releases' section!",
    description: "The “New Releases” algorithm has been completely redesigned! It now scans your 150 favorite artists and your most recently saved albums so you never miss a thing."
  }
];

export default function UpdateNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const lastSeen = localStorage.getItem("albumsortify_last_seen_update");
    if (lastSeen !== LATEST_UPDATE_ID) {
      setHasUnread(true);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && hasUnread) {
      setHasUnread(false);
      localStorage.setItem("albumsortify_last_seen_update", LATEST_UPDATE_ID);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button 
        onClick={toggleOpen}
        className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
        aria-label="What's new"
      >
        <FaBell size={18} />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1db954] rounded-full ring-2 ring-[#121212]"></span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-20 sm:absolute sm:left-auto sm:top-full sm:right-0 sm:mt-3 sm:w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-white">What's new?</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
              Update
            </span>
          </div>
          
          <div className="max-h-96 overflow-y-auto invisible-scrollbar">
            {UPDATES.map((update) => (
              <div key={update.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm text-gray-100">{update.title}</h4>
                </div>
                <p className="text-[10px] text-[#1db954] font-medium mb-2">{update.date}</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {update.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

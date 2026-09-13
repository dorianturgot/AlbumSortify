"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaCheck, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function AddAlbumButton({ album }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingLists, setIsFetchingLists] = useState(false);
  const [addedListIds, setAddedListIds] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsFetchingLists(true);
      fetch("/api/lists")
        .then((res) => res.json())
        .then((data) => {
          setLists(data);
          setIsFetchingLists(false);
        });
      setAddedListIds([]); // Reset feedback when opening
    }
  }, [isOpen]);

  const handleAdd = async (listId) => {
    if (addedListIds.includes(listId)) return; // Already added in this session
    
    setLoading(true);
    const res = await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: album.name,
        artist: album.artists?.map((a) => a.name).join(", ") || "",
        pictureUrl: album.images?.[0]?.url || "",
        url: album.external_urls?.spotify || "",
        releaseDate: album.release_date || "",
        spotifyId: album.id,
        totalTracks: album.total_tracks || 0,
        listId,
      }),
    });

    if (res.ok) {
      setAddedListIds((prev) => [...prev, listId]);
      router.refresh();
    } else {
      alert("Error or album already in list.");
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-2 rounded-full shadow-lg transition-opacity z-10"
        title="Add to a list"
      >
        <FaPlus className="w-4 h-4 sm:w-3 sm:h-3" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div 
            id="modal-content"
            className="bg-[#181818] rounded-2xl p-6 w-full max-w-sm relative shadow-2xl border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white text-center">Add to a list</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto invisible-scrollbar">
              {isFetchingLists ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <FaSpinner className="animate-spin text-green-500 text-3xl mb-2" />
                  <p className="text-gray-400 text-sm">Loading lists...</p>
                </div>
              ) : lists.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No lists available</p>
              ) : (
                lists.map((list) => {
                  const isAlreadyInDB = list.albums?.some((a) => a.spotifyId === album.id);
                  const isAddedSession = addedListIds.includes(list.id);
                  const isAdded = isAlreadyInDB || isAddedSession;

                  return (
                    <button
                      key={list.id}
                      onClick={async () => {
                        await handleAdd(list.id);
                        // Show temporary mini-toast
                        const toast = document.createElement("div");
                        toast.className = "absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-2xl text-sm font-bold z-50 animate-bounce";
                        toast.innerText = "Album added!";
                        document.getElementById("modal-content").appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                      }}
                      disabled={loading || isAdded}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                        isAdded ? "bg-green-500/20 text-green-400 cursor-default" : "bg-white/5 hover:bg-white/10 text-white disabled:opacity-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3 shadow-sm"
                          style={{ backgroundColor: list.color }}
                        />
                        <span className="font-semibold">{list.name}</span>
                      </div>
                      {isAdded && <FaCheck className="text-green-400" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

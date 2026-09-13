"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTrash, FaCheck, FaEdit, FaMusic } from "react-icons/fa";
import { useRouter } from "next/navigation";
import SortListsButton from "./SortListsButton";
import CreateListForm from "./CreateListForm";

export default function DashboardLists({ lists }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedListIds, setSelectedListIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const toggleSelection = (e, listId) => {
    if (!isEditMode) return; // Normally the Link handles navigation
    e.preventDefault(); // Prevent Link navigation
    
    setSelectedListIds((prev) => 
      prev.includes(listId) 
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedListIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedListIds.length} list(s)?`)) return;

    setIsDeleting(true);
    try {
      await Promise.all(
        selectedListIds.map((id) =>
          fetch(`/api/lists/${id}`, { method: "DELETE" })
        )
      );
      setSelectedListIds([]);
      setIsEditMode(false);
      router.refresh();
    } catch (error) {
      alert("Error deleting lists.");
    }
    setIsDeleting(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FaMusic className="text-[#1db954]" /> Your Lists
        </h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {lists.length > 0 && (
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedListIds.length === 0 || isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaTrash /> Delete ({selectedListIds.length})
                  </button>
                  <button
                    onClick={() => {
                      setIsEditMode(false);
                      setSelectedListIds([]);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-colors flex items-center gap-2"
                >
                  <FaEdit /> Select...
                </button>
              )}
            </div>
          )}
          
          <SortListsButton />
          <CreateListForm />
        </div>
      </div>

      {lists.length === 0 ? (
        <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10 shadow-lg">
          <p className="text-gray-300 text-lg">You don't have any lists yet. Create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {lists.map((list) => {
            const lastAlbum = list.albums[list.albums.length - 1];
            const isSelected = selectedListIds.includes(list.id);
            
            return (
              <Link 
                key={list.id} 
                href={isEditMode ? "#" : `/list/${list.id}`}
                onClick={(e) => toggleSelection(e, list.id)}
                className={`block group relative h-28 sm:h-40 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col justify-end transform bg-cover bg-center ring-1 ring-inset ${
                  isSelected ? "ring-green-400 ring-4 scale-95" : "hover:-translate-y-1 hover:shadow-2xl ring-white/10"
                }`}
                style={{ 
                  backgroundColor: list.color,
                  backgroundImage: lastAlbum ? `url(${lastAlbum.pictureUrl})` : 'none',
                  backgroundBlendMode: 'multiply'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90" />
                
                {isEditMode && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-green-500 border-green-500 text-white" : "border-white/50 bg-black/20"
                    }`}>
                      {isSelected && <FaCheck size={12} />}
                    </div>
                  </div>
                )}
                
                <h3 className="relative text-base sm:text-2xl font-bold text-white drop-shadow-lg z-10 line-clamp-2">
                  {list.name}
                </h3>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

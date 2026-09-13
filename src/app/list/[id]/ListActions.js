"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function ListActions({ albumId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this album from the list?")) return;

    const res = await fetch(`/api/albums/${albumId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDelete();
      }}
      className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full shadow-lg transition-opacity z-10"
      title="Remove album"
    >
      <FaTrash size={12} />
    </button>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

export default function DeleteListButton({ listId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this list? This action cannot be undone.")) return;
    
    const res = await fetch(`/api/lists/${listId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors ml-4"
      title="Delete list"
    >
      <FaTrash />
    </button>
  );
}

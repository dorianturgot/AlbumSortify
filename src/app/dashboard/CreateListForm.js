"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COLORS = [
  "#1db954", "#1e3264", "#e8115b", "#ff4632", 
  "#8c1932", "#503750", "#477d95", "#b02897", 
  "#006450", "#a5673f", "#537aa1", "#5a5a5a"
];

export default function CreateListForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color: randomColor }),
    });

    if (res.ok) {
      setIsOpen(false);
      setName("");
      router.refresh();
    } else {
      alert("Error creating list");
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#1db954] hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
      >
        Create list
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#181818] rounded-2xl p-8 w-full max-w-sm relative shadow-2xl border border-white/10">
        <h3 className="text-2xl font-bold mb-6 text-white">New List</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#1db954] border border-white/5 transition-shadow text-lg placeholder-white/40"
              placeholder="Name your collection"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-[#1db954] hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-bold transition-transform hover:scale-105 shadow-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

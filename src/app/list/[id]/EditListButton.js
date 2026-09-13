"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTimes } from "react-icons/fa";

const COLORS = [
  "#1db954", "#1e3264", "#e8115b", "#ff4632", 
  "#8c1932", "#503750", "#477d95", "#b02897", 
  "#006450", "#a5673f", "#537aa1", "#5a5a5a"
];

export default function EditListButton({ listId, initialName, initialColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });

    if (res.ok) {
      setIsOpen(false);
      router.refresh(); // Refresh to show new name/color
    } else {
      alert("Error editing list");
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-colors ml-4 backdrop-blur-md flex items-center justify-center"
        title="Edit list"
      >
        <FaEdit />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-white">Edit list</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2 text-gray-300">List name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#1db954] border border-white/10"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3 text-gray-300">List color</label>
                <div className="grid grid-cols-6 gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full cursor-pointer transition-transform ${color === c ? 'ring-4 ring-white scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl text-gray-300 hover:bg-white/10 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#1db954] hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

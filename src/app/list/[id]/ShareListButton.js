"use client";

import { useState } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";

export default function ShareListButton({ listId }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/list/${listId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button 
      onClick={handleShare}
      className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full shadow-lg transition-colors ml-0 sm:ml-4 backdrop-blur-md flex items-center justify-center gap-2"
      title="Share list"
    >
      {copied ? <FaCheck className="text-green-400" /> : <FaShareAlt />}
    </button>
  );
}

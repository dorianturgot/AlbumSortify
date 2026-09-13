"use client";

import { signIn } from "next-auth/react";
import { FaSpotify } from "react-icons/fa";

export default function LoginButton() {
  return (
    <button 
      onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })} 
      className="bg-[#1db954] hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 transition-transform hover:scale-105 text-lg shadow-xl shadow-green-900/20"
    >
      Connect with Spotify <FaSpotify className="text-2xl" />
    </button>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-white/10 hover:bg-red-500/80 hover:text-white text-gray-300 font-bold py-2 px-4 rounded-xl transition-colors backdrop-blur-md border border-white/5 flex items-center space-x-2"
      title="Log out"
    >
      <FaSignOutAlt />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}

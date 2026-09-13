import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <FaSpinner className="animate-spin text-green-500 text-6xl mb-6 drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]" />
      <p className="text-gray-300 text-xl font-light tracking-wide animate-pulse">Syncing your music...</p>
    </div>
  );
}

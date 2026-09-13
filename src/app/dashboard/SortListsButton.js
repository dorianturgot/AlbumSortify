"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

export default function SortListsButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "desc"; // desc is default

  const toggleSort = () => {
    const newSort = currentSort === "desc" ? "asc" : "desc";
    router.push(`/dashboard?sort=${newSort}`);
  };

  return (
    <button 
      onClick={toggleSort}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-colors border border-white/10 text-sm font-medium"
    >
      {currentSort === "desc" ? (
        <>
          <FaSortAmountDown /> Newest first
        </>
      ) : (
        <>
          <FaSortAmountUp /> Oldest first
        </>
      )}
    </button>
  );
}

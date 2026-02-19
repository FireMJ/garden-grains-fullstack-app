// src/components/VerticalPromoStrip.tsx
"use client";

import Link from "next/link";

export default function VerticalPromoStrip() {
  return (
    <div className="fixed top-[150px] bottom-[150px] right-0 z-50 flex items-center justify-center">
      <Link
        href="/menu"
        className="w-10 h-40 bg-[#F4A261] text-white rounded-l-full flex items-center justify-center rotate-90 origin-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Explore Menu"
      >
        Explore
      </Link>
    </div>
  );
}

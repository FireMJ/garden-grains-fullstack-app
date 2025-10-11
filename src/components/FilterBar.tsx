// components/DynamicBanner.tsx (or in your page.tsx)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import bannerImages from "@/data/bannerImages";

function DynamicBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set initial index only on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setCurrentIndex(Math.floor(Math.random() * bannerImages.length));
  }, []);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));

  // Auto-rotate only on client
  useEffect(() => {
    if (!isClient || isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isClient, isPaused]);

  // Swipe handlers
  const handlers = useSwipeable({ 
    onSwipedLeft: goNext, 
    onSwipedRight: goPrev, 
    trackMouse: true, 
    preventScrollOnSwipe: true 
  });

  // Preload images only on client
  useEffect(() => {
    if (!isClient) return;
    const nextIndex = (currentIndex + 1) % bannerImages.length;
    const prevIndex = currentIndex === 0 ? bannerImages.length - 1 : currentIndex - 1;
    [bannerImages[nextIndex], bannerImages[prevIndex]].forEach((src) => {
      new Image().src = src;
    });
  }, [currentIndex, isClient]);

  // Don't render banner until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-xs sm:text-sm md:text-lg">
          wholesome. crave-worthy. nourishment‑focused.
        </div>
      </div>
    );
  }

  return (
    <div {...handlers} className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      <Image 
        key={currentIndex} 
        src={bannerImages[currentIndex]} 
        alt="Banner" 
        fill 
        className="object-cover fade-in" 
        priority 
      />
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-xs sm:text-sm md:text-lg">
        wholesome. crave-worthy. nourishment‑focused.
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent"></div>

      <button 
        onClick={goPrev} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        ◀
      </button>
      <button 
        onClick={goNext} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        ▶
      </button>

      <button 
        onClick={() => setIsPaused((prev) => !prev)} 
        className="absolute top-2 left-2 bg-black/40 text-white px-3 py-1 rounded hover:bg-black/60 transition text-xs"
      >
        {isPaused ? "▶ Play" : "⏸ Pause"}
      </button>

      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {bannerImages.map((src, idx) => (
          <div 
            key={idx} 
            className="relative group" 
            onMouseEnter={() => setHoveredDot(idx)} 
            onMouseLeave={() => setHoveredDot(null)}
          >
            <button 
              onClick={() => setCurrentIndex(idx)} 
              className={`w-3 h-3 rounded-full transition ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`} 
            />
            {hoveredDot === idx && (
              <div className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded shadow-lg z-50">
                <Image 
                  src={src} 
                  alt={`Preview ${idx + 1}`} 
                  width={80} 
                  height={50} 
                  className="object-cover rounded" 
                  loading="lazy" 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DynamicBanner;
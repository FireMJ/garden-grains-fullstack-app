"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import bannerImages from "@/data/bannerImages";

const DynamicBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  }, []);

  // Mark as client and randomize initial index
  useEffect(() => {
    setIsClient(true);
    setCurrentIndex(Math.floor(Math.random() * bannerImages.length));
  }, []);

  // Safe image preloading using window.Image
  useEffect(() => {
    if (!isClient) return;
    
    bannerImages.forEach((src) => {
      if (!loadedImages.has(src)) {
        const img = new window.Image(); // ✅ Use window.Image to avoid conflict
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
        };
        img.src = src;
      }
    });
  }, [isClient, loadedImages]);

  // Autoplay
  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [isClient, goNext]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!isClient) {
    return (
      <div className="object-cover h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute bottom-4 left-4 bg-gray-300 text-transparent px-4 py-2 rounded text-sm">
          Loading banner...
        </div>
      </div>
    );
  }

  return (
    <div {...handlers} className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden mt-16 sm:mt-20">
      <Image
        key={currentIndex}
        src={bannerImages[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
        priority={currentIndex < 3}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded text-sm sm:text-base">
        wholesome. crave-worthy. nourishment-focused.
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10"
        aria-label="Previous banner"
      >
        ◀
      </button>

      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10"
        aria-label="Next banner"
      >
        ▶
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2">
        {bannerImages.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex % 10 ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
        <span className="text-white text-xs ml-2 bg-black/30 px-2 py-1 rounded">
          {currentIndex + 1}/{bannerImages.length}
        </span>
      </div>
    </div>
  );
};

export default DynamicBanner;
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BannerProps {
  images: { src: string; alt: string }[];
}

export default function Banner({ images }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Optimized banner image */}
      <div className="absolute inset-0">
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          fill
          priority={currentIndex === 0}
          sizes="100vw"
          style={{ objectFit: "cover" }}
          quality={85}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Welcome to Garden & Grains
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-8">
            Fresh, organic, farm-to-table meals delivered to your door
          </p>
          <a
            href="/menu"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition transform hover:scale-105"
          >
            Order Now
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? "bg-white w-4" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

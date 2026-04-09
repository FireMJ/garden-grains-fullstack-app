"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BannerImage {
  src: string;
  alt: string;
}

const bannerImages: BannerImage[] = [
  {
    src: "/images/banner1.jpg",
    alt: "Fresh farm produce"
  },
  {
    src: "/images/banner2.jpg",
    alt: "Organic grains"
  },
  {
    src: "/images/banner3.jpg",
    alt: "Farm to table"
  }
];

export default function DynamicBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-rotate banners every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentBanner = bannerImages[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentBanner && (
          <Image
            src={currentBanner.src}
            alt={currentBanner.alt}
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="100vw"
          />
        )}
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
            Experience the freshest farm-to-table ingredients, sustainably grown and delivered to your door.
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition transform hover:scale-105">
            Explore Our Menu
          </button>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

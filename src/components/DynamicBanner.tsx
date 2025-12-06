"use client";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { useState, useEffect } from "react";
import Image from "next/image";

interface BannerImage {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
}

const bannerImages: BannerImage[] = [
  {
    src: "/api/placeholder/1200/400",
    alt: "Fresh Grain Bowls",
    title: "Fresh & Healthy",
    subtitle: "Customize your perfect grain bowl"
  },
  {
    src: "/api/placeholder/1200/400",
    alt: "Quick Delivery",
    title: "Fast Delivery",
    subtitle: "Get your meal in 30 minutes or less"
  },
  {
    src: "/api/placeholder/1200/400",
    alt: "Local Ingredients",
    title: "Locally Sourced",
    subtitle: "Fresh ingredients from local farms"
  }
];

const DynamicBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Safe image preloading
    bannerImages.forEach((image) => {
      const img = new Image();
      img.src = image.src;
    });

    // Initialize with a stable index
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    // SSR fallback - show first banner
    const firstBanner = bannerImages[0];
    return (
      <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            {firstBanner.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {firstBanner.subtitle}
          </p>
        </div>
      </div>
    );
  }

  const currentImage = bannerImages[currentIndex];

  return (
    <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="absolute inset-0 opacity-20" />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
          {currentImage.title}
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          {currentImage.subtitle}
        </p>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#E9C46A] scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicBanner;

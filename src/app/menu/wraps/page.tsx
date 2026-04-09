"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { wraps } from "@/data/wrapsData";
import { FaArrowLeft } from "react-icons/fa";

export default function WrapsPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (wrapId: string) => {
    setImgErrors(prev => ({ ...prev, [wrapId]: true }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back to Menu Button */}
        <div className="mb-6">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Menu</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Fresh Wraps</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Delicious tortilla wraps filled with premium ingredients. Perfect for a quick,
            satisfying meal on the go.
          </p>
        </div>

        {/* Wraps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wraps.map((wrap) => (
            <div
              key={wrap.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/wraps/${wrap.slug}`)}
            >
              {/* Wrap Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-amber-100 to-orange-100">
                {!imgErrors[wrap.id] ? (
                  <Image
                    src={wrap.image}
                    alt={wrap.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(wrap.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🌯
                  </div>
                )}
                
                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {wrap.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Wrap Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{wrap.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{wrap.description}</p>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{wrap.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/wraps/${wrap.slug}`);
                    }}
                    className="bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition text-sm font-medium"
                  >
                    Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Info */}
        <div className="mt-12 p-6 bg-amber-50 rounded-xl text-center">
          <h3 className="font-bold text-amber-800 mb-2">Customize Your Wrap</h3>
          <p className="text-amber-700 text-sm">
            Add extra protein, cheese, or avocado to make your wrap even more delicious!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Chicken (R40)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Beef (R45)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Avocado (R20)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Feta Cheese (R25)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { smoothies } from "@/data/smoothiesData";
import { FaArrowLeft } from "react-icons/fa";

export default function SmoothiesListPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) => {
    setImgErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const formatPriceRange = (sizes: any[]) => {
    if (!sizes || sizes.length === 0) return "";
    const minPrice = Math.min(...sizes.map(s => s.price));
    const maxPrice = Math.max(...sizes.map(s => s.price));
    if (minPrice === maxPrice) return `R${minPrice}`;
    return `R${minPrice} - R${maxPrice}`;
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Fresh Smoothies</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handcrafted smoothies made with fresh fruits, Greek yoghurt, and wholesome ingredients.
            Available in 250ml, 350ml, and 500ml sizes.
          </p>
        </div>

        {/* Size Guide */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Small (250ml)</span>
            <span className="text-xs text-gray-500 ml-2">R65</span>
          </div>
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Medium (350ml)</span>
            <span className="text-xs text-gray-500 ml-2">R80</span>
          </div>
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Large (500ml)</span>
            <span className="text-xs text-gray-500 ml-2">R93</span>
          </div>
        </div>

        {/* Smoothies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {smoothies.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/smoothies/${item.slug}`)}
            >
              {/* Smoothie Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-purple-100 to-pink-100">
                {!imgErrors[item.id] ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(item.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🥤
                  </div>
                )}
                
                {/* Popular Badge */}
                {item.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#F4A261] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                {/* Tags */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Smoothie Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prices:</span>
                    <div className="flex gap-3">
                      <span className="text-green-600 font-medium">R65 (250ml)</span>
                      <span className="text-green-600 font-medium">R80 (350ml)</span>
                      <span className="text-green-600 font-medium">R93 (500ml)</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{formatPriceRange(item.sizes)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/smoothies/${item.slug}`);
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
          <h3 className="font-bold text-amber-800 mb-2">Customize Your Smoothie</h3>
          <p className="text-amber-700 text-sm">
            Add extra honey, chia seeds, or protein powder to boost your smoothie!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Honey (R5)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Chia Seeds (R10)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Protein Powder (R15)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Almond Milk (R10)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

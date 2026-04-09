"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { salads, saladDressings } from "@/data/saladsData";
import { FaArrowLeft } from "react-icons/fa";

export default function SaladsListPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (saladId: string) => {
    setImgErrors(prev => ({ ...prev, [saladId]: true }));
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Fresh Salads</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Crisp, fresh, and nutritious salads made with locally sourced ingredients. 
            Perfect for a healthy and satisfying meal.
          </p>
        </div>

        {/* Salads Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salads.map((salad) => (
            <div
              key={salad.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/salads/${salad.slug}`)}
            >
              {/* Salad Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-green-100 to-emerald-100">
                {!imgErrors[salad.id] ? (
                  <Image
                    src={salad.image}
                    alt={salad.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(salad.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🥗
                  </div>
                )}
                
                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {salad.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Salad Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{salad.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{salad.description}</p>
                
                {/* Dressings Preview */}
                <div className="mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Dressings:</span>
                    <span>{salad.dressings.slice(0, 3).map(d => d.name).join(', ')}</span>
                    {salad.dressings.length > 3 && <span className="ml-1">+{salad.dressings.length - 3}</span>}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{salad.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/salads/${salad.slug}`);
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

        {/* Dressing Options Info */}
        <div className="mt-12 p-6 bg-green-50 rounded-xl text-center">
          <h3 className="font-bold text-[#2F5D50] mb-2">Choose Your Dressing</h3>
          <p className="text-gray-600 text-sm mb-3">
            All our salads come with your choice of dressing:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {saladDressings.slice(0, 5).map((dressing) => (
              <span key={dressing.id} className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">
                {dressing.name}
              </span>
            ))}
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+{saladDressings.length - 5} more</span>
          </div>
        </div>

        {/* Add-ons Info */}
        <div className="mt-4 p-6 bg-amber-50 rounded-xl text-center">
          <h3 className="font-bold text-amber-800 mb-2">Customize Your Salad</h3>
          <p className="text-amber-700 text-sm">
            Add extra protein, avocado, or cheese to make your salad even more satisfying!
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

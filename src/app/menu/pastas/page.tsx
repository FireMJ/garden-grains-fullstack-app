"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { pastas } from "@/data/pastasData";
import { FaArrowLeft } from "react-icons/fa";

export default function PastasListPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (pastaId: string) => {
    setImgErrors(prev => ({ ...prev, [pastaId]: true }));
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Fresh Pastas</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handcrafted pasta dishes made with fresh ingredients and authentic flavors.
            Perfect for a satisfying and delicious meal.
          </p>
        </div>

        {/* Pastas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastas.map((pasta) => (
            <div
              key={pasta.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/pastas/${pasta.slug}`)}
            >
              {/* Pasta Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-amber-100 to-orange-100">
                {!imgErrors[pasta.id] ? (
                  <Image
                    src={pasta.image}
                    alt={pasta.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(pasta.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🍝
                  </div>
                )}
                
                {/* Popular Badge */}
                {pasta.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#F4A261] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                {/* Tags */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {pasta.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pasta Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pasta.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pasta.description}</p>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{pasta.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/pastas/${pasta.slug}`);
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
          <h3 className="font-bold text-amber-800 mb-2">Customize Your Pasta</h3>
          <p className="text-amber-700 text-sm">
            Add extra protein, cheese, or garlic bread to make your pasta even more delicious!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Chicken (R40)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Beef (R45)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Parmesan (R15)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Garlic Bread (R20)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

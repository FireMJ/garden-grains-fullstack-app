"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { bowls } from "@/data/bowlsData";
import { FaArrowLeft } from "react-icons/fa";

export default function BowlsListPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (bowlId: string) => {
    setImgErrors(prev => ({ ...prev, [bowlId]: true }));
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Signature Bowls</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fresh, nutritious bowls packed with flavor. Choose your base, add your favorites, 
            and top with our signature dressings.
          </p>
        </div>

        {/* Bowl Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-[#2F5D50] text-white rounded-full text-sm">All Bowls</span>
            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm">Chipotle-Inspired</span>
            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm">Poke Bowls</span>
            <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm">Vegetarian</span>
          </div>
        </div>

        {/* Bowls Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bowls.map((bowl) => (
            <div
              key={bowl.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/bowls/${bowl.slug}`)}
            >
              {/* Bowl Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-green-100 to-emerald-100">
                {!imgErrors[bowl.id] ? (
                  <Image
                    src={bowl.image}
                    alt={bowl.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(bowl.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🥗
                  </div>
                )}
                
                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {bowl.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bowl Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{bowl.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{bowl.description}</p>
                
                {/* Base Options */}
                <div className="mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Bases:</span>
                    <span>{bowl.baseOptions.slice(0, 3).join(', ')}</span>
                    {bowl.baseOptions.length > 3 && <span className="ml-1">+{bowl.baseOptions.length - 3}</span>}
                  </div>
                </div>

                {/* Dressings Preview */}
                <div className="mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Dressings:</span>
                    <span>{bowl.dressings.slice(0, 2).join(', ')}</span>
                    {bowl.dressings.length > 2 && <span className="ml-1">+{bowl.dressings.length - 2}</span>}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{bowl.basePrice}</span>
                    <span className="text-sm text-gray-500"> / bowl</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/bowls/${bowl.slug}`);
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
        <div className="mt-12 p-6 bg-green-50 rounded-xl text-center">
          <h3 className="font-bold text-[#2F5D50] mb-2">Customize Your Bowl</h3>
          <p className="text-gray-600 text-sm">
            Add extra protein, avocado, or cheese to make your bowl even more delicious!
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

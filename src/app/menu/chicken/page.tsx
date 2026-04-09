"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { chickenItems } from "@/data/chickenData";
import { FaArrowLeft } from "react-icons/fa";

export default function ChickenListPage() {
  const router = useRouter();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (itemId: string) => {
    setImgErrors(prev => ({ ...prev, [itemId]: true }));
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Grilled Chicken</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Juicy, flame-grilled chicken fillet strips made to order with your choice of basting.
            Served with crispy fries or steamed broccoli for a wholesome meal.
          </p>
        </div>

        {/* Chicken Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {chickenItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/chicken/${item.slug}`)}
            >
              {/* Item Image */}
              <div className="relative h-64 w-full bg-gradient-to-br from-amber-100 to-orange-100">
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
                    🍗
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

              {/* Item Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                {/* Basting Options Preview */}
                <div className="mb-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Basting Options:</span>
                    <span>Smokey Chipotle, Fiery Peri-Peri, Lemon & Herb, Classic BBQ</span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{item.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/chicken/${item.slug}`);
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

        {/* Basting Info */}
        <div className="mt-12 p-6 bg-amber-50 rounded-xl text-center">
          <h3 className="font-bold text-amber-800 mb-2">Choose Your Basting</h3>
          <p className="text-amber-700 text-sm mb-3">
            All our grilled chicken comes with your choice of basting:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm">🌶️ Smokey Chipotle</span>
            <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm">🔥 Fiery Peri-Peri</span>
            <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm">🍋 Lemon & Herb</span>
            <span className="text-xs bg-white px-3 py-1 rounded-full shadow-sm">🍔 Classic BBQ</span>
          </div>
        </div>

        {/* Add-ons Info */}
        <div className="mt-4 p-6 bg-green-50 rounded-xl text-center">
          <h3 className="font-bold text-green-800 mb-2">Make It a Meal</h3>
          <p className="text-green-700 text-sm">
            Add extra toppings or sides to customize your meal!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Chicken (R40)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Cheese Sauce (R15)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Side Salad (R25)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Onion Rings (R20)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

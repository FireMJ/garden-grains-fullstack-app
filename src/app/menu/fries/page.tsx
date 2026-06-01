"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { fries } from "@/data/friesData";
import { FaArrowLeft } from "react-icons/fa";

export default function FriesListPage() {
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Crispy Fries</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Golden, crispy fries made fresh to order. Choose your dip and customize your meal!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fries.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/fries/${item.slug}`)}
            >
              <div className="relative h-48 w-full bg-gradient-to-br from-amber-100 to-orange-100">
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
                    🍟
                  </div>
                )}
                
                {item.popular && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#F4A261] text-white text-xs px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.tags?.slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{item.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/fries/${item.slug}`);
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
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { juices } from "@/data/juicesData";
import { FaArrowLeft } from "react-icons/fa";

export default function JuicesListPage() {
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Fresh Juices</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cold-pressed, nutrient-rich juices made fresh daily with healthy ingredients.
            Available in 250ml, 350ml, and 500ml sizes.
          </p>
        </div>

        {/* Size Guide */}
        <div className="mb-8 flex justify-center gap-4">
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Small (250ml)</span>
            <span className="text-xs text-gray-500 ml-2">R59</span>
          </div>
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Medium (350ml)</span>
            <span className="text-xs text-gray-500 ml-2">R73</span>
          </div>
          <div className="bg-white rounded-lg shadow p-3 px-4 text-center">
            <span className="text-sm font-semibold text-gray-900">Large (500ml)</span>
            <span className="text-xs text-gray-500 ml-2">R89</span>
          </div>
        </div>

        {/* Juices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {juices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/juices/${item.slug}`)}
            >
              {/* Juice Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-green-100 to-emerald-100">
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
                    🧃
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

              {/* Juice Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prices:</span>
                    <div className="flex gap-3">
                      {item.sizes.length > 1 ? (
                        <>
                          <span className="text-green-600 font-medium">R59 (250ml)</span>
                          <span className="text-green-600 font-medium">R73 (350ml)</span>
                          <span className="text-green-600 font-medium">R89 (500ml)</span>
                        </>
                      ) : (
                        <span className="text-green-600 font-medium">R{item.sizes[0]?.price} (50ml)</span>
                      )}
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
                      router.push(`/menu/juices/${item.slug}`);
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

        {/* Ginger Shot Note */}
        <div className="mt-12 p-4 bg-red-50 rounded-xl text-center">
          <p className="text-sm text-red-700">
            ⚡ <strong>Ginger Shot Warning:</strong> 80% ginger, 20% lemon - it's fiery! Perfect for an immune boost.
          </p>
        </div>
      </div>
    </div>
  );
}

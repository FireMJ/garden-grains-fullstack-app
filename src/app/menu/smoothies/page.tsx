'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from "@/components/BackButton";
import Image from 'next/image';
import { smoothies } from '@/data/smoothiesData';
import { loadPopularItems, isItemPopular } from '@/services/popularItemsService';
import { FaChevronRight, FaFire, FaLeaf } from 'react-icons/fa';

export default function SmoothiesPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [popularItems, setPopularItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPopularItems();

    const popularStatus: Record<string, boolean> = {};
    smoothies.forEach(smoothie => {
      popularStatus[smoothie.id] = isItemPopular(smoothie.id, 'smoothies');
    });
    setPopularItems(popularStatus);
  }, []);

  // Get the minimum price from sizes
  const getMinPrice = (smoothie: any) => {
    if (smoothie.sizes && smoothie.sizes.length > 0) {
      const minPrice = Math.min(...smoothie.sizes.map((size: any) => size.price));
      return minPrice;
    }
    return 0;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          ← Back to Menu
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Smoothies</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Refreshing and nutritious smoothies made with fresh ingredients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {smoothies.map((smoothie) => (
            <Link
              key={smoothie.id}
              href={`/menu/smoothies/${smoothie.slug}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
            >
              <div className="relative h-48">
                <Image
                  src={imageErrors[smoothie.id] ? '/images/placeholders/food-placeholder.jpg' : smoothie.image}
                  alt={smoothie.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                  onError={() => setImageErrors(prev => ({ ...prev, [smoothie.id]: true }))}
                />
                {popularItems[smoothie.id] && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaFire className="text-xs" />
                    Popular
                  </div>
                )}
                {smoothie.tags?.includes('vegetarian') && (
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaLeaf className="text-xs" />
                    Vegetarian
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition">
                  {smoothie.name}
                </h2>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{smoothie.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{getMinPrice(smoothie)}</span>
                    <p className="text-xs text-gray-400">Starting from</p>
                  </div>
                  <span className="text-green-600 group-hover:translate-x-1 transition flex items-center gap-1">
                    View Details <FaChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

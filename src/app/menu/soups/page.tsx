'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { soups } from '@/data/soupsData';
import { loadPopularItems, isItemPopular } from '@/services/popularItemsService';
import { FaChevronRight, FaFire, FaLeaf } from 'react-icons/fa';

export default function SoupsPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [popularItems, setPopularItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPopularItems();
    
    const popularStatus: Record<string, boolean> = {};
    soups.forEach(soup => {
      popularStatus[soup.id] = isItemPopular(soup.id, 'soups');
    });
    setPopularItems(popularStatus);
  }, []);

  const handleImageError = (slug: string) => {
    setImageErrors(prev => ({ ...prev, [slug]: true }));
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Soups</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Warm, comforting soups made fresh daily with the finest ingredients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soups.map((soup) => (
            <Link
              key={soup.id}
              href={`/menu/soups/${soup.slug}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {!imageErrors[soup.slug] ? (
                  <Image
                    src={soup.image}
                    alt={soup.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    onError={() => handleImageError(soup.slug)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">🥣</div>
                )}
                
                {/* Dynamic Popular Badge */}
                {popularItems[soup.id] && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <FaFire className="w-3 h-3" />
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-5">
                {soup.tags && soup.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {soup.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
                        {tag === 'vegetarian' && <FaLeaf className="w-3 h-3 text-green-500" />}
                        <span className="capitalize">{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
                
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{soup.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{soup.description}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <div><span className="text-2xl font-bold text-green-600">R{soup.price}</span></div>
                  <div className="flex items-center gap-1 text-green-600 group-hover:gap-2 transition-all duration-300">
                    <span className="text-sm font-medium">View Details</span>
                    <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

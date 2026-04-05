'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { breakfastItems } from '@/data/breakfastData';

export default function BreakfastListPage() {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleNavigate = (slug: string) => {
    router.push(`/menu/breakfast/${slug}`);
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // Fallback gradient colors based on item name or tags
  const getGradientForItem = (item: typeof breakfastItems[0]) => {
    if (item.tags.includes('healthy') || item.tags.includes('vegetarian')) {
      return 'from-[#6C7B58] to-[#8A9B6E]'; // Green gradient for healthy items
    }
    if (item.tags.includes('protein') || item.tags.includes('high-protein')) {
      return 'from-[#B66D3B] to-[#D48C5B]'; // Orange/brown for protein-rich
    }
    if (item.tags.includes('warm') || item.tags.includes('comfort')) {
      return 'from-[#C45D42] to-[#E07A5F]'; // Warm red/orange for comfort food
    }
    return 'from-[#2A5568] to-[#3F6B82]'; // Default blue gradient
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F4A261] mb-4">Breakfast Menu</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Start your day right with our nutritious and delicious breakfast options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfastItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-[#F4A261]/30 transition-all duration-300 cursor-pointer group"
              onClick={() => handleNavigate(item.slug)}
            >
              {/* Image with actual content */}
              <div className="relative h-48 rounded-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {!imageErrors[item.id] ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => handleImageError(item.id)}
                    priority={breakfastItems.indexOf(item) < 3} // Priority load first 3 images
                  />
                ) : (
                  // Fallback gradient with item name
                  <div className={`absolute inset-0 bg-gradient-to-br ${getGradientForItem(item)} flex items-center justify-center`}>
                    <div className="text-center p-4">
                      <span className="text-white/90 text-lg font-semibold block mb-2">{item.name}</span>
                      <span className="text-white/70 text-sm">{item.tags.join(' • ')}</span>
                    </div>
                  </div>
                )}

                {/* Optional overlay with tags on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm bg-[#F4A261] px-3 py-1 rounded-full">
                    View Details
                  </span>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#F4A261] transition">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-green-300 bg-green-900/30 px-2 py-1 rounded">
                    R{item.price}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#6C7B58] text-white text-xs px-2 py-1 rounded capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Order Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(item.slug);
                  }}
                  className="w-full mt-4 bg-[#F4A261] text-white py-3 rounded-lg font-semibold hover:bg-[#e68e42] transition transform group-hover:scale-105 active:scale-95"
                >
                  Customize & Order
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Breakfast Info Section */}
        <div className="mt-16 bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl font-bold text-[#F4A261] mb-6 text-center">Breakfast Made Right</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition">
              <div className="text-3xl mb-4">🌅</div>
              <h3 className="font-semibold text-white mb-2">Fresh Daily</h3>
              <p className="text-gray-300 text-sm">Prepared fresh each morning with quality ingredients</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold text-white mb-2">Quick Service</h3>
              <p className="text-gray-300 text-sm">Perfect for busy mornings - ready when you are</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="font-semibold text-white mb-2">Healthy Options</h3>
              <p className="text-gray-300 text-sm">Nutritious choices to fuel your day</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
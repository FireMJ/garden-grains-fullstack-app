'use client';

import { useState } from 'react';
import Link from 'next/link';
import LocalImage from '@/components/LocalImage';
import { toasties } from '@/data/toastiesData';
import { FaChevronRight, FaFire } from 'react-icons/fa';

export default function ToastiesPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          ← Back to Menu
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Toasties</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Grilled to perfection on artisan sourdough
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toasties.map((toastie) => (
            <Link
              key={toastie.id}
              href={`/menu/toasties/${toastie.slug}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {!imageErrors[toastie.id] ? (
                  <LocalImage
                    src={toastie.image}
                    alt={toastie.name}
                    fill
                    className="group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
                    🥪
                  </div>
                )}
                
                {toastie.popular && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FaFire className="w-3 h-3" />
                    Popular
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{toastie.name}</h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{toastie.description}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{toastie.price}</span>
                  </div>
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

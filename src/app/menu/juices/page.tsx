"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { juices } from '@/data/juices';
import { Search, Star } from 'lucide-react';

export default function JuicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJuices = juices.filter(juice =>
    juice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    juice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Juices</h1>
          <p className="text-gray-500">Cold-pressed, nutrient-rich juices made fresh daily</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search juices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent"
            />
          </div>
        </div>

        {/* Juices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJuices.map((juice) => (
            <Link href={`/menu/juices/${juice.slug}`} key={juice.id}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                <div className="relative h-48">
                  {juice.image ? (
                    <Image src={juice.image} alt={juice.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      No image
                    </div>
                  )}
                  {juice.popular && (
                    <div className="absolute top-2 right-2 bg-yellow-50 px-2 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-yellow-700">Popular</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{juice.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{juice.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      {juice.sizes && juice.sizes.length > 0 && (
                        <p className="text-sm text-gray-500">
                          From R{juice.sizes[0].price}
                        </p>
                      )}
                    </div>
                    <span className="text-[#2F5D50] font-semibold text-sm">View Details →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredJuices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No juices found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { menuCategories } from '@/data/menuItems';
import { FaArrowLeft } from "react-icons/fa";

export default function MenuPage() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        {/* Back to Home Button */}
        <div className="container mx-auto px-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Navigation Header */}
        <div className="sticky top-16 z-40 bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="text-gray-600 mt-2">Fresh, healthy meals made with love</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Menu Categories with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/menu/${category.id}`)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                {/* Category Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#94aa4d] transition-colors">
                      {category.name}
                    </h3>
                    <div className="text-[#94aa4d] font-medium text-sm">
                      Browse →
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{category.description}</p>

                  {/* View Items Button */}
                  <button className="w-full mt-4 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition group-hover:bg-[#94aa4d] group-hover:text-white">
                    View {category.name.toLowerCase()} items
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

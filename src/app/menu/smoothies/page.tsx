"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { smoothies } from "@/data/smoothiesData";

export default function SmoothiesListPage() {
  const router = useRouter();
  const { cartItems, totalItems, totalPrice } = useCart(); // Fixed: using correct cart context properties

  const handleNavigate = (slug: string) => {
    router.push(`/menu/smoothies/${slug}`);
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/menu" className="flex items-center text-white hover:text-[#F4A261] transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </Link>
            <Link href="/" className="flex items-center text-white hover:text-[#F4A261] transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#F4A261]">
            Fresh Smoothies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nutrient-packed smoothies made with fresh fruits, superfoods, and wholesome ingredients
          </p>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="bg-[#6c8665] rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">Items in cart: {totalItems}</p>
                <p className="text-[#F4A261] font-bold text-xl">Total: R {totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => router.push("/cart")} className="px-4 py-2 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold">
                  View Cart
                </button>
                <button onClick={() => router.push("/schedule-order")} className="px-4 py-2 bg-[#6C7B58] text-white rounded-lg hover:bg-[#5a6a4d] transition font-semibold">
                  Schedule Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {smoothies.map((item) => {
            const inCart = cartItems.filter((c) => c.name.toLowerCase() === item.name.toLowerCase());
            const itemCount = inCart.reduce((sum, i) => sum + i.quantity, 0);
            const itemTotal = inCart.reduce((sum, i) => sum + ((i.price || 0) * i.quantity), 0);

            // Show medium price as base price (350ml)
            const basePrice = item.sizes.find(s => s.label === "350ml")?.price ?? item.sizes[0].price;

            return (
              <div key={item.id} onClick={() => handleNavigate(item.slug)} className="bg-white/10 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition transform hover:scale-105 hover:shadow-xl backdrop-blur-sm">
                <div className="relative w-full h-52">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2A5568] to-[#6C7B58] flex items-center justify-center">
                    <span className="text-white/80 text-lg">Smoothie Image</span>
                  </div>
                  {item.popular && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-[#F4A261] text-white px-2 py-1 rounded-full text-sm font-semibold">
                        Popular
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-green-200">{item.name}</h2>
                  <p className="text-gray-100 text-sm line-clamp-3">{item.description}</p>
                  <span className="font-bold text-green-300 text-lg">R{basePrice.toFixed(2)}</span>

                  {itemCount > 0 && (
                    <div className="text-sm bg-green-200 text-green-900 rounded-md px-3 py-1 mt-1 font-semibold">
                      ✅ In Cart: {itemCount} item{itemCount > 1 ? "s" : ""} • R{itemTotal.toFixed(2)}
                    </div>
                  )}

                  <button onClick={(e) => { e.stopPropagation(); handleNavigate(item.slug); }} className="mt-3 bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition">
                    Customize & Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Explore Other Categories</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/menu/breakfast" className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition text-sm">Breakfast</Link>
              <Link href="/menu/bowls" className="bg-[#6C7B58] text-white px-4 py-2 rounded-lg hover:bg-[#5a6a4d] transition text-sm">Bowls</Link>
              <Link href="/menu/juices" className="bg-[#E76F51] text-white px-4 py-2 rounded-lg hover:bg-[#d65a3c] transition text-sm">Juices</Link>
              <Link href="/menu" className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#1E4259] transition text-sm">All Categories</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

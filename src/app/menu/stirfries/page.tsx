"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart, type CartItem } from "@/context/CartContext";
import { stirfries } from "@/data/stirfryData";

export default function StirfriesListPage() {
  const router = useRouter();
  const { cart: cartItems } = useCart();
  const safeCartItems = cartItems && Array.isArray(cartItems) ? cartItems : [];
  // Calculate values since they are not provided by CartContext
  const totalItems = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.quantity || 1), 0);
  const totalPrice = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.price || 0) * (item.quantity || 1), 0);

  const handleNavigate = (slug: string) => {
    router.push(`/menu/stirfries/${slug}`);
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/menu"
              className="flex items-center text-white hover:text-[#F4A261] transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Menu
            </Link>
            <Link
              href="/"
              className="flex items-center text-white hover:text-[#F4A261] transition"
            >
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
            Stir Fries
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Fresh, flavorful stir fries made with premium ingredients and authentic Asian flavors
          </p>
        </div>

        {/* Cart Summary */}
        {(cartItems && Array.isArray(cartItems) ? safeCartItems.length : 0) > 0 && (
          <div className="bg-[#6c8665] rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  Items in cart: {totalItems}
                </p>
                <p className="text-[#F4A261] font-bold text-xl">
                  Total: R {totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/cart")}
                  className="px-4 py-2 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold"
                >
                  View Cart
                </button>
                <button
                  onClick={() => router.push("/schedule-order")}
                  className="px-4 py-2 bg-[#6C7B58] text-white rounded-lg hover:bg-[#5a6a4d] transition font-semibold"
                >
                  Schedule Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stirfries.map((item) => {
            const inCart = safeCartItems.filter(
              (c) => c.name.toLowerCase() === item.name.toLowerCase()
            );
            const itemCount = inCart.reduce((sum: number, i) => sum + i.quantity, 0);
            const itemTotal = inCart.reduce(
              (sum, i) => sum + ((i.price || 0) * i.quantity),
              0
            );

            return (
              <div
                key={item.id}
                onClick={() => handleNavigate(item.slug)}
                className="bg-white/10 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition transform hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <div className="relative w-full h-52">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513] to-[#D2691E] hidden items-center justify-center">
                    <span className="text-white/80 text-sm">Stir Fry Image</span>
                  </div>
                  
                  {/* Tags */}
                  {item.tags && item.tags.includes("Popular") && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#F4A261] text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Vegetarian Tag */}
                  {item.tags && item.tags.includes("Vegetarian") && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Vegetarian
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-green-200">
                    {item.name}
                  </h2>
                  <p className="text-gray-100 text-sm line-clamp-3">
                    {item.description}
                  </p>
                  
                  {/* Price */}
                  <div className="text-green-300 font-bold text-lg">
                    R{item.price.toFixed(2)}
                  </div>

                  {/* Base Options Preview */}
                  {item.baseOptions && (
                    <div className="text-xs text-gray-400">
                      Bases: {item.baseOptions.slice(0, 3).map(base => base.name).join(", ")}
                      {item.baseOptions.length > 3 && "..."}
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.tags.filter(tag => tag !== "Popular" && tag !== "Vegetarian").map((tag: any, index) => (
                        <span key={index} className="bg-gray-500/50 text-gray-200 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Show live cart count for this item */}
                  {itemCount > 0 && (
                    <div className="text-sm bg-green-200 text-green-900 rounded-md px-3 py-1 mt-1 font-semibold">
                      ✅ In Cart: {itemCount} item{itemCount > 1 ? "s" : ""} • R
                      {itemTotal.toFixed(2)}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(item.slug);
                    }}
                    className="mt-3 bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
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
            <h3 className="text-xl font-bold text-white mb-4">
              Explore Other Categories
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/menu/breakfast"
                className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition text-sm"
              >
                Breakfast
              </Link>
              <Link
                href="/menu/bowls"
                className="bg-[#6C7B58] text-white px-4 py-2 rounded-lg hover:bg-[#5a6a4d] transition text-sm"
              >
                Bowls
              </Link>
              <Link
                href="/menu/juices"
                className="bg-[#2A5568] text-white px-4 py-2 rounded-lg hover:bg-[#1E4259] transition text-sm"
              >
                Juices
              </Link>
              <Link
                href="/menu/smoothies"
                className="bg-[#8A9B6E] text-white px-4 py-2 rounded-lg hover:bg-[#7a8b5e] transition text-sm"
              >
                Smoothies
              </Link>
              <Link
                href="/menu/fries"
                className="bg-[#D2691E] text-white px-4 py-2 rounded-lg hover:bg-[#b35917] transition text-sm"
              >
                Fries
              </Link>
              <Link
                href="/menu/pastas"
                className="bg-[#8B4513] text-white px-4 py-2 rounded-lg hover:bg-[#6b3410] transition text-sm"
              >
                Pastas
              </Link>
              <Link
                href="/menu/stirfries"
                className="bg-[#A0522D] text-white px-4 py-2 rounded-lg hover:bg-[#804020] transition text-sm"
              >
                Stir Fries
              </Link>
              <Link
                href="/menu"
                className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#1E4259] transition text-sm"
              >
                All Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

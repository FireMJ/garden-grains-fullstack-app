"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Image from "next/image";
import { menuCategories } from '@/data/menuItems';

export const dynamic = "force-dynamic";

export default function MenuPage() {
  const router = useRouter();
  const { cart: cartItems } = useCart();

  const totalPrice = (() => {
    if (!cartItems || !Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const basePrice = item.basePrice || 0;
      const baseExtra = item.baseExtra || 0;
      const addOnsTotal = (item.selectedAddOns || []).reduce((a, b) => a + (b.price || 0), 0);
      const friesPrice = item.fries?.price || 0;
      const juicePrice = item.juice?.price || 0;
      const itemTotal = (basePrice + baseExtra + addOnsTotal + friesPrice + juicePrice) * item.quantity;
      return sum + itemTotal;
    }, 0);
  })();

  const safeCartItems = cartItems && Array.isArray(cartItems) ? cartItems : [];
  const cartItemsCount = safeCartItems.length;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        {/* Navigation Header */}
        <div className="sticky top-16 z-40 bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
            <p className="text-gray-600 mt-2">Fresh, healthy meals made with love</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Cart Summary - Sticky */}
          {cartItemsCount > 0 && (
            <div className="sticky top-20 z-40 bg-white rounded-lg shadow-lg p-4 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-gray-900">
                    🛒 {cartItemsCount} item{cartItemsCount > 1 ? "s" : ""} in cart
                  </span>
                  <span className="ml-4 text-lg font-bold text-[#94aa4d]">
                    R{totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => router.push("/cart")}
                  className="bg-[#94aa4d] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#7d9243] transition"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}

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

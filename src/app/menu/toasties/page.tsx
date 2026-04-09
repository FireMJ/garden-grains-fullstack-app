"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toasties } from "@/data/toastiesData";
import { useCart } from "@/context/CartContext";
import { FaArrowLeft } from "react-icons/fa";

export default function ToastiesListPage() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const safeCartItems = cartItems && Array.isArray(cartItems) ? cartItems : [];
  const cartItemsCount = safeCartItems.length;
  const totalPrice = safeCartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  const handleImageError = (itemId: string) => {
    setImgErrors(prev => ({ ...prev, [itemId]: true }));
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
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Gourmet Toasties</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Delicious, crispy toasties made with artisanal sourdough bread and premium ingredients.
            Perfect for a quick and satisfying meal.
          </p>
        </div>

        {/* Cart Summary */}
        {cartItemsCount > 0 && (
          <div className="bg-amber-50 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">Items in cart: {cartItemsCount}</p>
                <p className="text-green-600 font-bold text-xl">Total: R {totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/cart")}
                  className="px-4 py-2 bg-[#2F5D50] text-white rounded-lg hover:bg-[#244a3f] transition font-semibold"
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

        {/* Toasties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toasties.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/menu/toasties/${item.slug}`)}
            >
              {/* Toastie Image */}
              <div className="relative h-48 w-full bg-gradient-to-br from-amber-100 to-orange-100">
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
                    🥪
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

              {/* Toastie Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                {/* Price and Action */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R{item.price}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/toasties/${item.slug}`);
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

        {/* Add-ons Info */}
        <div className="mt-12 p-6 bg-amber-50 rounded-xl text-center">
          <h3 className="font-bold text-amber-800 mb-2">Customize Your Toastie</h3>
          <p className="text-amber-700 text-sm">
            Add extra bacon, cheese, or avocado to make your toastie even more delicious!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Bacon (R25)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Extra Cheese (R15)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Avocado (R20)</span>
            <span className="text-xs bg-white px-2 py-1 rounded-full shadow-sm">+ Poached Egg (R15)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { juices } from "@/data/juicesData";  // Fixed: importing 'juices' not 'juicesData'

export default function JuicesListPage() {
  const router = useRouter();
  const { state } = useCart();
  const [juicesList, setJuicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safely load the juices data
    try {
      if (juices && Array.isArray(juices)) {
        setJuicesList(juices);
      } else {
        console.warn("Juices data is not available or not an array");
        setJuicesList([]);
      }
    } catch (error) {
      console.error("Error loading juices data:", error);
      setJuicesList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNavigate = (slug: string) => {
    router.push(`/menu/juices/${slug}`);
  };

  const totalItems = state?.itemCount || 0;
  const totalPrice = state?.total || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#1E4259] text-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          Loading delicious juices...
        </div>
      </main>
    );
  }

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
            Fresh Juices
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Cold-pressed, nutrient-rich juices made fresh daily with healthy ingredients
          </p>
        </div>

        {/* Cart Summary */}
        {state?.items?.length > 0 && (
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
        {juicesList.length === 0 ? (
          <div className="text-center py-12 text-gray-300">
            <p className="text-xl">No juices available at the moment.</p>
            <p className="mt-2">Please check back later or explore other categories.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {juicesList.map((item) => {
              // Safety checks for each item
              if (!item) return null;
              
              const inCart = state?.items?.filter((c) => 
                c?.name?.toLowerCase() === item?.name?.toLowerCase()
              ) || [];
              const itemCount = inCart.reduce((sum, i) => sum + (i?.quantity || 0), 0);
              const itemTotal = inCart.reduce((sum, i) => sum + ((i?.price || 0) * (i?.quantity || 0)), 0);

              // Safely get base price (Medium size or first available)
              let basePrice = 0;
              if (item.sizes && Array.isArray(item.sizes) && item.sizes.length > 0) {
                const mediumSize = item.sizes.find(s => s?.label === "Medium");
                basePrice = mediumSize?.price ?? item.sizes[0]?.price ?? 0;
              }

              return (
                <div 
                  key={item.id || Math.random()} 
                  onClick={() => item.slug && handleNavigate(item.slug)} 
                  className="bg-white/10 rounded-2xl shadow-lg cursor-pointer overflow-hidden transition transform hover:scale-105 hover:shadow-xl backdrop-blur-sm"
                >
                  <div className="relative w-full h-52">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name || "Juice"} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-green-200">{item.name || "Unnamed Juice"}</h2>
                    <p className="text-gray-100 text-sm line-clamp-3">{item.description || "Delicious fresh juice"}</p>
                    <span className="font-bold text-green-300 text-lg">R{basePrice.toFixed(2)}</span>

                    {itemCount > 0 && (
                      <div className="text-sm bg-green-200 text-green-900 rounded-md px-3 py-1 mt-1 font-semibold">
                        ✅ In Cart: {itemCount} item{itemCount > 1 ? "s" : ""} • R{itemTotal.toFixed(2)}
                      </div>
                    )}

                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (item.slug) handleNavigate(item.slug); 
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
        )}

        {/* Quick Navigation */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Explore Other Categories</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/menu/breakfast" className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition text-sm">Breakfast</Link>
              <Link href="/menu/bowls" className="bg-[#6C7B58] text-white px-4 py-2 rounded-lg hover:bg-[#5a6a4d] transition text-sm">Bowls</Link>
              <Link href="/menu/fries" className="bg-[#E76F51] text-white px-4 py-2 rounded-lg hover:bg-[#d65a3c] transition text-sm">Fries & Sides</Link>
              <Link href="/menu" className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#1E4259] transition text-sm">All Categories</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

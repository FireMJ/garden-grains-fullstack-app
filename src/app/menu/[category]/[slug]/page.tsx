"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { getMenuItemBySlug } from '@/data/menuData';
import { notFound } from 'next/navigation';

// Extended MenuItem interface to handle all item types
interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags?: string[];
  addOns?: Array<{ id: string; name: string; price: number }>;
  dipOptions?: Array<{ id: string; name: string; price: number }>;
  proteinOptions?: Array<{ id: string; name: string; price: number }>;
  friesUpsell?: Array<{ id: string; name: string; price: number; optional?: boolean }>;
  juiceUpsell?: Array<{ size: string; options: Array<{ id: string; name: string; price: number }> }>;
  hasProteinSelection?: boolean;
  baseOptions?: string[];
  sizes?: { [key: string]: number };
}

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, addToCart } = useCart();
  
  const category = params.category as string;
  const slug = params.slug as string;
  
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    const item = getMenuItemBySlug(slug);
    setMenuItem(item || null);
    setLoading(false);
  }, [slug]);

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotalPrice = () => {
    if (!menuItem) return 0;
    
    let totalPrice = menuItem.price;
    
    // Add selected add-ons price
    selectedAddOns.forEach(addOnId => {
      const addOn = menuItem.addOns?.find(a => a.id === addOnId);
      if (addOn) totalPrice += addOn.price;
    });
    
    return totalPrice;
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    const selectedAddOnsData = menuItem.addOns?.filter(addOn => 
      selectedAddOns.includes(addOn.id)
    ) || [];

    const cartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      name: menuItem.name + (selectedSize ? ` (${selectedSize})` : ''),
      description: menuItem.description,
      price: calculateTotalPrice(),
      quantity: 1,
      image: menuItem.image,
      addOns: selectedAddOnsData,
      specialInstructions: specialInstructions || undefined,
      size: selectedSize || undefined
    };

    addToCart(cartItem);
    
    // Show success message and option to go to cart or continue shopping
    if (confirm(`${menuItem.name} added to cart! Would you like to view your cart?`)) {
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center text-white hover:text-[#F4A261] transition text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <span className="text-white/40">›</span>
              <Link 
                href="/menu"
                className="flex items-center text-white hover:text-[#F4A261] transition text-sm"
              >
                Menu
              </Link>
              <span className="text-white/40">›</span>
              <Link 
                href={`/menu/${category}`}
                className="flex items-center text-white hover:text-[#F4A261] transition text-sm capitalize"
              >
                {category}
              </Link>
              <span className="text-white/40">›</span>
              <span className="text-[#F4A261] text-sm truncate max-w-xs">{menuItem.name}</span>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-[#F4A261] transition text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Item details */}
        <div className="bg-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gradient-to-br from-[#6C7B58] to-[#8A9B6E] flex items-center justify-center relative">
                {menuItem.image ? (
                  <Image 
                    src={menuItem.image} 
                    alt={menuItem.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-white/60 text-lg">Item Image</span>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{menuItem.name}</h1>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">{menuItem.description}</p>
              
              {menuItem.tags && menuItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {menuItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-[#6c8665] text-white text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Size Selection (if available) */}
              {menuItem.sizes && Object.keys(menuItem.sizes).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Select Size</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(menuItem.sizes).map(([size, price]) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3 border-2 rounded-lg text-center transition-all ${
                          selectedSize === size
                            ? "border-[#F4A261] bg-[#F4A261]/20 text-white"
                            : "border-gray-600 text-gray-300 hover:border-gray-500"
                        }`}
                      >
                        <div className="font-semibold">{size}</div>
                        <div className="text-sm mt-1">R{price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {menuItem.addOns && menuItem.addOns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {menuItem.addOns.map((addOn) => (
                      <label key={addOn.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addOn.id)}
                            onChange={() => handleAddOnToggle(addOn.id)}
                            className="w-4 h-4 text-[#F4A261] bg-gray-700 border-gray-600 rounded focus:ring-[#F4A261] focus:ring-2"
                          />
                          <span className="ml-3 text-white">{addOn.name}</span>
                        </div>
                        <span className="text-[#F4A261] font-semibold">+R{addOn.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  className="w-full p-3 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#F4A261] focus:ring-1 focus:ring-[#F4A261] resize-none"
                  rows={3}
                />
              </div>

              {/* Price and Add to Cart */}
              <div className="border-t border-gray-600 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-semibold text-white">Total:</span>
                    <div className="text-gray-300 text-sm">
                      {menuItem.name}
                      {selectedAddOns.length > 0 && ` + ${selectedAddOns.length} add-ons`}
                      {selectedSize && ` (${selectedSize})`}
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-[#F4A261]">
                    R{calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold text-lg shadow-lg"
                >
                  Add to Cart - R{calculateTotalPrice().toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        {state.items.length > 0 && (
          <div className="mt-8 bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-white">
                  {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-[#F4A261] font-bold text-xl">
                  Total: R{state.total.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/cart")}
                  className="px-6 py-3 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold"
                >
                  View Cart
                </button>
                <button
                  onClick={() => router.push("/schedule-order")}
                  className="px-6 py-3 bg-[#6C7B58] text-white rounded-lg hover:bg-[#5a6a4d] transition font-semibold"
                >
                  Schedule Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">
              Continue Exploring
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/menu/${category}`}
                className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition text-sm"
              >
                More {category}
              </Link>
              <Link
                href="/menu"
                className="bg-[#6C7B58] text-white px-4 py-2 rounded-lg hover:bg-[#5a6a4d] transition text-sm"
              >
                All Categories
              </Link>
              <Link
                href="/"
                className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#1E4259] transition text-sm"
              >
                Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

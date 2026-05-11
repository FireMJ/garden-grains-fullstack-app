"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart, type CartItem } from "@/context/CartContext";
const generateAddOnId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "-");

// This is a generic dynamic page for menu items that don't have specific pages
// For breakfast and bowls, use their specific pages instead

export default function MenuItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const category = params.category as string;
  const slug = params.slug as string;

  // For now, this is a fallback page. In a real app, you'd fetch the item data
  // based on the category and slug, or redirect to specific category pages
  
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>();

  // Mock data - in a real app, you'd fetch this based on category and slug
  const menuItem = {
    id: "1",
    name: "Sample Menu Item",
    description: "This is a sample menu item description.",
    price: 45.00,
    image: "/images/menu/default.jpg",
    category: category
  };

  const availableAddOns = [
    { id: "addon1", name: "Extra Sauce", price: 5.00 },
    { id: "addon2", name: "Extra Cheese", price: 8.00 }
  ];

  const availableSizes = [
    { id: "small", name: "Small", price: 0 },
    { id: "medium", name: "Medium", price: 5.00 },
    { id: "large", name: "Large", price: 10.00 }
  ];

  const handleAddToCart = () => {
    // Calculate total including add-ons and size
    const addOnsTotal = selectedAddOns.reduce((sum: number, addOn) => sum + addOn.price, 0);
    const sizePrice = availableSizes.find(size => size.id === selectedSize)?.price || 0;
    const itemTotal = (menuItem.price + addOnsTotal + sizePrice) * quantity;

    const cartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      quantity: quantity,
      total: itemTotal, // ✅ Added missing total
      image: menuItem.image,
      category: menuItem.category, // ✅ Added missing category
      addOns: selectedAddOns.map(a => ({ id: a.id || generateAddOnId(a.name), name: a.name, price: a.price, quantity: a.quantity })),
      specialInstructions: specialInstructions,
      size: selectedSize
    };

    addToCart(cartItem);

    // Show success message and option to go to cart or continue shopping
    if (confirm(`${menuItem.name} added to cart! Would you like to view your cart?`)) {
      router.push("/cart");
    } else {
      router.push("/menu");
    }
  };

  const toggleAddOn = (addOn: any) => {
    setSelectedAddOns(prev => 
      prev.find(a => a.id === addOn.id) 
        ? prev.filter(a => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  return (
    <div className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-white hover:text-[#F4A261] transition mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Menu
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={menuItem.image}
              alt={menuItem.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C7B58] to-[#8A9B6E] flex items-center justify-center">
              <span className="text-white/80 text-lg">Menu Item Image</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {menuItem.name}
              </h1>
              <p className="text-gray-300 mb-4">
                {menuItem.description}
              </p>
              <div className="text-2xl font-bold text-green-300">
                R{menuItem.price.toFixed(2)}
              </div>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Size</h3>
                <div className="space-y-2">
                  {availableSizes.map((size) => (
                    <label key={size.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="size"
                        checked={selectedSize === size.id}
                        onChange={() => setSelectedSize(size.id)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{size.name}</span>
                      {size.price > 0 && (
                        <span className="text-green-300">+R{size.price.toFixed(2)}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {availableAddOns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add-ons</h3>
                <div className="space-y-2">
                  {availableAddOns.map((addOn) => (
                    <label key={addOn.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some(a => a.id === addOn.id)}
                        onChange={() => toggleAddOn(addOn)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{addOn.name}</span>
                      <span className="text-green-300">+R{addOn.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                >
                  -
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261] resize-none"
              />
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

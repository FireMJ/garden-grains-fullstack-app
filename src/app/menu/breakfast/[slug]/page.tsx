"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { breakfastItems, type AddOn, type FriesUpsell, type JuiceUpsell } from "@/data/breakfastData";

interface SelectedJuice {
  size: string;
  option: {
    id: string;
    name: string;
    price: number;
  };
}

export default function BreakfastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const slug = params.slug as string;
  const breakfastItem = breakfastItems.find(item => item.slug === slug);

  // State for customization
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedFries, setSelectedFries] = useState<FriesUpsell | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<SelectedJuice | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!breakfastItem) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Item Not Found</h1>
          <button 
            onClick={() => router.push("/menu/breakfast")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Back to Breakfast Menu
          </button>
        </div>
      </div>
    );
  }

  // Calculate total price INCLUDING add-ons and upsells
  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const friesTotal = selectedFries ? selectedFries.price : 0;
  const juiceTotal = selectedJuice ? selectedJuice.option.price : 0;
  const itemTotal = (breakfastItem.price + addOnsTotal + friesTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      id: `${breakfastItem.id}-${Date.now()}`,
      name: breakfastItem.name,
      description: breakfastItem.description,
      price: breakfastItem.price,
      quantity: quantity,
      total: itemTotal,
      addOns: selectedAddOns,
      fries: selectedFries,
      juice: selectedJuice,
      specialInstructions: specialInstructions,
      image: breakfastItem.image,
      category: "breakfast"
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => 
      prev.find(a => a.id === addOn.id) 
        ? prev.filter(a => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const toggleFries = (fries: FriesUpsell) => {
    setSelectedFries(prev => prev?.id === fries.id ? null : fries);
  };

  const toggleJuice = (size: string, option: { id: string; name: string; price: number }) => {
    setSelectedJuice(prev => 
      prev?.option.id === option.id ? null : { size, option }
    );
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu/breakfast")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Breakfast
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-[#6C7B58] to-[#8A9B6E]">
            {!imageError ? (
              <Image
                src={breakfastItem.image}
                alt={breakfastItem.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/80 text-lg">{breakfastItem.name}</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {breakfastItem.name}
              </h1>
              <p className="text-gray-300 mb-4">
                {breakfastItem.description}
              </p>
              <div className="text-2xl font-bold text-green-300">
                R{breakfastItem.price.toFixed(2)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {breakfastItem.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[#6C7B58] text-white text-xs px-3 py-1 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>

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

            {/* Add-ons - Using data from breakfastData */}
            {breakfastItem.addOns && breakfastItem.addOns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add-ons</h3>
                <div className="space-y-2">
                  {breakfastItem.addOns.map((addOn) => (
                    <label key={addOn.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some(a => a.id === addOn.id)}
                        onChange={() => toggleAddOn(addOn)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1 capitalize">{addOn.name}</span>
                      <span className="text-green-300">+R{addOn.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Fries Upsell - Using data from breakfastData */}
            {breakfastItem.friesUpsell && breakfastItem.friesUpsell.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add Fries</h3>
                <div className="space-y-2">
                  {breakfastItem.friesUpsell.map((fries) => (
                    <label key={fries.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fries"
                        checked={selectedFries?.id === fries.id}
                        onChange={() => toggleFries(fries)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{fries.name}</span>
                      <span className="text-green-300">+R{fries.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Juice Upsell - Using data from breakfastData */}
            {breakfastItem.juiceUpsell && breakfastItem.juiceUpsell.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add Fresh Juice</h3>
                <div className="space-y-4">
                  {breakfastItem.juiceUpsell.map((juiceGroup) => (
                    <div key={juiceGroup.size} className="space-y-2">
                      <h4 className="font-medium text-gray-300">{juiceGroup.size}</h4>
                      {juiceGroup.options.map((juice) => (
                        <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="juice"
                            checked={selectedJuice?.option.id === juice.id}
                            onChange={() => toggleJuice(juiceGroup.size, juice)}
                            className="w-4 h-4 text-[#F4A261]"
                          />
                          <span className="flex-1">{juice.name}</span>
                          <span className="text-green-300">+R{juice.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Total and Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#F4A261]">
                  R{itemTotal.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg hover:scale-105 transform"
              >
                Add to Cart - R{itemTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
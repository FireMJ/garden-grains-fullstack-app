"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { fries, friesAddOns } from "@/data/friesData";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface JuiceOption {
  id: string;
  name: string;
  price: number;
}

interface JuiceUpsell {
  id: string;
  name: string;
  price: number;
  size: string;
}

export default function FriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const slug = params.slug as string;
  const friesItem = fries.find(item => item.slug === slug);

  // State for customization
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedDip, setSelectedDip] = useState<AddOn | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<JuiceUpsell | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!friesItem) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Fries Not Found</h1>
          <button 
            onClick={() => router.push("/menu/fries")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Back to Fries Menu
          </button>
        </div>
      </div>
    );
  }

  // Calculate total price INCLUDING add-ons and selected dip
  const addOnsTotal = selectedAddOns.reduce((sum: number, addon) => sum + addon.price, 0);
  const dipTotal = selectedDip ? selectedDip.price : 0;
  const juiceTotal = selectedJuice ? selectedJuice.price : 0;
  const itemTotal = (friesItem.price + addOnsTotal + dipTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    // Convert JuiceUpsell to the expected CartItem juice structure
    const cartJuice = selectedJuice ? {
      size: selectedJuice.size,
      option: {
        id: selectedJuice.id,
        name: selectedJuice.name.replace(`(${selectedJuice.size})`, '').trim(),
        price: selectedJuice.price
      }
    } : null;

    const cartItem = {
      id: `${friesItem.id}-${Date.now()}`,
      name: friesItem.name,
      description: friesItem.description,
      price: friesItem.price,
      quantity: quantity,
      total: itemTotal,
      addOns: selectedAddOns,
      dip: selectedDip,
      juice: cartJuice,
      specialInstructions: specialInstructions,
      image: friesItem.image,
      category: "fries"
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

  // Combine item-specific add-ons with common add-ons
  const allAddOns = [...(friesItem.addOns || []), ...friesAddOns];
  // Remove duplicates based on id
  const uniqueAddOns = allAddOns.filter((addOn, index, self) => 
    index === self.findIndex(a => a.id === addOn.id)
  );

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu/fries")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Fries
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={friesItem.image}
              alt={friesItem.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B4513] to-[#D2691E] flex items-center justify-center">
              <span className="text-white/80 text-lg">Fries Image</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {friesItem.name}
              </h1>
              <p className="text-gray-300 mb-4">
                {friesItem.description}
              </p>
              
              <div className="text-2xl font-bold text-green-300">
                R{friesItem.price.toFixed(2)}
              </div>
            </div>

            {/* Dip Selection */}
            {friesItem.dipOptions && friesItem.dipOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Select Dip</h3>
                <div className="space-y-2">
                  {friesItem.dipOptions.map((dip) => (
                    <label key={dip.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="dip"
                        checked={selectedDip?.id === dip.id}
                        onChange={() => setSelectedDip(dip)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{dip.name}</span>
                      <span className="text-green-300">
                        {dip.price > 0 ? `+R${dip.price.toFixed(2)}` : "Free"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Juice Upsell */}
            {friesItem.juiceUpsell && friesItem.juiceUpsell.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add a Fresh Juice</h3>
                <div className="space-y-2">
                  {friesItem.juiceUpsell.map((juice) => (
                    <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="juice"
                        checked={selectedJuice?.id === juice.id}
                        onChange={() => setSelectedJuice(juice)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{juice.name}</span>
                      <span className="text-green-300">+R{juice.price.toFixed(2)}</span>
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

            {/* Add-ons */}
            {uniqueAddOns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add-ons</h3>
                <div className="space-y-2">
                  {uniqueAddOns.map((addOn) => (
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
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#F4A261]">
                  R{itemTotal.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg"
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

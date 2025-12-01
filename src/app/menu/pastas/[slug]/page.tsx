"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { pastas, pastaAddOns } from "@/data/pastasData";
import { friesUpsellOptions, juiceUpsellOptions } from "@/data/bowlsData";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

export default function PastaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const slug = params.slug as string;
  const pastaItem = pastas.find(item => item.slug === slug);

  // State for customization
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedFries, setSelectedFries] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<any>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!pastaItem) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Pasta Not Found</h1>
          <button 
            onClick={() => router.push("/menu/pastas")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Back to Pastas Menu
          </button>
        </div>
      </div>
    );
  }

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev => 
      prev.find(a => a.id === addOn.id) 
        ? prev.filter(a => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  // Calculate total price INCLUDING all selections
  const basePrice = pastaItem.price;
  const addOnsTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  const friesTotal = selectedFries ? selectedFries.price : 0;
  const juiceTotal = selectedJuice ? selectedJuice.price : 0;
  
  const itemTotal = (basePrice + addOnsTotal + friesTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    const allAddOns = [...selectedAddOns];
    
    addToCart({
      id: `${pastaItem.id}-${Date.now()}`,
      name: pastaItem.name,
      description: pastaItem.description,
      price: pastaItem.price,
      quantity: quantity,
      total: itemTotal,
      image: pastaItem.image,
      category: pastaItem.category,
      addOns: allAddOns,
      fries: selectedFries,
      juice: selectedJuice,
      specialInstructions: specialInstructions
    });
    
    router.push("/cart");
  };

  // Combine item-specific add-ons with common add-ons
  const allAddOns = [...(pastaItem.addOns || []), ...pastaAddOns];
  // Remove duplicates based on id
  const uniqueAddOns = allAddOns.filter((addOn, index, self) => 
    index === self.findIndex(a => a.id === addOn.id)
  );

  // Group juices by type for better display
  const groupedJuices = juiceUpsellOptions.reduce((acc, juice) => {
    if (!acc[juice.name]) {
      acc[juice.name] = [];
    }
    acc[juice.name].push(juice);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu/pastas")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pastas
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2A5568] to-[#6C7B58] flex items-center justify-center">
              <span className="text-white/80 text-lg">Pasta Image</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {pastaItem.name}
              </h1>
              <p className="text-gray-300 mb-4">
                {pastaItem.description}
              </p>
              
              {/* Ingredients */}
              {pastaItem.ingredients && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Ingredients:</h4>
                  <p className="text-sm text-gray-400">{pastaItem.ingredients.join(", ")}</p>
                </div>
              )}
              
              {/* Base Price */}
              <div className="text-2xl font-bold text-green-300">
                R{pastaItem.price.toFixed(2)}
              </div>
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

            {/* Fries Upsell */}
            {friesUpsellOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add Fries</h3>
                <div className="space-y-2">
                  {friesUpsellOptions.map((fries) => (
                    <label key={fries.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fries"
                        value={fries.id}
                        checked={selectedFries?.id === fries.id}
                        onChange={() => setSelectedFries(fries)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{fries.name}</span>
                      <span className="text-green-300">+R{fries.price}</span>
                    </label>
                  ))}
                  <button
                    onClick={() => setSelectedFries(null)}
                    className="text-sm text-gray-400 hover:text-white transition ml-7"
                  >
                    No fries, thanks
                  </button>
                </div>
              </div>
            )}

            {/* Juice Upsell */}
            {juiceUpsellOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add a Juice</h3>
                <div className="space-y-4">
                  {groupedJuices && Object.entries(groupedJuices).map(([juiceName, sizes]) => (
                    <div key={juiceName}>
                      <h4 className="font-medium mb-2 text-gray-300">{juiceName}</h4>
                      <div className="space-y-2">
                        {sizes.map((juice) => (
                          <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="juice"
                              value={juice.id}
                              checked={selectedJuice?.id === juice.id}
                              onChange={() => setSelectedJuice(juice)}
                              className="w-4 h-4 text-[#F4A261] rounded"
                            />
                            <span className="flex-1">{juice.size}</span>
                            <span className="text-green-300">+R{juice.price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setSelectedJuice(null)}
                    className="text-sm text-gray-400 hover:text-white transition ml-7"
                  >
                    No juice, thanks
                  </button>
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
                placeholder="Any allergies, dietary restrictions, or special requests..."
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

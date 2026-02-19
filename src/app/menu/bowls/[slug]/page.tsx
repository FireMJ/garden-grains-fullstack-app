"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { notFound, useParams } from "next/navigation";
import bowlsData from "@/data/bowlsData";

const BowlPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const bowlItem = bowlsData.find((bowl) => bowl.slug === slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [selectedDressing, setSelectedDressing] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [selectedFries, setSelectedFries] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<any>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    if (bowlItem) {
      setSelectedBase(bowlItem.bases[0] || null);
      setSelectedDressing(bowlItem.dressings[0] || null);
    }
  }, [bowlItem]);

  if (!bowlItem) {
    notFound();
  }

  const toggleAddOn = (addOn: any) => {
    setSelectedAddOns((prev) => {
      const isSelected = prev.some((a) => a.id === addOn.id);
      if (isSelected) {
        return prev.filter((a: any) => a.id !== addOn.id);
      } else {
        // Ensure add-on has both name and price
        return [...prev, { 
          id: addOn.id, 
          name: addOn.name, 
          price: addOn.price || 0 
        }];
      }
    });
  };

  const toggleFries = (fries: any) => {
    setSelectedFries(selectedFries?.id === fries.id ? null : fries);
  };

  const toggleJuice = (juice: any) => {
    setSelectedJuice(selectedJuice?.id === juice.id ? null : juice);
  };

  // Calculate total price
  const basePrice = bowlItem.price;
  const baseExtra = selectedBase?.price || 0;
  const addOnsTotal = selectedAddOns.reduce((sum: number, addOn) => sum + (addOn.price || 0), 0);
  const friesTotal = selectedFries ? selectedFries.price : 0;
  const juiceTotal = selectedJuice ? selectedJuice.price : 0;

  const itemTotal = (basePrice + baseExtra + addOnsTotal + friesTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    // Validate required selections
    if (!selectedBase) {
      alert("Please select a base");
      return;
    }

    // Format add-ons to match CartContext structure
    const formattedAddOns = selectedAddOns.map(addOn => ({
      name: addOn.name,
      price: addOn.price || 0
    }));

    addToCart({
      id: bowlItem.id,
      name: bowlItem.name,
      price: bowlItem.price,
      quantity: quantity,
      image: bowlItem.image,
      base: selectedBase?.name || "",
      dressing: selectedDressing?.name || "",
      addOns: formattedAddOns as any,
      friesUpsell: selectedFries,
      juiceUpsell: selectedJuice,
      specialInstructions: specialInstructions,
      baseExtra: baseExtra
    });

    // Show confirmation
    alert(`Added ${quantity} ${bowlItem.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/menu"
          className="inline-flex items-center text-[#E9C46A] hover:text-[#F4A261] mb-6"
        >
          ← Back to Menu
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bowl Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-64 md:h-80">
              <Image
                src={bowlItem.image}
                alt={bowlItem.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800">{bowlItem.name}</h1>
              <p className="text-gray-600 mt-2">{bowlItem.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-3xl font-bold text-[#264653]">
                  R{bowlItem.price.toFixed(2)}
                </span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-[#E9C46A] text-white font-bold hover:bg-[#F4A261]"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-[#E9C46A] text-white font-bold hover:bg-[#F4A261]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Base Selection */}
            {bowlItem.bases && bowlItem.bases.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-[#264653] mb-3">
                  Choose Your Base
                </h3>
                <div className="space-y-2">
                  {bowlItem.bases.map((base: any) => (
                    <label key={base.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="base"
                        checked={selectedBase?.id === base.id}
                        onChange={() => setSelectedBase(base)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{base.name}</span>
                      {base.price > 0 && (
                        <span className="text-[#2A9D8F] font-semibold">
                          +R{base.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dressing Selection */}
            {bowlItem.dressings && bowlItem.dressings.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-[#264653] mb-3">
                  Choose Your Dressing
                </h3>
                <div className="space-y-2">
                  {bowlItem.dressings.map((dressing: any) => (
                    <label key={dressing.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="dressing"
                        checked={selectedDressing?.id === dressing.id}
                        onChange={() => setSelectedDressing(dressing)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{dressing.name}</span>
                      {dressing.price > 0 && (
                        <span className="text-[#2A9D8F] font-semibold">
                          +R{dressing.price.toFixed(2)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add-Ons */}
            {bowlItem.addOns && bowlItem.addOns.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-[#F4A261] mb-3">
                  Additional Add-Ons
                </h3>
                <div className="space-y-2">
                  {bowlItem.addOns.map((addOn: any) => (
                    <label key={addOn.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some(a => a.id === addOn.id)}
                        onChange={() => toggleAddOn(addOn)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{addOn.name}</span>
                      <span className="text-[#2A9D8F] font-semibold">
                        +R{(addOn.price || 0).toFixed(2)} each
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Fries */}
            {(bowlItem as any).fries && (bowlItem as any).fries.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-[#264653] mb-3">
                  Add Fries
                </h3>
                <div className="space-y-2">
                  {(bowlItem as any).fries.map((fry: any) => (
                    <label key={fry.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFries?.id === fry.id}
                        onChange={() => toggleFries(fry)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{fry.name}</span>
                      <span className="text-[#2A9D8F] font-semibold">
                        +R{fry.price.toFixed(2)} each
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Juice */}
            {(bowlItem as any).juices && (bowlItem as any).juices.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold text-[#264653] mb-3">
                  Add Juice
                </h3>
                <div className="space-y-2">
                  {(bowlItem as any).juices.map((juice: any) => (
                    <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedJuice?.id === juice.id}
                        onChange={() => toggleJuice(juice)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{juice.name} ({juice.size})</span>
                      <span className="text-[#2A9D8F] font-semibold">
                        +R{juice.price.toFixed(2)} each
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold text-[#264653] mb-3">
                Special Instructions
              </h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                placeholder="Any special requests or allergies..."
              />
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-semibold text-[#264653] mb-3">
                Price Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Bowl:</span>
                  <span>R{basePrice.toFixed(2)} × {quantity}</span>
                </div>
                {baseExtra > 0 && (
                  <div className="flex justify-between text-[#2A9D8F]">
                    <span>{selectedBase?.name}:</span>
                    <span>+R{baseExtra.toFixed(2)} × {quantity}</span>
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-[#2A9D8F]">
                    <span>Add-ons:</span>
                    <span>+R{addOnsTotal.toFixed(2)} × {quantity}</span>
                  </div>
                )}
                {selectedFries && (
                  <div className="flex justify-between text-[#2A9D8F]">
                    <span>{selectedFries.name}:</span>
                    <span>+R{selectedFries.price.toFixed(2)} × {quantity}</span>
                  </div>
                )}
                {selectedJuice && (
                  <div className="flex justify-between text-[#2A9D8F]">
                    <span>{selectedJuice.name}:</span>
                    <span>+R{selectedJuice.price.toFixed(2)} × {quantity}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-[#264653]">
                    <span>Total:</span>
                    <span>R{itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gradient-to-r from-[#E9C46A] to-[#F4A261] text-white text-lg font-bold rounded-lg hover:from-[#F4A261] hover:to-[#E76F51] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Add to Cart - R{itemTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowlPage;

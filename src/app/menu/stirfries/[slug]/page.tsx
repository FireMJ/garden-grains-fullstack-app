"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { stirfries, stirFryBaseOptions, stirFryAddOns, friesUpsellOptions, juiceUpsellOptions } from "@/data/stirfryData";

interface StirFryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  baseOptions?: any[];
  addOns?: any[];
  friesUpsell?: any[];
  juiceUpsell?: any[];
}

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  size?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function StirfryDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [stirFryItem, setStirFryItem] = useState<StirFryItem | null>(null);
  const [selectedBase, setSelectedBase] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  // Upsell states
  const [selectedFries, setSelectedFries] = useState<UpsellItem | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<UpsellItem | null>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Unwrap params
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setSlug(unwrapped.slug);
    };
    unwrapParams();
  }, [params]);

  // Load stir fry data
  useEffect(() => {
    if (!slug) return;
    
    const item = stirfries?.find((s: any) => s.slug === slug);
    if (item) {
      setStirFryItem(item);
    }
  }, [slug]);

  const handleAddOnToggle = (addOn: { name: string; price: number }) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.name === addOn.name);
      if (existing) {
        return prev.filter(a => a.name !== addOn.name);
      } else {
        return [...prev, { ...addOn, quantity: 1 }];
      }
    });
  };

  const updateAddOnQuantity = (addOnName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedAddOns(prev => prev.filter(a => a.name !== addOnName));
    } else {
      setSelectedAddOns(prev =>
        prev.map(a =>
          a.name === addOnName ? { ...a, quantity: newQuantity } : a
        )
      );
    }
  };

  const calculateTotal = () => {
    let total = stirFryItem?.price || 0;
    
    if (selectedBase && selectedBase.price) {
      total += selectedBase.price;
    }
    
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
    }
    
    if (selectedFries) {
      total += selectedFries.price;
    }
    
    if (selectedJuice) {
      total += selectedJuice.price;
    }
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: `${stirFryItem?.id}-${Date.now()}`,
      name: stirFryItem?.name || "",
      price: stirFryItem?.price || 0,
      quantity: quantity,
      image: stirFryItem?.image || "",
      category: "stirfries",
      description: stirFryItem?.description || "",
      base: selectedBase?.name || "",
      baseExtra: selectedBase?.price || 0,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions,
      friesUpsell: selectedFries,
      juiceUpsell: selectedJuice,
      juiceSize: selectedJuiceSize
    };
    
    console.log("Adding stir fry to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceUpsellOptions.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  if (!mounted || !stirFryItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stir fry details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/stirfries" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Stir Fries
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={stirFryItem.image}
                alt={stirFryItem.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{stirFryItem.name}</h1>
            <p className="text-gray-600 mb-4">{stirFryItem.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{stirFryItem.price}</div>

            {stirFryItem.tags && stirFryItem.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {stirFryItem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Base Selection - Optional */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Add a Base (Optional)</h3>
              <div className="grid grid-cols-2 gap-2">
                {stirFryItem.baseOptions?.map((base) => (
                  <button
                    key={base.id}
                    onClick={() => setSelectedBase(selectedBase?.id === base.id ? null : base)}
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedBase?.id === base.id
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{base.name}</span>
                      {base.price > 0 && (
                        <span className="text-sm text-green-600">+R{base.price}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {stirFryAddOns && stirFryAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {stirFryAddOns.map((addOn, index) => {
                    const selected = selectedAddOns.find(a => a.name === addOn.name);
                    return (
                      <div key={`addon-${index}-${addOn.name}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-green-600">+R{addOn.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddOnToggle(addOn)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upsells Section - Fries & Juice */}
            <div className="mb-6">
              <button
                onClick={() => setShowUpsells(!showUpsells)}
                className="flex items-center gap-2 text-green-600 font-medium mb-3 hover:text-green-700"
              >
                {showUpsells ? '▼' : '▶'} Add Fries & Drink to Complete Your Meal
              </button>
              
              {showUpsells && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaTruck className="text-amber-600" />
                      Add Fries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {friesUpsellOptions.map((fries) => (
                        <button
                          key={fries.id}
                          onClick={() => setSelectedFries(selectedFries?.id === fries.id ? null : fries)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedFries?.id === fries.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {fries.name} <span className="text-green-600">+R{fries.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-amber-600" />
                      Add Juice
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {juiceUpsellOptions.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => setSelectedJuiceSize(size.size)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            selectedJuiceSize === size.size
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getJuiceOptionsForSize().map((juice) => (
                        <button
                          key={juice.id}
                          onClick={() => setSelectedJuice(selectedJuice?.id === juice.id ? null : juice)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedJuice?.id === juice.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {juice.name} <span className="text-green-600">+R{juice.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or dietary requirements?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="mb-4">
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span>Base Price:</span>
                  <span>R{stirFryItem.price}</span>
                </div>
                {selectedBase && selectedBase.price > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Base Add-on:</span>
                    <span>+R{selectedBase.price}</span>
                  </div>
                )}
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Add-ons:</span>
                    <span>+R{selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0)}</span>
                  </div>
                )}
                {selectedFries && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Fries:</span>
                    <span>+R{selectedFries.price}</span>
                  </div>
                )}
                {selectedJuice && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Juice:</span>
                    <span>+R{selectedJuice.price}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600 pt-2 border-t">
                  <span className="font-semibold">Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
                  <span className="font-semibold">R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Add to Cart - R{calculateTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

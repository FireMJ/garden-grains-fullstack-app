"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { wraps, wrapAddOns, friesUpsellOptions, juiceUpsellOptions } from "@/data/wrapsData";

interface WrapItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  proteinOptions?: any[];
  addOns?: any[];
  friesUpsell?: any[];
  juiceUpsell?: any[];
}

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  dips?: any[];
  selectedDip?: any;
  size?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WrapDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [wrapItem, setWrapItem] = useState<WrapItem | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [proteinError, setProteinError] = useState<string>("");
  
  // Upsell states
  const [selectedFries, setSelectedFries] = useState<UpsellItem | null>(null);
  const [selectedDip, setSelectedDip] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<UpsellItem | null>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);

  const isQuesadilla = wrapItem?.slug === "crunchy-quesadilla";

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

  // Load wrap data
  useEffect(() => {
    if (!slug) return;
    
    const item = wraps?.find((w: any) => w.slug === slug);
    if (item) {
      setWrapItem(item);
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

  const validateSelection = () => {
    if (isQuesadilla && !selectedProtein) {
      setProteinError("Please select a protein for your quesadilla");
      return false;
    }
    setProteinError("");
    return true;
  };

  const calculateTotal = () => {
    let total = wrapItem?.price || 0;
    
    // Add protein price if selected (for quesadilla)
    if (selectedProtein && selectedProtein.price) {
      total += selectedProtein.price;
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
    if (!validateSelection()) {
      document.getElementById('protein-selection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const cartItem = {
      id: `${wrapItem?.id}-${Date.now()}`,
      name: wrapItem?.name || "",
      price: wrapItem?.price || 0,
      quantity: quantity,
      image: wrapItem?.image || "",
      category: "wraps",
      description: wrapItem?.description || "",
      protein: selectedProtein?.name,
      proteinExtra: selectedProtein?.price || 0,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions,
      friesUpsell: selectedFries ? {
        ...selectedFries,
        selectedDip: selectedDip
      } : null,
      juiceUpsell: selectedJuice,
      juiceSize: selectedJuiceSize
    };
    
    console.log("Adding wrap to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  // Get available juice options for selected size
  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceUpsellOptions.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  if (!mounted || !wrapItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wrap details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/wraps" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Wraps
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={wrapItem.image}
                alt={wrapItem.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{wrapItem.name}</h1>
            <p className="text-gray-600 mb-4">{wrapItem.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{wrapItem.price}</div>

            {/* Tags */}
            {wrapItem.tags && wrapItem.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {wrapItem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Protein Selection - Only for Quesadilla */}
            {isQuesadilla && wrapItem.proteinOptions && (
              <div id="protein-selection" className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Choose Your Protein <span className="text-red-500 text-sm">*Required</span>
                </h3>
                {proteinError && (
                  <p className="text-red-500 text-sm mb-2">{proteinError}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {wrapItem.proteinOptions.map((protein) => (
                    <button
                      key={protein.id}
                      onClick={() => {
                        setSelectedProtein(protein);
                        setProteinError("");
                      }}
                      className={`p-3 rounded-lg border text-left transition ${
                        selectedProtein?.id === protein.id
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{protein.name}</span>
                        {protein.price > 0 && (
                          <span className="text-sm text-green-600">+R{protein.price}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {wrapAddOns && wrapAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {wrapAddOns.map((addOn, index) => {
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
                  {/* Fries Selection with Dip Choice */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaTruck className="text-amber-600" />
                      Add Fries
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friesUpsellOptions.map((fries) => (
                        <button
                          key={fries.id}
                          onClick={() => {
                            setSelectedFries(selectedFries?.id === fries.id ? null : fries);
                            setSelectedDip(null);
                          }}
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
                    
                    {/* Dip Selection - Only shown when fries are selected */}
                    {selectedFries && selectedFries.dips && (
                      <div className="mt-3 pt-3 border-t border-amber-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Choose your dip:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFries.dips.map((dip) => (
                            <button
                              key={dip.id}
                              onClick={() => setSelectedDip(dip)}
                              className={`px-3 py-1 rounded-lg border text-sm transition ${
                                selectedDip?.id === dip.id
                                  ? 'border-green-500 bg-green-50 text-green-700'
                                  : 'border-gray-300 hover:border-green-300'
                              }`}
                            >
                              {dip.name}
                            </button>
                          ))}
                        </div>
                        {selectedDip && (
                          <p className="text-xs text-green-600 mt-2">✓ {selectedDip.name} selected</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Juice Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-amber-600" />
                      Add Juice
                    </h3>
                    
                    {/* Juice Size Selector */}
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
                    
                    {/* Juice Options for Selected Size */}
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
                    {selectedJuice && (
                      <p className="text-xs text-green-600 mt-2">✓ {selectedJuice.name} ({selectedJuiceSize}) added</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
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

            {/* Quantity */}
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

            {/* Total and Add to Cart */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span>Base Price:</span>
                  <span>R{wrapItem.price}</span>
                </div>
                {selectedProtein && selectedProtein.price > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Protein Upgrade:</span>
                    <span>+R{selectedProtein.price}</span>
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
              {isQuesadilla && !selectedProtein && (
                <p className="text-xs text-center text-red-500 mt-2">
                  * Please select a protein before adding to cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

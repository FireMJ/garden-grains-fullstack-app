"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { salads, saladAddOns, friesUpsellOptions, juiceUpsellOptions, saladDressings } from "@/data/saladsData";

interface SaladItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  dressings: any[];
}

interface DipOption {
  id: string;
  name: string;
  price: number;
}

interface FriesUpsellItem {
  id: string;
  name: string;
  price: number;
  dipOptions?: DipOption[];
}

interface SelectedFriesWithDip {
  id: string;
  name: string;
  price: number;
  selectedDip?: DipOption;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SaladDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [salad, setSalad] = useState<SaladItem | null>(null);
  const [selectedDressing, setSelectedDressing] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  // Upsell states
  const [selectedFries, setSelectedFries] = useState<SelectedFriesWithDip | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<any>(null);
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

  // Load salad data
  useEffect(() => {
    if (!slug) return;
    
    const item = salads?.find((s: any) => s.slug === slug);
    if (item) {
      setSalad(item);
      if (item.dressings && item.dressings.length > 0) {
        setSelectedDressing(item.dressings[0].name);
      }
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

  // Handle fries selection with dip
  const handleFriesSelect = (fries: FriesUpsellItem) => {
    if (selectedFries?.id === fries.id) {
      setSelectedFries(null);
    } else {
      setSelectedFries({
        id: fries.id,
        name: fries.name,
        price: fries.price,
        selectedDip: undefined,
      });
    }
  };

  const handleDipSelect = (dip: DipOption) => {
    if (selectedFries) {
      setSelectedFries({
        ...selectedFries,
        selectedDip: selectedFries.selectedDip?.id === dip.id ? undefined : dip,
      });
    }
  };

  // Handle juice selection
  const handleJuiceSelect = (juice: any, size: string) => {
    if (selectedJuice?.name === juice.name && selectedJuice?.size === size) {
      setSelectedJuice(null);
    } else {
      setSelectedJuice({
        size: size,
        name: juice.name,
        price: juice.price
      });
    }
  };

  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceUpsellOptions.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  const calculateTotal = () => {
    let total = salad?.price || 0;
    
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
    }
    
    if (selectedFries) {
      total += selectedFries.price;
      if (selectedFries.selectedDip && selectedFries.selectedDip.price > 0) {
        total += selectedFries.selectedDip.price;
      }
    }
    
    if (selectedJuice) {
      total += selectedJuice.price;
    }
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!salad) return;
    
    let itemName = salad.name;
    if (selectedFries) {
      itemName += ` + ${selectedFries.name}`;
      if (selectedFries.selectedDip) {
        itemName += ` (${selectedFries.selectedDip.name})`;
      }
    }
    if (selectedJuice) {
      itemName += ` + ${selectedJuice.name} (${selectedJuice.size})`;
    }
    
    const cartItem = {
      id: `${salad.id}-${Date.now()}`,
      name: itemName,
      price: salad.price,
      quantity: quantity,
      image: salad.image,
      category: "salads",
      description: salad.description,
      dressing: selectedDressing,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions,
      fries: selectedFries ? {
        name: selectedFries.name,
        price: selectedFries.price,
        dip: selectedFries.selectedDip?.name,
        dipPrice: selectedFries.selectedDip?.price || 0,
      } : null,
      juice: selectedJuice ? {
        name: selectedJuice.name,
        price: selectedJuice.price,
        size: selectedJuice.size,
      } : null,
    };
    
    console.log("Adding to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  if (!mounted || !salad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading salad details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/salads" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Salads
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={salad.image}
                alt={salad.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{salad.name}</h1>
            <p className="text-gray-600 mb-4">{salad.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{salad.price}</div>

            {/* Tags */}
            {salad.tags && salad.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {salad.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dressing Selection */}
            {salad.dressings && salad.dressings.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Choose Your Dressing</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {salad.dressings.map((dressing) => (
                    <button
                      key={dressing.id}
                      onClick={() => setSelectedDressing(dressing.name)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        selectedDressing === dressing.name
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {dressing.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {saladAddOns && saladAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {saladAddOns.map((addOn, index) => {
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
                className="flex items-center gap-2 text-green-600 font-medium mb-3 hover:text-green-700 w-full text-left"
              >
                <span>{showUpsells ? '▼' : '▶'}</span> 
                <span>Add Fries & Drink to Complete Your Meal</span>
              </button>
              
              {showUpsells && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  {/* Fries Selection with Dip Options */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaTruck className="text-amber-600" />
                      Add Fries
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friesUpsellOptions.map((fries: FriesUpsellItem) => (
                        <button
                          key={fries.id}
                          onClick={() => handleFriesSelect(fries)}
                          className={`px-4 py-2 rounded-lg border text-sm transition ${
                            selectedFries?.id === fries.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 bg-white hover:border-amber-300'
                          }`}
                        >
                          {fries.name} <span className="text-green-600 font-medium">+R{fries.price}</span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Dip Options - only show if fries are selected */}
                    {selectedFries && friesUpsellOptions.find(f => f.id === selectedFries.id)?.dipOptions && (
                      <div className="mt-3 pl-4 border-l-2 border-amber-300">
                        <p className="text-sm font-medium text-gray-700 mb-2">Choose a dip (optional):</p>
                        <div className="flex flex-wrap gap-2">
                          {friesUpsellOptions
                            .find(f => f.id === selectedFries.id)
                            ?.dipOptions?.map((dip: DipOption) => (
                              <button
                                key={dip.id}
                                onClick={() => handleDipSelect(dip)}
                                className={`px-3 py-1 rounded-full text-xs transition ${
                                  selectedFries.selectedDip?.id === dip.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
                                }`}
                              >
                                {dip.name} {dip.price > 0 && `+R${dip.price}`}
                              </button>
                            ))}
                        </div>
                        {selectedFries.selectedDip && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ {selectedFries.selectedDip.name} added
                          </p>
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
                      {juiceUpsellOptions.map((sizeGroup) => (
                        <button
                          key={sizeGroup.size}
                          onClick={() => {
                            setSelectedJuiceSize(sizeGroup.size);
                            setSelectedJuice(null);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            selectedJuiceSize === sizeGroup.size
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {sizeGroup.size}
                        </button>
                      ))}
                    </div>
                    
                    {/* Juice Options for Selected Size */}
                    <div className="flex flex-wrap gap-2">
                      {getJuiceOptionsForSize().map((juice) => (
                        <button
                          key={juice.id}
                          onClick={() => handleJuiceSelect(juice, selectedJuiceSize)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedJuice?.name === juice.name && selectedJuice?.size === selectedJuiceSize
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 bg-white hover:border-amber-300'
                          }`}
                        >
                          {juice.name} <span className="text-green-600">+R{juice.price}</span>
                        </button>
                      ))}
                    </div>
                    {selectedJuice && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {selectedJuice.name} ({selectedJuice.size}) added
                      </p>
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
              <div className="mb-4 space-y-1">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Base Price:</span>
                  <span>R{salad.price}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Add-ons:</span>
                    <span>+R{selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0)}</span>
                  </div>
                )}
                {selectedFries && (
                  <>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>{selectedFries.name}:</span>
                      <span>+R{selectedFries.price}</span>
                    </div>
                    {selectedFries.selectedDip && selectedFries.selectedDip.price > 0 && (
                      <div className="flex justify-between items-center text-gray-600 pl-4 text-sm">
                        <span>└ {selectedFries.selectedDip.name}:</span>
                        <span>+R{selectedFries.selectedDip.price}</span>
                      </div>
                    )}
                  </>
                )}
                {selectedJuice && (
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{selectedJuice.name} ({selectedJuice.size}):</span>
                    <span>+R{selectedJuice.price}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-900 font-semibold pt-2 border-t mt-2">
                  <span>Total ({quantity} item{quantity > 1 ? 's' : ''}):</span>
                  <span className="text-green-600 text-xl">R{calculateTotal().toFixed(2)}</span>
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

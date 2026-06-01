"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { breakfastItems, breakfastAddOns, friesUpsell, juiceGroup, juiceAddOns } from "@/data/breakfastData";

interface BreakfastItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
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

interface JuiceAddOn {
  id: string;
  name: string;
  price: number;
}

interface JuiceUpsellItem {
  id: string;
  name: string;
  price: number;
  addOns?: JuiceAddOn[];
}

interface SelectedFriesWithDip {
  id: string;
  name: string;
  price: number;
  selectedDip?: DipOption;
}

interface SelectedJuiceWithAddOns {
  id: string;
  name: string;
  price: number;
  selectedAddOns: JuiceAddOn[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper function to generate add-on ID
const generateAddOnId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-');

export default function BreakfastDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [breakfastItem, setBreakfastItem] = useState<BreakfastItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  
  const [selectedFries, setSelectedFries] = useState<SelectedFriesWithDip | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<SelectedJuiceWithAddOns | null>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setSlug(unwrapped.slug);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    
    const item = breakfastItems?.find((b: any) => b.slug === slug);
    if (item) {
      setBreakfastItem(item);
    }
  }, [slug]);

  const handleAddOnToggle = (addOn: { id: string; name: string; price: number }) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.id === addOn.id);
      if (existing) {
        return prev.filter(a => a.id !== addOn.id);
      } else {
        return [...prev, { ...addOn, quantity: 1 }];
      }
    });
  };

  const updateAddOnQuantity = (addOnId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedAddOns(prev => prev.filter(a => a.id !== addOnId));
    } else {
      setSelectedAddOns(prev =>
        prev.map(a =>
          a.id === addOnId ? { ...a, quantity: newQuantity } : a
        )
      );
    }
  };

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

  const handleJuiceSelect = (juice: JuiceUpsellItem) => {
    if (selectedJuice?.id === juice.id) {
      setSelectedJuice(null);
    } else {
      setSelectedJuice({
        id: juice.id,
        name: juice.name,
        price: juice.price,
        selectedAddOns: [],
      });
    }
  };

  const handleJuiceAddOnToggle = (addOn: JuiceAddOn) => {
    if (selectedJuice) {
      setSelectedJuice(prev => {
        if (!prev) return prev;
        const existing = prev.selectedAddOns.find(a => a.id === addOn.id);
        if (existing) {
          return {
            ...prev,
            selectedAddOns: prev.selectedAddOns.filter(a => a.id !== addOn.id),
          };
        } else {
          return {
            ...prev,
            selectedAddOns: [...prev.selectedAddOns, addOn],
          };
        }
      });
    }
  };

  const calculateTotal = () => {
    let total = breakfastItem?.price || 0;
    
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
      if (selectedJuice.selectedAddOns.length > 0) {
        total += selectedJuice.selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
      }
    }
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!breakfastItem) return;
    
    let itemName = breakfastItem.name;
    if (selectedFries) {
      itemName += ` + ${selectedFries.name}`;
      if (selectedFries.selectedDip) {
        itemName += ` (${selectedFries.selectedDip.name})`;
      }
    }
    if (selectedJuice) {
      itemName += ` + ${selectedJuice.name} (${selectedJuiceSize})`;
    }
    
    const cartItem = {
      id: `${breakfastItem.id}-${Date.now()}`,
      name: itemName,
      price: breakfastItem.price,
      quantity: quantity,
      image: breakfastItem.image,
      category: "breakfast",
      description: breakfastItem.description,
      addOns: selectedAddOns.map(a => ({ 
        id: a.id, 
        name: a.name, 
        price: a.price, 
        quantity: a.quantity 
      })),
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
        size: selectedJuiceSize,
        addOns: selectedJuice.selectedAddOns,
      } : null,
    };
    
    console.log("Adding to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceGroup.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  if (!mounted || !breakfastItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading breakfast details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/breakfast" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Breakfast
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton fallbackHref="/menu" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={breakfastItem.image}
                alt={breakfastItem.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{breakfastItem.name}</h1>
            <p className="text-gray-600 mb-4">{breakfastItem.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{breakfastItem.price}</div>

            {breakfastItem.tags && breakfastItem.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {breakfastItem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {breakfastAddOns && breakfastAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {breakfastAddOns.map((addOn) => {
                    const addOnWithId = { ...addOn, id: addOn.id || generateAddOnId(addOn.name) };
                    const selected = selectedAddOns.find(a => a.id === addOnWithId.id);
                    return (
                      <div key={addOnWithId.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-green-600">+R{addOn.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateAddOnQuantity(addOnWithId.id, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOnWithId.id, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddOnToggle(addOnWithId)}
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
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friesUpsell.map((fries: FriesUpsellItem) => (
                        <button
                          key={fries.id}
                          onClick={() => handleFriesSelect(fries)}
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
                    
                    {selectedFries && (
                      <div className="mt-3 pl-4 border-l-2 border-amber-300">
                        <p className="text-sm font-medium text-gray-700 mb-2">Choose a dip (optional):</p>
                        <div className="flex flex-wrap gap-2">
                          {friesUpsell
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

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-amber-600" />
                      Add Juice
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {juiceGroup.map((sizeGroup) => (
                        <button
                          key={sizeGroup.size}
                          onClick={() => {
                            setSelectedJuiceSize(sizeGroup.size);
                            setSelectedJuice(null);
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
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getJuiceOptionsForSize().map((juice: JuiceUpsellItem) => (
                        <button
                          key={juice.id}
                          onClick={() => handleJuiceSelect(juice)}
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

                    {selectedJuice && juiceAddOns && (
                      <div className="mt-3 pl-4 border-l-2 border-amber-300">
                        <p className="text-sm font-medium text-gray-700 mb-2">Boost your juice (optional):</p>
                        <div className="flex flex-wrap gap-2">
                          {juiceAddOns.map((addOn: JuiceAddOn) => {
                            const isSelected = selectedJuice.selectedAddOns.some(a => a.id === addOn.id);
                            return (
                              <button
                                key={addOn.id}
                                onClick={() => handleJuiceAddOnToggle(addOn)}
                                className={`px-3 py-1 rounded-full text-xs transition ${
                                  isSelected
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
                                }`}
                              >
                                + {addOn.name} <span className="text-xs">R{addOn.price}</span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedJuice.selectedAddOns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-green-600">
                              ✓ Added: {selectedJuice.selectedAddOns.map(a => a.name).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
                  <span>R{breakfastItem.price}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Add-ons:</span>
                    <span>+R{selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0)}</span>
                  </div>
                )}
                {selectedFries && (
                  <>
                    <div className="flex justify-between items-center text-gray-600 mb-2">
                      <span>{selectedFries.name}:</span>
                      <span>+R{selectedFries.price}</span>
                    </div>
                    {selectedFries.selectedDip && selectedFries.selectedDip.price > 0 && (
                      <div className="flex justify-between items-center text-gray-600 mb-2 pl-4 text-sm">
                        <span>└ {selectedFries.selectedDip.name}:</span>
                        <span>+R{selectedFries.selectedDip.price}</span>
                      </div>
                    )}
                  </>
                )}
                {selectedJuice && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>{selectedJuice.name} ({selectedJuiceSize}):</span>
                    <span>+R{selectedJuice.price}</span>
                  </div>
                )}
                {selectedJuice?.selectedAddOns.length > 0 && (
                  <div className="pl-4 text-sm">
                    {selectedJuice.selectedAddOns.map((addOn, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-600 mb-1">
                        <span>└ + {addOn.name}:</span>
                        <span>+R{addOn.price}</span>
                      </div>
                    ))}
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

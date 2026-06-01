"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import Link from "next/link";
import { smoothies, smoothieSizes, smoothieAddOns } from "@/data/smoothiesData";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";

// Helper function to generate add-on ID
const generateAddOnId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-');

interface AddOnWithId {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SmoothieDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [smoothieItem, setSmoothieItem] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnWithId[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    const item = smoothies?.find((s: any) => s.slug === slug);
    if (item) {
      setSmoothieItem(item);
      // Set default size to Small (first size)
      if (item.sizes && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0]);
      }
    }
  }, [slug]);

  const handleAddOnToggle = (addOn: { name: string; price: number }) => {
    const addOnId = generateAddOnId(addOn.name);
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.id === addOnId);
      if (existing) {
        return prev.filter(a => a.id !== addOnId);
      } else {
        return [...prev, { id: addOnId, ...addOn, quantity: 1 }];
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

  const calculateTotal = () => {
    // Base price comes ONLY from selected size (smoothies don't have base price)
    let total = selectedSize?.price || 0;

    // Add add-ons
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
    }

    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!smoothieItem || !selectedSize) return;

    let itemName = `${smoothieItem.name} - ${selectedSize.name} (${selectedSize.ml}ml)`;

    const cartItem = {
      id: `${smoothieItem.id}-${Date.now()}`,
      name: itemName,
      price: selectedSize.price, // Price from selected size
      quantity: quantity,
      image: smoothieItem.image,
      category: "smoothies",
      description: smoothieItem.description,
      selectedSize: selectedSize.name,
      selectedSizeMl: selectedSize.ml,
      addOns: selectedAddOns.map(a => ({ 
        id: a.id, 
        name: a.name, 
        price: a.price, 
        quantity: a.quantity 
      })),
      specialInstructions: specialInstructions,
    };

    console.log("Adding smoothie to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  if (!mounted || !smoothieItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading smoothie details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/smoothies" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Smoothies
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton fallbackHref="/menu" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={smoothieItem.image}
                alt={smoothieItem.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <span className="text-4xl">🥤</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{smoothieItem.name}</h1>
            <p className="text-gray-600 mb-4">{smoothieItem.description}</p>
            
            {/* Price display based on selected size */}
            <div className="text-2xl font-bold text-green-600 mb-6">
              {selectedSize ? `R${selectedSize.price}` : 'Select size'}
            </div>

            {smoothieItem.tags && smoothieItem.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {smoothieItem.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection - This is CRITICAL for smoothies */}
            {smoothieSizes && smoothieSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Choose Your Size</h3>
                <div className="flex flex-wrap gap-3">
                  {smoothieSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all flex-1 min-w-[100px] ${
                        selectedSize?.id === size.id
                          ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="font-semibold">{size.name}</div>
                      <div className="text-sm text-gray-500">{size.ml}ml</div>
                      <div className="text-green-600 font-bold">R{size.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {smoothieAddOns && smoothieAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Boost Your Smoothie</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {smoothieAddOns.map((addOn) => {
                    const addOnId = generateAddOnId(addOn.name);
                    const selected = selectedAddOns.find(a => a.id === addOnId);
                    return (
                      <div key={addOnId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-green-600">+R{addOn.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateAddOnQuantity(addOnId, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaMinus />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOnId, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaPlus />
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

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., extra sweet, less ice)"
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
                  <span>Smoothie ({selectedSize?.name || 'Select size'}):</span>
                  <span>R{selectedSize?.price || 0}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Boosters:</span>
                    <span>+R{selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-900 font-semibold pt-2 border-t mt-2">
                  <span>Total ({quantity} smoothie{quantity > 1 ? 's' : ''}):</span>
                  <span className="text-green-600 text-xl">R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-3 rounded-lg transition font-medium ${
                  selectedSize 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedSize ? `Add to Cart - R${calculateTotal().toFixed(2)}` : 'Please select a size'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

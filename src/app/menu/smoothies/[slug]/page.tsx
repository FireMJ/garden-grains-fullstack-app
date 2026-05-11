"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
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
    let total = (smoothieItem?.price || 0) + (selectedSize?.price || 0);
    
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
    }
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!smoothieItem) return;
    
    let itemName = smoothieItem.name;
    if (selectedSize && selectedSize.name !== "Regular") {
      itemName += ` (${selectedSize.name})`;
    }
    
    const cartItem = {
      id: `${smoothieItem.id}-${Date.now()}`,
      name: itemName,
      price: smoothieItem.price + (selectedSize?.price || 0),
      quantity: quantity,
      image: smoothieItem.image,
      category: "smoothies",
      description: smoothieItem.description,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={smoothieItem.image}
                alt={smoothieItem.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{smoothieItem.name}</h1>
            <p className="text-gray-600 mb-4">{smoothieItem.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">
              From R{smoothieItem.price}
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

            {smoothieSizes && smoothieSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Choose Your Size</h3>
                <div className="flex flex-wrap gap-2">
                  {smoothieSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        selectedSize?.id === size.id
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {size.name} {size.price > 0 && `(+R${size.price})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {smoothieAddOns && smoothieAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
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
                              className="w-8 h-8 bg-gray-200 rounded-full"
                            >
                              <FaMinus />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOnId, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full"
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
                placeholder="Any special requests?"
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={2}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-gray-200 rounded-full">
                  <FaMinus />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-gray-200 rounded-full">
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <button onClick={handleAddToCart} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium">
                Add to Cart - R{calculateTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

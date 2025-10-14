"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

// Mock data - replace with actual data fetching
const bowlItems = [
  {
    id: "1",
    slug: "quinoa-power-bowl",
    name: "Quinoa Power Bowl",
    description: "Protein-packed quinoa with roasted vegetables, avocado, and tahini dressing",
    price: 89,
    image: "/images/bowls/quinoa-bowl.jpg",
    ingredients: ["Quinoa", "Roasted Vegetables", "Avocado", "Tahini Dressing", "Chickpeas"],
    addOns: [
      { id: "addon-1", name: "Extra Avocado", price: 15 },
      { id: "addon-2", name: "Grilled Chicken", price: 25 },
      { id: "addon-3", name: "Salmon", price: 35 }
    ]
  },
  {
    id: "2", 
    slug: "buddha-bowl",
    name: "Buddha Bowl",
    description: "Brown rice, seasonal vegetables, greens, and your choice of protein",
    price: 79,
    image: "/images/bowls/buddha-bowl.jpg",
    ingredients: ["Brown Rice", "Seasonal Vegetables", "Greens", "Protein", "Sesame Dressing"],
    addOns: [
      { id: "addon-4", name: "Tofu", price: 20 },
      { id: "addon-5", name: "Halloumi", price: 25 },
      { id: "addon-6", name: "Feta", price: 15 }
    ]
  }
];

export default function BowlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [bowl, setBowl] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    const foundBowl = bowlItems.find(item => item.slug === params.slug);
    if (foundBowl) {
      setBowl(foundBowl);
    } else {
      router.push("/menu/bowls");
    }
  }, [params.slug, router]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleAddToCart = () => {
    if (!bowl) return;

    const selectedAddOnsData = bowl.addOns.filter((addOn: any) => 
      selectedAddOns.includes(addOn.id)
    );

    const totalPrice = bowl.price + selectedAddOnsData.reduce((sum: number, addOn: any) => sum + addOn.price, 0);

    const cartItem = {
      id: `${bowl.id}-${Date.now()}`,
      name: bowl.name,
      price: totalPrice,
      quantity,
      image: bowl.image,
      instructions: specialInstructions,
      addOns: selectedAddOnsData
    };

    addToCart(cartItem);
    toast.success(`${quantity} ${bowl.name} added to cart!`);
    
    // Reset form
    setSelectedAddOns([]);
    setQuantity(1);
    setSpecialInstructions("");
  };

  if (!bowl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-green-600 hover:text-green-700"
        >
          ← Back to Bowls
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-1">
              <div className="relative h-96 md:h-full">
                <Image
                  src={bowl.image}
                  alt={bowl.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="md:flex-1 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{bowl.name}</h1>
              <p className="text-green-600 text-2xl font-bold mb-4">R{bowl.price}</p>
              <p className="text-gray-600 mb-6">{bowl.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {bowl.ingredients.map((ingredient: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {bowl.addOns && bowl.addOns.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {bowl.addOns.map((addOn: any) => (
                      <label key={addOn.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addOn.id)}
                          onChange={() => toggleAddOn(addOn.id)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="flex-1">{addOn.name}</span>
                        <span className="text-green-600 font-semibold">+R{addOn.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Add to Cart - R{bowl.price * quantity}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

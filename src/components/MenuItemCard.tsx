"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MenuItem, AddOn } from '@/types/menu';

export default function MenuItemCard({ id, name, description, price, image, category, addOns = [] }: MenuItem) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const handleAddToCart = () => {
    addToCart(
      { id, name, description, price, image, category }, // item
      quantity,                                           // quantity
      selectedAddOns                                      // addOns
    );
  };

  return (
    <div className="rounded-lg shadow-md p-4 bg-white">
      {/* ...image, name, description... */}

      <div className="mt-2">
        <label>Quantity:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-16 border rounded px-2 py-1"
        />
      </div>

      {addOns.length > 0 && (
        <div className="mt-4">
          <label>Add-Ons:</label>
          <div className="flex flex-wrap gap-2">
            {addOns.map(addOn => (
              <button
                key={addOn.name}
                onClick={() =>
                  setSelectedAddOns(prev =>
                    prev.some(a => a.name === addOn.name)
                      ? prev.filter(a => a.name !== addOn.name)
                      : [...prev, addOn]
                  )
                }
                className={`px-2 py-1 rounded border ${
                  selectedAddOns.some(a => a.name === addOn.name)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {addOn.name} (+R{addOn.price})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold">R{price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Add to Order
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
    const calculateItemTotal = () => {
    const itemPrice = item.price || 0;
    const addons = (item as any).addOns || (item as any).addons || [];
    const addOnsTotal = addons.reduce((sum: number, addOn: any) => sum + (addOn.price || 0), 0) || 0;
    return (itemPrice + addOnsTotal) * (item.quantity || 1);
  };

  // Get addons for display
  const displayAddons = (item as any).addOns || (item as any).addons || [];

  return (
    <div className="flex items-center">
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          R {(item.price || 0).toFixed(2)} each
        </p>
        {displayAddons.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">Add-ons:</p>
            <ul className="text-xs text-gray-600">
              {displayAddons.map((addOn: any, index: number) => (
                <li key={index}>• {addOn.name} (+R{addOn.price?.toFixed(2) || "0.00"})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-lg">R {calculateItemTotal().toFixed(2)}</p>
        <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
      </div>
    </div>
  );
}

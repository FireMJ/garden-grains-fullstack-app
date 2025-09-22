"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">R{item.totalPrice.toFixed(2)}</p>
                  
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Add-ons:</h4>
                      <ul className="text-sm text-gray-600">
                        {item.addOns.map(addon => (
                          <li key={addon.name}>+ {addon.name} (R{addon.price.toFixed(2)})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.fries && item.fries.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Fries:</h4>
                      <ul className="text-sm text-gray-600">
                        {item.fries.map(fry => (
                          <li key={fry.name}>+ {fry.name} (R{fry.price.toFixed(2)})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.juices && item.juices.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Juices:</h4>
                      <ul className="text-sm text-gray-600">
                        {item.juices.map(juice => (
                          <li key={juice.name}>+ {juice.name} (R{juice.price.toFixed(2)})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.specialInstructions && (
                    <p className="text-sm mt-2">Special instructions: {item.specialInstructions}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>R{getCartTotal().toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full bg-[#F4A261] text-white py-3 rounded-lg font-semibold hover:bg-[#e68e42] transition">
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
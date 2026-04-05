"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

export default function SimpleTestPage() {
  const cart = useCart();
  const [localItems, setLocalItems] = useState<any[]>([]);

  // Check localStorage directly
  useEffect(() => {
    const stored = localStorage.getItem('garden-grains-cart');
    console.log("📦 DIRECT localStorage read:", stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalItems(parsed);
        console.log("📦 Parsed localStorage items:", parsed);
      } catch (e) {
        console.error("❌ Parse error:", e);
      }
    }
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cart Diagnostic</h1>
      
      {/* Cart Context Status */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Cart Context Status</h2>
        <div className="space-y-2">
          <p><strong>cart exists:</strong> {cart ? '✅ Yes' : '❌ No'}</p>
          <p><strong>cartItems:</strong> {cart.cartItems?.length || 0} items</p>
          <p><strong>cartItems array?:</strong> {Array.isArray(cart.cartItems) ? '✅ Yes' : '❌ No'}</p>
          <p><strong>totalPrice:</strong> R {cart.totalPrice || 0}</p>
          <p><strong>finalTotal:</strong> R {cart.finalTotal || 0}</p>
        </div>
        
        <pre className="bg-white p-4 mt-4 rounded text-sm overflow-auto max-h-40">
          {JSON.stringify(cart.cartItems, null, 2)}
        </pre>
      </div>

      {/* LocalStorage Status */}
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-4">LocalStorage Status</h2>
        <p><strong>Items in localStorage:</strong> {localItems.length}</p>
        <pre className="bg-white p-4 mt-4 rounded text-sm overflow-auto max-h-40">
          {JSON.stringify(localItems, null, 2)}
        </pre>
      </div>

      {/* Test Controls */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Test Controls</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => {
              const testItem = {
                id: `test-${Date.now()}`,
                name: "Test Item from Simple Page",
                price: 49.99,
                quantity: 1,
                image: "",
                category: "Test"
              };
              cart.addToCart(testItem);
              console.log("✅ Added via cart context:", testItem);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add via Cart Context
          </button>

          <button
            onClick={() => {
              const testItem = {
                id: `test-${Date.now()}`,
                name: "Test Item Direct",
                price: 49.99,
                quantity: 1,
                image: "",
                category: "Test"
              };
              const current = JSON.parse(localStorage.getItem('garden-grains-cart') || '[]');
              current.push(testItem);
              localStorage.setItem('garden-grains-cart', JSON.stringify(current));
              setLocalItems(current);
              console.log("✅ Added directly to localStorage:", testItem);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Direct to localStorage
          </button>

          <button
            onClick={() => {
              console.log("Current cart context:", cart);
              console.log("Current cart items:", cart.cartItems);
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Log Cart Context
          </button>

          <button
            onClick={() => {
              cart.clearCart();
              localStorage.removeItem('garden-grains-cart');
              setLocalItems([]);
              console.log("🧹 Cart cleared");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-bold mb-2">Test Steps:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Click "Add Direct to localStorage" - check if item appears in LocalStorage section</li>
          <li>Refresh the page - does the item load into Cart Context?</li>
          <li>Click "Add via Cart Context" - does it appear in Cart Context section immediately?</li>
          <li>Check the browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import { X, Trash2, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function CartDrawer() {
  const { cart = [], removeFromCart, closeCart, isCartOpen, updateQuantity, clearCart } = useCart();
  const { data: session } = useSession();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number }>(null);
  const [promoError, setPromoError] = useState("");

  // Always run hooks, even if cart is closed
  useEffect(() => {
    if (session?.user?.isNewUser && !appliedPromo) {
      setAppliedPromo({ code: "SIGNUP30", discount: 30 });
    }
  }, [session, appliedPromo]);

  const calcSubTotal = (item: CartItem) => {
    const addOnsTotal = item.addOns?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    const friesTotal = item.fries?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    const juiceTotal = item.juices?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    return (item.price + addOnsTotal + friesTotal + juiceTotal) * item.quantity || 1;
  };

  const total = cart.reduce((sum, item) => sum + calcSubTotal(item), 0);
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const finalTotal = Math.max(total - discount, 0);

  const handleSubItemQuantityUpdate = (
    item: CartItem,
    type: "addOns" | "fries" | "juices",
    index: number,
    newQuantity: number
  ) => {
    const updatedItem = { ...item };
    const list = [...(updatedItem[type] || [])];

    if (newQuantity < 1) {
      list.splice(index, 1);
    } else {
      list[index] = { ...list[index], quantity: newQuantity };
    }

    updatedItem[type] = list;
    updateQuantity(updatedItem, item.quantity || 1);
  };

  const handleApplyPromo = () => {
    if (appliedPromo) {
      setPromoError("Promo code already applied.");
      return;
    }
    if (promoCode.trim().toLowerCase() === "signup30") {
      if (!session?.user?.isNewUser) {
        setPromoError("Promo only valid for new users.");
        return;
      }
      setAppliedPromo({ code: "SIGNUP30", discount: 30 });
      setPromoError("");
    } else {
      setPromoError("Invalid promo code.");
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await axios.post("/api/orders/create", {
        items: cart,
        total: finalTotal,
        promo: appliedPromo,
        userId: session?.user?.id,
      });

      if (appliedPromo?.code === "SIGNUP30" && session?.user?.isNewUser) {
        await axios.post("/api/users/mark-new-user-used", { userId: session.user.id });
      }

      alert(
        `Order placed! ${appliedPromo ? `(Promo applied: -R${discount.toFixed(2)}) ` : ""}Total: R${finalTotal.toFixed(2)}`
      );
      clearCart();
      closeCart();
    } catch (err) {
      console.error(err);
      alert("Error placing order. Please try again.");
    }
    setIsCheckingOut(false);
  };

  // --- Conditional rendering: cart overlay ---
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full sm:w-96 bg-white h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-[#1E4259]">Your Cart</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-600">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="mt-4 text-[#1E4259] hover:text-[#2A536B] font-medium"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item: CartItem, index) => {
                const itemSubTotal = calcSubTotal(item);
                return (
                  <div key={`${item.id}-${index}`} className="pb-4 border-b border-gray-100">
                    <div className="flex">
                      {item.image && (
                        <div className="w-20 h-20 relative mr-4 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-[#1E4259]">{item.name}</h3>
                          <span className="font-semibold text-[#1E4259]">R{itemSubTotal.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500">× {item.quantity || 1}</div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {/* Promo Code */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-[#1E4259] mb-2">Promo Code</label>
              {appliedPromo ? (
                <div className="flex items-center justify-between text-sm text-green-700 font-medium">
                  Applied: {appliedPromo.code} (−R{appliedPromo.discount.toFixed(2)})
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-[#1E4259] focus:outline-none"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-[#1E4259] text-white rounded text-sm hover:bg-[#2A536B]"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-[#1E4259]">
              <div className="flex justify-between">Subtotal:<span>R{total.toFixed(2)}</span></div>
              {appliedPromo && (
                <div className="flex justify-between text-green-700">
                  Promo Discount:<span>−R{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">Total:<span>R{finalTotal.toFixed(2)}</span></div>
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#1E4259] text-white py-3 rounded-lg hover:bg-[#2A536B] transition font-medium flex items-center justify-center disabled:opacity-70"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

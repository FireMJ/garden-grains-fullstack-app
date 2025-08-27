"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [schedule, setSchedule] = useState<"now" | "later">("now");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  return (
    <main className="px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Checkout</h1>

      {/* Order Type */}
      <div className="mb-4">
        <label className="font-medium">Order Type:</label>
        <div className="flex gap-4 mt-2">
          <button onClick={() => setOrderType("pickup")} className={orderType === "pickup" ? "bg-green-600 text-white px-3 py-1 rounded" : "bg-gray-100 px-3 py-1 rounded"}>
            Pickup
          </button>
          <button onClick={() => setOrderType("delivery")} className={orderType === "delivery" ? "bg-green-600 text-white px-3 py-1 rounded" : "bg-gray-100 px-3 py-1 rounded"}>
            Delivery
          </button>
        </div>
      </div>

      {/* Delivery Address */}
      {orderType === "delivery" && (
        <div className="mb-4">
          <label className="font-medium">Delivery Address:</label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter your address"
          />
        </div>
      )}

      {/* Schedule */}
      <div className="mb-4">
        <label className="font-medium">Schedule:</label>
        <div className="flex gap-4 mt-2">
          <button onClick={() => setSchedule("now")} className={schedule === "now" ? "bg-green-600 text-white px-3 py-1 rounded" : "bg-gray-100 px-3 py-1 rounded"}>
            Order Now
          </button>
          <button onClick={() => setSchedule("later")} className={schedule === "later" ? "bg-green-600 text-white px-3 py-1 rounded" : "bg-gray-100 px-3 py-1 rounded"}>
            Schedule
          </button>
        </div>
      </div>

      {/* Scheduled Time */}
      {schedule === "later" && (
        <div className="mb-4">
          <label className="font-medium">Select Time:</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>
      )}

      {/* Cart Summary */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Items</h2>
        {cart.map((item) => (
          <div key={item.id} className="border-b py-2">
            <div className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>R{item.price * item.quantity}</span>
            </div>
            {item.addOns?.length > 0 && (
              <ul className="text-sm text-gray-600 mt-1">
                {item.addOns.map((addOn, i) => (
                  <li key={i}>+ {addOn.name} (R{addOn.price})</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800">
          Confirm Order
        </button>
      </div>
    </main>
  );
}

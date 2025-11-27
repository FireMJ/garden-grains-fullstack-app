"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function OrderConfirmationPage() {
  useEffect(() => {
    // In a real app, you might:
    // - Send confirmation email
    // - Update order status in database
    // - Track analytics
    console.log("Order confirmed - tracking analytics");
  }, []);

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-4xl font-bold mb-4 text-[#F4A261]">Order Confirmed!</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Thank you for your order! We're preparing your delicious food and will notify you when it's ready for pickup/delivery.
        </p>
        
        <div className="bg-white/10 rounded-xl p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4 text-white">What's Next?</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <span className="text-[#F4A261] mr-3">1.</span>
              You'll receive an order confirmation email shortly
            </li>
            <li className="flex items-center">
              <span className="text-[#F4A261] mr-3">2.</span>
              We'll start preparing your order immediately
            </li>
            <li className="flex items-center">
              <span className="text-[#F4A261] mr-3">3.</span>
              Estimated ready time: 20-30 minutes
            </li>
            <li className="flex items-center">
              <span className="text-[#F4A261] mr-3">4.</span>
              We'll notify you when your order is ready
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-[#F4A261] text-white px-8 py-4 rounded-lg hover:bg-[#e68e42] transition text-lg font-semibold"
          >
            Order Again
          </Link>
          <Link
            href="/"
            className="border-2 border-[#F4A261] text-[#F4A261] px-8 py-4 rounded-lg hover:bg-[#F4A261] hover:text-white transition text-lg font-semibold"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          Questions about your order? Call us at <span className="text-[#F4A261]">081 000 0000</span>
        </div>
      </div>
    </main>
  );
}

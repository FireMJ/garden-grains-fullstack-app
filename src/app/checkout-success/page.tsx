"use client";

import { Suspense } from "react";
import Link from "next/link";

function CheckoutSuccessContent() {
  return (
    <main className="min-h-screen bg-[#1E4259] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-[#6c8665] rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-[#F4A261]">
            Order Successful!
          </h1>
          
          <p className="text-lg mb-6 text-gray-100">
            Thank you for your order. Your order has been placed successfully.
          </p>

          <div className="bg-[#1E4259] rounded-lg p-4 mb-6">
            <p className="text-sm opacity-75">Order Reference</p>
            <p className="font-mono text-sm">ORD-{Date.now().toString().slice(-8)}</p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-200">
              You will receive an order confirmation shortly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/menu"
                className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
              >
                Continue Shopping
              </Link>
              
              <Link
                href="/"
                className="bg-transparent border border-[#F4A261] text-[#F4A261] px-6 py-3 rounded-lg hover:bg-[#F4A261] hover:text-white transition font-semibold"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#1E4259] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F4A261] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

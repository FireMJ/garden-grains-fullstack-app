'use client';

import Link from 'next/link';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order! We've received your order and will begin preparing it right away.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/menu"
              className="inline-block bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
            >
              Order Again
            </Link>
            <br />
            <Link
              href="/"
              className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

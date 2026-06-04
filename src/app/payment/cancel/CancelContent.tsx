'use client';

import { useSearchParams } from 'next/navigation';
import { FaTimesCircle, FaArrowLeft, FaCreditCard } from 'react-icons/fa';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-white rounded-xl shadow-md overflow-hidden text-center">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
            <FaTimesCircle className="text-5xl text-white mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            
            <div className="space-y-3">
              {orderId && (
                <Link
                  href={`/payment?orderId=${orderId}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  <FaArrowLeft /> Try Again
                </Link>
              )}
              
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                <FaArrowLeft /> Return to Cart
              </Link>
              
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

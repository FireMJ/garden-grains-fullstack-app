'use client';

import { useRouter } from 'next/navigation';
import { FaTimesCircle } from 'react-icons/fa';

export default function VodaPayCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            You cancelled the payment. No charges have been made.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/checkout')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/menu')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

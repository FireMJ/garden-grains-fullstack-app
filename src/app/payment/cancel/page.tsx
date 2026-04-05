"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, HelpCircle } from "lucide-react";

// Component that uses useSearchParams (must be wrapped in Suspense)
function CancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was cancelled';
  
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Cancel Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Cancel Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-red-100">Your transaction was not completed</p>
        </div>

        {/* Details */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Reason</p>
            <p className="text-lg font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-lg inline-block">
              {reason}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Common Reasons</p>
                <ul className="text-sm text-gray-600 list-disc ml-4 mt-1">
                  <li>You cancelled the transaction</li>
                  <li>Insufficient funds</li>
                  <li>Bank declined the transaction</li>
                  <li>Technical error</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-4">What would you like to do?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/cart"
                className="block p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-center"
              >
                <RefreshCw className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <span className="font-medium text-gray-900">Try Again</span>
                <span className="block text-sm text-gray-500">Return to cart</span>
              </Link>

              <Link
                href="/contact"
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-center"
              >
                <span className="block text-2xl mb-2">💬</span>
                <span className="font-medium text-gray-900">Contact Support</span>
                <span className="block text-sm text-gray-500">Get help with payment</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function CancelLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <Suspense fallback={<CancelLoading />}>
        <CancelContent />
      </Suspense>
    </div>
  );
}

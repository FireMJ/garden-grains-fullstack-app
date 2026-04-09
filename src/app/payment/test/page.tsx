"use client";

import { Suspense } from "react";
import { PaymentTester } from "@/components/Payment/PaymentTester";

// Loading fallback component
function PaymentTestLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading payment tester...</p>
      </div>
    </div>
  );
}

export default function PaymentTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Payment Integration Testing
        </h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong className="font-bold">Important:</strong> Complete UAT testing must be 
                signed off by the Integration team before migrating to production. Your production 
                merchant API key is not enabled until testing is complete.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<PaymentTestLoading />}>
          <PaymentTester />
        </Suspense>
      </div>
    </div>
  );
}

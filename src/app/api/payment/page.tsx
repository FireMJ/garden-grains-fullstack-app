"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('paymentId');
  const status = searchParams.get('status');

  useEffect(() => {
    // Here you could verify the payment status with your backend
    if (status === 'successful' && paymentId) {
      // Payment was successful
      console.log('Payment successful:', paymentId);
    }
  }, [paymentId, status]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        {paymentId && (
          <p className="text-sm text-gray-500 mb-4">Payment ID: {paymentId}</p>
        )}
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-[#1E4259] text-white rounded-lg hover:bg-[#2A536B] transition inline-flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </button>
      </div>
    </div>
  );
}
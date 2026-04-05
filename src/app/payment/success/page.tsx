"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Mail, Phone, MapPin, Clock } from "lucide-react";

// Component that uses useSearchParams (must be wrapped in Suspense)
function SuccessContent() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const transactionId = searchParams.get('transactionId') || `TX-${Date.now().toString(36).toUpperCase()}`;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-green-100">Thank you for your order</p>
        </div>

        {/* Order Details */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Transaction ID</p>
            <p className="text-xl font-mono font-bold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg inline-block">
              {transactionId}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Confirmation Email Sent</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email with your order details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Estimated Preparation Time</p>
                <p className="text-sm text-gray-600">
                  15-20 minutes for pickup • 30-45 minutes for delivery
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Pickup Location</p>
                <p className="text-sm text-gray-600">
                  Uitsig Wine Farm<br />
                  Spaanschemat River Rd, Fir Grove<br />
                  Cape Town, 7806
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/menu"
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-center"
              >
                <span className="block text-2xl mb-2">🍽️</span>
                <span className="font-medium text-gray-900">Order More</span>
                <span className="block text-sm text-gray-500">Continue shopping</span>
              </Link>

              <Link
                href="/reviews"
                className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-center"
              >
                <span className="block text-2xl mb-2">⭐</span>
                <span className="font-medium text-gray-900">Leave a Review</span>
                <span className="block text-sm text-gray-500">Share your experience</span>
              </Link>
            </div>
          </div>

          {/* Auto-redirect Countdown */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Redirecting to homepage in {countdown} seconds...</p>
            <Link href="/" className="text-green-600 hover:underline font-medium">
              Click here if not redirected
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function SuccessLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <Suspense fallback={<SuccessLoading />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

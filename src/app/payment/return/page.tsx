"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// Component that uses useSearchParams (must be wrapped in Suspense)
function ReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const status = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    
    if (status === 'success' || status === 'approved') {
      router.push(`/payment/success?transactionId=${transactionId || ''}`);
    } else {
      const reason = searchParams.get('reason') || 'Transaction failed';
      router.push(`/payment/cancel?reason=${encodeURIComponent(reason)}`);
    }
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Processing payment result...</p>
    </div>
  );
}

// Loading fallback component
function ReturnLoading() {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<ReturnLoading />}>
        <ReturnContent />
      </Suspense>
    </div>
  );
}

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';

function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const status = searchParams.get('status');
    const errorMessage = searchParams.get('message');
    
    setMessage(errorMessage || (status === 'cancelled' ? 'Payment was cancelled by user' : 'Payment was cancelled'));
    
    // Clear pending order
    sessionStorage.removeItem('pendingOrder');
    
    // Redirect back to checkout after 3 seconds
    setTimeout(() => {
      router.push('/checkout');
    }, 3000);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <p className="text-sm text-gray-500">Redirecting back to checkout...</p>
      </div>
    </div>
  );
}

export default function VodaPayCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}

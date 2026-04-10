'use client';

import { useState } from 'react';
import axios from 'axios';

interface VodaPayPaymentProps {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export function VodaPayPayment({
  amount,
  currency = 'ZAR',
  orderId,
  customerEmail,
  customerPhone,
  onSuccess,
  onError
}: VodaPayPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Initialize payment with VodaPay
      const paymentResponse = await axios.post('/api/vodapay/initiate', {
        amount,
        currency,
        orderId,
        customerEmail,
        customerPhone,
        returnUrl: `${window.location.origin}/payment/vodapay/return`,
        cancelUrl: `${window.location.origin}/payment/vodapay/cancel`,
      });

      const { paymentUrl, transactionId } = paymentResponse.data;

      // Step 2: Redirect to VodaPay payment page
      if (paymentUrl) {
        // Store transaction ID for later reference
        sessionStorage.setItem('vodapay_transaction_id', transactionId);
        window.location.href = paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      setPaymentStatus('error');
      onError(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xl">📱</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">VodaPay Payment</h3>
            <p className="text-sm text-blue-700">Pay securely with VodaPay</p>
          </div>
        </div>
      </div>

      {paymentStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">Payment failed. Please try again.</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
      >
        {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)} with VodaPay`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You will be redirected to VodaPay to complete your payment
      </p>
    </div>
  );
}

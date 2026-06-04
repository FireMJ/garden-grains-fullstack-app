'use client';

import { useState } from 'react';
import { initiateVodaPayPayment } from '@/app/actions/payment';
import { SANDBOX_TEST_CARDS, SANDBOX_API_KEYS } from '@/lib/vodapay/api';
import { toast } from 'react-hot-toast';

interface VodaPayPaymentProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function VodaPayPayment({ 
  amount, 
  orderId, 
  customerEmail, 
  customerPhone,
  onSuccess,
  onError 
}: VodaPayPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTestCards, setShowTestCards] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const loadingToast = toast.loading('Initiating VodaPay Sandbox payment...');
    
    try {
      const result = await initiateVodaPayPayment({
        amount,
        currency: 'ZAR',
        orderId,
        customerEmail,
        customerPhone,
        description: `Garden & Grains Order #${orderId.slice(-8)}`,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        notifyUrl: `${window.location.origin}/api/vodapay/webhook`
      });

      toast.dismiss(loadingToast);

      if (result.success && result.redirectUrl) {
        toast.success('Redirecting to VodaPay...');
        localStorage.setItem('vodapay_transaction_id', result.transactionId!);
        window.location.href = result.redirectUrl;
        onSuccess(result.transactionId!);
      } else {
        const errorMsg = result.error || 'Payment initiation failed';
        toast.error(errorMsg);
        onError(errorMsg);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMsg = error instanceof Error ? error.message : 'Payment error';
      toast.error(errorMsg);
      onError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyTestCard = (cardNumber: string, message: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast.success(`Test card copied: ${cardNumber} (${message})`);
  };

  return (
    <div className="space-y-4">
      {/* Sandbox Banner */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>🧪 VodaPay Sandbox Mode</strong> - Use test cards for payments
        </p>
      </div>

      {/* Test Cards Info */}
      <div>
        <button
          onClick={() => setShowTestCards(!showTestCards)}
          className="text-sm text-purple-600 hover:text-purple-700 mb-2"
        >
          {showTestCards ? 'Hide' : 'Show'} Sandbox Test Cards
        </button>
        
        {showTestCards && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold mb-2">Virtual Test Cards:</p>
            <div className="space-y-2 text-sm">
              {Object.entries(SANDBOX_TEST_CARDS).map(([key, card]) => (
                <button
                  key={key}
                  onClick={() => copyTestCard(card.number, card.message)}
                  className="block w-full text-left p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <span className="font-mono font-bold">{card.number}</span>
                  <span className="text-xs ml-2 text-gray-500">- {card.message}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click any card to copy the number. Use with any expiry (12/25) and CVV (123).
            </p>
          </div>
        )}
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </span>
        ) : (
          `Pay R${amount.toFixed(2)} with VodaPay`
        )}
      </button>

      {/* Security Info */}
      <div className="text-center text-xs text-gray-500">
        <p>Secure payment powered by VodaPay Gateway (Sandbox)</p>
        <p className="mt-1">PCI DSS Compliant • 3D Secure Verified</p>
      </div>
    </div>
  );
}

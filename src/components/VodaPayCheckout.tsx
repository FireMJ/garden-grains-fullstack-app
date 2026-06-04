'use client';

import { useState, useEffect } from 'react';
import { createSandboxClient } from '@/lib/vodapay/client';
import { toast } from 'react-hot-toast';

interface VodaPayCheckoutProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export default function VodaPayCheckout({ 
  amount, 
  orderId, 
  customerEmail, 
  customerPhone,
  onSuccess,
  onError 
}: VodaPayCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTestCards, setShowTestCards] = useState(true);

  useEffect(() => {
    console.log(`VodaPayCheckout initialized with amount: R${amount} (${amount * 100} cents)`);
  }, [amount]);

  const testCards = [
    { number: '4444444444444400', message: 'Approved - Transaction Successful', code: '00' },
    { number: '4444444444444405', message: 'Do not honour - Card Declined', code: '05' },
    { number: '4444444444444451', message: 'Insufficient Funds', code: '51' },
    { number: '4444444444444454', message: 'Card Expired', code: '54' },
    { number: '4444444444444499', message: '3DSecure Fail', code: '99' }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    const loadingToast = toast.loading('Connecting to VodaPay gateway...');
    
    try {
      const client = createSandboxClient();
      
      const result = await client.initiateOnceOffPayment({
        amount: amount,
        orderId,
        customerEmail,
        customerPhone: customerPhone || '0760000000',
        description: `Garden & Grains Order #${orderId.slice(-8)}`,
        returnUrl: `${window.location.origin}/payment/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/payment/cancel?orderId=${orderId}`,
        notificationUrl: `${window.location.origin}/api/vodapay/webhook`,
        delaySettlement: false
      });

      toast.dismiss(loadingToast);
      
      if (result.success && result.initiationUrl) {
        toast.success('Payment initiated! Redirecting to VodaPay...');
        onSuccess(result.transactionId || '');
        
        localStorage.setItem('vodapay_transaction_id', result.transactionId || '');
        localStorage.setItem('vodapay_session_id', result.sessionId || '');
        
        setTimeout(() => {
          window.location.href = result.initiationUrl!;
        }, 1500);
      } else {
        toast.error(result.error || 'Payment failed');
        onError(result.error || 'Payment failed');
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

  return (
    <div className="space-y-4">
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✅ VodaPay Live Sandbox Mode</strong> - Connected to test environment
        </p>
        <p className="text-xs text-green-600 mt-1">
          Amount to be charged: <strong>R{amount.toFixed(2)}</strong>
        </p>
      </div>

      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-800">
          <strong>🔑 API Key:</strong> d605f89b-079c-11ed-b83a-06c42a9d493e<br />
          <strong>🏪 Merchant ID:</strong> VPS00000000000<br />
          <strong>🌐 Environment:</strong> VodaPay Sandbox (UAT)
        </p>
      </div>

      <div>
        <button
          onClick={() => setShowTestCards(!showTestCards)}
          className="text-sm text-purple-600 hover:text-purple-700 mb-2"
        >
          {showTestCards ? 'Hide' : 'Show'} Test Cards
        </button>
        
        {showTestCards && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold mb-2">Sandbox Test Cards:</p>
            <div className="space-y-2">
              {testCards.map((card) => (
                <div key={card.number} className="flex items-center justify-between p-2 rounded">
                  <div>
                    <span className="font-mono font-bold">{card.number}</span>
                    <span className="text-sm ml-2 text-gray-600">- {card.message}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(card.number);
                      toast.success(`Copied: ${card.number}`);
                    }}
                    className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Use any expiry (12/25) and CVV (123) with these test cards
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 Tip: Use card ending 4400 for successful payment, other cards test different decline scenarios
            </p>
          </div>
        )}
      </div>

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

      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          You will be redirected to VodaPay's secure payment page to complete your transaction.
        </p>
      </div>
    </div>
  );
}

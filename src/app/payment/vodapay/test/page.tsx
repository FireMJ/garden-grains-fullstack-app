'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VodaPayTestPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await fetch('/api/vodapay/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'ZAR',
          orderId: `TEST_${Date.now()}`,
          customerEmail: 'test@example.com',
          customerPhone: '27721234567',
          returnUrl: `${window.location.origin}/payment/vodapay/return`,
          cancelUrl: `${window.location.origin}/payment/vodapay/cancel`,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // Redirect to VodaPay payment page (mock in sandbox)
        window.location.href = data.paymentUrl;
      } else {
        setError(data.message || 'Payment initiation failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError('Failed to connect to payment service. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const testCards = [
    { number: '4444 4444 4444 4400', description: '✅ Approved', code: '00' },
    { number: '4444 4444 4444 4405', description: '❌ Do not honour', code: '05' },
    { number: '4444 4444 4444 4451', description: '❌ Insufficient Funds', code: '51' },
    { number: '4444 4444 4444 4499', description: '❌ 3DSecure Fail', code: '99' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/payment/test')}
          className="text-gray-600 hover:text-green-600 mb-4 inline-flex items-center gap-2"
        >
          ← Back to Test Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              VodaPay Test Payment
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Amount (ZAR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="1"
                step="10"
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-sm">
              <p className="text-yellow-800">
                <strong>Sandbox Mode:</strong> Using virtual test cards. No real money charged.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold"
            >
              {isProcessing ? 'Processing...' : `Pay R${amount.toFixed(2)} with VodaPay`}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              You will be redirected to VodaPay secure payment page
            </p>
          </div>

          {/* Test Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Virtual Test Cards</h3>
              <div className="space-y-2">
                {testCards.map((card, idx) => (
                  <div key={idx} className="text-sm flex justify-between items-center border-b pb-2">
                    <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                      {card.number}
                    </code>
                    <span className="text-gray-600">{card.description}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Use any future expiry date (e.g., 12/34) and any CVC (e.g., 123)
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Test Instructions</h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Enter an amount and click "Pay with VodaPay"</li>
                <li>On the sandbox page, enter a test card number</li>
                <li>Use 4444 4444 4444 4400 for successful payment</li>
                <li>Use other test cards to test error scenarios</li>
                <li>Use any expiry date (e.g., 12/34) and any CVC (e.g., 123)</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { initiateVodaPayPayment, getVodaPayTransactionStatus } from '@/app/actions/payment';
import { SANDBOX_API_KEYS, SANDBOX_TEST_CARDS } from '@/lib/vodapay/api';
import { toast } from 'react-hot-toast';

export default function VodaPayTestDashboard() {
  const [selectedApiKey, setSelectedApiKey] = useState(SANDBOX_API_KEYS[0]);
  const [selectedCard, setSelectedCard] = useState<keyof typeof SANDBOX_TEST_CARDS>('approved');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<any>(null);

  const testPayment = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    const testOrderId = `TEST_${Date.now()}`;
    const testCard = SANDBOX_TEST_CARDS[selectedCard];
    
    toast.loading(`Testing with card: ${testCard.number} (${testCard.message})`);
    
    try {
      const result = await initiateVodaPayPayment({
        amount: 100,
        currency: 'ZAR',
        orderId: testOrderId,
        customerEmail: 'test@example.com',
        description: `Test Transaction - ${testCard.message}`,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        notifyUrl: `${window.location.origin}/api/vodapay/webhook`,
        testApiKey: selectedApiKey
      });
      
      toast.dismiss();
      
      setTestResult({
        success: result.success,
        transactionId: result.transactionId,
        error: result.error,
        cardUsed: testCard,
        apiKeyUsed: selectedApiKey
      });
      
      if (result.transactionId) {
        setTransactionId(result.transactionId);
      }
      
      toast.success(result.success ? 'Payment initiated successfully!' : `Payment failed: ${result.error}`);
    } catch (error) {
      toast.dismiss();
      toast.error('Test failed');
      setTestResult({ success: false, error: String(error), cardUsed: testCard });
    } finally {
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async () => {
    if (!transactionId) {
      toast.error('No transaction ID to check');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const status = await getVodaPayTransactionStatus(transactionId, selectedApiKey);
      setTransactionStatus(status);
      toast.success(status.success ? 'Transaction found' : 'Transaction not found');
    } catch (error) {
      toast.error('Failed to check status');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTestCard = (cardNumber: string, message: string) => {
    navigator.clipboard.writeText(cardNumber);
    toast.success(`Test card copied: ${cardNumber} (${message})`);
  };

  return (
    <div className="space-y-6">
      {/* API Key Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-900 mb-3">1. Select Test API Key</h3>
        <select
          value={selectedApiKey}
          onChange={(e) => setSelectedApiKey(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm"
        >
          {SANDBOX_API_KEYS.map((key, idx) => (
            <option key={key} value={key}>
              Key #{idx + 1}: {key.slice(0, 8)}...{key.slice(-8)}
            </option>
          ))}
        </select>
      </div>

      {/* Test Card Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-900 mb-3">2. Select Test Card Scenario</h3>
        <select
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value as keyof typeof SANDBOX_TEST_CARDS)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-3"
        >
          {Object.entries(SANDBOX_TEST_CARDS).map(([key, card]) => (
            <option key={key} value={key}>
              {card.number} - {card.message} ({card.scenario})
            </option>
          ))}
        </select>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-mono mb-1">
            Card Number: <button
              onClick={() => copyTestCard(SANDBOX_TEST_CARDS[selectedCard].number, SANDBOX_TEST_CARDS[selectedCard].message)}
              className="text-purple-600 hover:text-purple-700"
            >
              {SANDBOX_TEST_CARDS[selectedCard].number} (click to copy)
            </button>
          </p>
          <p className="text-xs text-gray-500">Expiry: 12/25 • CVV: 123</p>
          <p className="text-xs text-gray-500 mt-1">Expected Response: {SANDBOX_TEST_CARDS[selectedCard].responseCode}</p>
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={testPayment}
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : `Test Card: ${SANDBOX_TEST_CARDS[selectedCard].number}`}
      </button>

      {/* Test Results */}
      {testResult && (
        <div className={`rounded-lg p-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className={`font-semibold mb-2 ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
            Test Result: {testResult.success ? '✅ Success' : '❌ Failed'}
          </h3>
          <div className="text-sm space-y-1">
            <p><strong>Card Used:</strong> {testResult.cardUsed.number}</p>
            <p><strong>Expected:</strong> {testResult.cardUsed.message}</p>
            {testResult.transactionId && (
              <p><strong>Transaction ID:</strong> <code className="text-xs">{testResult.transactionId}</code></p>
            )}
            {testResult.error && <p><strong>Error:</strong> {testResult.error}</p>}
          </div>
        </div>
      )}

      {/* Transaction Status Check */}
      {transactionId && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3">3. Check Transaction Status</h3>
          <p className="text-sm font-mono mb-3">Transaction ID: {transactionId}</p>
          <button
            onClick={checkTransactionStatus}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Transaction Status
          </button>
          
          {transactionStatus && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(transactionStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Documentation Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-800">
          <strong>Note:</strong> The Transactions API endpoint returns 404 until a valid transaction ID 
          is provided. After running a test, use the returned transaction ID to query the status.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { usePayment } from "@/context/PaymentContext";
import { TEST_CARDS, TEST_API_KEYS } from "@/lib/payment/vodapay";

export function PaymentTester() {
  const { 
    testMode, 
    setTestMode, 
    environment, 
    setEnvironment,
    selectedTestApiKey,
    setSelectedTestApiKey,
    paymentLoading,
    paymentError 
  } = usePayment();

  const [selectedCard, setSelectedCard] = useState(TEST_CARDS?.[0] || null);
  const [amount, setAmount] = useState(100);
  const [testResult, setTestResult] = useState<string>('');

  const runTest = async () => {
    if (!selectedCard) return;
    setTestResult(`Testing with card ending in ${selectedCard.number.slice(-4)}...`);
    
    // Simulate test result
    setTimeout(() => {
      setTestResult(`
        Card: ****${selectedCard.number.slice(-4)}
        Expected Response: ${selectedCard.code} - ${selectedCard.message}
        Environment: ${environment}
        Test Mode: ${testMode ? 'ON' : 'OFF'}
      `);
    }, 1000);
  };

  if (!TEST_CARDS || !TEST_API_KEYS) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p>Payment configuration loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Integration Testing</h2>
      
      {/* Test Mode Toggle */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800">Test Mode</h3>
            <p className="text-sm text-blue-600">Toggle between test and production</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              {testMode ? 'Test Mode Active' : 'Production Mode'}
            </span>
          </label>
        </div>
      </div>

      {testMode && (
        <>
          {/* Environment Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Environment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setEnvironment('sandbox')}
                className={`p-3 rounded-lg border text-sm font-medium transition ${
                  environment === 'sandbox'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                Sandbox
                <span className="block text-xs text-gray-500">Virtual Cards</span>
              </button>
              <button
                onClick={() => setEnvironment('uat')}
                className={`p-3 rounded-lg border text-sm font-medium transition ${
                  environment === 'uat'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                UAT Environment
                <span className="block text-xs text-gray-500">Real Test Cards</span>
              </button>
            </div>
          </div>

          {/* Test API Key Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test API Key
            </label>
            <select
              value={selectedTestApiKey}
              onChange={(e) => setSelectedTestApiKey(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {TEST_API_KEYS.map((key, index) => (
                <option key={key} value={key}>
                  Test Key {index + 1}: {key.slice(0, 8)}...{key.slice(-4)}
                </option>
              ))}
            </select>
          </div>

          {/* Test Cards */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Card Scenarios
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {TEST_CARDS.map((card) => (
                <button
                  key={card.number}
                  onClick={() => setSelectedCard(card)}
                  className={`w-full p-3 text-left rounded-lg border transition ${
                    selectedCard?.number === card.number
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">
                      **** **** **** {card.number.slice(-4)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      card.code === '00' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {card.code}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{card.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Test Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Amount (ZAR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="10"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Test Button */}
          <button
            onClick={runTest}
            disabled={paymentLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mb-4"
          >
            {paymentLoading ? 'Processing...' : 'Run Test Transaction'}
          </button>

          {/* Test Results */}
          {testResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Test Result:</h4>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}

          {paymentError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              Error: {paymentError}
            </div>
          )}
        </>
      )}

      {/* Testing Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Testing Instructions</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
          <li>Use Sandbox with virtual test cards for initial testing</li>
          <li>Complete UAT testing with real test cards before production</li>
          <li>All test transactions are isolated from production</li>
          <li>UAT must be signed off by Integration team before going live</li>
          <li>Production API key is not enabled until testing is complete</li>
        </ul>
      </div>
    </div>
  );
}

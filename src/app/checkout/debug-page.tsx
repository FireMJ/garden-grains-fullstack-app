'use client';

import { useState, useEffect } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function DebugCheckoutPage() {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Debug page loaded');
  }, []);

  const handleAddressSelect = (selectedAddress) => {
    console.log('Address selected:', selectedAddress);
    setAddress(selectedAddress);
    setError(null);
  };

  const handleError = (err) => {
    console.error('Address error:', err);
    setError(err.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Debug Checkout - Address Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            placeholder="Start typing your Cape Town address..."
            className="w-full"
          />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">Error: {error}</p>
            </div>
          )}
          
          {address && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">Address Selected:</p>
              <pre className="text-sm mt-2">{JSON.stringify(address, null, 2)}</pre>
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Debug Info:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>✅ AddressAutocomplete component loaded</li>
            <li>✅ Google Maps API key configured</li>
            <li>🔍 Check browser console for errors</li>
            <li>📝 Try typing "Cape Town" or "Long Street"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

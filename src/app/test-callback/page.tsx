'use client';

import { useState } from 'react';
import { parseVodaPayCallback, formatAmount } from '@/lib/vodapay/callbackParser';

const SAMPLE_CALLBACK_DATA = "eyJlY2hvRGF0YSI6Ijk4NzY1NDMyIiwic2Vzc2lvbklkIjoiODdjNGRkMjAtZjAwMC00ZWNlLWJhMGUtYzNmZDM1MjgxMjM0IiwicmVzcG9uc2VDb2RlIjoiMDAiLCJyZXNwb25zZU1lc3NhZ2UiOiJBcHByb3ZlZCBvciBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5IiwicGF5bWVudFRva2VuIjoiMTIzNDU2Nzg5MDEyMzQ1NiIsInJldHJpZXZhbFJlZmVyZW5jZU51bWJlciI6IlJFUF85ODc2NTQzMiIsInJldHJpZXZhbFJlZmVyZW5jZU51bWJlckV4dGVuZGVkIjoiRVhUXzk4NzY1NDMyIiwibWVyY2hhbnRJZCI6IlZQUzAwMDAwMDAwMDAwMCIsIm1lcmNoYW50TmFtZSI6IkdhcmRlbiAmIEdyYWlucyIsInRyYW5zYWN0aW9uQW1vdW50IjoyMjUwMCwiY3VycmVuY3lDb2RlIjoiNzEwIiwidHJhbnNhY3Rpb25JZCI6InR4bl85ODc2NTQzMi0xMjM0LTU2NzgtOTAxMi0zNDU2Nzg5MDEyMzQiLCJwYXltZW50TWV0aG9kIjoiMDYifQ==";

export default function TestCallbackPage() {
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testParse = () => {
    try {
      const parsed = parseVodaPayCallback(SAMPLE_CALLBACK_DATA);
      setDecoded(parsed);
      setError(null);
      console.log('Parsed callback:', parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse error');
      setDecoded(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Test VodaPay Callback Parser</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="font-semibold mb-2">Sample Callback Data (Base64):</h2>
          <p className="text-xs font-mono break-all bg-gray-100 p-2 rounded mb-4">
            {SAMPLE_CALLBACK_DATA}
          </p>
          
          <button
            onClick={testParse}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Parse Callback Data
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {decoded && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold text-green-800 mb-3">Decoded Callback Data:</h2>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Order ID (echoData):</span>
                <span>{decoded.echoData}</span>
                
                <span className="font-medium">Transaction ID:</span>
                <span className="font-mono text-xs">{decoded.transactionId}</span>
                
                <span className="font-medium">Response Code:</span>
                <span className={decoded.responseCode === '00' ? 'text-green-600 font-bold' : 'text-red-600'}>
                  {decoded.responseCode} - {decoded.responseMessage}
                </span>
                
                <span className="font-medium">Amount:</span>
                <span className="font-bold text-green-600">{formatAmount(decoded.transactionAmount)}</span>
                
                <span className="font-medium">Amount in cents:</span>
                <span>{decoded.transactionAmount} cents</span>
                
                <span className="font-medium">Session ID:</span>
                <span className="font-mono text-xs break-all">{decoded.sessionId}</span>
                
                <span className="font-medium">Retrieval Reference:</span>
                <span>{decoded.retrievalReferenceNumber}</span>
                
                <span className="font-medium">Payment Method:</span>
                <span>{decoded.paymentMethod === '06' ? 'Credit/Debit Card' : decoded.paymentMethod}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

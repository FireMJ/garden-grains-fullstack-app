'use client';

import { useState } from 'react';

export default function TestPlacesPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPlaces = async () => {
    if (input.length < 3) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Use the server-side proxy
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`);
      const data = await response.json();
      
      console.log('Response:', data);
      
      if (data.status === 'OK') {
        setResults(data.predictions || []);
      } else {
        setError(`API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(`Fetch error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Google Places API Test</h1>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter address (e.g., Long Street, Cape Town)"
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              onClick={searchPlaces}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Results ({results.length}):</h3>
              <ul className="space-y-2">
                {results.map((r, i) => (
                  <li key={i} className="p-2 bg-gray-50 rounded">
                    {r.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-gray-500 mt-2">
              Using server-side proxy to bypass CORS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

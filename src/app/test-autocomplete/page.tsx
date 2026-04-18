'use client';

import { useState } from 'react';
import { getAddressSuggestions } from '@/lib/googleMaps';

export default function TestAutocompletePage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (input.length < 3) {
      setError('Please enter at least 3 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    console.log('🔍 Searching for:', input);
    
    try {
      const suggestions = await getAddressSuggestions(input);
      console.log('📋 Suggestions received:', suggestions);
      setResults(suggestions);
      if (suggestions.length === 0) {
        setError('No suggestions found. Try a different address.');
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to fetch suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔍 Test Address Autocomplete</h1>
          <p className="text-gray-600 mb-4">Test the Google Places API directly</p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Type an address (e.g., Long Street, Cape Town)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Fetching suggestions...</p>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Suggestions ({results.length}):</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800">{result.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Place ID: {result.placeId}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">💡 Test these addresses:</p>
            <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
              <li>Long Street, Cape Town</li>
              <li>V&A Waterfront</li>
              <li>Table Mountain</li>
              <li>Uitsig Wine Farm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

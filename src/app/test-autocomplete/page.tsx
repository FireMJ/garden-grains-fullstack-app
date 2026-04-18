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
      console.log('📋 Suggestions:', suggestions);
      setResults(suggestions);
      if (suggestions.length === 0) {
        setError('No suggestions found');
      }
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Test Autocomplete API</h1>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type an address..."
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
          
          {error && <div className="p-2 bg-red-50 text-red-600 rounded mb-4">{error}</div>}
          
          {results.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Results ({results.length}):</h3>
              <ul className="space-y-1">
                {results.map((r, i) => (
                  <li key={i} className="p-2 bg-gray-50 rounded">{r.description}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

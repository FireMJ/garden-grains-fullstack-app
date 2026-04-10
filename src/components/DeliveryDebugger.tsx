'use client';

import { useState } from 'react';
import { getDrivingDistanceFromCoords, geocodeAddress, RESTAURANT_COORDS } from '@/lib/googleMaps';

export default function DeliveryDebugger() {
  const [testAddress, setTestAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAddressDistance = async () => {
    if (!testAddress) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Geocode address
      console.log('1. Geocoding address:', testAddress);
      const coords = await geocodeAddress(testAddress);
      
      if (!coords) {
        setError('Could not find coordinates for this address');
        setLoading(false);
        return;
      }
      
      console.log('2. Coordinates found:', coords);
      
      // Step 2: Calculate distance
      console.log('3. Calculating distance to restaurant:', RESTAURANT_COORDS);
      const distanceResult = await getDrivingDistanceFromCoords(coords.lat, coords.lng);
      
      console.log('4. Distance result:', distanceResult);
      
      if (distanceResult) {
        const maxDistance = 50; // km
        const isAvailable = distanceResult.distance <= maxDistance;
        
        setResult({
          address: testAddress,
          coordinates: coords,
          distance: distanceResult.distance,
          duration: distanceResult.duration,
          isAvailable: isAvailable,
          fee: isAvailable ? calculateFee(distanceResult.distance) : null,
        });
      } else {
        setError('Could not calculate distance');
      }
    } catch (err: any) {
      console.error('Debug error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = (distanceKm: number) => {
    const BASE_FEE = 35;
    const BASE_DISTANCE = 5;
    const EXTRA_RATE = 5;
    
    if (distanceKm <= BASE_DISTANCE) return BASE_FEE;
    const extraKm = Math.ceil(distanceKm - BASE_DISTANCE);
    return BASE_FEE + (extraKm * EXTRA_RATE);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Distance Debugger</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            placeholder="Enter an address to test"
            className="flex-1 p-3 border border-gray-300 rounded-lg"
          />
          <button
            onClick={testAddressDistance}
            disabled={loading}
            className="px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700">Restaurant Location:</p>
        <p className="text-sm text-gray-600">Uitsig Wine Farm, Spaanschemat River Rd, Cape Town</p>
        <p className="text-xs text-gray-500">Coordinates: {RESTAURANT_COORDS.lat}, {RESTAURANT_COORDS.lng}</p>
        <p className="text-xs text-gray-500">Max Delivery Radius: 50 km</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">Error:</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Results:</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Address:</strong> {result.address}</p>
            <p><strong>Coordinates:</strong> {result.coordinates.lat.toFixed(4)}, {result.coordinates.lng.toFixed(4)}</p>
            <p><strong>Distance:</strong> {result.distance.toFixed(2)} km</p>
            <p><strong>Duration:</strong> {Math.ceil(result.duration)} minutes</p>
            <div className={`p-2 rounded ${result.isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">
                {result.isAvailable ? '✅ Delivery Available!' : '❌ Delivery Not Available'}
              </p>
              {result.isAvailable ? (
                <p>Delivery Fee: R{result.fee.toFixed(2)}</p>
              ) : (
                <p>Reason: Distance exceeds maximum of 50km</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium">Troubleshooting Tips:</p>
        <ul className="text-xs text-yellow-700 mt-2 space-y-1 list-disc list-inside">
          <li>Check browser console (F12) for detailed logs</li>
          <li>Verify Google Maps API key is valid</li>
          <li>Ensure address is in South Africa</li>
          <li>Try using "My Location" button on checkout page</li>
          <li>Check if address is within 50km of Cape Town</li>
        </ul>
      </div>
    </div>
  );
}

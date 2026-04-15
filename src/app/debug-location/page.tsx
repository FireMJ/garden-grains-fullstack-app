'use client';

import { useState } from 'react';
import { getCurrentLocation } from '@/lib/locationService';

export default function DebugLocationPage() {
  const [status, setStatus] = useState<string>('Ready');
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawCoords, setRawCoords] = useState<any>(null);

  const testLocation = async () => {
    setLoading(true);
    setStatus('Acquiring GPS signal...');
    setError(null);
    
    // Get raw coordinates first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRawCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toLocaleString(),
          });
        },
        (err) => {
          console.error('Raw geolocation error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    
    const result = await getCurrentLocation();
    
    if (result.success) {
      setStatus('✅ Location acquired!');
      setLocation({
        lat: result.coordinates?.lat,
        lng: result.coordinates?.lng,
        accuracy: result.accuracy,
        address: result.address,
      });
    } else {
      setStatus('❌ Location failed');
      setError(result.error || 'Unknown error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Location Debugger</h1>
          
          <button
            onClick={testLocation}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-6"
          >
            {loading ? 'Acquiring GPS...' : 'Test My Location'}
          </button>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-100 rounded">
              <strong>Status:</strong>
              <p className="text-sm mt-1">{status}</p>
            </div>
            
            {rawCoords && (
              <div className="p-3 bg-yellow-50 rounded">
                <strong>Raw GPS Coordinates (Direct from browser):</strong>
                <p className="text-sm mt-1">Latitude: {rawCoords.lat}</p>
                <p className="text-sm">Longitude: {rawCoords.lng}</p>
                <p className="text-sm">Accuracy: {rawCoords.accuracy?.toFixed(1)} meters</p>
                <p className="text-sm">Time: {rawCoords.timestamp}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {rawCoords.accuracy < 20 ? '✅ Excellent GPS lock!' : 
                   rawCoords.accuracy < 100 ? '⚠️ Moderate accuracy' : 
                   '❌ Poor accuracy - likely WiFi/network based'}
                </p>
              </div>
            )}
            
            {location && (
              <>
                <div className="p-3 bg-green-50 rounded">
                  <strong>Processed Location (After Google Maps):</strong>
                  <p className="text-sm mt-1">Latitude: {location.lat}</p>
                  <p className="text-sm">Longitude: {location.lng}</p>
                  <p className="text-sm">Accuracy: {location.accuracy?.toFixed(1)} meters</p>
                </div>
                
                {location.address && (
                  <div className="p-3 bg-blue-50 rounded">
                    <strong>Address:</strong>
                    <p className="text-sm mt-1">{location.address}</p>
                  </div>
                )}
              </>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 rounded">
                <strong>Error:</strong>
                <p className="text-sm mt-1 text-red-600">{error}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-3 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-800 font-medium">⚠️ Troubleshooting Tips:</p>
            <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside space-y-1">
              <li>Test on a mobile phone for best GPS accuracy</li>
              <li>Enable "High Accuracy" mode in your device location settings</li>
              <li>Go outdoors or near a window for better GPS signal</li>
              <li>Disable any VPN or proxy services</li>
              <li>Check that your browser has location permission set to "Allow"</li>
              <li>On iPhone: Settings → Privacy → Location Services → On</li>
              <li>On Android: Settings → Location → High accuracy mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

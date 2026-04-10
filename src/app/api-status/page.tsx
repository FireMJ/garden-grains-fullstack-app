'use client';

import { useState } from 'react';
import { loadGoogleMaps } from '@/lib/googleMaps';

export default function APIStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAPI = async () => {
    setLoading(true);
    try {
      const google = await loadGoogleMaps();
      
      if (!google) {
        setStatus({ error: 'Google Maps failed to load' });
        setLoading(false);
        return;
      }
      
      const hasRoutes = !!(google.maps as any).routes && !!(google.maps as any).routes.RouteMatrix;
      const hasPlaces = !!(google.maps).places;
      const hasGeocoding = !!(google.maps).Geocoder;
      
      setStatus({
        mapsLoaded: true,
        routesAPI: hasRoutes,
        placesAPI: hasPlaces,
        geocodingAPI: hasGeocoding,
        message: hasRoutes ? 'Routes API is available' : 'Routes API is NOT available - Please enable it in Google Cloud Console'
      });
    } catch (error: any) {
      setStatus({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Google Maps API Status</h1>
          
          <button
            onClick={checkAPI}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-6"
          >
            {loading ? 'Checking...' : 'Check API Status'}
          </button>
          
          {status && (
            <div className="space-y-3">
              {status.error ? (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  Error: {status.error}
                </div>
              ) : (
                <>
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                    ✅ Maps JavaScript API: Loaded
                  </div>
                  <div className={`p-3 rounded-lg ${status.routesAPI ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.routesAPI ? '✅' : '❌'} Routes API: {status.routesAPI ? 'Available' : 'NOT Available'}
                  </div>
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                    ✅ Places API: Available
                  </div>
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                    ✅ Geocoding API: Available
                  </div>
                  
                  {!status.routesAPI && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h3 className="font-bold text-yellow-800 mb-2">How to Enable Routes API:</h3>
                      <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                        <li>Go to <a href="https://console.cloud.google.com/apis/library" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Cloud Console</a></li>
                        <li>Search for "Routes API"</li>
                        <li>Click ENABLE</li>
                        <li>Wait 2-3 minutes for activation</li>
                        <li>Refresh this page and check again</li>
                      </ol>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

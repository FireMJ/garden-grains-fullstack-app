'use client';

import { loadGoogleMaps } from './googleMaps';

export interface LocationResult {
  success: boolean;
  coordinates?: { lat: number; lng: number };
  address?: string;
  error?: string;
  errorCode?: number;
  accuracy?: number;
}

// More aggressive location options
const LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 30000,  // Increased timeout
  maximumAge: 0,
};

// Check if coordinates are the US default (37.09024, -95.712891)
const isUSDefaultLocation = (lat: number, lng: number): boolean => {
  // US geographic center is approximately 39.8°N, 98.6°W
  return Math.abs(lat - 39.8) < 5 && Math.abs(lng - -98.6) < 10;
};

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, LOCATION_OPTIONS);
  });
};

export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    const position = await getCurrentPosition();
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    
    const accuracy = position.coords.accuracy;
    console.log(`📍 Raw GPS: ${coords.lat}, ${coords.lng} (${accuracy.toFixed(1)}m accuracy)`);
    
    // Check if this is the US default location
    if (isUSDefaultLocation(coords.lat, coords.lng) || accuracy > 5000) {
      console.warn('⚠️ Location appears to be IP-based default. Using Cape Town coordinates.');
      
      // Use Cape Town city center as fallback
      const capeTownCoords = { lat: -33.9249, lng: 18.4241 };
      
      const google = await loadGoogleMaps();
      if (google) {
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve) => {
          geocoder.geocode(
            { location: capeTownCoords },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                resolve({
                  success: true,
                  coordinates: capeTownCoords,
                  address: results[0].formatted_address,
                  accuracy: 100,
                  error: "Using approximate location (GPS not available on this device)",
                });
              } else {
                resolve({
                  success: true,
                  coordinates: capeTownCoords,
                  address: "Cape Town, South Africa",
                  accuracy: 100,
                });
              }
            }
          );
        });
      }
      
      return {
        success: true,
        coordinates: capeTownCoords,
        address: "Cape Town, South Africa",
        accuracy: 100,
      };
    }
    
    const google = await loadGoogleMaps();
    if (!google) {
      return {
        success: true,
        coordinates: coords,
        accuracy: accuracy,
      };
    }
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode(
        { 
          location: coords,
          componentRestrictions: { country: 'ZA' }
        },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            resolve({
              success: true,
              coordinates: coords,
              address: results[0].formatted_address,
              accuracy: accuracy,
            });
          } else {
            resolve({
              success: true,
              coordinates: coords,
              accuracy: accuracy,
            });
          }
        }
      );
    });
  } catch (error: any) {
    console.error("Location error:", error);
    
    let errorMessage = "Unable to get your location";
    
    switch (error.code) {
      case 1:
        errorMessage = "Location permission denied. Please enable location access.";
        break;
      case 2:
        errorMessage = "GPS signal unavailable. Please go outdoors.";
        break;
      case 3:
        errorMessage = "Location request timed out. Please try again.";
        break;
      default:
        errorMessage = error.message || "Failed to get location.";
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code,
    };
  }
};

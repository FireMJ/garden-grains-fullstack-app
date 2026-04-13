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

// Location options for high accuracy GPS
const LOCATION_OPTIONS = {
  enableHighAccuracy: true,  // Use GPS for best accuracy
  timeout: 10000,            // 10 seconds timeout
  maximumAge: 0,             // Don't use cached position
};

// Get current position with Promise API
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, LOCATION_OPTIONS);
  });
};

// Get full location with address using reverse geocoding
export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    // Step 1: Get GPS coordinates with high accuracy
    const position = await getCurrentPosition();
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    
    const accuracy = position.coords.accuracy;
    console.log(`📍 Location acquired with accuracy: ${accuracy.toFixed(1)} meters`);
    
    // Step 2: Reverse geocode to get address
    const google = await loadGoogleMaps();
    if (!google) {
      return {
        success: true,
        coordinates: coords,
        accuracy: accuracy,
        error: "Could not get address from location",
      };
    }
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode(
        { location: coords },
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
              error: "Could not get address from coordinates",
            });
          }
        }
      );
    });
  } catch (error: any) {
    console.error("Location error:", error);
    
    // Handle specific error types for better user feedback
    let errorMessage = "Unable to get your location";
    
    switch (error.code) {
      case 1: // PERMISSION_DENIED
        errorMessage = "Please allow location access to use this feature. Check your browser settings.";
        break;
      case 2: // POSITION_UNAVAILABLE
        errorMessage = "Location information is unavailable. Please check your GPS/WiFi connection.";
        break;
      case 3: // TIMEOUT
        errorMessage = "Location request timed out. Please try again in an open area.";
        break;
      default:
        errorMessage = error.message || "Failed to get location. Please try typing your address.";
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code,
    };
  }
};

// Watch position for real-time tracking (for delivery driver feature)
export const watchLocation = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    onError({ code: 0, message: "Geolocation not supported", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
    return -1;
  }
  
  return navigator.geolocation.watchPosition(onSuccess, onError, LOCATION_OPTIONS);
};

// Stop watching position
export const clearWatch = (watchId: number) => {
  if (watchId !== -1 && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

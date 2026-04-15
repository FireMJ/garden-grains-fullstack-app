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
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

// South Africa bounds (approximate)
const SOUTH_AFRICA_BOUNDS = {
  north: -22.0,
  south: -35.0,
  west: 16.0,
  east: 33.0,
};

// Check if coordinates are within South Africa
const isInSouthAfrica = (lat: number, lng: number): boolean => {
  return (
    lat >= SOUTH_AFRICA_BOUNDS.south &&
    lat <= SOUTH_AFRICA_BOUNDS.north &&
    lng >= SOUTH_AFRICA_BOUNDS.west &&
    lng <= SOUTH_AFRICA_BOUNDS.east
  );
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
    console.log(`📍 Location acquired: ${coords.lat}, ${coords.lng} (accuracy: ${accuracy.toFixed(1)}m)`);
    
    // Check if location is in South Africa
    if (!isInSouthAfrica(coords.lat, coords.lng)) {
      console.warn('Location is outside South Africa, defaulting to Cape Town');
      // Default to Cape Town center
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
                  accuracy: accuracy,
                  error: "Location outside SA, using Cape Town as default",
                });
              } else {
                resolve({
                  success: true,
                  coordinates: capeTownCoords,
                  address: "Cape Town, South Africa",
                  accuracy: accuracy,
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
        accuracy: accuracy,
      };
    }
    
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
        { 
          location: coords,
          componentRestrictions: { country: 'ZA' } // Restrict to South Africa
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
              error: "Could not get address from coordinates",
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
        errorMessage = "Please allow location access to use this feature.";
        break;
      case 2:
        errorMessage = "Location unavailable. Please check your GPS/WiFi.";
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

export const clearWatch = (watchId: number) => {
  if (watchId !== -1 && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

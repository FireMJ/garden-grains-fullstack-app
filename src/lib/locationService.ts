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

// Cape Town coordinates (default)
const CAPE_TOWN_COORDS = {
  lat: -33.9249,
  lng: 18.4241
};

const CAPE_TOWN_ADDRESS = "Cape Town City Centre, Cape Town, South Africa";

// South Africa bounds
const SOUTH_AFRICA_BOUNDS = {
  north: -22.0,
  south: -35.0,
  west: 16.0,
  east: 33.0,
};

const isInSouthAfrica = (lat: number, lng: number): boolean => {
  return lat >= SOUTH_AFRICA_BOUNDS.south && lat <= SOUTH_AFRICA_BOUNDS.north && 
         lng >= SOUTH_AFRICA_BOUNDS.west && lng <= SOUTH_AFRICA_BOUNDS.east;
};

// Check if location is the US default (IP-based fallback)
const isUSDefaultLocation = (lat: number, lng: number): boolean => {
  // US center is approximately 39.8°N, 98.6°W
  return (Math.abs(lat - 39.8) < 5 && Math.abs(lng - -98.6) < 10) || 
         (Math.abs(lat - 37.09024) < 5 && Math.abs(lng - -95.712891) < 10);
};

// Location options for best accuracy
const LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
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

export const getAccurateLocation = async (maxAttempts: number = 3): Promise<GeolocationPosition | null> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const position = await getCurrentPosition();
      const accuracy = position.coords.accuracy;
      
      // If accuracy is good (< 100m) or this is the last attempt, return
      if (accuracy < 100 || attempt === maxAttempts - 1) {
        console.log(`📍 Location acquired (attempt ${attempt + 1}): ${accuracy.toFixed(1)}m accuracy`);
        return position;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
    }
  }
  return null;
};

export const getCurrentLocation = async (): Promise<LocationResult> => {
  try {
    const position = await getAccurateLocation(3);
    
    if (!position) {
      // Default to Cape Town if GPS fails
      console.log('📍 GPS failed, defaulting to Cape Town');
      return {
        success: true,
        coordinates: CAPE_TOWN_COORDS,
        address: CAPE_TOWN_ADDRESS,
        accuracy: 500,
        error: "Using Cape Town as default location",
      };
    }
    
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    const accuracy = position.coords.accuracy;
    
    // If location is US default, use Cape Town instead
    if (isUSDefaultLocation(coords.lat, coords.lng)) {
      console.log('⚠️ Got US default location. Using Cape Town instead.');
      return {
        success: true,
        coordinates: CAPE_TOWN_COORDS,
        address: CAPE_TOWN_ADDRESS,
        accuracy: 500,
        error: "Using Cape Town as default location",
      };
    }
    
    // If location is outside South Africa, use Cape Town
    if (!isInSouthAfrica(coords.lat, coords.lng)) {
      console.log('⚠️ Location outside South Africa. Using Cape Town instead.');
      return {
        success: true,
        coordinates: CAPE_TOWN_COORDS,
        address: CAPE_TOWN_ADDRESS,
        accuracy: 500,
        error: "Location outside SA, using Cape Town",
      };
    }
    
    console.log(`📍 GPS acquired: ${coords.lat}, ${coords.lng} (${accuracy.toFixed(1)}m accuracy)`);
    
    const google = await loadGoogleMaps();
    if (!google) {
      return { success: true, coordinates: coords, accuracy: accuracy };
    }
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode(
        { location: coords, componentRestrictions: { country: 'ZA' } },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            resolve({
              success: true,
              coordinates: coords,
              address: results[0].formatted_address,
              accuracy: accuracy,
            });
          } else {
            resolve({ success: true, coordinates: coords, accuracy: accuracy });
          }
        }
      );
    });
  } catch (error: any) {
    console.error("Location error:", error);
    // Default to Cape Town on any error
    return {
      success: true,
      coordinates: CAPE_TOWN_COORDS,
      address: CAPE_TOWN_ADDRESS,
      accuracy: 500,
      error: "Using Cape Town as default location",
    };
  }
};

// Get default Cape Town location (for testing/fallback)
export const getCapeTownLocation = (): LocationResult => {
  return {
    success: true,
    coordinates: CAPE_TOWN_COORDS,
    address: CAPE_TOWN_ADDRESS,
    accuracy: 500,
  };
};

// Add missing getCapeTownLocation function
export const getCapeTownLocation = (): LocationResult => {
  return {
    success: true,
    coordinates: { lat: -33.9249, lng: 18.4241 },
    address: "Cape Town, South Africa",
    accuracy: 500,
  };
};

// Restaurant coordinates (Uitsig Wine Farm, Constantia, Cape Town)
export const RESTAURANT_COORDS = {
  lat: -34.0425,
  lng: 18.4412
};

export const RESTAURANT_ADDRESS = "Uitsig Wine Farm, Spaanschemat River Rd, Constantia, Cape Town, 7806";

export const DELIVERY_CONFIG = {
  MAX_DISTANCE_KM: 50,
  BASE_DELIVERY_FEE: 35,
  BASE_DISTANCE_KM: 5,
  EXTRA_KM_RATE: 2.75,
  FREE_DELIVERY_THRESHOLD: 850,
};

export const CAPE_TOWN_BOUNDS = {
  north: -33.5,
  south: -34.2,
  west: 18.2,
  east: 18.65,
};

let googleMapsPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = async () => {
  if (typeof window === 'undefined') return null;

  if (window.google?.maps) {
    return window.google;
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is missing');
    return null;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = `initGoogleMap_${Date.now()}`;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,routes,geometry&region=ZA&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;

    const timeout = setTimeout(() => reject(new Error('Google Maps timeout')), 30000);
    (window as any)[callbackName] = () => {
      clearTimeout(timeout);
      delete (window as any)[callbackName];
      resolve(window.google);
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });

  try {
    await googleMapsPromise;
    if (window.google) {
      await window.google.maps.importLibrary("places");
      await window.google.maps.importLibrary("routes");
    }
    return window.google;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    googleMapsPromise = null;
    return null;
  }
};

// Calculate straight-line distance (Haversine formula)
export const calculateStraightLineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if coordinates are within delivery radius
export const isWithinDeliveryRadius = (lat: number, lng: number): boolean => {
  const distance = calculateStraightLineDistance(lat, lng, RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng);
  return distance <= DELIVERY_CONFIG.MAX_DISTANCE_KM + 10;
};

// Validate Cape Town coordinates
export const isValidCapeTownAddress = (lat: number, lng: number): boolean => {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return false;
  }
  return lat >= -34.2 && lat <= -33.5 && lng >= 18.2 && lng <= 18.65;
};

// Alias for backward compatibility
export const isValidCapeTownCoordinates = isValidCapeTownAddress;

// Geocode address - convert address to coordinates
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;

    const geocoder = new google.maps.Geocoder();
    const fullAddress = address.toLowerCase().includes('south africa') || address.toLowerCase().includes('za')
      ? address
      : `${address}, Cape Town, South Africa`;

    return new Promise((resolve) => {
      geocoder.geocode(
        {
          address: fullAddress,
          componentRestrictions: { country: 'ZA' },
          region: 'ZA',
        },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            console.error(`Geocoding failed for "${address}": ${status}`);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Get address suggestions
export const getAddressSuggestions = async (input: string) => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return [];

    const { AutocompleteSuggestion } = await google.maps.importLibrary("places") as any;
    const sessionToken = new google.maps.places.AutocompleteSessionToken();
    
    const response = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
      input,
      locationBias: { center: RESTAURANT_COORDS, radius: DELIVERY_CONFIG.MAX_DISTANCE_KM * 1000 },
      sessionToken,
    });
    
    if (!response.suggestions) return [];
    
    return response.suggestions.map((s: any) => ({
      description: s.placePrediction.structuredFormat?.mainText?.text || s.placePrediction.text?.text || '',
      placeId: s.placePrediction.placeId,
    }));
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
};

// Get place details
export const getPlaceDetails = async (placeId: string) => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
    const { Place } = await google.maps.importLibrary("places") as any;
    const place = new Place({ id: placeId, requestedLanguage: "en" });
    
    await place.fetchFields({
      fields: ["formattedAddress", "location", "addressComponents", "displayName"],
    });
    
    const location = place.location;
    return {
      formattedAddress: place.formattedAddress || place.displayName || "",
      location: location ? { lat: location.lat(), lng: location.lng() } : { lat: 0, lng: 0 },
      addressComponents: place.addressComponents,
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

// Calculate driving distance
export const getDrivingDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
    const { RouteMatrix } = await google.maps.importLibrary("routes") as any;
    
    const result = await RouteMatrix.computeRouteMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      units: google.maps.UnitSystem.METRIC,
      fields: ['distanceMeters', 'durationMillis', 'condition'],
    });
    
    if (result?.matrix?.rows?.[0]?.items?.[0]?.condition === 'ROUTE_EXISTS') {
      const item = result.matrix.rows[0].items[0];
      return {
        distance: item.distanceMeters / 1000,
        duration: item.durationMillis / (1000 * 60),
      };
    }
    
    // Fallback to straight-line distance
    const straightLine = calculateStraightLineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    return { distance: straightLine, duration: (straightLine / 40) * 60 };
  } catch (error) {
    console.error('Error calculating distance:', error);
    const straightLine = calculateStraightLineDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    return { distance: straightLine, duration: (straightLine / 40) * 60 };
  }
};

// Alias for backward compatibility
export const getDrivingDistanceFromCoords = async (
  userLat: number,
  userLng: number
): Promise<{ distance: number; duration: number } | null> => {
  return getDrivingDistance({ lat: userLat, lng: userLng }, RESTAURANT_COORDS);
};

export const calculateDeliveryFee = (distanceKm: number, subtotal: number = 0): number => {
  if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
  if (distanceKm <= DELIVERY_CONFIG.BASE_DISTANCE_KM) return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
  const extraKm = Math.ceil(distanceKm - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  return DELIVERY_CONFIG.BASE_DELIVERY_FEE + (extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE);
};

// Check if delivery is available
export const isDeliveryAvailable = async (
  userLat: number,
  userLng: number,
  maxDistanceKm: number = DELIVERY_CONFIG.MAX_DISTANCE_KM
): Promise<{ available: boolean; distance?: number; duration?: number; fee?: number; reason?: string }> => {
  try {
    const result = await getDrivingDistanceFromCoords(userLat, userLng);
    if (!result) {
      return { 
        available: false, 
        reason: "Could not calculate distance. Please ensure your address is in Cape Town." 
      };
    }
    
    if (result.distance <= maxDistanceKm) {
      const fee = calculateDeliveryFee(result.distance);
      return { 
        available: true, 
        distance: result.distance, 
        duration: result.duration, 
        fee: fee 
      };
    }
    
    return { 
      available: false, 
      distance: result.distance, 
      duration: result.duration, 
      reason: `Location is ${result.distance.toFixed(1)} km away. Maximum delivery distance is ${maxDistanceKm} km.` 
    };
  } catch (error) {
    console.error('Error checking delivery availability:', error);
    return { 
      available: false, 
      reason: "Error checking delivery availability. Please try again." 
    };
  }
};

// Add this function to check if delivery is available

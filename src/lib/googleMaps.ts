// Restaurant coordinates (Uitsig Wine Farm, Cape Town)
export const RESTAURANT_COORDS = {
  lat: -34.0425,
  lng: 18.4412
};

export const RESTAURANT_ADDRESS = "Uitsig Wine Farm, Spaanschemat River Rd, Fir Grove, Cape Town, 7806";

// Delivery configuration
export const DELIVERY_CONFIG = {
  MAX_DISTANCE_KM: 50,
  BASE_DELIVERY_FEE: 35,
  BASE_DISTANCE_KM: 5,
  EXTRA_KM_RATE: 5,
  FREE_DELIVERY_THRESHOLD: 350,
};

let googleMapsPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = async () => {
  if (typeof window === 'undefined') return null;
  
  if (window.google && window.google.maps) {
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
  
  const callbackName = `initGoogleMap_${Date.now()}`;
  
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,routes&region=ZA&loading=async&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    const timeout = setTimeout(() => {
      reject(new Error('Google Maps script loading timeout'));
    }, 30000);
    
    (window as any)[callbackName] = () => {
      clearTimeout(timeout);
      delete (window as any)[callbackName];
      resolve(window.google);
    };
    
    script.onerror = () => {
      clearTimeout(timeout);
      delete (window as any)[callbackName];
      googleMapsPromise = null;
      reject(new Error('Failed to load Google Maps script'));
    };
    
    document.head.appendChild(script);
  });
  
  try {
    await googleMapsPromise;
    return window.google;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    googleMapsPromise = null;
    return null;
  }
};

export const getDrivingDistance = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
    // Use Distance Matrix API (more reliable than Routes API)
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    
    return new Promise((resolve) => {
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK' && response && response.rows[0]?.elements[0]) {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              resolve({
                distance: element.distance.value / 1000,
                duration: element.duration.value / 60,
              });
            } else {
              console.error('Distance Matrix element status:', element.status);
              resolve(null);
            }
          } else {
            console.error('Distance Matrix status:', status);
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in getDrivingDistance:', error);
    return null;
  }
};

export const getDrivingDistanceFromCoords = async (
  userLat: number,
  userLng: number
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const origin = { lat: userLat, lng: userLng };
    const destination = RESTAURANT_COORDS;
    
    return await getDrivingDistance(origin, destination);
  } catch (error) {
    console.error('Error calculating delivery distance:', error);
    return null;
  }
};

export const calculateDeliveryFee = (distanceKm: number, subtotal: number = 0): number => {
  if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) {
    return 0;
  }
  
  if (distanceKm <= DELIVERY_CONFIG.BASE_DISTANCE_KM) {
    return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
  }
  
  const extraKm = Math.ceil(distanceKm - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  return DELIVERY_CONFIG.BASE_DELIVERY_FEE + (extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE);
};

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
        reason: "Could not calculate distance. Please try again." 
      };
    }
    
    if (result.distance <= maxDistanceKm) {
      const fee = calculateDeliveryFee(result.distance);
      return {
        available: true,
        distance: result.distance,
        duration: result.duration,
        fee: fee,
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
    return { available: false, reason: "Error checking delivery availability. Please try again." };
  }
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
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
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getAddressSuggestions = async (input: string): Promise<Array<{ description: string; placeId: string }>> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return [];
    
    const autocompleteService = new google.maps.places.AutocompleteService();
    
    return new Promise((resolve) => {
      autocompleteService.getPlacePredictions(
        { 
          input, 
          componentRestrictions: { country: 'za' },
          types: ['address']
        },
        (predictions, status) => {
          if (status === 'OK' && predictions) {
            resolve(predictions.map(p => ({
              description: p.description,
              placeId: p.place_id,
            })));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
};

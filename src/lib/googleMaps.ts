// Restaurant coordinates (Uitsig Wine Farm, Cape Town)
export const RESTAURANT_COORDS = {
  lat: -34.0425,
  lng: 18.4412
};

export const RESTAURANT_ADDRESS = "Uitsig Wine Farm, Spaanschemat River Rd, Fir Grove, Cape Town, 7806";

let googleMapsPromise: Promise<typeof google> | null = null;
let isScriptLoading = false;

// Direct script loading approach
export const loadGoogleMaps = async () => {
  if (typeof window === 'undefined') return null;
  
  // If already loaded
  if (window.google && window.google.maps) {
    return window.google;
  }
  
  // If already loading, return existing promise
  if (googleMapsPromise) {
    return googleMapsPromise;
  }
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local');
    return null;
  }
  
  // Create a new promise to load the script
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'initGoogleMap_' + Date.now();
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    
    // Define the callback function
    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      resolve(window.google);
    };
    
    script.onerror = () => {
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

// Function to get driving distance between two points
export const getDrivingDistance = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<google.maps.DistanceMatrixResponseElement | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
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
            resolve(response.rows[0].elements[0]);
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error getting driving distance:', error);
    return null;
  }
};

// Function to get driving distance from coordinates
export const getDrivingDistanceFromCoords = async (
  userLat: number,
  userLng: number
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const origin = { lat: userLat, lng: userLng };
    const destination = RESTAURANT_COORDS;
    
    const result = await getDrivingDistance(origin, destination);
    
    if (result && result.status === 'OK') {
      return {
        distance: result.distance.value / 1000, // Convert to kilometers
        duration: result.duration.value / 60, // Convert to minutes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating delivery distance:', error);
    return null;
  }
};

// Helper function to check if delivery is available
export const isDeliveryAvailable = async (
  userLat: number,
  userLng: number,
  maxDistanceKm: number = 15
): Promise<{ available: boolean; distance?: number; duration?: number }> => {
  try {
    const result = await getDrivingDistanceFromCoords(userLat, userLng);
    
    if (result && result.distance <= maxDistanceKm) {
      return {
        available: true,
        distance: result.distance,
        duration: result.duration,
      };
    }
    
    return {
      available: false,
      distance: result?.distance,
      duration: result?.duration,
    };
  } catch (error) {
    console.error('Error checking delivery availability:', error);
    return { available: false };
  }
};

// Geocode address to coordinates
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
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

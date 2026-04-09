// Restaurant coordinates (Uitsig Wine Farm, Cape Town)
export const RESTAURANT_COORDS = {
  lat: -34.0425,
  lng: 18.4412
};

export const RESTAURANT_ADDRESS = "Uitsig Wine Farm, Spaanschemat River Rd, Fir Grove, Cape Town, 7806";

let googleMapsPromise: Promise<typeof google> | null = null;

// Direct script loading with proper async and routes library
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
    console.error('Google Maps API key is missing');
    return null;
  }
  
  // Create a unique callback name
  const callbackName = `initGoogleMap_${Date.now()}`;
  
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    
    // Include routes library for Route Matrix API
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,routes&loading=async&callback=${callbackName}`;
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

// Check if Route Matrix API is available
const isRouteMatrixAvailable = (google: typeof window.google): boolean => {
  try {
    return !!(google && google.maps && (google.maps as any).routes && (google.maps as any).routes.RouteMatrix);
  } catch {
    return false;
  }
};

// Get driving distance using Route Matrix API (replaces deprecated Distance Matrix)
export const getDrivingDistance = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const google = await loadGoogleMaps();
    if (!google) return null;
    
    // Check if Route Matrix API is available (using type assertion)
    if (isRouteMatrixAvailable(google)) {
      try {
        // New Route Matrix API with type assertion
        const routesAPI = (google.maps as any).routes;
        const routeMatrix = routesAPI.RouteMatrix;
        
        const request = {
          origins: [{ waypoint: { location: { latLng: origin } } }],
          destinations: [{ waypoint: { location: { latLng: destination } } }],
          travelMode: google.maps.TravelMode.DRIVING,
        };
        
        const response = await routeMatrix.computeRouteMatrix(request);
        
        if (response && response[0]) {
          const element = response[0];
          const distanceMeters = element.distanceMeters || 0;
          const durationSeconds = element.duration || 0;
          
          return {
            distance: distanceMeters / 1000, // Convert to kilometers
            duration: durationSeconds / 60, // Convert to minutes
          };
        }
      } catch (routeError) {
        console.warn('Route Matrix API error, falling back to Distance Matrix:', routeError);
      }
    }
    
    // Fallback to legacy Distance Matrix API
    return getDrivingDistanceLegacy(origin, destination);
  } catch (error) {
    console.error('Error in getDrivingDistance:', error);
    return null;
  }
};

// Legacy fallback (kept for backward compatibility)
export const getDrivingDistanceLegacy = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<{ distance: number; duration: number } | null> => {
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
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              resolve({
                distance: element.distance.value / 1000,
                duration: element.duration.value / 60,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    console.error('Legacy distance error:', error);
    return null;
  }
};

// Get driving distance from user coordinates to restaurant
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

// Check if delivery is available
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

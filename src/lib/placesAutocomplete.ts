import { loadGoogleMaps } from './googleMaps';

export interface AddressPrediction {
  id: string;
  description: string;
  mainText: string;
  secondaryText: string;
  place_id?: string;
}

export interface PlaceDetails {
  formattedAddress: string;
  coordinates: { lat: number; lng: number };
  location?: { lat: number; lng: number }; // Alias for coordinates
  addressComponents?: any[];
  street?: string;
  city?: string;
  postalCode?: string;
  streetNumber?: string;
  suburb?: string;
}

// Cape Town coordinates for bias
const CAPE_TOWN_COORDS = { lat: -33.9249, lng: 18.4241 };

/**
 * Search for addresses using Google Places API
 */
export async function searchAddressesModern(
  input: string, 
  sessionToken?: any, 
  locationBias?: { lat: number; lng: number }
): Promise<AddressPrediction[]> {
  if (!input || input.length < 2) return [];
  
  try {
    const google = await loadGoogleMaps();
    if (!google || !google.maps) {
      console.warn('Google Maps not loaded');
      return [];
    }
    
    const autocompleteService = new google.maps.places.AutocompleteService();
    
    // Prepare request with location bias
    const request: google.maps.places.AutocompletionRequest = {
      input,
      componentRestrictions: { country: 'za' },
      types: ['address'],
    };
    
    // Add location bias if provided
    if (locationBias) {
      request.locationBias = new google.maps.LatLng(locationBias.lat, locationBias.lng);
    } else {
      request.locationBias = new google.maps.LatLng(CAPE_TOWN_COORDS.lat, CAPE_TOWN_COORDS.lng);
    }
    
    // Add session token if provided (for billing purposes)
    if (sessionToken) {
      request.sessionToken = sessionToken;
    }
    
    return new Promise((resolve) => {
      autocompleteService.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            resolve([]);
            return;
          }
          
          const results: AddressPrediction[] = predictions.map(prediction => ({
            id: prediction.place_id,
            place_id: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting?.main_text || '',
            secondaryText: prediction.structured_formatting?.secondary_text || '',
          }));
          
          resolve(results);
        }
      );
    });
  } catch (error) {
    console.error('Error searching addresses:', error);
    return [];
  }
}

/**
 * Get place details for a selected address
 */
export async function getPlaceDetailsModern(placeId: string): Promise<PlaceDetails | null> {
  if (!placeId) return null;
  
  try {
    const google = await loadGoogleMaps();
    if (!google || !google.maps) {
      console.warn('Google Maps not loaded');
      return null;
    }
    
    // Create a temporary div for the places service
    const div = document.createElement('div');
    const placesService = new google.maps.places.PlacesService(div);
    
    return new Promise((resolve) => {
      placesService.getDetails(
        {
          placeId,
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
        },
        (place, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !place.geometry?.location) {
            resolve(null);
            return;
          }
          
          // Extract address components
          let street = '';
          let streetNumber = '';
          let city = '';
          let postalCode = '';
          let suburb = '';
          
          if (place.address_components) {
            for (const component of place.address_components) {
              const types = component.types;
              if (types.includes('route')) {
                street = component.long_name;
              }
              if (types.includes('street_number')) {
                streetNumber = component.long_name;
              }
              if (types.includes('locality')) {
                city = component.long_name;
              }
              if (types.includes('postal_code')) {
                postalCode = component.long_name;
              }
              if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                suburb = component.long_name;
              }
            }
          }
          
          // Build full street address
          const fullStreet = streetNumber ? `${streetNumber} ${street}` : street;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          const result: PlaceDetails = {
            formattedAddress: place.formatted_address || '',
            coordinates: { lat, lng },
            location: { lat, lng }, // Add location alias for component compatibility
            addressComponents: place.address_components,
            street: fullStreet,
            streetNumber,
            city: city || 'Cape Town',
            postalCode: postalCode || '',
            suburb,
          };
          
          resolve(result);
        }
      );
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
}

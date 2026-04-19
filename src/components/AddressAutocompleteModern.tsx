'use client';

import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps } from '@/lib/googleMaps';
import { searchAddressesModern, getPlaceDetailsModern } from '@/lib/placesAutocomplete';
import { FaMapMarkerAlt, FaSpinner, FaCrosshairs } from 'react-icons/fa';

const CAPE_TOWN_COORDS = { lat: -33.9249, lng: 18.4241 };

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    street: string;
    city: string;
    postalCode: string;
    formattedAddress: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function AddressAutocompleteModern({
  onAddressSelect,
  placeholder = "Enter your Cape Town address",
  className = "",
  initialValue = "",
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const sessionTokenRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Maps and session token
  useEffect(() => {
    const init = async () => {
      try {
        await loadGoogleMaps();
        // Create a new session token for the new API
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load address search. Please refresh the page.');
      }
    };
    
    init();
  }, []);

  // Search using modern API
  const searchAddresses = async (query: string) => {
    if (!query.trim() || !isReady) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchAddressesModern(query, sessionTokenRef.current, CAPE_TOWN_COORDS);
      setSuggestions(results);
      
      // Reset session token for next search (good practice for billing)
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    } catch (err) {
      console.error('Address search error:', err);
      setError('Failed to search addresses. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced handler
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };

  // Handle selection using modern API
  const handleSelectSuggestion = async (suggestion: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const placeDetails = await getPlaceDetailsModern(suggestion.placeId);
      
      const selectedAddress = {
        street: placeDetails.street,
        city: placeDetails.city || "Cape Town",
        postalCode: placeDetails.postalCode,
        formattedAddress: placeDetails.formattedAddress,
        coordinates: placeDetails.location,
      };
      
      setInputValue(selectedAddress.formattedAddress);
      setSuggestions([]);
      onAddressSelect(selectedAddress);
      
      // Create fresh session token for next search
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Failed to get address details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location with reverse geocoding
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { lat, lng } = position.coords;
          
          // Use modern Place class for reverse geocoding
          const { Place } = await google.maps.importLibrary("places") as any;
          
          const place = new Place({
            location: { lat, lng },
            requestedLanguage: "en",
          });
          
          await place.fetchFields({
            fields: ["formattedAddress", "addressComponents"],
          });
          
          let street = "";
          let city = "";
          let postalCode = "";
          
          if (place.addressComponents) {
            for (const component of place.addressComponents) {
              const types = component.types;
              if (types.includes("route") || types.includes("street_address")) {
                street = component.longText;
              }
              if (types.includes("locality")) {
                city = component.longText;
              }
              if (types.includes("postal_code")) {
                postalCode = component.longText;
              }
            }
          }
          
          onAddressSelect({
            street: street || "Current Location",
            city: city || "Cape Town",
            postalCode: postalCode || "",
            formattedAddress: place.formattedAddress || "Current Location",
            coordinates: { lat, lng },
          });
          
          setInputValue(place.formattedAddress || "Current Location");
          setSuggestions([]);
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setError("Could not get address for your location");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        let errorMessage = "Could not get your location. ";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage += "Please enable location access.";
        }
        setError(errorMessage);
        setIsLocating(false);
      }
    );
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={!isReady}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating || !isReady}
            className="p-2 text-gray-500 hover:text-green-600 disabled:opacity-50"
            title="Use my current location"
          >
            {isLocating ? <FaSpinner className="animate-spin" /> : <FaCrosshairs />}
          </button>
          
          {isLoading && <FaSpinner className="animate-spin text-gray-400" />}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
      
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.placeId}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-start gap-3"
            >
              <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-800">{suggestion.mainText}</div>
                <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {!isReady && (
        <div className="mt-2 text-sm text-gray-500">Loading address search...</div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
}

export default function AddressAutocompleteModern({ onAddressSelect, placeholder }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const sessionTokenRef = useRef<any>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize session token
  useEffect(() => {
    const initGoogleMaps = async () => {
      const google = await loadGoogleMaps();
      if (google && google.maps && !sessionTokenRef.current) {
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }
    };
    initGoogleMaps();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search for addresses
  const searchAddresses = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchAddressesModern(query, sessionTokenRef.current, CAPE_TOWN_COORDS);
      setSuggestions(results);
      setShowSuggestions(true);
      
      // Reset session token for next search
      const google = await loadGoogleMaps();
      if (google && google.maps) {
        sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      }
    } catch (error) {
      console.error('Error searching addresses:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (suggestion: any) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);
    
    try {
      const placeDetails = await getPlaceDetailsModern(suggestion.id);
      if (placeDetails) {
        onAddressSelect({
          street: placeDetails.street || '',
          city: placeDetails.city || 'Cape Town',
          postalCode: placeDetails.postalCode || '',
          formattedAddress: placeDetails.formattedAddress,
          coordinates: placeDetails.coordinates,
        });
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          const google = await loadGoogleMaps();
          if (google && google.maps) {
            const { Place } = await google.maps.importLibrary('places') as any;
            const place = new Place({ id: null, location: new google.maps.LatLng(lat, lng) });
            await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'addressComponents'] });
            
            if (place.formattedAddress) {
              setInputValue(place.formattedAddress);
              onAddressSelect({
                street: place.formattedAddress,
                city: 'Cape Town',
                postalCode: '',
                formattedAddress: place.formattedAddress,
                coordinates: { lat, lng },
              });
            }
          }
        } catch (error) {
          console.error('Error getting location details:', error);
          alert('Could not get address for your location');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please check your permissions.');
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder || "Enter your delivery address"}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <FaSpinner className="animate-spin text-gray-400" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          title="Use current location"
        >
          <FaCrosshairs className={isGettingLocation ? "animate-spin" : ""} />
        </button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm"
            >
              <div className="font-medium">{suggestion.mainText}</div>
              <div className="text-xs text-gray-500">{suggestion.secondaryText}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

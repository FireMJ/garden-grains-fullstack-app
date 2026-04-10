'use client';

import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps, geocodeAddress } from '@/lib/googleMaps';
import { FaMapMarkerAlt, FaSpinner, FaCrosshairs, FaSearch } from 'react-icons/fa';

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

export default function AddressAutocomplete({ 
  onAddressSelect, 
  placeholder = "Enter your address in Cape Town", 
  className = "",
  initialValue = ""
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Array<{ description: string; placeId: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps services
  useEffect(() => {
    const initServices = async () => {
      const google = await loadGoogleMaps();
      if (google) {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        geocoderRef.current = new google.maps.Geocoder();
      }
    };
    initServices();
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

  // Fetch address suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 3 || !autocompleteServiceRef.current) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        autocompleteServiceRef.current.getPlacePredictions(
          { 
            input: inputValue, 
            componentRestrictions: { country: 'za' },
            types: ['address']
          },
          (predictions: any[], status: string) => {
            if (status === 'OK' && predictions) {
              setSuggestions(predictions.map(p => ({
                description: p.description,
                placeId: p.place_id,
              })));
            } else {
              setSuggestions([]);
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setInputValue("Getting your location...");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      setInputValue("");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          if (geocoderRef.current) {
            const latLng = { lat: latitude, lng: longitude };
            // Don't use componentRestrictions with location-based geocoding
            geocoderRef.current.geocode(
              { location: latLng },
              (results: any[], status: string) => {
                if (status === 'OK' && results && results[0]) {
                  const address = results[0];
                  const formattedAddress = address.formatted_address;
                  
                  setInputValue(formattedAddress);
                  
                  // Extract address components
                  let street = '';
                  let city = '';
                  let postalCode = '';
                  
                  address.address_components.forEach((component: any) => {
                    if (component.types.includes('street_number')) {
                      street = component.long_name + ' ' + street;
                    }
                    if (component.types.includes('route')) {
                      street = street + component.long_name;
                    }
                    if (component.types.includes('locality')) {
                      city = component.long_name;
                    }
                    if (component.types.includes('postal_code')) {
                      postalCode = component.long_name;
                    }
                  });
                  
                  onAddressSelect({
                    street: street.trim(),
                    city: city,
                    postalCode: postalCode,
                    formattedAddress: formattedAddress,
                    coordinates: { lat: latitude, lng: longitude },
                  });
                } else {
                  setLocationError("Could not get address from your location");
                }
                setIsGettingLocation(false);
              }
            );
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          setLocationError("Could not get address from location");
          setIsGettingLocation(false);
          setInputValue("");
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to use this feature";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        setInputValue("");
        setTimeout(() => setLocationError(null), 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSelectSuggestion = async (suggestion: { description: string; placeId: string }) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      if (geocoderRef.current) {
        // Use placeId only, without componentRestrictions
        geocoderRef.current.geocode(
          { placeId: suggestion.placeId },
          (results: any[], status: string) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              const address = results[0];
              
              let street = '';
              let city = '';
              let postalCode = '';
              
              address.address_components.forEach((component: any) => {
                if (component.types.includes('street_number')) {
                  street = component.long_name + ' ' + street;
                }
                if (component.types.includes('route')) {
                  street = street + component.long_name;
                }
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
              });
              
              onAddressSelect({
                street: street.trim() || suggestion.description.split(',')[0],
                city: city,
                postalCode: postalCode,
                formattedAddress: suggestion.description,
                coordinates: {
                  lat: location.lat(),
                  lng: location.lng(),
                },
              });
            }
            setIsLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      setIsLoading(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setLocationError(null);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
          />
          {(isLoading || isGettingLocation) && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
          )}
        </div>
        
        {/* My Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          title="Use my current location"
        >
          <FaCrosshairs className="w-4 h-4 text-green-600" />
          <span className="hidden sm:inline text-sm">My Location</span>
        </button>
      </div>
      
      {/* Error Message */}
      {locationError && (
        <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg">
          {locationError}
        </div>
      )}
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm border-b last:border-b-0 flex items-start gap-2"
            >
              <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-1">
        Enter a Cape Town address (e.g., "1 Long Street, Cape Town")
      </p>
    </div>
  );
}

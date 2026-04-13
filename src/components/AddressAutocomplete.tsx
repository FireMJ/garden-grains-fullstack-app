'use client';

import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps } from '@/lib/googleMaps';
import { getCurrentLocation as getCurrentLocationService } from '@/lib/locationService';
import { FaMapMarkerAlt, FaSpinner, FaCrosshairs, FaSearch, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

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
  const [locationStatus, setLocationStatus] = useState<'idle' | 'acquiring' | 'success' | 'error'>('idle');
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
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

  // Get current location with high accuracy GPS
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setLocationStatus('acquiring');
    setLocationAccuracy(null);
    setInputValue("Acquiring GPS signal...");

    const result = await getCurrentLocationService();
    
    if (result.success && result.coordinates) {
      setLocationStatus('success');
      setLocationAccuracy(result.accuracy || null);
      
      // Format the display address
      let displayAddress = result.address || `${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)}`;
      setInputValue(displayAddress);
      
      // Extract address components
      let street = '';
      let city = '';
      let postalCode = '';
      let formattedAddress = displayAddress;
      
      if (result.address && geocoderRef.current) {
        geocoderRef.current.geocode(
          { location: result.coordinates },
          (results: any[], status: string) => {
            if (status === 'OK' && results && results[0]) {
              const address = results[0];
              formattedAddress = address.formatted_address;
              
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
            }
            
            onAddressSelect({
              street: street.trim() || displayAddress.split(',')[0],
              city: city,
              postalCode: postalCode,
              formattedAddress: formattedAddress,
              coordinates: result.coordinates!,
            });
          }
        );
      } else {
        onAddressSelect({
          street: displayAddress.split(',')[0],
          city: '',
          postalCode: '',
          formattedAddress: displayAddress,
          coordinates: result.coordinates,
        });
      }
      
      // Clear success status after 3 seconds
      setTimeout(() => setLocationStatus('idle'), 3000);
    } else {
      setLocationStatus('error');
      setLocationError(result.error || "Could not get your location");
      setInputValue("");
      setTimeout(() => {
        setLocationStatus('idle');
        setLocationError(null);
      }, 5000);
    }
    
    setIsGettingLocation(false);
  };

  const handleSelectSuggestion = async (suggestion: { description: string; placeId: string }) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      if (geocoderRef.current) {
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

  const getLocationButtonContent = () => {
    if (locationStatus === 'acquiring') {
      return (
        <>
          <FaSpinner className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline text-sm">Acquiring GPS...</span>
        </>
      );
    }
    if (locationStatus === 'success') {
      return (
        <>
          <FaCheckCircle className="w-4 h-4 text-green-600" />
          <span className="hidden sm:inline text-sm">GPS Located!</span>
        </>
      );
    }
    if (locationStatus === 'error') {
      return (
        <>
          <FaExclamationTriangle className="w-4 h-4 text-red-600" />
          <span className="hidden sm:inline text-sm">Retry</span>
        </>
      );
    }
    return (
      <>
        <FaCrosshairs className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">My Location</span>
      </>
    );
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
              setLocationStatus('idle');
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
          />
          {(isLoading || isGettingLocation) && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
          )}
        </div>
        
        {/* My Location Button with Enhanced UI */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className={`px-4 py-3 rounded-lg transition flex items-center gap-2 disabled:opacity-50 whitespace-nowrap ${
            locationStatus === 'success' 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : locationStatus === 'error'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Use my current GPS location for accurate delivery address"
        >
          {getLocationButtonContent()}
        </button>
      </div>
      
      {/* Error Message with Helpful Text */}
      {locationError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">Location Error</p>
          <p className="text-red-600 text-xs mt-1">{locationError}</p>
          <p className="text-red-500 text-xs mt-2">
            💡 Tip: For best accuracy, enable GPS and ensure you're in an open area
          </p>
        </div>
      )}
      
      {/* Success Feedback with Accuracy */}
      {locationStatus === 'success' && !locationError && locationAccuracy && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs flex items-center gap-2">
          <FaCheckCircle className="w-3 h-3" />
          <span>GPS acquired! Accuracy: {locationAccuracy.toFixed(0)} meters</span>
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
      
      {/* Help Text */}
      <p className="text-xs text-gray-400 mt-1">
        📍 Use "My Location" for GPS-accurate positioning (best in open areas)
      </p>
    </div>
  );
}

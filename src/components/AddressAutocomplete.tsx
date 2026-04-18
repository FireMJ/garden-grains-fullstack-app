'use client';

import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps, getAddressSuggestions, geocodeAddress } from '@/lib/googleMaps';
import { getCurrentLocation, getCapeTownLocation } from '@/lib/locationService';
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
  placeholder = "Enter your Cape Town address", 
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('📍 AddressAutocomplete mounted');
    loadGoogleMaps().then(() => {
      console.log('✅ Google Maps API ready');
    }).catch(err => {
      console.error('❌ Google Maps API failed:', err);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(async () => {
      if (inputValue.length >= 3) {
        setIsLoading(true);
        console.log(`🔍 Fetching suggestions for: "${inputValue}"`);
        try {
          const results = await getAddressSuggestions(inputValue);
          console.log(`📋 Got ${results.length} suggestions`);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('❌ Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [inputValue]);

  const handleGetCurrentLocation = async () => {
    console.log('📍 Getting current location...');
    setIsGettingLocation(true);
    setLocationError(null);
    setLocationStatus('acquiring');
    setLocationAccuracy(null);
    setInputValue("Acquiring GPS signal...");

    const result = await getCurrentLocation();
    console.log('📍 Location result:', result);
    
    if (result.success && result.coordinates) {
      setLocationStatus('success');
      setLocationAccuracy(result.accuracy || null);
      
      let displayAddress = result.address || `${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)}`;
      setInputValue(displayAddress);
      
      let street = '';
      let city = '';
      let postalCode = '';
      let formattedAddress = displayAddress;
      
      if (result.address) {
        formattedAddress = result.address;
        const parts = result.address.split(',');
        if (parts.length >= 2) {
          street = parts[0].trim();
          city = parts[1].trim();
        }
      }
      
      onAddressSelect({
        street: street || displayAddress.split(',')[0],
        city: city,
        postalCode: postalCode,
        formattedAddress: formattedAddress,
        coordinates: result.coordinates,
      });
      
      setTimeout(() => setLocationStatus('idle'), 3000);
    } else {
      const capeTown = getCapeTownLocation();
      setLocationStatus('success');
      setInputValue(capeTown.address || "Cape Town, South Africa");
      onAddressSelect({
        street: "Cape Town City Centre",
        city: "Cape Town",
        postalCode: "8000",
        formattedAddress: capeTown.address || "Cape Town, South Africa",
        coordinates: capeTown.coordinates,
      });
      setLocationError(result.error || "Using Cape Town as default location");
      setTimeout(() => {
        setLocationStatus('idle');
        setLocationError(null);
      }, 3000);
    }
    
    setIsGettingLocation(false);
  };

  const handleSelectSuggestion = async (suggestion: { description: string; placeId: string }) => {
    console.log(`📍 Selected: ${suggestion.description}`);
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const coords = await geocodeAddress(suggestion.description);
      if (coords) {
        console.log(`📍 Geocoded:`, coords);
        const parts = suggestion.description.split(',');
        const street = parts[0]?.trim() || '';
        const city = parts[1]?.trim() || '';
        const postalCode = parts[2]?.trim() || '';
        
        onAddressSelect({
          street: street,
          city: city,
          postalCode: postalCode,
          formattedAddress: suggestion.description,
          coordinates: coords,
        });
      } else {
        console.error('❌ Could not geocode address');
      }
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationButtonContent = () => {
    if (locationStatus === 'acquiring') {
      return <><FaSpinner className="w-4 h-4 animate-spin" /><span className="hidden sm:inline text-sm">Acquiring GPS...</span></>;
    }
    if (locationStatus === 'success') {
      return <><FaCheckCircle className="w-4 h-4 text-green-600" /><span className="hidden sm:inline text-sm">Location Set</span></>;
    }
    if (locationStatus === 'error') {
      return <><FaExclamationTriangle className="w-4 h-4 text-red-600" /><span className="hidden sm:inline text-sm">Retry</span></>;
    }
    return <><FaCrosshairs className="w-4 h-4" /><span className="hidden sm:inline text-sm">My Location</span></>;
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
              setLocationError(null);
              setLocationStatus('idle');
            }}
            onFocus={() => {
              if (inputValue.length >= 3 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={placeholder}
            className={`w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
          />
          {(isLoading || isGettingLocation) && (
            <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin" />
          )}
        </div>
        
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
          title="Use my current location"
        >
          {getLocationButtonContent()}
        </button>
      </div>
      
      {locationError && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-xs">{locationError}</p>
        </div>
      )}
      
      {locationStatus === 'success' && !locationError && locationAccuracy && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs flex items-center gap-2">
          <FaCheckCircle className="w-3 h-3" />
          <span>Location acquired! Accuracy: {locationAccuracy.toFixed(0)} meters</span>
        </div>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
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
        💡 Type your Cape Town address or click "My Location" for GPS
      </p>
    </div>
  );
}

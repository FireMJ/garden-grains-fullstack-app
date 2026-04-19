'use client';

import { useState, useEffect, useRef } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('📍 AddressAutocomplete mounted');
  }, []);

  // Fetch address suggestions using server-side proxy (bypasses CORS)
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(async () => {
      if (inputValue.length >= 3) {
        setIsLoading(true);
        console.log(`🔍 Fetching suggestions for: "${inputValue}"`);
        try {
          const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(inputValue)}`);
          const data = await response.json();
          
          console.log('📋 API Response:', data.status);
          
          if (data.status === 'OK' && data.predictions && data.predictions.length > 0) {
            setSuggestions(data.predictions.map((p: any) => ({
              description: p.description,
              placeId: p.place_id,
            })));
            setShowSuggestions(true);
          } else if (data.status === 'ZERO_RESULTS') {
            console.log('No results found');
            setSuggestions([]);
          } else {
            console.warn('API error:', data.status, data.error_message);
            setSuggestions([]);
          }
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
    }, 500);
    
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [inputValue]);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setLocationStatus('acquiring');
    setInputValue("Getting your location...");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      setInputValue("");
      return;
    }

    const timeoutId = setTimeout(() => {
      if (isGettingLocation) {
        console.log('GPS timeout, falling back to Cape Town');
        const capeTownCoords = { lat: -33.9249, lng: 18.4241 };
        const capeTownAddress = "Cape Town City Centre, Cape Town, South Africa";
        setInputValue(capeTownAddress);
        onAddressSelect({
          street: "Cape Town City Centre",
          city: "Cape Town",
          postalCode: "8000",
          formattedAddress: capeTownAddress,
          coordinates: capeTownCoords,
        });
        setLocationStatus('success');
        setIsGettingLocation(false);
        setTimeout(() => setLocationStatus('idle'), 3000);
      }
    }, 8000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        
        const isInSA = latitude < -22 && latitude > -35 && longitude > 16 && longitude < 33;
        
        if (!isInSA) {
          console.log('Location outside SA, using Cape Town');
          const capeTownCoords = { lat: -33.9249, lng: 18.4241 };
          const capeTownAddress = "Cape Town City Centre, Cape Town, South Africa";
          setInputValue(capeTownAddress);
          onAddressSelect({
            street: "Cape Town City Centre",
            city: "Cape Town",
            postalCode: "8000",
            formattedAddress: capeTownAddress,
            coordinates: capeTownCoords,
          });
          setLocationStatus('success');
          setIsGettingLocation(false);
          setTimeout(() => setLocationStatus('idle'), 3000);
          return;
        }
        
        try {
          const geocodeUrl = `/api/places/geocode?lat=${latitude}&lng=${longitude}`;
          const response = await fetch(geocodeUrl);
          const data = await response.json();
          
          if (data.status === 'OK' && data.results && data.results[0]) {
            const address = data.results[0];
            const formattedAddress = address.formatted_address;
            setInputValue(formattedAddress);
            
            let street = '';
            let city = '';
            let postalCode = '';
            
            address.address_components?.forEach((component: any) => {
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
              street: street.trim() || formattedAddress.split(',')[0],
              city: city,
              postalCode: postalCode,
              formattedAddress: formattedAddress,
              coordinates: { lat: latitude, lng: longitude },
            });
            setLocationStatus('success');
          } else {
            throw new Error('Geocoding failed');
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          onAddressSelect({
            street: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: '',
            postalCode: '',
            formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coordinates: { lat: latitude, lng: longitude },
          });
        } finally {
          setIsGettingLocation(false);
          setTimeout(() => setLocationStatus('idle'), 3000);
        }
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', error);
        const capeTownCoords = { lat: -33.9249, lng: 18.4241 };
        const capeTownAddress = "Cape Town City Centre, Cape Town, South Africa";
        setInputValue(capeTownAddress);
        onAddressSelect({
          street: "Cape Town City Centre",
          city: "Cape Town",
          postalCode: "8000",
          formattedAddress: capeTownAddress,
          coordinates: capeTownCoords,
        });
        setLocationStatus('success');
        setIsGettingLocation(false);
        setTimeout(() => setLocationStatus('idle'), 3000);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleSelectSuggestion = async (suggestion: { description: string; placeId: string }) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/places/geocode?placeId=${suggestion.placeId}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        const address = data.results[0];
        
        let street = '';
        let city = '';
        let postalCode = '';
        
        address.address_components?.forEach((component: any) => {
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
            lat: location.lat,
            lng: location.lng,
          },
        });
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationButtonContent = () => {
    if (locationStatus === 'acquiring') {
      return <><FaSpinner className="w-4 h-4 animate-spin" /><span className="hidden sm:inline text-sm">Getting location...</span></>;
    }
    if (locationStatus === 'success') {
      return <><FaCheckCircle className="w-4 h-4 text-green-600" /><span className="hidden sm:inline text-sm">Location Set</span></>;
    }
    if (locationStatus === 'error') {
      return <><FaExclamationTriangle className="w-4 h-4 text-red-600" /><span className="hidden sm:inline text-sm">Use Cape Town</span></>;
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
          {isLoading && (
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
      
      {locationStatus === 'success' && !locationError && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs flex items-center gap-2">
          <FaCheckCircle className="w-3 h-3" />
          <span>Location acquired!</span>
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
        📍 Type your Cape Town address or click "My Location" (defaults to Cape Town)
      </p>
    </div>
  );
}

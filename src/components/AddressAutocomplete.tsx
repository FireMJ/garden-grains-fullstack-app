'use client';

import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps, getAddressSuggestions, getPlaceDetails, isWithinDeliveryRadius, RESTAURANT_COORDS } from '@/lib/googleMaps';
import { FaMapMarkerAlt, FaSpinner, FaCrosshairs, FaExclamationTriangle } from 'react-icons/fa';

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
  initialValue = "",
}: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Array<{ description: string; placeId: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadGoogleMaps().then(() => setIsReady(true)).catch(() => setError('Failed to load maps'));
  }, []);

  const searchAddresses = async (query: string) => {
    if (!query.trim() || !isReady) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getAddressSuggestions(query);
      setSuggestions(results);
      setError(null);
    } catch (err) {
      setError('Failed to search addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => searchAddresses(value), 300);
  };

  const handleSelectSuggestion = async (placeId: string, description: string) => {
    setIsLoading(true);
    try {
      const details = await getPlaceDetails(placeId);
      if (!details) throw new Error('No details');
      
      const { lat, lng } = details.location;
      
      // Check if within 50km delivery radius
      if (!isWithinDeliveryRadius(lat, lng)) {
        const distance = Math.sqrt(Math.pow(lat - RESTAURANT_COORDS.lat, 2) + Math.pow(lng - RESTAURANT_COORDS.lng, 2)) * 111;
        setError(`"${description.split(',')[0]}" is approximately ${distance.toFixed(0)}km from our restaurant. Maximum delivery distance is 50km.`);
        setIsLoading(false);
        return;
      }
      
      // Extract address components
      let street = "", city = "", postalCode = "";
      if (details.addressComponents) {
        for (const comp of details.addressComponents) {
          if (comp.types.includes("route") || comp.types.includes("street_address")) street = comp.longText;
          if (comp.types.includes("locality")) city = comp.longText;
          if (comp.types.includes("postal_code")) postalCode = comp.longText;
        }
      }
      
      const parts = description.split(',');
      const selected = {
        street: street || parts[0] || "",
        city: city || (parts[1]?.trim() || "Cape Town"),
        postalCode: postalCode || "",
        formattedAddress: details.formattedAddress || description,
        coordinates: { lat, lng },
      };
      
      setInputValue(selected.formattedAddress);
      setSuggestions([]);
      onAddressSelect(selected);
    } catch (err) {
      setError('Failed to get address details');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        
        // Check if within 50km delivery radius
        if (!isWithinDeliveryRadius(latitude, longitude)) {
          const distance = Math.sqrt(Math.pow(latitude - RESTAURANT_COORDS.lat, 2) + Math.pow(longitude - RESTAURANT_COORDS.lng, 2)) * 111;
          setError(`Your location is approximately ${distance.toFixed(0)}km from our restaurant. Maximum delivery distance is 50km.`);
          setIsLocating(false);
          return;
        }
        
        const google = await loadGoogleMaps();
        if (google) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            if (status === 'OK' && results?.[0]) {
              let street = "", city = "", postalCode = "";
              for (const comp of results[0].address_components) {
                if (comp.types.includes("route") || comp.types.includes("street_address")) street = comp.long_name;
                if (comp.types.includes("locality")) city = comp.long_name;
                if (comp.types.includes("postal_code")) postalCode = comp.long_name;
              }
              
              onAddressSelect({
                street: street || "Current Location",
                city: city || "Cape Town",
                postalCode: postalCode || "",
                formattedAddress: results[0].formatted_address,
                coordinates: { lat: latitude, lng: longitude },
              });
              setInputValue(results[0].formatted_address);
            }
            setIsLocating(false);
          });
        }
      },
      () => setError("Could not get your location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent"
          disabled={!isReady}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating || !isReady}
            className="p-2 text-gray-500 hover:text-[#2F5D50] disabled:opacity-50"
            title="Use my location"
          >
            {isLocating ? <FaSpinner className="animate-spin" /> : <FaCrosshairs />}
          </button>
          {isLoading && <FaSpinner className="animate-spin text-gray-400" size={20} />}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <FaExclamationTriangle className="text-red-500" />
          <span>{error}</span>
        </div>
      )}
      
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s) => (
            <li
              key={s.placeId}
              onClick={() => handleSelectSuggestion(s.placeId, s.description)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex gap-3"
            >
              <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium">{s.description.split(',')[0]}</div>
                <div className="text-sm text-gray-500">{s.description.split(',').slice(1).join(',').trim()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

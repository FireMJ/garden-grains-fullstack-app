import { useState, useCallback } from 'react';
import { 
  getDrivingDistanceFromCoords, 
  loadGoogleMaps, 
  isDeliveryAvailable, 
  calculateDeliveryFee,
  DELIVERY_CONFIG 
} from '@/lib/googleMaps';
import { geocodeAddress } from '@/lib/googleMaps';

export interface DeliveryInfo {
  distance: number | null;
  duration: number | null;
  fee: number;
  isAvailable: boolean;
  address?: string;
  coordinates?: { lat: number; lng: number };
  reason?: string;
}

interface UseDeliveryCalculationReturn {
  deliveryInfo: DeliveryInfo | null;
  calculateFromAddress: (address: string) => Promise<void>;
  calculateFromCoordinates: (lat: number, lng: number, address?: string) => Promise<void>;
  resetDeliveryInfo: () => void;
  isLoading: boolean;
  error: string | null;
}

export const useDeliveryCalculation = (): UseDeliveryCalculationReturn => {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateFromAddress = async (address: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const coordinates = await geocodeAddress(address);
      
      if (!coordinates) {
        throw new Error('Could not find coordinates for this address. Please check the address and try again.');
      }
      
      await calculateFromCoordinates(coordinates.lat, coordinates.lng, address);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate delivery';
      setError(errorMessage);
      setDeliveryInfo({
        distance: null,
        duration: null,
        fee: 0,
        isAvailable: false,
        reason: errorMessage,
      });
      setIsLoading(false);
    }
  };

  const calculateFromCoordinates = async (lat: number, lng: number, address?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadGoogleMaps();
      
      const availability = await isDeliveryAvailable(lat, lng, DELIVERY_CONFIG.MAX_DISTANCE_KM);
      
      if (!availability.available) {
        const errorReason = availability.reason || 
          `Delivery not available to this location. Maximum delivery distance is ${DELIVERY_CONFIG.MAX_DISTANCE_KM}km.`;
        
        setError(errorReason);
        setDeliveryInfo({
          distance: availability.distance || null,
          duration: availability.duration || null,
          fee: 0,
          isAvailable: false,
          coordinates: { lat, lng },
          address,
          reason: errorReason,
        });
        setIsLoading(false);
        return;
      }
      
      const fee = calculateDeliveryFee(availability.distance || 0);
      
      setDeliveryInfo({
        distance: availability.distance,
        duration: availability.duration,
        fee: fee,
        isAvailable: true,
        coordinates: { lat, lng },
        address,
      });
      
    } catch (err) {
      console.error('Error calculating delivery:', err);
      const errorMessage = 'Failed to calculate delivery. Please ensure Routes API is enabled in Google Cloud Console.';
      setError(errorMessage);
      setDeliveryInfo({
        distance: null,
        duration: null,
        fee: 0,
        isAvailable: false,
        reason: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDeliveryInfo = () => {
    setDeliveryInfo(null);
    setError(null);
  };

  return {
    deliveryInfo,
    calculateFromAddress,
    calculateFromCoordinates,
    resetDeliveryInfo,
    isLoading,
    error,
  };
};

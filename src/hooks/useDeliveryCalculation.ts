import { useState, useCallback } from 'react';
import { getDrivingDistanceFromCoords, loadGoogleMaps, isDeliveryAvailable, geocodeAddress } from '@/lib/googleMaps';

const BASE_DELIVERY_FEE = 35; // R35 for first 5km
const BASE_DISTANCE_KM = 5; // 5km base
const EXTRA_KM_RATE = 5; // R5 per additional km
const MAX_DELIVERY_DISTANCE = 15; // 15km max

export interface DeliveryInfo {
  distance: number | null;
  duration: number | null;
  fee: number;
  isAvailable: boolean;
  address?: string;
  coordinates?: { lat: number; lng: number };
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
        throw new Error('Could not find coordinates for this address');
      }
      
      await calculateFromCoordinates(coordinates.lat, coordinates.lng, address);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate delivery');
      setIsLoading(false);
    }
  };

  const calculateFromCoordinates = async (lat: number, lng: number, address?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await loadGoogleMaps();
      
      // Check if delivery is available
      const availability = await isDeliveryAvailable(lat, lng, MAX_DELIVERY_DISTANCE);
      
      if (!availability.available) {
        setDeliveryInfo({
          distance: availability.distance || null,
          duration: availability.duration || null,
          fee: 0,
          isAvailable: false,
          coordinates: { lat, lng },
          address,
        });
        setError('Delivery not available to this location. Please consider pickup.');
        setIsLoading(false);
        return;
      }
      
      // Calculate delivery fee based on distance
      const distance = availability.distance || 0;
      let fee = BASE_DELIVERY_FEE;
      
      if (distance > BASE_DISTANCE_KM) {
        const extraKm = Math.ceil(distance - BASE_DISTANCE_KM);
        fee += extraKm * EXTRA_KM_RATE;
      }
      
      setDeliveryInfo({
        distance: distance,
        duration: availability.duration || null,
        fee: fee,
        isAvailable: true,
        coordinates: { lat, lng },
        address,
      });
      
    } catch (err) {
      console.error('Error calculating delivery:', err);
      setError('Failed to calculate delivery. Please try again.');
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

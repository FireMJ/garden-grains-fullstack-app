import { useState, useCallback } from 'react';
import { getDrivingDistance, getDrivingDistanceFromCoords, DistanceResult } from '@/lib/googleMaps';

const BASE_DELIVERY_FEE = 35; // R35 for first 5km
const BASE_DISTANCE_KM = 5; // 5km base
const EXTRA_RATE_PER_KM = 5; // R5 per additional km
const FREE_DELIVERY_THRESHOLD = 850; // R850 for free delivery

export interface DeliveryInfo {
  distanceKm: number | null;
  distanceText: string;
  durationText: string;
  deliveryFee: number;
  isFreeDelivery: boolean;
  addressValid: boolean;
  error: string | null;
  isLoading: boolean;
}

export function useDeliveryCalculation() {
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    distanceKm: null,
    distanceText: '',
    durationText: '',
    deliveryFee: 0,
    isFreeDelivery: false,
    addressValid: false,
    error: null,
    isLoading: false
  });

  const calculateDeliveryFee = useCallback((distanceKm: number): number => {
    if (distanceKm <= BASE_DISTANCE_KM) {
      return BASE_DELIVERY_FEE;
    } else {
      const extraDistance = distanceKm - BASE_DISTANCE_KM;
      // Round up to nearest km for billing
      const extraKmBilled = Math.ceil(extraDistance);
      return BASE_DELIVERY_FEE + (extraKmBilled * EXTRA_RATE_PER_KM);
    }
  }, []);

  const calculateFromAddress = useCallback(async (address: string, subtotal: number) => {
    if (!address || address.length < 10) {
      setDeliveryInfo(prev => ({
        ...prev,
        addressValid: false,
        error: 'Please enter a valid address',
        isLoading: false
      }));
      return;
    }

    setDeliveryInfo(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getDrivingDistance(address);
      
      if (result && result.distance) {
        // Convert meters to kilometers
        const distanceKm = result.distance.value / 1000;
        const deliveryFee = calculateDeliveryFee(distanceKm);
        const isFree = subtotal >= FREE_DELIVERY_THRESHOLD;
        
        setDeliveryInfo({
          distanceKm,
          distanceText: result.distance.text,
          durationText: result.duration.text,
          deliveryFee: isFree ? 0 : deliveryFee,
          isFreeDelivery: isFree,
          addressValid: true,
          error: null,
          isLoading: false
        });
      } else {
        setDeliveryInfo({
          distanceKm: null,
          distanceText: '',
          durationText: '',
          deliveryFee: 0,
          isFreeDelivery: false,
          addressValid: false,
          error: 'Could not calculate distance for this address. Please check and try again.',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error calculating delivery:', error);
      setDeliveryInfo(prev => ({
        ...prev,
        distanceKm: null,
        addressValid: false,
        error: 'Error calculating delivery distance. Please try again.',
        isLoading: false
      }));
    }
  }, [calculateDeliveryFee]);

  const calculateFromCoordinates = useCallback(async (
    coords: { lat: number; lng: number },
    subtotal: number
  ) => {
    setDeliveryInfo(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await getDrivingDistanceFromCoords(coords);
      
      if (result && result.distance) {
        const distanceKm = result.distance.value / 1000;
        const deliveryFee = calculateDeliveryFee(distanceKm);
        const isFree = subtotal >= FREE_DELIVERY_THRESHOLD;
        
        setDeliveryInfo({
          distanceKm,
          distanceText: result.distance.text,
          durationText: result.duration.text,
          deliveryFee: isFree ? 0 : deliveryFee,
          isFreeDelivery: isFree,
          addressValid: true,
          error: null,
          isLoading: false
        });
      } else {
        setDeliveryInfo({
          distanceKm: null,
          distanceText: '',
          durationText: '',
          deliveryFee: 0,
          isFreeDelivery: false,
          addressValid: false,
          error: 'Could not calculate distance for this location.',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error calculating delivery from coordinates:', error);
      setDeliveryInfo(prev => ({
        ...prev,
        error: 'Error calculating delivery distance.',
        isLoading: false
      }));
    }
  }, [calculateDeliveryFee]);

  const resetDeliveryInfo = useCallback(() => {
    setDeliveryInfo({
      distanceKm: null,
      distanceText: '',
      durationText: '',
      deliveryFee: 0,
      isFreeDelivery: false,
      addressValid: false,
      error: null,
      isLoading: false
    });
  }, []);

  return {
    deliveryInfo,
    calculateFromAddress,
    calculateFromCoordinates,
    resetDeliveryInfo
  };
}

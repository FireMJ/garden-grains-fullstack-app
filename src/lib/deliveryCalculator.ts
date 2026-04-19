import { DELIVERY_CONFIG } from './googleMaps';

export const calculateCustomerDeliveryFee = (distanceKm: number, subtotal: number = 0): number => {
  if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
  if (distanceKm <= DELIVERY_CONFIG.BASE_DISTANCE_KM) return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
  const extraKm = Math.ceil(distanceKm - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  return DELIVERY_CONFIG.BASE_DELIVERY_FEE + (extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE);
};

export const calculateDriverPayment = (distanceKm: number): number => {
  const basePayment = 25;
  const perKmRate = 5;
  return basePayment + (distanceKm * perKmRate);
};

export const DELIVERY_CONFIG_EXPORT = DELIVERY_CONFIG;

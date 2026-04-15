'use client';

// Delivery configuration
export const DELIVERY_CONFIG = {
  MAX_DISTANCE_KM: 50,
  BASE_DELIVERY_FEE: 35,
  BASE_DISTANCE_KM: 5,
  EXTRA_KM_RATE: 2.75,
  FREE_DELIVERY_THRESHOLD: 850,
};

/**
 * Calculate the actual delivery fee (what the customer pays)
 * This can be R0 if order qualifies for free delivery
 */
export const calculateCustomerDeliveryFee = (distanceKm: number, subtotal: number = 0): number => {
  // Customer pays nothing if order meets free delivery threshold
  if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) {
    return 0;
  }
  
  // Otherwise calculate based on distance
  return calculateBaseDeliveryFee(distanceKm);
};

/**
 * Calculate the driver's payment (always based on distance, regardless of free delivery)
 * Drivers should always be compensated for their travel
 */
export const calculateDriverPayment = (distanceKm: number): number => {
  return calculateBaseDeliveryFee(distanceKm);
};

/**
 * Calculate the base delivery fee based purely on distance
 * This is what the driver earns and what customer pays when no free delivery
 */
export const calculateBaseDeliveryFee = (distanceKm: number): number => {
  if (distanceKm <= DELIVERY_CONFIG.BASE_DISTANCE_KM) {
    return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
  }
  
  const extraKm = Math.ceil(distanceKm - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  const extraFee = extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE;
  
  return DELIVERY_CONFIG.BASE_DELIVERY_FEE + extraFee;
};

/**
 * Get detailed breakdown for display
 */
export const getDeliveryBreakdown = (distanceKm: number, subtotal: number = 0) => {
  const baseFee = calculateBaseDeliveryFee(distanceKm);
  const customerFee = calculateCustomerDeliveryFee(distanceKm, subtotal);
  const driverPayment = calculateDriverPayment(distanceKm);
  const isFreeDelivery = subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD;
  const amountNeededForFree = Math.max(0, DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal);
  
  return {
    baseFee,
    customerFee,
    driverPayment,
    isFreeDelivery,
    amountNeededForFree,
    distanceKm,
  };
};

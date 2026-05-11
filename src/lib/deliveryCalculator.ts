export const DELIVERY_CONFIG = {
  BASE_DELIVERY_FEE: 35,
  FREE_DELIVERY_THRESHOLD: 850,
  BASE_DISTANCE_KM: 5,
  EXTRA_KM_RATE: 3,
  MAX_DISTANCE_KM: 60
};

export function calculateCustomerDeliveryFee(distance: number, subtotal: number): number {
  // Free delivery if subtotal reaches threshold
  if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
  
  // Check if distance exceeds maximum
  if (distance > DELIVERY_CONFIG.MAX_DISTANCE_KM) {
    return Infinity; // Cannot deliver
  }
  
  // Base fee for first 5km
  if (!distance || distance <= DELIVERY_CONFIG.BASE_DISTANCE_KM) {
    return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
  }
  
  // Additional fee for extra km beyond 5km
  const extraKm = Math.ceil(distance - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  const extraFee = extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE;
  
  return DELIVERY_CONFIG.BASE_DELIVERY_FEE + extraFee;
}

export function calculateDriverPayment(distance: number): number {
  // Base payment for first 5km
  const basePayment = 25;
  const extraKmPayment = 2;
  
  if (!distance || distance <= DELIVERY_CONFIG.BASE_DISTANCE_KM) {
    return basePayment;
  }
  
  const extraKm = Math.ceil(distance - DELIVERY_CONFIG.BASE_DISTANCE_KM);
  return basePayment + (extraKm * extraKmPayment);
}

export function isDeliveryAvailable(distance: number): boolean {
  return distance <= DELIVERY_CONFIG.MAX_DISTANCE_KM;
}

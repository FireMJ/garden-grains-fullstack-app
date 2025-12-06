/**
 * Currency formatting utilities for South African Rands (R)
 */

/**
 * Format a number as South African Rands
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "R 125.50")
 */
export function formatZAR(amount: number): string {
  return `R${amount.toFixed(2)}`;
}

/**
 * Format a number as South African Rands with thousands separator
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "R 1,250.50")
 */
export function formatZARWithSeparator(amount: number): string {
  return `R${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Calculate delivery fee based on distance and order total
 * @param distance - Delivery distance in kilometers
 * @param orderTotal - Total order amount before delivery
 * @returns Delivery fee information
 */
export interface DeliveryFeeInfo {
  fee: number;
  freeDelivery: boolean;
  message: string;
}

export function calculateDeliveryFee(distance: number, orderTotal: number): DeliveryFeeInfo {
  let fee = 0;
  let freeDelivery = false;
  let message = '';
  
  // Free delivery for orders R850+ up to 15km
  if (orderTotal >= 850) {
    if (distance <= 15) {
      freeDelivery = true;
      fee = 0;
      message = '🎉 FREE DELIVERY! (Order over R850)';
    } else {
      const extraKm = distance - 15;
      fee = extraKm * 5;
      freeDelivery = false;
      message = `R${fee.toFixed(2)} delivery (R5/km beyond 15km)`;
    }
  } else {
    // Standard delivery pricing
    if (distance <= 7.5) {
      fee = 30;
      message = `R${fee.toFixed(2)} delivery (up to 7.5km)`;
    } else {
      const extraKm = distance - 7.5;
      fee = 30 + (Math.ceil(extraKm) * 5);
      message = `R${fee.toFixed(2)} delivery (R5/km beyond 7.5km)`;
    }
    
    // Add tip for free delivery
    if (orderTotal > 0) {
      const amountNeeded = 850 - orderTotal;
      if (amountNeeded > 0) {
        message += `\n💡 Add R${amountNeeded.toFixed(2)} more for free delivery!`;
      }
    }
  }
  
  return { fee, freeDelivery, message };
}

/**
 * Delivery Time Calculation Utility
 * Hydration-safe version
 */

// Pickup location
const PICKUP_LOCATION = {
  lat: -33.9249,
  lng: 18.4241
};

// Delivery speeds
const DELIVERY_SPEEDS = {
  optimal: 40,
  normal: 30,
  busy: 20,
  slow: 15
};

// Time buffers
const TIME_BUFFERS = {
  preparation: 15,
  packaging: 5,
  handoff: 3
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Server-side safe version
export function estimateDeliveryTime(
  dropoffLat: number,
  dropoffLng: number,
  options?: {
    traffic?: keyof typeof DELIVERY_SPEEDS;
    orderSize?: 'small' | 'medium' | 'large';
    timeOfDay?: string;
  }
): {
  minTime: number;
  maxTime: number;
  avgTime: number;
  distance: number;
  traffic: string;
} {
  const distance = calculateDistance(
    PICKUP_LOCATION.lat,
    PICKUP_LOCATION.lng,
    dropoffLat,
    dropoffLng
  );

  const traffic = options?.traffic || 'normal';
  const speed = DELIVERY_SPEEDS[traffic];
  const travelTime = (distance / speed) * 60;
  const totalBuffer = TIME_BUFFERS.preparation + TIME_BUFFERS.packaging + TIME_BUFFERS.handoff;
  const sizeBuffer = options?.orderSize === 'large' ? 5 : 
                    options?.orderSize === 'medium' ? 3 : 0;
  
  const avgTime = Math.round(travelTime + totalBuffer + sizeBuffer);
  const minTime = Math.round(avgTime * 0.8);
  const maxTime = Math.round(avgTime * 1.3);

  return {
    minTime,
    maxTime,
    avgTime,
    distance: Math.round(distance * 10) / 10,
    traffic
  };
}

// Client-side only version
export function useDeliveryTime(
  dropoffLat: number,
  dropoffLng: number,
  options?: {
    traffic?: keyof typeof DELIVERY_SPEEDS;
    orderSize?: 'small' | 'medium' | 'large';
    timeOfDay?: string;
  }
) {
  const [estimate, setEstimate] = useState<ReturnType<typeof estimateDeliveryTime> | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const result = estimateDeliveryTime(dropoffLat, dropoffLng, options);
    setEstimate(result);
  }, [dropoffLat, dropoffLng, options]);

  return estimate;
}

export function getDeliverySlots(): {
  time: string;
  display: string;
  available: boolean;
}[] {
  // Static slots for SSR
  return [
    { time: "13:00", display: "1:00 PM", available: true },
    { time: "14:00", display: "2:00 PM", available: true },
    { time: "15:00", display: "3:00 PM", available: true },
    { time: "16:00", display: "4:00 PM", available: true }
  ];
}

// Client-side only delivery slots
export function useDeliverySlots() {
  const [slots, setSlots] = useState(getDeliverySlots());
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const now = new Date();
    const currentHour = now.getHours();
    const updatedSlots = [];
    
    for (let i = 1; i <= 4; i++) {
      const slotHour = currentHour + i;
      const hour24 = slotHour % 24;
      const hour12 = hour24 % 12 || 12;
      const ampm = hour24 < 12 ? 'AM' : 'PM';
      const isAvailable = hour24 >= 8 && hour24 < 22;
      
      updatedSlots.push({
        time: `${hour24}:00`,
        display: `${hour12}:00 ${ampm}`,
        available: isAvailable
      });
    }
    
    setSlots(updatedSlots);
  }, []);
  
  return slots;
}

// Stable tracking simulation
export function simulateLiveTracking(
  orderId: string
): {
  status: 'preparing' | 'dispatched' | 'en_route' | 'arriving' | 'delivered';
  progress: number;
  estimatedArrival: number;
} {
  // Use order ID for stable simulation
  const hash = orderId.split('').reduce((acc: number, char) => acc + char.charCodeAt(0), 0);
  const progress = (hash % 70) + 15; // 15-85%
  
  let status: 'preparing' | 'dispatched' | 'en_route' | 'arriving' | 'delivered';
  
  if (progress < 25) status = 'preparing';
  else if (progress < 35) status = 'dispatched';
  else if (progress < 85) status = 'en_route';
  else if (progress < 100) status = 'arriving';
  else status = 'delivered';
  
  return {
    status,
    progress,
    estimatedArrival: Math.max(0, Math.round((100 - progress) / 2))
  };
}

import { useState, useEffect } from 'react';

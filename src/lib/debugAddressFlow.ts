// Debug utility to trace address selection flow
export const debugAddressFlow = (step: string, data: any) => {
  console.log(`[Address Debug] ${step}:`, {
    timestamp: new Date().toISOString(),
    ...data
  });
};

// Validate if coordinates are in South Africa
export const isValidCapeTownCoordinates = (lat: number, lng: number): boolean => {
  // Cape Town bounding box roughly:
  // Latitude: -34.5 to -33.5
  // Longitude: 18.0 to 19.0
  const isValid = lat >= -34.5 && lat <= -33.5 && lng >= 18.0 && lng <= 19.0;
  
  if (!isValid) {
    console.warn(`Invalid Cape Town coordinates detected: lat=${lat}, lng=${lng}`);
  }
  
  return isValid;
};

// Get restaurant coordinates with validation
export const getValidRestaurantCoords = () => {
  const coords = { lat: -34.0425, lng: 18.4412 };
  console.log(`Restaurant coordinates (Uitsig Wine Farm):`, coords);
  return coords;
};
};

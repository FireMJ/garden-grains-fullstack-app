// Accurate Cape Town metropolitan area bounds
// Rosebank, Claremont, Rondebosch, Milnerton, etc. are all within Cape Town

export const CAPE_TOWN_METRO_BOUNDS = {
  // Expanded to cover all Cape Town suburbs
  north: -33.5,  // Melkbosstrand area
  south: -34.2,  // Fish Hoek/Noordhoek area  
  west: 18.2,    // Atlantic seaboard
  east: 18.65,   // Bellville/Kuils River area
};

// Specific suburb bounds for better accuracy
export const CAPE_TOWN_SUBURBS = {
  Rosebank: { lat: -33.9556, lng: 18.4741 },
  Claremont: { lat: -33.9806, lng: 18.4658 },
  Rondebosch: { lat: -33.9631, lng: 18.4764 },
  Milnerton: { lat: -33.8741, lng: 18.5024 },
  CenturyCity: { lat: -33.8925, lng: 18.5133 },
  Newlands: { lat: -33.9789, lng: 18.4539 },
  Constantia: { lat: -34.0314, lng: 18.4186 },
  TableView: { lat: -33.8269, lng: 18.4831 },
  Durbanville: { lat: -33.8327, lng: 18.6469 },
  Brackenfell: { lat: -33.8717, lng: 18.6944 },
};

export const isValidCapeTownAddress = (lat: number, lng: number): boolean => {
  // Check if coordinates fall within Cape Town metropolitan area
  const isWithinBounds = lat >= CAPE_TOWN_METRO_BOUNDS.south && 
                         lat <= CAPE_TOWN_METRO_BOUNDS.north &&
                         lng >= CAPE_TOWN_METRO_BOUNDS.west && 
                         lng <= CAPE_TOWN_METRO_BOUNDS.east;
  
  if (!isWithinBounds) {
    console.log(`Coordinates (${lat}, ${lng}) outside Cape Town bounds`);
  }
  
  return isWithinBounds;
};

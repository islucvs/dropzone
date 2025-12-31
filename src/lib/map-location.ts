export interface MapLocation {
  lat: number;
  lng: number;
  zoom: number;
}

const INTERESTING_LOCATIONS = [
  { lat: 48.8566, lng: 2.3522, zoom: 13 },
  { lat: 40.7128, lng: -74.0060, zoom: 13 },
  { lat: 35.6762, lng: 139.6503, zoom: 13 },
  { lat: 51.5074, lng: -0.1278, zoom: 13 },
  { lat: -33.8688, lng: 151.2093, zoom: 13 },
  { lat: 55.7558, lng: 37.6173, zoom: 13 },
  { lat: 39.9042, lng: 116.4074, zoom: 13 },
  { lat: 25.2048, lng: 55.2708, zoom: 13 },
  { lat: -22.9068, lng: -43.1729, zoom: 13 },
  { lat: 37.7749, lng: -122.4194, zoom: 13 },
  { lat: 52.5200, lng: 13.4050, zoom: 13 },
  { lat: 41.9028, lng: 12.4964, zoom: 13 },
  { lat: 1.3521, lng: 103.8198, zoom: 13 },
  { lat: 19.4326, lng: -99.1332, zoom: 13 },
  { lat: 28.6139, lng: 77.2090, zoom: 13 },
];

export function generateRandomLocation(): MapLocation {
  const randomIndex = Math.floor(Math.random() * INTERESTING_LOCATIONS.length);
  return INTERESTING_LOCATIONS[randomIndex];
}

export function getStoredLocation(): MapLocation | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('game_map_location');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function storeLocation(location: MapLocation): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('game_map_location', JSON.stringify(location));
}

export function getOrGenerateLocation(): MapLocation {
  const stored = getStoredLocation();

  if (stored && stored.lat !== undefined && stored.lng !== undefined) {
    const isOcean = stored.lat === 0 || (Math.abs(stored.lat) < 5 && Math.abs(stored.lng) > 170);
    if (isOcean) {
      localStorage.removeItem('game_map_location');
    } else {
      return stored;
    }
  }

  const newLocation = generateRandomLocation();
  storeLocation(newLocation);
  return newLocation;
}

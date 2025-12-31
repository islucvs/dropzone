const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN || '';

export function getMapboxSatelliteTileUrl(
  zoom: number,
  x: number,
  y: number,
  retina: boolean = true,
  styleType: 'satellite' | 'satellite-streets' = 'satellite'
): string {
  const scale = retina ? '@2x' : '';
  const styleId = styleType === 'satellite-streets' ? 'satellite-streets-v12' : 'satellite-v9';
  const url = `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/512/${zoom}/${x}/${y}${scale}?access_token=${MAPBOX_TOKEN}`;

  return url;
}

export const MAPBOX_TILE_SIZE = 512;

'use client';

import { useEffect, useState } from 'react';
import { getOrGenerateLocation } from '@/lib/map-location';
import { calculateDayNight, DayNightInfo } from '@/lib/day-night-cycle';
import { getMapboxSatelliteTileUrl, MAPBOX_TILE_SIZE } from '@/lib/mapbox-tiles';
import { useGameState } from '@/contexts/game/game-state-context';
import type { Viewport } from '@/types/game';

interface RealMapBackgroundProps {
  mapDimensions: { width: number; height: number };
  viewport: Viewport;
  showGrid: boolean;
}

interface Tile {
  x: number;
  y: number;
  url: string;
}

function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
  const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
  return { x, y };
}

function generateTiles(lat: number, lng: number, zoom: number, width: number, height: number, styleType: 'satellite' | 'satellite-streets'): Tile[] {
  const tileSize = MAPBOX_TILE_SIZE;
  const center = latLngToTile(lat, lng, zoom);

  const tilesX = Math.ceil(width / tileSize) + 2;
  const tilesY = Math.ceil(height / tileSize) + 2;

  const startX = center.x - Math.floor(tilesX / 2);
  const startY = center.y - Math.floor(tilesY / 2);

  const tiles: Tile[] = [];

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      const tileX = startX + x;
      const tileY = startY + y;

      tiles.push({
        x: x * tileSize,
        y: y * tileSize,
        url: getMapboxSatelliteTileUrl(zoom, tileX, tileY, true, styleType)
      });
    }
  }

  return tiles;
}

export function RealMapBackground({ mapDimensions, viewport, showGrid }: RealMapBackgroundProps) {
  const { mapBackgroundType } = useGameState();
  const [dayNightInfo, setDayNightInfo] = useState<DayNightInfo | null>(null);
  const [mapLocation] = useState(() => getOrGenerateLocation());
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loadedTiles, setLoadedTiles] = useState(0);
  const [totalTiles, setTotalTiles] = useState(0);

  useEffect(() => {
    const updateDayNight = () => {
      const info = calculateDayNight(mapLocation.lat, mapLocation.lng);
      setDayNightInfo(info);
    };

    updateDayNight();
    const interval = setInterval(updateDayNight, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [mapLocation.lat, mapLocation.lng]);

  useEffect(() => {
    if (mapBackgroundType === 'static') return;

    const styleType = mapBackgroundType === 'satellite-streets' ? 'satellite-streets' : 'satellite';
    const generatedTiles = generateTiles(
      mapLocation.lat,
      mapLocation.lng,
      mapLocation.zoom,
      mapDimensions.width,
      mapDimensions.height,
      styleType
    );
    setTiles(generatedTiles);
    setTotalTiles(generatedTiles.length);
    setLoadedTiles(0);
  }, [mapLocation.lat, mapLocation.lng, mapLocation.zoom, mapDimensions.width, mapDimensions.height, mapBackgroundType]);

  useEffect(() => {
    if (loadedTiles > 0 && loadedTiles === totalTiles) {
      window.dispatchEvent(new CustomEvent('mapTilesLoaded'));
    }
  }, [loadedTiles, totalTiles]);

  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0',
          width: `${mapDimensions.width}px`,
          height: `${mapDimensions.height}px`,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {tiles.map((tile, idx) => (
          <img
            key={idx}
            src={tile.url}
            alt=""
            className="absolute pointer-events-none"
            style={{
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${MAPBOX_TILE_SIZE}px`,
              height: `${MAPBOX_TILE_SIZE}px`,
              opacity: 0.7,
              imageRendering: 'auto',
            }}
            loading="eager"
            crossOrigin="anonymous"
            onLoad={() => setLoadedTiles(prev => prev + 1)}
            onError={() => setLoadedTiles(prev => prev + 1)}
          />
        ))}
      </div>

      <div
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0',
          width: `${mapDimensions.width}px`,
          height: `${mapDimensions.height}px`,
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 100%)',
          zIndex: 1,
        }}
      />

      {showGrid && (
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: '0 0',
            width: `${mapDimensions.width}px`,
            height: `${mapDimensions.height}px`,
            zIndex: 2,
          }}
        >
          {Array.from({ length: Math.ceil(mapDimensions.height / 50) }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full pointer-events-none"
              style={{
                top: `${i * 50}px`,
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,200,255,0.15) 50%, transparent 100%)',
                boxShadow: '0 0 2px rgba(0,200,255,0.3)',
              }}
            />
          ))}
          {Array.from({ length: Math.ceil(mapDimensions.width / 50) }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full pointer-events-none"
              style={{
                left: `${i * 50}px`,
                width: '1px',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,200,255,0.15) 50%, transparent 100%)',
                boxShadow: '0 0 2px rgba(0,200,255,0.3)',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

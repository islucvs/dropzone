'use client';

import type { Viewport } from '@/types/game';

interface MapBackgroundProps {
  mapDimensions: { width: number; height: number };
  viewport: Viewport;
  showGrid: boolean;
}

export function MapBackground({ mapDimensions, viewport, showGrid }: MapBackgroundProps) {
  return (
    <div
      className="absolute"
      style={{
        backgroundImage: "url(../images/map.png)",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: '0 0',
        width: `${mapDimensions.width}px`,
        height: `${mapDimensions.height}px`,
        opacity: 0.4
      }}
    >
      {showGrid && (
        <>
          {Array.from({ length: Math.ceil(mapDimensions.height / 50) }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-white/10"
              style={{ top: `${i * 50}px` }}
            />
          ))}
          {Array.from({ length: Math.ceil(mapDimensions.width / 50) }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-white/10"
              style={{ left: `${i * 50}px` }}
            />
          ))}
        </>
      )}
    </div>
  );
}

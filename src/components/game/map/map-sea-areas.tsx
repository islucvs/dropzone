'use client';

import type { SeaArea, Position } from '@/types/game';

interface MapSeaAreasProps {
  seaAreas: SeaArea[];
  transformPosition: (pos: Position) => Position;
  transformSize: (size: number) => number;
}

export function MapSeaAreas({ seaAreas, transformPosition, transformSize }: MapSeaAreasProps) {
  return (
    <>
      {seaAreas.map(sea => {
        const transformedPos = transformPosition(sea.position);
        const width = transformSize(sea.width);
        const height = transformSize(sea.height);

        return (
          <div
            key={sea.id}
            className="absolute pointer-events-none"
            style={{
              left: transformedPos.x,
              top: transformedPos.y,
              width,
              height,
              background: sea.type === 'deep-sea'
                ? 'linear-gradient(135deg, rgba(0, 50, 150, 0.4) 0%, rgba(0, 100, 200, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(0, 100, 200, 0.3) 0%, rgba(0, 150, 255, 0.5) 100%)',
              border: `2px ${sea.type === 'deep-sea' ? 'dashed' : 'dotted'} rgba(0, 150, 255, 0.7)`,
              borderRadius: '10px',
              zIndex: 3,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/70 text-sm font-bold bg-black/30 px-3 py-1 rounded">
                {sea.type === 'deep-sea' ? '🌊 Deep Sea' : '💧 Sea'}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

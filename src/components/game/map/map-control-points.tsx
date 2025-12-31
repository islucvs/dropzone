'use client';

import type { ControlPoint, Position } from '@/types/game';

interface MapControlPointsProps {
  controlPoints: ControlPoint[];
  transformPosition: (pos: Position) => Position;
  transformSize: (size: number) => number;
}

export function MapControlPoints({ controlPoints, transformPosition, transformSize }: MapControlPointsProps) {
  return (
    <>
      {controlPoints
        .filter(cp => cp.ownedByPlayer)
        .map(cp => {
          const transformedPos = transformPosition(cp.position);
          const radius = transformSize(cp.radius);

          return (
            <div
              key={`area-${cp.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: transformedPos.x - radius,
                top: transformedPos.y - radius,
                width: radius * 2,
                height: radius * 2,
                background: 'radial-gradient(circle, rgba(0,255,0,0.1) 0%, rgba(0,255,0,0) 70%)',
                border: '2px dashed rgba(0, 255, 0, 0.3)',
                zIndex: 4,
              }}
            />
          );
        })}

      {controlPoints.map(cp => {
        const transformedPos = transformPosition(cp.position);
        const radius = transformSize(cp.radius);

        return (
          <div
            key={cp.id}
            className="absolute rounded-full"
            style={{
              left: transformedPos.x - radius,
              top: transformedPos.y - radius,
              width: radius * 2,
              height: radius * 2,
              border: `3px ${cp.ownedByPlayer ? 'solid' : 'dashed'} ${cp.color}`,
              background: cp.ownedByPlayer
                ? `radial-gradient(circle, ${cp.color}40 0%, transparent 70%)`
                : 'transparent',
              opacity: 0.8,
              zIndex: 4,
            }}
          >
            {!cp.ownedByPlayer && cp.progress > 0 && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#00aaff ${cp.progress * 3.6}deg, transparent 0deg)`
                }}
              />
            )}

            {cp.ownedByPlayer && cp.progress > 0 && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, transparent ${360 - (cp.progress * 3.6)}deg, #ff0000 ${360 - (cp.progress * 3.6)}deg)`,
                  transform: 'scaleX(-1)'
                }}
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                <div className={`text-lg ${cp.ownedByPlayer ? 'text-green-400' : 'text-red-400'}`}>
                  {cp.ownedByPlayer ? '✓' : '⚔'}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

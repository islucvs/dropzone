'use client';

import type { Unit, Position } from '@/types/game';

interface MapUnitRendererProps {
  unit: Unit;
  transformPosition: (pos: Position) => Position;
  transformSize: (size: number) => number;
  onSelect: (id: string, e: React.MouseEvent) => void;
  getUnitSize: (category: string) => number;
}

export function MapUnitRenderer({ unit, transformPosition, transformSize, onSelect, getUnitSize }: MapUnitRendererProps) {
  const size = getUnitSize(unit.category);

  if (unit.health <= 0 || unit.carriedBy) return null;

  const pos = unit.position;

  return (
    <div key={unit.id}>
      {unit.destination && unit.type === 'player' && (
        <>
          <div
            className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"
            style={{
              left: unit.destination.x - 1.5,
              top: unit.destination.y - 1.5,
            }}
          />
          <div
            className="absolute h-1 bg-green-500/50 origin-left"
            style={{
              left: pos.x,
              top: pos.y,
              width: Math.sqrt(
                Math.pow(unit.destination.x - unit.position.x, 2) +
                Math.pow(unit.destination.y - unit.position.y, 2)
              ),
              transform: `rotate(${Math.atan2(
                unit.destination.y - unit.position.y,
                unit.destination.x - unit.position.x
              ) * 180 / Math.PI}deg)`,
              transformOrigin: '0 0'
            }}
          />
        </>
      )}

      {unit.type === 'enemy' && unit.isVisible && (
        <div
          className={`absolute cursor-pointer transition-all duration-200 ${unit.selected ? 'scale-110' : ''}`}
          style={{
            left: pos.x - 20,
            top: pos.y - 20,
            width: 40,
            height: 40,
            zIndex: unit.selected ? 110 : 100,
          }}
          onClick={(e) => onSelect(unit.id, e)}
        >
          <div className="absolute inset-0">
            <img
              src={unit.imagePath}
              className="w-full h-full object-contain pointer-events-none"
              style={{
                transform: unit.name === 'Scout' ? 'scaleY(-1)' : undefined
              }}
              alt={unit.name}
              onError={(e) => {
                e.currentTarget.src = '../images/enemies/enemy_default.png';
              }}
            />
          </div>

          <div className="absolute -top-2 left-1 right-1 h-1.5 bg-gray-900 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                unit.health > unit.maxHealth * 0.5 ? 'bg-red-500' :
                unit.health > unit.maxHealth * 0.25 ? 'bg-orange-500' :
                'bg-red-700'
              }`}
              style={{ width: `${(unit.health / unit.maxHealth) * 100}%` }}
            />
          </div>

          <div className="absolute -bottom-5 left-0 right-0 text-center">
            <div className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded inline-block">
              {unit.name}
            </div>
          </div>
        </div>
      )}

      {unit.type === 'player' && (
        <div
          className={`absolute cursor-pointer transition-all ${unit.selected ? 'scale-110' : ''}`}
          style={{
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            width: size,
            height: size,
            zIndex: unit.selected ? 110 : 100,
          }}
          onClick={(e) => onSelect(unit.id, e)}
        >
          {unit.selected && !unit.carriedBy && (
            <>
              <div className="absolute inset-0 rounded-full border-3 border-yellow-400 animate-pulse"></div>
              {unit.attackRange > 0 && (
                <div
                  className="absolute rounded-full border border-red-500/30 pointer-events-none"
                  style={{
                    width: unit.attackRange * 2,
                    height: unit.attackRange * 2,
                    left: size / 2 - unit.attackRange,
                    top: size / 2 - unit.attackRange,
                    background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)'
                  }}
                />
              )}
            </>
          )}

          <div className="absolute inset-0">
            <img
              src={unit.imagePath}
              className="w-full h-full object-contain pointer-events-none"
              alt={unit.name}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full px-1">
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  unit.health / unit.maxHealth > 0.6 ? 'bg-green-500' :
                  unit.health / unit.maxHealth > 0.3 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${(unit.health / unit.maxHealth) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

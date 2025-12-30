'use client';

import type { Unit, Position } from '@/types/game';
import { MapUnitRenderer } from './map-unit-renderer';
import { useGameState } from '@/contexts/game/game-state-context';

interface MapUnitsProps {
  units: Unit[];
  transformPosition: (pos: Position) => Position;
  transformSize: (size: number) => number;
  onUnitSelect: (id: string, e: React.MouseEvent) => void;
}

const getUnitSize = (category: string): number => {
  if (category === 'infantry') return 25;
  if (category === 'recon') return 30;
  if (category === 'robotics') return 28;
  if (category === 'pfvs') return 35;
  if (category === 'mbt') return 40;
  if (category === 'artillery') return 38;
  if (category === 'aas') return 36;
  if (category === 'helicopters') return 35;
  if (category === 'fighterjets') return 38;
  if (category === 'transportation') return 42;
  if (category === 'bomber') return 45;
  if (category === 'destroyers') return 50;
  if (category === 'carrier') return 60;
  return 30;
};

export function MapUnits({ units, transformPosition, transformSize, onUnitSelect }: MapUnitsProps) {
  const { viewport } = useGameState();

  return (
    <div
      className="absolute"
      style={{
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: '0 0',
        width: '100%',
        height: '100%',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {units.map(unit => (
          <MapUnitRenderer
            key={unit.id}
            unit={unit}
            transformPosition={(pos) => pos}
            transformSize={(size) => size}
            onSelect={onUnitSelect}
            getUnitSize={getUnitSize}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useGameState } from '@/contexts/game/game-state-context';
import { useGameActions } from '@/contexts/game/game-actions-context';
import type { Unit } from '@/types/game';

export function SelectedUnitsPanel() {
  const { units, setUnits, setSelectedUnitInfo, viewport, setViewport } = useGameState();
  const { transformPosition } = useGameActions();

  const selectedUnits = units.filter(u => u.selected && u.type === 'player');

  const handleDeselectAll = () => {
    setUnits(prev => prev.map(u => ({ ...u, selected: false })));
  };

  const handleUnitClick = (unit: Unit) => {
    const transformedPos = transformPosition(unit.position);
    const offsetX = transformedPos.x - window.innerWidth / 2;
    const offsetY = transformedPos.y - window.innerHeight / 2;

    setViewport(prev => ({
      ...prev,
      x: -offsetX,
      y: -offsetY
    }));

    setSelectedUnitInfo(unit);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
        <span>Selected Units ({selectedUnits.length})</span>
        {selectedUnits.length > 0 && (
          <button
            onClick={handleDeselectAll}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Deselect All
          </button>
        )}
      </h3>

      {selectedUnits.length === 0 ? (
        <div className="text-gray-500 text-sm italic text-center py-4">
          No units selected
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {selectedUnits.map(unit => (
            <div
              key={unit.id}
              className="p-2 bg-gray-900/30 rounded border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => handleUnitClick(unit)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={unit.imagePath}
                  className="w-8 h-8 object-contain rounded bg-gray-800"
                  alt={unit.name}
                  onError={(e) => {
                    e.currentTarget.src = `../images/${unit.category}/default.png`;
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm text-white truncate">{unit.name}</div>
                  <div className="text-xs text-gray-400">
                    HP: {Math.round(unit.health)}/{unit.maxHealth}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

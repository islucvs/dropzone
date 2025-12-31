'use client';

import { useGameState } from '@/contexts/game/game-state-context';

export function BottomStatusBar() {
  const { units, controlPoints, economy, draggingUnitType } = useGameState();

  const playerUnitsCount = units.filter(u => u.type === 'player' && u.health > 0).length;
  const controlledPointsCount = controlPoints.filter(cp => cp.ownedByPlayer).length;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {playerUnitsCount} units deployed •
          {controlledPointsCount} control points •
          {economy.income.toLocaleString()}/s income
        </div>
        <div className="flex items-center gap-4">
          <div className="text-green-400 font-medium">
            $<span className="text-lg">{Math.floor(economy.money / 1000000)}</span>M
          </div>
          <div className={`text-xs px-2 py-1 rounded ${draggingUnitType ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>
            {draggingUnitType ? 'READY TO DEPLOY' : 'DRAG UNIT TO DEPLOY'}
          </div>
        </div>
      </div>
    </div>
  );
}

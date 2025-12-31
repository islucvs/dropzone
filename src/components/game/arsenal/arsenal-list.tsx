'use client';

import { Target } from 'lucide-react';
import { useGameState } from '@/contexts/game/game-state-context';
import { useGameActions } from '@/contexts/game/game-actions-context';
import { ArsenalUnitCard } from './arsenal-unit-card';
import { useMemo } from 'react';

export function ArsenalList() {
  const { selectedArsenalUnits, unitTemplates, unitCost } = useGameState();
  const { handleUnitDragStart, handleUnitDragEnd } = useGameActions();

  const unitTemplatesMemo = useMemo(() => unitTemplates, [unitTemplates]);

  return (
    <div className="p-4 border-b border-gray-800">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Target size={18} className="text-blue-400" />
        Available Arsenal
      </h2>

      {selectedArsenalUnits.length === 0 ? (
        <div className="text-gray-400 text-sm italic p-4 text-center bg-gray-900/50 rounded-lg">
          No units selected. Go to Arsenal tab to select units.
        </div>
      ) : (
        <div className="space-y-3">
          {unitTemplatesMemo.map(template => (
            <ArsenalUnitCard
              key={template.id}
              template={template}
              cost={unitCost}
              onDragStart={handleUnitDragStart}
              onDragEnd={handleUnitDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

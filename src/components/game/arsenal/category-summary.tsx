'use client';

import { useGameState } from '@/contexts/game/game-state-context';
import { CATEGORY_LABELS } from '@/lib/game-constants';

export function CategorySummary() {
  const { selectedArsenalUnits } = useGameState();

  const getCategoryCount = (category: string) => {
    return selectedArsenalUnits.filter(u => u.category === category).length;
  };

  return (
    <div className="p-4 border-b border-gray-800">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Arsenal Composition</h3>
      <div className="space-y-2">
        {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
          const count = getCategoryCount(category);
          if (count === 0) return null;

          return (
            <div key={category} className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">{label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(count / 3) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium w-6 text-right">{count}/3</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

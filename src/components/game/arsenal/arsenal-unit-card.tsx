'use client';

import type { UnitTemplate } from '@/types/game';

interface ArsenalUnitCardProps {
  template: UnitTemplate;
  cost: number;
  onDragStart: (e: React.DragEvent, unitType: string) => void;
  onDragEnd: () => void;
}

export function ArsenalUnitCard({ template, cost, onDragStart, onDragEnd }: ArsenalUnitCardProps) {
  return (
    <div
      className="group relative p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, template.id)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3">
        <img
          src={template.imagePath}
          className="w-12 h-12 object-contain rounded-md bg-gray-800"
          alt={template.name}
          onError={(e) => {
            e.currentTarget.src = `../images/${template.category}/default.png`;
          }}
        />
        <div className="flex-1">
          <div className="font-medium text-white truncate">{template.name}</div>
          <div className="text-xs text-gray-400 capitalize">{template.category}</div>
          <div className="flex items-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1 text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {template.health} HP
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {template.attackRange} Range
            </span>
            {template.capabilities?.canFloat && (
              <span className="flex items-center gap-1 text-cyan-400" title="Naval Unit">
                ⚓
              </span>
            )}
            {template.capabilities?.canFly && (
              <span className="flex items-center gap-1 text-sky-400" title="Air Unit">
                ✈
              </span>
            )}
          </div>
        </div>
        <div className="text-yellow-400 text-sm font-bold">
          ${cost.toLocaleString()}
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
    </div>
  );
}

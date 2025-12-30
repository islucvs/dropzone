'use client';

import { X } from 'lucide-react';
import type { Unit } from '@/types/game';

interface UnitInfoCardProps {
  unit: Unit;
  onClose: () => void;
}

export function UnitInfoCard({ unit, onClose }: UnitInfoCardProps) {
  const healthPercent = (unit.health / unit.maxHealth) * 100;

  return (
    <div className="absolute top-4 right-4 w-80 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-white">{unit.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-400">Health</span>
            <span className={`font-bold ${
              healthPercent > 60 ? 'text-green-400' :
              healthPercent > 30 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {Math.round(healthPercent)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                healthPercent > 60 ? 'bg-green-500' :
                healthPercent > 30 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${healthPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Health</span>
            <span className="text-white">{unit.health}/{unit.maxHealth}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Attack Range</span>
            <span className="text-white">{unit.attackRange}</span>
          </div>
          {unit.visionRange && unit.visionRange > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vision Range</span>
              <span className="text-cyan-400">{unit.visionRange}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            {unit.carriedBy
              ? 'Being transported'
              : 'Click anywhere to move, press S to stop'}
          </div>
        </div>
      </div>
    </div>
  );
}

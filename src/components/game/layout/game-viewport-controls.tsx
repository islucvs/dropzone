'use client';

import { useGameState } from '@/contexts/game/game-state-context';

export function GameViewportControls() {
  const { setViewport } = useGameState();

  const handleZoomIn = () => {
    setViewport(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.2) }));
  };

  const handleZoomOut = () => {
    setViewport(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.2) }));
  };

  const handleReset = () => {
    setViewport({ x: 0, y: 0, scale: 1 });
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700"
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700"
      >
        -
      </button>
      <button
        onClick={handleReset}
        className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700 text-xs"
      >
        1:1
      </button>
    </div>
  );
}

import { useEffect } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';

export function useKeyboardControls(spawnEnemyWaveFromAllPoints: () => void) {
  const {
    setIsCtrlPressed,
    setUnits,
    setSelectedUnitInfo,
    setShowTransportUI,
    setSelectedTransport,
    setShowGrid
  } = useGameState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCtrlPressed(true);

      if (e.key === 'Escape') {
        setUnits(prev => prev.map(unit => ({ ...unit, selected: false })));
        setSelectedUnitInfo(null);
        setShowTransportUI(false);
        setSelectedTransport(null);
      }

      if (e.key === 's' || e.key === 'S') {
        setUnits(prev => prev.map(unit => {
          if (unit.selected && unit.type === 'player' && unit.health > 0) {
            return { ...unit, destination: null };
          }
          return unit;
        }));
      }

      if (e.key === 'g' || e.key === 'G') setShowGrid(prev => !prev);

      if (e.key === 'm' || e.key === 'M') {
        spawnEnemyWaveFromAllPoints();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') setIsCtrlPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIsCtrlPressed, setUnits, setSelectedUnitInfo, setShowTransportUI, setSelectedTransport, setShowGrid, spawnEnemyWaveFromAllPoints]);
}

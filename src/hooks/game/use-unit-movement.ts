import { useCallback } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';
import type { Unit, Position } from '@/types/game';

export function useUnitMovement() {
  const { seaAreas } = useGameState();

  const isInSeaArea = useCallback((position: Position): { isSea: boolean; type: 'sea' | 'deep-sea' | null } => {
    for (const sea of seaAreas) {
      if (
        position.x >= sea.position.x &&
        position.x <= sea.position.x + sea.width &&
        position.y >= sea.position.y &&
        position.y <= sea.position.y + sea.height
      ) {
        return { isSea: true, type: sea.type };
      }
    }
    return { isSea: false, type: null };
  }, [seaAreas]);

  const canUnitMoveThroughPosition = useCallback((unit: Unit, position: Position): boolean => {
    const seaCheck = isInSeaArea(position);

    if (unit.capabilities?.canFly) {
      return true;
    }

    if (unit.capabilities?.canFloat) {
      return seaCheck.isSea;
    }

    if (unit.capabilities?.isAmphibious) {
      return true;
    }

    return !seaCheck.isSea;
  }, [isInSeaArea]);

  const getUnitSpeed = useCallback((category: string): number => {
    switch (category) {
      case 'recon': return 3.5;
      case 'infantry': return 0.2;
      case 'robotics': return 0.4;
      case 'pfvs': return 0.5;
      case 'mbt': return 0.5;
      case 'artillery': return 0.6;
      case 'aas': return 0.5;
      case 'helicopters': return 1;
      case 'fighterjets': return 2;
      case 'transportation': return 2;
      case 'bomber': return 1.5;
      case 'destroyers': return 0.8;
      case 'carrier': return 0.5;
      default: return 1;
    }
  }, []);

  return {
    isInSeaArea,
    canUnitMoveThroughPosition,
    getUnitSpeed
  };
}

import { useCallback } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';

export function useVisibility() {
  const { setUnits } = useGameState();

  const calculateVisibility = useCallback(() => {
    setUnits(prevUnits => {
      const updatedUnits = [...prevUnits];
      const playerUnits = updatedUnits.filter(u => u.type === 'player' && u.health > 0);
      const enemyUnits = updatedUnits.filter(u => u.type === 'enemy' && u.health > 0);

      enemyUnits.forEach(enemy => {
        enemy.isVisible = false;
      });

      playerUnits.forEach(playerUnit => {
        const visionRange = playerUnit.visionRange || 0;

        enemyUnits.forEach(enemy => {
          if (enemy.health > 0) {
            const dx = playerUnit.position.x - enemy.position.x;
            const dy = playerUnit.position.y - enemy.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= visionRange) {
              enemy.isVisible = true;
            }
          }
        });
      });

      return updatedUnits;
    });
  }, [setUnits]);

  return { calculateVisibility };
}

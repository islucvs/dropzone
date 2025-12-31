import { useEffect, useRef } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';
import { useUnitMovement } from './use-unit-movement';
import { useVisibility } from './use-visibility';

export function useGameLoop() {
  const {
    units,
    mapDimensions,
    transports,
    setUnits,
    setTransports
  } = useGameState();

  const { canUnitMoveThroughPosition, getUnitSpeed } = useUnitMovement();
  const { calculateVisibility } = useVisibility();

  const gameLoopRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      setUnits(prevUnits => {
        const updatedUnits = [...prevUnits];
        let unitsChanged = false;

        const aliveUnits = updatedUnits.filter(unit => {
          if (unit.health <= 0) {
            unitsChanged = true;

            if (unit.carriedBy && transports[unit.carriedBy]) {
              setTransports(prev => ({
                ...prev,
                [unit.carriedBy!]: {
                  ...prev[unit.carriedBy!],
                  carriedUnits: prev[unit.carriedBy!].carriedUnits.filter(id => id !== unit.id),
                  capacityUsed: Math.max(0, prev[unit.carriedBy!].capacityUsed - (unit.transportSize || 1))
                }
              }));
            }
            return false;
          }
          return true;
        });

        if (unitsChanged) {
          return aliveUnits;
        }

        aliveUnits.forEach(unit => {
          if (unit.type === 'player' && unit.destination && unit.health > 0 && !unit.carriedBy) {
            const dx = unit.destination.x - unit.position.x;
            const dy = unit.destination.y - unit.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
              const speed = getUnitSpeed(unit.category);

              const nextX = unit.position.x + (dx / distance) * speed;
              const nextY = unit.position.y + (dy / distance) * speed;

              const canMove = canUnitMoveThroughPosition(unit, { x: nextX, y: nextY });

              if (canMove) {
                unit.position.x = nextX;
                unit.position.y = nextY;

                unit.position.x = Math.max(0, Math.min(mapDimensions.width, unit.position.x));
                unit.position.y = Math.max(0, Math.min(mapDimensions.height, unit.position.y));
              } else {
                unit.destination = null;
              }
            } else {
              unit.destination = null;
            }
          }
        });

        aliveUnits.forEach(unit => {
          if (unit.type === 'enemy' && unit.destination && unit.health > 0) {
            const dx = unit.destination.x - unit.position.x;
            const dy = unit.destination.y - unit.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
              const enemyType = unit.unitId;
              let speed = 0.8;

              if (enemyType === 'fast') speed = 1.5;
              else if (enemyType === 'tank') speed = 0.4;
              else if (enemyType === 'ranged') speed = 0.6;

              const nextX = unit.position.x + (dx / distance) * speed;
              const nextY = unit.position.y + (dy / distance) * speed;

              unit.position.x = nextX;
              unit.position.y = nextY;

              unit.position.x = Math.max(0, Math.min(mapDimensions.width, unit.position.x));
              unit.position.y = Math.max(0, Math.min(mapDimensions.height, unit.position.y));
            } else {
              unit.destination = null;
            }
          }
        });

        const playerUnits = aliveUnits.filter(u => u.type === 'player' && u.health > 0);
        const enemyUnits = aliveUnits.filter(u => u.type === 'enemy' && u.health > 0);

        playerUnits.forEach(playerUnit => {
          enemyUnits.forEach(enemy => {
            if (enemy.health > 0 && playerUnit.health > 0) {
              const dx = playerUnit.position.x - enemy.position.x;
              const dy = playerUnit.position.y - enemy.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < playerUnit.attackRange) {
                enemy.health -= 1;
              }

              if (distance < enemy.attackRange) {
                playerUnit.health -= 0.5;
              }
            }
          });
        });

        return aliveUnits;
      });

      calculateVisibility();
    }, 50);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [units, mapDimensions, transports, canUnitMoveThroughPosition, getUnitSpeed, calculateVisibility, setUnits, setTransports]);
}

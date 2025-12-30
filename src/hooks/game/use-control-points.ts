import { useEffect, useRef } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';
import { toast } from '@/components/ui/sonner';

export function useControlPoints() {
  const { setUnits, setControlPoints } = useGameState();
  const captureIntervalRef = useRef<NodeJS.Timeout>();
  const notifiedCapturesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }

    captureIntervalRef.current = setInterval(() => {
      setUnits(currentUnits => {
        setControlPoints(prevCPs => {
          return prevCPs.map(cp => {
            const playerUnitsInRange = currentUnits.filter(unit =>
              unit.type === 'player' &&
              unit.health > 0 &&
              !unit.carriedBy &&
              Math.sqrt(
                Math.pow(unit.position.x - cp.position.x, 2) +
                Math.pow(unit.position.y - cp.position.y, 2)
              ) < cp.radius
            ).length;

            const enemyUnitsInRange = currentUnits.filter(unit =>
              unit.type === 'enemy' &&
              unit.health > 0 &&
              Math.sqrt(
                Math.pow(unit.position.x - cp.position.x, 2) +
                Math.pow(unit.position.y - cp.position.y, 2)
              ) < cp.radius
            ).length;

            if (cp.ownedByPlayer) {
              if (enemyUnitsInRange > playerUnitsInRange) {
                const captureSpeed = 3 + (enemyUnitsInRange * 1);
                const newProgress = Math.min(100, cp.progress + captureSpeed);
                if (newProgress >= 100 && cp.progress < 100) {
                  const captureKey = `${cp.id}-enemy-${Date.now()}`;
                  if (!notifiedCapturesRef.current.has(cp.id)) {
                    notifiedCapturesRef.current.add(cp.id);
                    toast.error(
                      `${cp.id.toUpperCase()} LOST!`,
                      { description: 'Control point captured by enemies!' }
                    );
                    setTimeout(() => {
                      notifiedCapturesRef.current.delete(cp.id);
                    }, 2000);
                  }

                  const enemiesNearPoint = currentUnits.filter(unit =>
                    unit.type === 'enemy' &&
                    unit.health > 0 &&
                    Math.sqrt(
                      Math.pow(unit.position.x - cp.position.x, 2) +
                      Math.pow(unit.position.y - cp.position.y, 2)
                    ) < cp.radius * 2
                  );

                  if (enemiesNearPoint.length > 0) {
                    setControlPoints(allCPs => {
                      const playerPoints = allCPs.filter(p => p.ownedByPlayer);
                      const playerUnits = currentUnits.filter(u => u.type === 'player' && u.health > 0 && !u.carriedBy);

                      let targetPosition = null;
                      let minDistance = Infinity;

                      playerPoints.forEach(point => {
                        const dx = cp.position.x - point.position.x;
                        const dy = cp.position.y - point.position.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < minDistance) {
                          minDistance = distance;
                          targetPosition = point.position;
                        }
                      });

                      playerUnits.forEach(unit => {
                        const dx = cp.position.x - unit.position.x;
                        const dy = cp.position.y - unit.position.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < minDistance) {
                          minDistance = distance;
                          targetPosition = unit.position;
                        }
                      });

                      if (targetPosition) {
                        setUnits(allUnits => allUnits.map(unit => {
                          if (enemiesNearPoint.some(e => e.id === unit.id)) {
                            return { ...unit, destination: targetPosition };
                          }
                          return unit;
                        }));
                      }

                      return allCPs;
                    });
                  }

                  return {
                    ...cp,
                    progress: 0,
                    ownedByPlayer: false,
                    color: '#ff4444'
                  };
                }
                return {
                  ...cp,
                  progress: newProgress,
                  color: '#ff0000'
                };
              }
              else if (enemyUnitsInRange === 0 && cp.progress > 0) {
                return { ...cp, progress: Math.max(0, cp.progress - 2) };
              }
            }
            else {
              if (playerUnitsInRange > enemyUnitsInRange) {
                const captureSpeed = 5 + (playerUnitsInRange * 2);
                const newProgress = Math.min(100, cp.progress + captureSpeed);
                if (newProgress >= 100 && cp.progress > 0 && cp.progress < 100) {
                  if (!notifiedCapturesRef.current.has(cp.id)) {
                    notifiedCapturesRef.current.add(cp.id);
                    setTimeout(() => {
                      toast.tactical(
                        `${cp.id.toUpperCase()} CAPTURED`,
                        'Control point successfully conquered!'
                      );
                    }, 0);
                    setTimeout(() => {
                      notifiedCapturesRef.current.delete(cp.id);
                    }, 3000);
                  }
                  return {
                    ...cp,
                    progress: 0,
                    ownedByPlayer: true,
                    color: '#44ff44'
                  };
                }
                return {
                  ...cp,
                  progress: newProgress,
                  color: '#00aaff'
                };
              }
              else if (playerUnitsInRange === 0 && cp.progress > 0) {
                return { ...cp, progress: Math.max(0, cp.progress - 3) };
              }
            }
            return cp;
          });
        });

        return currentUnits;
      });
    }, 1000);

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [setUnits, setControlPoints]);
}

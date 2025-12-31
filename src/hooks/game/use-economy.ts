import { useEffect, useRef } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';

export function useEconomy() {
  const { controlPoints, setEconomy } = useGameState();
  const economyIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (economyIntervalRef.current) {
      clearInterval(economyIntervalRef.current);
    }

    economyIntervalRef.current = setInterval(() => {
      setEconomy(prev => {
        const now = Date.now();
        const elapsedSeconds = (now - prev.lastUpdate) / 1000;

        const currentControlledPoints = controlPoints.filter(cp => cp.ownedByPlayer).length;
        const currentIncome = currentControlledPoints * 500000;

        const newMoney = prev.money + currentIncome * elapsedSeconds;

        return {
          money: newMoney,
          income: currentIncome,
          lastUpdate: now
        };
      });
    }, 1000);

    return () => {
      if (economyIntervalRef.current) {
        clearInterval(economyIntervalRef.current);
      }
    };
  }, [controlPoints, setEconomy]);
}

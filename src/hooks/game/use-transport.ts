import { useEffect } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';

export function useTransport() {
  const { units, transports, setTransports } = useGameState();

  useEffect(() => {
    const newTransports = { ...transports };
    let updated = false;

    Object.keys(newTransports).forEach(transportId => {
      const carriedUnits = units.filter(u => u.carriedBy === transportId);
      const carriedUnitIds = carriedUnits.map(u => u.id);
      const capacityUsed = carriedUnits.reduce((sum, u) => sum + (u.transportSize || 1), 0);

      if (
        JSON.stringify(newTransports[transportId].carriedUnits) !== JSON.stringify(carriedUnitIds) ||
        newTransports[transportId].capacityUsed !== capacityUsed
      ) {
        newTransports[transportId] = {
          ...newTransports[transportId],
          carriedUnits: carriedUnitIds,
          capacityUsed: capacityUsed
        };
        updated = true;
      }
    });

    if (updated) {
      setTransports(newTransports);
    }
  }, [units, transports, setTransports]);
}

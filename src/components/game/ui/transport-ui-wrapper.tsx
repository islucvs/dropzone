'use client';

import { TransportUI } from '@/components/ui/transportui';
import { useGameState } from '@/contexts/game/game-state-context';

export function TransportUIWrapper() {
  const {
    selectedTransport,
    transports,
    units,
    showTransportUI,
    setUnits,
    setShowTransportUI,
    setSelectedTransport
  } = useGameState();

  if (!showTransportUI || !selectedTransport) return null;

  const transport = transports[selectedTransport];
  if (!transport) return null;

  const handleLoadUnit = (unitId: string) => {
    setUnits(prev => prev.map(u =>
      u.id === unitId ? { ...u, carriedBy: selectedTransport } : u
    ));
  };

  const handleUnloadUnit = (unitId: string) => {
    setUnits(prev => prev.map(u =>
      u.id === unitId ? { ...u, carriedBy: undefined } : u
    ));
  };

  const handleLoadAllCompatible = () => {
    const transportUnit = units.find(u => u.id === selectedTransport);
    if (!transportUnit) return;

    const nearbyUnits = units.filter(u =>
      u.type === 'player' &&
      !u.carriedBy &&
      u.canBeTransported &&
      Math.sqrt(
        Math.pow(u.position.x - transportUnit.position.x, 2) +
        Math.pow(u.position.y - transportUnit.position.y, 2)
      ) < 100
    );

    setUnits(prev => prev.map(u =>
      nearbyUnits.find(nu => nu.id === u.id)
        ? { ...u, carriedBy: selectedTransport }
        : u
    ));
  };

  const handleUnloadAll = () => {
    setUnits(prev => prev.map(u =>
      u.carriedBy === selectedTransport
        ? { ...u, carriedBy: undefined }
        : u
    ));
  };

  const handleClose = () => {
    setShowTransportUI(false);
    setSelectedTransport(null);
  };

  return (
    <TransportUI
      transport={transport}
      transports={transports}
      units={units}
      onLoadUnit={handleLoadUnit}
      onUnloadUnit={handleUnloadUnit}
      onLoadAllCompatible={handleLoadAllCompatible}
      onUnloadAll={handleUnloadAll}
      onClose={handleClose}
    />
  );
}

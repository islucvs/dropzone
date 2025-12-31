import { useEffect, useState } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';

export function useGameLoading() {
  const {
    selectedArsenalUnits,
    unitTemplates,
    controlPoints,
    isLoading,
    setIsLoading,
    setLoadingProgress,
  } = useGameState();
  const [mapTilesLoaded, setMapTilesLoaded] = useState(false);

  useEffect(() => {
    const handleMapTilesLoaded = () => setMapTilesLoaded(true);
    window.addEventListener('mapTilesLoaded', handleMapTilesLoaded);
    return () => window.removeEventListener('mapTilesLoaded', handleMapTilesLoaded);
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    let progress = 0;
    const loadingSteps = [
      { check: () => true, weight: 15, delay: 300 },
      { check: () => selectedArsenalUnits.length > 0, weight: 20, delay: 500 },
      { check: () => unitTemplates.length > 0, weight: 20, delay: 400 },
      { check: () => controlPoints.length > 0, weight: 20, delay: 600 },
    ];

    const updateProgress = async () => {
      for (const step of loadingSteps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));

        if (step.check()) {
          progress += step.weight;
          setLoadingProgress(progress);
        }
      }

      setLoadingProgress(75);

      while (!mapTilesLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setLoadingProgress(100);

      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoading(false);
    };

    updateProgress();
  }, [
    selectedArsenalUnits.length,
    unitTemplates.length,
    controlPoints.length,
    isLoading,
    setIsLoading,
    setLoadingProgress,
    mapTilesLoaded,
  ]);
}

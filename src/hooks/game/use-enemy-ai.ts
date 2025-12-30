import { useCallback, useEffect, useRef } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';
import type { Unit, Position, EnemySpawnPoint } from '@/types/game';

export function useEnemyAI() {
  const {
    controlPoints,
    enemySpawnPoints,
    enemyTypes,
    enemyAIState,
    mapDimensions,
    autoSpawnEnabled,
    setEnemySpawnPoints,
    setUnits,
    setEnemyAIState
  } = useGameState();

  const enemyAISpawnRef = useRef<NodeJS.Timeout>();

  const updateEnemySpawnPoints = useCallback(() => {
    const enemyControlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer);

    const newSpawnPoints: EnemySpawnPoint[] = enemyControlledPoints.map(cp => {
      const existingSpawn = enemySpawnPoints.find(sp => sp.controlPointId === cp.id);

      const playerBase = controlPoints.find(cp => cp.id === 'cp-1');
      let spawnPower = 1;
      if (playerBase) {
        const dx = cp.position.x - playerBase.position.x;
        const dy = cp.position.y - playerBase.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        spawnPower = Math.max(1, Math.min(2, 2000 / distance));
      }

      return {
        id: existingSpawn?.id || `enemy-spawn-${cp.id}`,
        controlPointId: cp.id,
        position: cp.position,
        lastSpawnTime: existingSpawn?.lastSpawnTime || Date.now(),
        spawnInterval: 45000,
        spawnPower: spawnPower
      };
    });

    setEnemySpawnPoints(newSpawnPoints);
  }, [controlPoints, enemySpawnPoints, setEnemySpawnPoints]);

  const getRandomEnemyType = useCallback(() => {
    const totalWeight = enemyTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
    let random = Math.random() * totalWeight;

    for (const type of enemyTypes) {
      random -= type.spawnWeight;
      if (random <= 0) {
        return type;
      }
    }

    return enemyTypes[0];
  }, [enemyTypes]);

  const spawnEnemyWave = useCallback((spawnPointId: string, forceType?: string, count?: number) => {
    const spawnPoint = enemySpawnPoints.find(sp => sp.id === spawnPointId);
    if (!spawnPoint) return;

    const controlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer).length;
    const baseCount = count || Math.max(1, Math.floor(controlledPoints / 5) + 1);

    const newEnemies: Unit[] = [];

    for (let i = 0; i < baseCount; i++) {
      const enemyType = forceType ? enemyTypes.find(et => et.id === forceType) : getRandomEnemyType();
      if (!enemyType) continue;

      const offsetX = (Math.random() - 0.5) * 80;
      const offsetY = (Math.random() - 0.5) * 80;

      const basePosition = {
        x: spawnPoint.position.x + offsetX,
        y: spawnPoint.position.y + offsetY
      };

      let target: Position | null = null;

      const playerPoints = controlPoints.filter(cp => cp.ownedByPlayer);
      if (playerPoints.length > 0) {
        let nearestPoint = playerPoints[0];
        let minDistance = Infinity;

        playerPoints.forEach(point => {
          const dx = basePosition.x - point.position.x;
          const dy = basePosition.y - point.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = point;
          }
        });

        target = nearestPoint.position;
      }

      if (!target) {
        target = { x: mapDimensions.width / 2, y: mapDimensions.height / 2 };
      }

      const enemyUnit: Unit = {
        id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'enemy',
        position: basePosition,
        destination: target,
        health: enemyType.health,
        maxHealth: enemyType.maxHealth,
        attackRange: enemyType.attackRange,
        selected: false,
        unitId: enemyType.id,
        name: enemyType.name,
        category: 'enemy',
        imagePath: enemyType.imagePath,
        isVisible: false,
        capabilities: {
          canFloat: false,
          canFly: false,
          isAmphibious: false
        }
      };

      newEnemies.push(enemyUnit);
    }

    if (newEnemies.length > 0) {
      setUnits(prev => [...prev, ...newEnemies]);
    }

    setEnemySpawnPoints(prev => prev.map(sp =>
      sp.id === spawnPointId
        ? { ...sp, lastSpawnTime: Date.now() }
        : sp
    ));
  }, [enemySpawnPoints, enemyTypes, getRandomEnemyType, controlPoints, mapDimensions, setUnits, setEnemySpawnPoints]);

  const spawnEnemyWaveFromAllPoints = useCallback((force = false) => {
    const now = Date.now();

    enemySpawnPoints.forEach(spawnPoint => {
      const timeSinceLastSpawn = now - spawnPoint.lastSpawnTime;

      if (force || timeSinceLastSpawn >= spawnPoint.spawnInterval) {
        const spawnCount = Math.max(1, Math.floor(spawnPoint.spawnPower));
        spawnEnemyWave(spawnPoint.id, undefined, spawnCount);
      }
    });
  }, [enemySpawnPoints, spawnEnemyWave]);

  const updateEnemyAI = useCallback(() => {
    if (!autoSpawnEnabled) return;

    const now = Date.now();
    const controlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer).length;

    spawnEnemyWaveFromAllPoints();

    if (now - enemyAIState.lastWaveTime >= 180000 && controlledPoints > 0) {
      console.log("MAJOR WAVE INCOMING!");

      enemySpawnPoints.forEach(spawnPoint => {
        const waveSize = Math.max(1, Math.floor(controlledPoints * 0.5));
        spawnEnemyWave(spawnPoint.id, undefined, waveSize);
      });

      setEnemyAIState(prev => ({
        ...prev,
        lastWaveTime: now
      }));
    }
  }, [autoSpawnEnabled, enemyAIState.lastWaveTime, controlPoints, enemySpawnPoints, spawnEnemyWave, spawnEnemyWaveFromAllPoints, setEnemyAIState]);

  useEffect(() => {
    if (enemyAISpawnRef.current) {
      clearInterval(enemyAISpawnRef.current);
      enemyAISpawnRef.current = undefined;
    }

    if (autoSpawnEnabled) {
      enemyAISpawnRef.current = setInterval(() => {
        updateEnemySpawnPoints();
        updateEnemyAI();
      }, 5000);
    }

    return () => {
      if (enemyAISpawnRef.current) {
        clearInterval(enemyAISpawnRef.current);
        enemyAISpawnRef.current = undefined;
      }
    };
  }, [autoSpawnEnabled, updateEnemySpawnPoints, updateEnemyAI]);

  const forceSpawnWave = useCallback(() => {
    updateEnemySpawnPoints();
    spawnEnemyWaveFromAllPoints(true);
  }, [updateEnemySpawnPoints, spawnEnemyWaveFromAllPoints]);

  return {
    spawnEnemyWave,
    spawnEnemyWaveFromAllPoints,
    updateEnemySpawnPoints,
    updateEnemyAI,
    forceSpawnWave
  };
}

import { Position } from './units';

export interface EnemySpawnPoint {
  id: string;
  controlPointId: string;
  position: Position;
  lastSpawnTime: number;
  spawnInterval: number;
  spawnPower: number;
}

export interface EnemyWave {
  id: string;
  type: string;
  count: number;
  spawnPointId: string;
  destination?: Position | null;
}

export interface EnemyAIState {
  aggression: number;
  lastWaveTime: number;
  waveCooldown: number;
  spawnBudget: number;
}

export interface EnemyTypeConfig {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  attackRange: number;
  spawnCost: number;
  imagePath: string;
  spawnWeight: number;
}

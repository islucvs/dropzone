'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type {
  Unit,
  UnitTemplate,
  SelectedUnitFromDB,
  TransportStatus,
  ControlPoint,
  SeaArea,
  Viewport,
  GameEconomy,
  EnemyTypeConfig,
  EnemySpawnPoint,
  EnemyWave,
  EnemyAIState
} from '@/types/game';

interface GameStateContextType {
  units: Unit[];
  controlPoints: ControlPoint[];
  seaAreas: SeaArea[];

  selectedArsenalUnits: SelectedUnitFromDB[];
  unitTemplates: UnitTemplate[];

  enemyTypes: EnemyTypeConfig[];
  enemySpawnPoints: EnemySpawnPoint[];
  enemyWaves: EnemyWave[];
  enemyAIState: EnemyAIState;

  transports: Record<string, TransportStatus>;
  selectedTransport: string | null;
  showTransportUI: boolean;

  viewport: Viewport;
  mapDimensions: { width: number; height: number };
  selectedUnitInfo: Unit | null;
  draggingUnitType: string | null;
  isDragging: boolean;
  isMapDragging: boolean;
  isFullscreen: boolean;
  showGrid: boolean;
  isCtrlPressed: boolean;
  autoSpawnEnabled: boolean;
  isLoading: boolean;
  loadingProgress: number;
  mapBackgroundType: 'static' | 'satellite' | 'satellite-streets';

  economy: GameEconomy;

  unitCost: number;

  setUnits: (units: Unit[] | ((prev: Unit[]) => Unit[])) => void;
  setControlPoints: (points: ControlPoint[] | ((prev: ControlPoint[]) => ControlPoint[])) => void;
  setSelectedArsenalUnits: (units: SelectedUnitFromDB[]) => void;
  setUnitTemplates: (templates: UnitTemplate[]) => void;
  setEnemySpawnPoints: (points: EnemySpawnPoint[] | ((prev: EnemySpawnPoint[]) => EnemySpawnPoint[])) => void;
  setEnemyWaves: (waves: EnemyWave[] | ((prev: EnemyWave[]) => EnemyWave[])) => void;
  setEnemyAIState: (state: EnemyAIState | ((prev: EnemyAIState) => EnemyAIState)) => void;
  setTransports: (transports: Record<string, TransportStatus> | ((prev: Record<string, TransportStatus>) => Record<string, TransportStatus>)) => void;
  setSelectedTransport: (id: string | null) => void;
  setShowTransportUI: (show: boolean) => void;
  setViewport: (viewport: Viewport | ((prev: Viewport) => Viewport)) => void;
  setSelectedUnitInfo: (unit: Unit | null) => void;
  setDraggingUnitType: (type: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsMapDragging: (isDragging: boolean) => void;
  setIsFullscreen: (isFullscreen: boolean) => void;
  setShowGrid: (showGrid: boolean) => void;
  setIsCtrlPressed: (isPressed: boolean) => void;
  setAutoSpawnEnabled: (enabled: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  setMapBackgroundType: (type: 'static' | 'satellite' | 'satellite-streets') => void;
  setEconomy: (economy: GameEconomy | ((prev: GameEconomy) => GameEconomy)) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);
  const [seaAreas] = useState<SeaArea[]>([
    { id: 'sea-1', position: { x: 0, y: 1000 }, width: 4000, height: 3000, type: 'deep-sea' },
  ]);

  const [selectedArsenalUnits, setSelectedArsenalUnits] = useState<SelectedUnitFromDB[]>([]);
  const [unitTemplates, setUnitTemplates] = useState<UnitTemplate[]>([]);

  const [enemyTypes] = useState<EnemyTypeConfig[]>([
    {
      id: 'basic',
      name: 'Grunt',
      health: 120,
      maxHealth: 120,
      speed: 0.8,
      damage: 3,
      attackRange: 50,
      spawnCost: 0,
      imagePath: '../images/enemies/grunt.png',
      spawnWeight: 60
    },
    {
      id: 'fast',
      name: 'Scout',
      health: 80,
      maxHealth: 80,
      speed: 1.5,
      damage: 2,
      attackRange: 40,
      spawnCost: 0,
      imagePath: '../images/enemies/scout.png',
      spawnWeight: 25
    },
    {
      id: 'tank',
      name: 'Juggernaut',
      health: 300,
      maxHealth: 300,
      speed: 0.4,
      damage: 8,
      attackRange: 60,
      spawnCost: 0,
      imagePath: '../images/enemies/juggernaut.png',
      spawnWeight: 10
    },
    {
      id: 'ranged',
      name: 'Sniper',
      health: 90,
      maxHealth: 90,
      speed: 0.6,
      damage: 5,
      attackRange: 150,
      spawnCost: 0,
      imagePath: '../images/enemies/sniper.png',
      spawnWeight: 5
    }
  ]);

  const [enemySpawnPoints, setEnemySpawnPoints] = useState<EnemySpawnPoint[]>([
    {
      id: 'enemy-hq',
      controlPointId: 'cp-10',
      position: { x: 2200, y: 450 },
      lastSpawnTime: Date.now(),
      spawnInterval: 15000,
      spawnPower: 1
    }
  ]);

  const [enemyWaves, setEnemyWaves] = useState<EnemyWave[]>([]);
  const [enemyAIState, setEnemyAIState] = useState<EnemyAIState>({
    aggression: 1,
    lastWaveTime: Date.now(),
    waveCooldown: 6000,
    spawnBudget: 10
  });

  const [transports, setTransports] = useState<Record<string, TransportStatus>>({});
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
  const [showTransportUI, setShowTransportUI] = useState(false);

  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    scale: 1
  });
  const [mapDimensions] = useState({ width: 1008 * 10, height: 663 * 10 });
  const [selectedUnitInfo, setSelectedUnitInfo] = useState<Unit | null>(null);
  const [draggingUnitType, setDraggingUnitType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [autoSpawnEnabled, setAutoSpawnEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mapBackgroundType, setMapBackgroundType] = useState<'static' | 'satellite' | 'satellite-streets'>('satellite');

  const [economy, setEconomy] = useState<GameEconomy>({
    money: 10000000,
    income: 0,
    lastUpdate: Date.now()
  });

  const unitCost = 2000000;

  return (
    <GameStateContext.Provider value={{
      units,
      controlPoints,
      seaAreas,
      selectedArsenalUnits,
      unitTemplates,
      enemyTypes,
      enemySpawnPoints,
      enemyWaves,
      enemyAIState,
      transports,
      selectedTransport,
      showTransportUI,
      viewport,
      mapDimensions,
      selectedUnitInfo,
      draggingUnitType,
      isDragging,
      isMapDragging,
      isFullscreen,
      showGrid,
      isCtrlPressed,
      autoSpawnEnabled,
      isLoading,
      loadingProgress,
      mapBackgroundType,
      economy,
      unitCost,
      setUnits,
      setControlPoints,
      setSelectedArsenalUnits,
      setUnitTemplates,
      setEnemySpawnPoints,
      setEnemyWaves,
      setEnemyAIState,
      setTransports,
      setSelectedTransport,
      setShowTransportUI,
      setViewport,
      setSelectedUnitInfo,
      setDraggingUnitType,
      setIsDragging,
      setIsMapDragging,
      setIsFullscreen,
      setShowGrid,
      setIsCtrlPressed,
      setAutoSpawnEnabled,
      setIsLoading,
      setLoadingProgress,
      setMapBackgroundType,
      setEconomy
    }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

  'use client';
  import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
  import { Maximize2, Minimize2, Target, Shield, Zap, DollarSign, Eye, EyeOff, Settings, Info, X, Truck } from 'lucide-react';
  import { TransportUI } from '@/components/ui/transportui';
import { stat } from 'fs';

  interface Player {
    id: string;
    socketId: string;
    name: string;
    team: 'red' | 'blue';
  }

  interface Spectator {
    id: string;
    socketId: string;
    name: string;
  }

  interface Position {
    x: number;
    y: number;
  }

  interface TransportCapabilities {
    [key: string]: boolean; // Add index signature
    infantry?: boolean;
    recon?: boolean;
    robotics?: boolean;
    pfvs?: boolean;
    mbt?: boolean;
    artillery?: boolean;
    aas?: boolean;
    helicopters?: boolean;
    fighterjets?: boolean;
    transportation?: boolean;
    bomber?: boolean;
    destroyers?: boolean;
    carrier?: boolean;
  }

  interface TransportStatus {
    transportId: string;
    carriedUnits: string[]; // IDs of carried units
    loadingQueue: string[]; // Units queued to load
    unloadingQueue: string[]; // Units queued to unload
    capacityUsed: number;
    loadingPoint?: Position; // Where units should go to load
    unloadingPoint?: Position; // Where units should go to unload
  }

  interface SeaArea {
    id: string;
    position: Position;
    width: number;
    height: number;
    type: 'deep-sea';
  }

  interface UnitCapabilities {
    canFloat?: boolean;
    canFly?: boolean;
    isAmphibious?: boolean;
  }

  interface Unit {
    id: string;
    type: 'player' | 'enemy';
    position: Position;
    destination: Position | null;
    health: number;
    maxHealth: number;
    attackRange: number;
    selected: boolean;
    unitId: string;
    name: string;
    category: string;
    imagePath: string;
    description?: string;
    stats?: any;
    transportCapabilities?: TransportCapabilities;
    maxCapacity?: number;
    canBeTransported?: boolean;
    transportSize?: number;
    carriedBy?: string;
    isTransport?: boolean;
    loading?: boolean;
    unloading?: boolean;
    capabilities?: UnitCapabilities; // Add capabilities
    visionRange?: number; // Add vision range
    isVisible?: boolean;
  }

  interface UnitTemplate {
    id: string;
    type: 'player';
    class: string;
    name: string;
    health: number;
    attackRange: number;
    color: string;
    icon: string;
    imagePath: string;
    category: string;
    transportCapabilities?: TransportCapabilities;
    maxCapacity?: number;
    canBeTransported?: boolean;
    transportSize?: number;
    isTransport?: boolean;
    capabilities?: UnitCapabilities; // Add capabilities
    visionRange?: number
  }

  interface Viewport {
    x: number;
    y: number;
    scale: number;
  }

  interface ControlPoint {
    id: string;
    position: Position;
    radius: number;
    ownedByPlayer: boolean;
    color: string;
    progress: number;
  }

  interface GameEconomy {
    money: number;
    income: number;
    lastUpdate: number;
  }

  interface SelectedUnitFromDB {
    id: number;
    unit_id: string;
    category: string;
    selected_order: number;
    name: string;
    image_path: string;
    description: string;
    stats: any;
    transport_capacity: any;
    max_capacity?: number;
    can_be_transported?: boolean;
    transport_size?: number;
  }

  interface DestinationWithTransportId extends Position {
    transportId?: string;
  }
  
interface EnemySpawnPoint {
  id: string;
  controlPointId: string;
  position: Position;
  lastSpawnTime: number;
  spawnInterval: number;
  spawnPower: number;
}

interface EnemyWave {
  id: string;
  type: string;
  count: number;
  spawnPointId: string;
  destination?: Position | null;
}

interface EnemyAIState {
  aggression: number;
  lastWaveTime: number;
  waveCooldown: number;
  spawnBudget: number;
}

interface EnemyTypeConfig {
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

// Your existing interfaces should also include these updates:
interface Unit {
  id: string;
  type: 'player' | 'enemy';
  position: Position;
  destination: Position | null;
  health: number;
  maxHealth: number; // Add this
  attackRange: number;
  selected: boolean;
  unitId: string; // This should match enemyTypes id for enemies
  name: string;
  category: string;
  imagePath: string;
  description?: string;
  stats?: any;
  transportCapabilities?: TransportCapabilities;
  maxCapacity?: number;
  canBeTransported?: boolean;
  transportSize?: number;
  carriedBy?: string;
  isTransport?: boolean;
  loading?: boolean;
  unloading?: boolean;
  capabilities?: UnitCapabilities;
  visionRange?: number;
  isVisible?: boolean;
}

  export default function DropzoneGame() {
    // Game state
    const [selectedArsenalUnits, setSelectedArsenalUnits] = useState<SelectedUnitFromDB[]>([]);
    const [unitTemplates, setUnitTemplates] = useState<UnitTemplate[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [mapDimensions, setMapDimensions] = useState({ width: 1008 * 10, height: 663 * 10 }); // 3x bigger
    const [draggingUnitType, setDraggingUnitType] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
    const [isMapDragging, setIsMapDragging] = useState(false);
    const [mapDragStart, setMapDragStart] = useState<Position>({ x: 0, y: 0 });
    const [transports, setTransports] = useState<Record<string, TransportStatus>>({});
    const [selectedTransport, setSelectedTransport] = useState<string | null>(null);
    const [showTransportUI, setShowTransportUI] = useState(false);
    const [lastClickedUnit, setLastClickedUnit] = useState<{id: string, time: number} | null>(null);
    const animationFrameRef = useRef<number>();
    const lastUpdateTimeRef = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [seaAreas, setSeaAreas] = useState<SeaArea[]>([
      { id: 'sea-1', position: { x: 0, y: 1000 }, width: 4000, height: 3000, type: 'deep-sea' },
    ]);
    const [viewport, setViewport] = useState<Viewport>({ 
      x: 0, 
      y: 0, 
      scale: 1
    });
    const [controlPoints, setControlPoints] = useState<ControlPoint[]>([
      { id: 'cp-1', position: { x: 200, y: 150 }, radius: 60, ownedByPlayer: true, color: '#44ff44ff', progress: 0 },
      { id: 'cp-2', position: { x: 600, y: 300 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-3', position: { x: 400, y: 450 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-4', position: { x: 800, y: 200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-5', position: { x: 300, y: 500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-6', position: { x: 1300, y: 500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-7', position: { x: 900, y: 200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-8', position: { x: 450, y: 1400 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-9', position: { x: 1500, y: 800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-10', position: { x: 2200, y: 450 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-11', position: { x: 1800, y: 1200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-12', position: { x: 2800, y: 900 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-13', position: { x: 3500, y: 600 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-14', position: { x: 4200, y: 1500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-15', position: { x: 3100, y: 1800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-16', position: { x: 5000, y: 800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-17', position: { x: 4800, y: 2200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-18', position: { x: 3800, y: 2800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-19', position: { x: 5500, y: 3200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-20', position: { x: 6200, y: 1500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-21', position: { x: 7000, y: 2500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-22', position: { x: 4500, y: 4000 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-23', position: { x: 5800, y: 4800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-24', position: { x: 7200, y: 3800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-25', position: { x: 8000, y: 1800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-26', position: { x: 8500, y: 3200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-27', position: { x: 9200, y: 4500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-28', position: { x: 7500, y: 5500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-29', position: { x: 6800, y: 6200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-30', position: { x: 9500, y: 5800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-31', position: { x: 3000, y: 5200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-32', position: { x: 2000, y: 3800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-33', position: { x: 1500, y: 4800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-34', position: { x: 2500, y: 6200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-35', position: { x: 1000, y: 3500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-36', position: { x: 600, y: 5800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-37', position: { x: 9000, y: 1200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-38', position: { x: 9800, y: 3000 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-39', position: { x: 8800, y: 6500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-40', position: { x: 5200, y: 5800 }, radius: 60, ownedByPlayer: true, color: '#44ff44ff', progress: 0 }
    ]);
    const [economy, setEconomy] = useState<GameEconomy>({
      money: 10000000,
      income: 0,
      lastUpdate: Date.now()
    });
    
    // UI state
const [isFullscreen, setIsFullscreen] = useState(false);
const [showGrid, setShowGrid] = useState(true);
const [isCtrlPressed, setIsCtrlPressed] = useState(false);
const [unitCost] = useState(2000000);
const [selectedUnitInfo, setSelectedUnitInfo] = useState<Unit | null>(null);
const mapRef = useRef<HTMLDivElement>(null);
const sidebarRef = useRef<HTMLDivElement>(null);
const MAP_PADDING = 50;

// Enemy configuration
const [enemyTypes] = useState([
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
    spawnWeight: 60 // Higher weight = more common
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
    spawnInterval: 15000, // 30 seconds base
    spawnPower: 1 // Increases with more controlled points
  }
]);

const [enemyWaves, setEnemyWaves] = useState<EnemyWave[]>([]);
const [enemyAIState, setEnemyAIState] = useState({
  aggression: 1, // Increases over time
  lastWaveTime: Date.now(),
  waveCooldown: 6000, // 1 minute between major waves
  spawnBudget: 10 // Increases with controlled points
});

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  recon: 'Recon',
  robotics: 'Robotics',
  infantry: 'Infantry',
  pfvs: 'Armored Vehicles',
  mbt: 'MBTs',
  artillery: 'Artillery',
  aas: 'Anti-Aircraft',
  helicopters: 'Helicopters',
  fighterjets: 'Fighter Jets',
  transportation: 'Transportation',
  bomber: 'Bomber',
  destroyers: 'Destroyers',
  carrier: 'Carrier'
};

// Initialize enemies as moving units with destinations
useEffect(() => {
  const initialEnemies: Unit[] = [
    { 
      id: 'enemy-1', 
      type: 'enemy', 
      position: { x: 400, y: 300 }, 
      destination: { x: 200, y: 150 },
      health: 120, 
      maxHealth: 120, 
      attackRange: 50, 
      selected: false, 
      unitId: 'basic', // Matches enemyTypes[0].id
      name: 'Grunt', 
      category: 'enemy', 
      imagePath: '../images/enemies/grunt.png',
      isVisible: false
    },
    { 
      id: 'enemy-2', 
      type: 'enemy', 
      position: { x: 550, y: 20 }, 
      destination: { x: 200, y: 150 },
      health: 120, 
      maxHealth: 120, 
      attackRange: 50, 
      selected: false, 
      unitId: 'basic', // Matches enemyTypes[0].id
      name: 'Grunt', 
      category: 'enemy', 
      imagePath: '../images/enemies/grunt.png',
      isVisible: false
    },
    { 
      id: 'enemy-3', 
      type: 'enemy', 
      position: { x: 234, y: 197 }, 
      destination: { x: 200, y: 150 },
      health: 90, 
      maxHealth: 90, 
      attackRange: 150, 
      selected: false, 
      unitId: 'ranged', // Matches enemyTypes[3].id
      name: 'Sniper', 
      category: 'enemy', 
      imagePath: '../images/enemies/sniper.png',
      isVisible: false
    },
    { 
      id: 'enemy-4', 
      type: 'enemy', 
      position: { x: 456, y: 452 }, 
      destination: { x: 200, y: 150 },
      health: 80, 
      maxHealth: 80, 
      attackRange: 40, 
      selected: false, 
      unitId: 'fast', // Matches enemyTypes[1].id
      name: 'Scout', 
      category: 'enemy', 
      imagePath: '../images/enemies/scout.png',
      isVisible: false
    },
  ];
  
  // Set the enemies to the units state
  setUnits(initialEnemies);
}, []);

// Load selected units from database
useEffect(() => {
  const loadSelectedUnits = async () => {
    if (selectedArsenalUnits.length > 0) return;
    
    try {
      const response = await fetch('/api/units/selected?userId=default_user');
      if (response.ok) {
        const data = await response.json();
        setSelectedArsenalUnits(data);
        
        const templates = data.map((unit: SelectedUnitFromDB) => {
          const safeParseJSON = (data: any) => {
            if (!data) return {};
            if (typeof data === 'object') return data;
            if (typeof data === 'string') {
              try {
                return JSON.parse(data);
              } catch {
                return {};
              }
            }
            return {};
          };
          
          const stats = safeParseJSON(unit.stats);
          
          const getUnitProperties = () => {
            let health = 100;
            let attackRange = 80;
            let color = '#2563eb';
            let capabilities: UnitCapabilities = {};
            let visionRange = 0;
            
            switch(unit.category) {
              case 'recon': 
                health = 70; attackRange = 0; color = '#8b5cf6';
                capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                visionRange = 3000;
                break;
              case 'robotics': 
                health = 150; attackRange = 90; color = '#10b981';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'infantry': 
                health = 100; attackRange = 80; color = '#2563eb';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'pfvs': 
                health = 300; attackRange = 150; color = '#dc2626';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'mbt': 
                health = 500; attackRange = 200; color = '#7c2d12';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'artillery': 
                health = 150; attackRange = 300; color = '#f59e0b';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'aas': 
                health = 180; attackRange = 180; color = '#059669';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'helicopters': 
                health = 200; attackRange = 120; color = '#1d4ed8';
                capabilities = { canFly: true };
                break;
              case 'fighterjets': 
                health = 180; attackRange = 250; color = '#0ea5e9';
                capabilities = { canFly: true };
                break;
              case 'transportation': 
                health = 250; attackRange = 50; color = '#6366f1';
                capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                break;
              case 'bomber': 
                health = 350; attackRange = 350; color = '#be123c';
                capabilities = { canFly: true };
                break;
              case 'destroyers': 
                health = 400; attackRange = 280; color = '#1e3a8a';
                capabilities = { canFloat: true, isAmphibious: false };
                break;
              case 'carrier': 
                health = 600; attackRange = 150; color = '#0c4a6e';
                capabilities = { canFloat: true, isAmphibious: false };
                break;
              default:
                if (stats.health) health = stats.health;
                if (stats.attackRange) attackRange = stats.attackRange;
                if (stats.color) color = stats.color;
                capabilities = stats.capabilities || {};
            }
            
            if (stats.health) health = stats.health;
            if (stats.attackRange) attackRange = stats.attackRange;
            if (stats.color) color = stats.color;
            if (stats.visionRange) visionRange = stats.visionRange;
            if (stats.capabilities) capabilities = { ...capabilities, ...stats.capabilities };
            
            return { health, attackRange, color, capabilities, visionRange };
          };
          
          const properties = getUnitProperties();
          
          const transportCapabilities = unit.transport_capacity ? 
            (typeof unit.transport_capacity === 'string' ? 
              JSON.parse(unit.transport_capacity) : 
              unit.transport_capacity) : 
            {};

          const maxCapacity = unit.max_capacity || 0;
          const isTransport = maxCapacity > 0;
          
          return {
            id: unit.unit_id,
            type: 'player' as const,
            class: unit.category,
            name: unit.name,
            health: properties.health,
            attackRange: properties.attackRange,
            color: properties.color,
            icon: '',
            imagePath: unit.image_path,
            category: unit.category,
            transportCapabilities,
            maxCapacity,
            canBeTransported: unit.can_be_transported || false,
            transportSize: unit.transport_size || 1,
            isTransport,
            capabilities: properties.capabilities,
            visionRange: properties.visionRange
          };
        });
        
        setUnitTemplates(templates);
      }
    } catch (error) {
      console.error('Error loading selected units:', error);
    }
  };
  
  loadSelectedUnits();
}, []);

// Memoize unit templates for performance
const unitTemplatesMemo = useMemo(() => unitTemplates, [unitTemplates]);

// Check if position is in conquered area
const isInConqueredArea = useCallback((position: Position): boolean => {
  return controlPoints.some(cp => {
    if (!cp.ownedByPlayer) return false;
    const dx = position.x - cp.position.x;
    const dy = position.y - cp.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= cp.radius;
  });
}, [controlPoints]);

// Check if position is in sea area
const isInSeaArea = useCallback((position: Position): { isSea: boolean; type: 'sea' | 'deep-sea' | null } => {
  for (const seaArea of seaAreas) {
    if (
      position.x >= seaArea.position.x && 
      position.x <= seaArea.position.x + seaArea.width &&
      position.y >= seaArea.position.y && 
      position.y <= seaArea.position.y + seaArea.height
    ) {
      return { isSea: true, type: seaArea.type };
    }
  }
  return { isSea: false, type: null };
}, [seaAreas]);

// Check if unit can be placed at position
const canPlaceUnitAtPosition = useCallback((unit: UnitTemplate, position: Position): { valid: boolean; reason?: string } => {
  const seaCheck = isInSeaArea(position);
  
  // Naval units (destroyers, carrier) can only be placed in deep-sea
  if (unit.category === 'destroyers' || unit.category === 'carrier') {
    if (!seaCheck.isSea || seaCheck.type !== 'deep-sea') {
      return { 
        valid: false, 
        reason: `${unit.name} can only be deployed in deep sea areas!` 
      };
    }
    return { valid: true };
  }
  
  // Flying units can be placed anywhere
  if (unit.capabilities?.canFly) {
    return { valid: true };
  }
  
  // Land units cannot be placed in sea areas
  if (seaCheck.isSea) {
    return { 
      valid: false, 
      reason: `${unit.name} cannot be deployed in water!` 
    };
  }
  
  return { valid: true };
}, [isInSeaArea]);

// Function to calculate if enemy is visible to player units
const calculateVisibility = useCallback(() => {
  setUnits(prevUnits => {
    const updatedUnits = [...prevUnits];
    const playerUnits = updatedUnits.filter(u => u.type === 'player' && u.health > 0);
    const enemyUnits = updatedUnits.filter(u => u.type === 'enemy' && u.health > 0);
    
    // First, mark all enemies as invisible
    enemyUnits.forEach(enemy => {
      enemy.isVisible = false;
    });
    
    // Then check visibility from each player unit
    playerUnits.forEach(playerUnit => {
      const visionRange = playerUnit.visionRange || 0;
      
      enemyUnits.forEach(enemy => {
        if (enemy.health > 0) {
          const dx = playerUnit.position.x - enemy.position.x;
          const dy = playerUnit.position.y - enemy.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If within vision range, make enemy visible
          if (distance <= visionRange) {
            enemy.isVisible = true;
          }
        }
      });
    });
    
    return updatedUnits;
  });
}, []);

// Check if unit can move through position
const canUnitMoveThroughPosition = useCallback((unit: Unit, position: Position): boolean => {
  const seaCheck = isInSeaArea(position);
  
  // Flying units can move anywhere
  if (unit.capabilities?.canFly) {
    return true;
  }
  
  // Naval units can only move in sea areas
  if (unit.capabilities?.canFloat) {
    return seaCheck.isSea;
  }
  
  // Amphibious units can move anywhere
  if (unit.capabilities?.isAmphibious) {
    return true;
  }
  
  // Land units cannot move through sea
  return !seaCheck.isSea;
}, [isInSeaArea]);

// Economy system
const economyIntervalRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (economyIntervalRef.current) {
    clearInterval(economyIntervalRef.current);
  }
  
  economyIntervalRef.current = setInterval(() => {
    setEconomy(prev => {
      const now = Date.now();
      const elapsedSeconds = (now - prev.lastUpdate) / 1000;
      
      // Calculate current income based on controlled points
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
}, [controlPoints]);

// Sync transports with carried units
useEffect(() => {
  const newTransports = { ...transports };
  let updated = false;
  
  // Update each transport's carried units
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
}, [units, transports]);

// Keyboard controls
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Control') setIsCtrlPressed(true);
    if (e.key === 'Escape') {
      setUnits(prev => prev.map(unit => ({ ...unit, selected: false })));
      setSelectedUnitInfo(null);
      setShowTransportUI(false);
      setSelectedTransport(null);
    }
    if (e.key === 's' || e.key === 'S') {
      setUnits(prev => prev.map(unit => {
        if (unit.selected && unit.type === 'player' && unit.health > 0) {
          return { ...unit, destination: null };
        }
        return unit;
      }));
    }
    if (e.key === 'g' || e.key === 'G') setShowGrid(prev => !prev);
    if (e.key === 'm' || e.key === 'M') {
      // Debug: Force enemy wave
      spawnEnemyWaveFromAllPoints();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control') setIsCtrlPressed(false);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, []);

// ENEMY AI FUNCTIONS

// Update enemy spawn points based on controlled points
const updateEnemySpawnPoints = useCallback(() => {
  const enemyControlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer);
  
  // Create/update spawn points for enemy-controlled points
  const newSpawnPoints: EnemySpawnPoint[] = enemyControlledPoints.map(cp => {
    const existingSpawn = enemySpawnPoints.find(sp => sp.controlPointId === cp.id);
    
    // Calculate spawn power based on distance from player base (closer = more dangerous)
    const playerBase = controlPoints.find(cp => cp.id === 'cp-1');
    let spawnPower = 1;
    if (playerBase) {
      const dx = cp.position.x - playerBase.position.x;
      const dy = cp.position.y - playerBase.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      spawnPower = Math.max(1, Math.min(3, 3000 / distance));
    }
    
    return {
      id: existingSpawn?.id || `enemy-spawn-${cp.id}`,
      controlPointId: cp.id,
      position: cp.position,
      lastSpawnTime: existingSpawn?.lastSpawnTime || Date.now(),
      spawnInterval: existingSpawn?.spawnInterval || 30000,
      spawnPower: existingSpawn?.spawnPower || spawnPower
    };
  });
  
  setEnemySpawnPoints(newSpawnPoints);
}, [controlPoints, enemySpawnPoints]);

// Select random enemy type based on weights
const getRandomEnemyType = useCallback(() => {
  const totalWeight = enemyTypes.reduce((sum, type) => sum + type.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const type of enemyTypes) {
    random -= type.spawnWeight;
    if (random <= 0) {
      return type;
    }
  }
  
  return enemyTypes[0]; // Fallback
}, [enemyTypes]);

// Spawn enemies from a specific point
const spawnEnemyWave = useCallback((spawnPointId: string, forceType?: string, count?: number) => {
  const spawnPoint = enemySpawnPoints.find(sp => sp.id === spawnPointId);
  if (!spawnPoint) return;

  const controlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer).length;
  const baseCount = count || Math.max(1, Math.floor(controlledPoints / 2) + 1);
  
  const newEnemies: Unit[] = [];
  
  for (let i = 0; i < baseCount; i++) {
    const enemyType = forceType ? enemyTypes.find(et => et.id === forceType) : getRandomEnemyType();
    if (!enemyType) continue;
    
    // Add some randomness to spawn position
    const offsetX = (Math.random() - 0.5) * 80;
    const offsetY = (Math.random() - 0.5) * 80;
    
    const basePosition = {
      x: spawnPoint.position.x + offsetX,
      y: spawnPoint.position.y + offsetY
    };
    
    // Choose a target
    let target: Position | null = null;
    
    // Find nearest player-controlled point
    const playerPoints = controlPoints.filter(cp => cp.ownedByPlayer);
    if (playerPoints.length > 0) {
      // Find nearest player-controlled point
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
    
    // If no target, go towards center of map
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
  
  // Add the new enemies to the game
  if (newEnemies.length > 0) {
    setUnits(prev => [...prev, ...newEnemies]);
  }
  
  // Update spawn point's last spawn time
  setEnemySpawnPoints(prev => prev.map(sp => 
    sp.id === spawnPointId 
      ? { ...sp, lastSpawnTime: Date.now() }
      : sp
  ));
}, [enemySpawnPoints, enemyTypes, getRandomEnemyType, controlPoints, mapDimensions]);

// Spawn enemies from all points (for waves) xxx
const spawnEnemyWaveFromAllPoints = useCallback(() => {
  const now = Date.now();
  
  enemySpawnPoints.forEach(spawnPoint => {
    const timeSinceLastSpawn = now - spawnPoint.lastSpawnTime;
    
    // Only spawn if enough time has passed
    if (timeSinceLastSpawn >= spawnPoint.spawnInterval) {
      // Scale spawn count with spawn power
      const spawnCount = Math.floor(spawnPoint.spawnPower * 2);
      if (spawnCount > 0) {
        spawnEnemyWave(spawnPoint.id, undefined, spawnCount);
      }
    }
  });
}, [enemySpawnPoints, spawnEnemyWave]);

// Update enemy AI state
const updateEnemyAI = useCallback(() => {
  const now = Date.now();
  const controlledPoints = controlPoints.filter(cp => !cp.ownedByPlayer).length;
  
  // Always try to spawn from all points
  spawnEnemyWaveFromAllPoints();
  
  // Occasionally spawn a major wave (every 2 minutes)
  if (now - enemyAIState.lastWaveTime >= 120000) {
    console.log("MAJOR WAVE INCOMING!");
    
    enemySpawnPoints.forEach(spawnPoint => {
      const waveSize = Math.max(2, Math.floor(controlledPoints * 1.5));
      spawnEnemyWave(spawnPoint.id, undefined, waveSize);
    });
    
    setEnemyAIState(prev => ({
      ...prev,
      lastWaveTime: now
    }));
  }
}, [enemyAIState.lastWaveTime, controlPoints, enemySpawnPoints, spawnEnemyWave, spawnEnemyWaveFromAllPoints]);

// Control point capture system - COMBINED for both player and enemy conquest
const captureIntervalRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (captureIntervalRef.current) {
    clearInterval(captureIntervalRef.current);
  }

  captureIntervalRef.current = setInterval(() => {
    setUnits(currentUnits => {
      setControlPoints(prevCPs => {
        return prevCPs.map(cp => {
          // Count player units in range (excluding carried units)
          const playerUnitsInRange = currentUnits.filter(unit => 
            unit.type === 'player' && 
            unit.health > 0 && 
            !unit.carriedBy &&
            Math.sqrt(
              Math.pow(unit.position.x - cp.position.x, 2) + 
              Math.pow(unit.position.y - cp.position.y, 2)
            ) < cp.radius
          ).length;
          
          // Count enemy units in range
          const enemyUnitsInRange = currentUnits.filter(unit => 
            unit.type === 'enemy' && 
            unit.health > 0 &&
            Math.sqrt(
              Math.pow(unit.position.x - cp.position.x, 2) + 
              Math.pow(unit.position.y - cp.position.y, 2)
            ) < cp.radius
          ).length;
          
          // If it's a player-controlled point
          if (cp.ownedByPlayer) {
            // If enemies outnumber players, capture progress goes up (ENEMY capturing)
            if (enemyUnitsInRange > playerUnitsInRange) {
              const captureSpeed = Math.min(3, Math.floor(enemyUnitsInRange / 2));
              const newProgress = Math.min(100, cp.progress + captureSpeed);
              if (newProgress >= 100) {
                // Captured by enemies
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
                color: '#ffaa00'
              };
            } 
            // If no enemies and progress > 0, decay
            else if (enemyUnitsInRange === 0 && cp.progress > 0) {
              return { ...cp, progress: Math.max(0, cp.progress - 2) };
            }
          } 
          // If it's an enemy-controlled point
          else {
            // If players outnumber enemies, capture progress goes up (PLAYER capturing)
            if (playerUnitsInRange > enemyUnitsInRange) {
              const newProgress = Math.min(100, cp.progress + 10);
              if (newProgress >= 100) {
                // Captured by players
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
                color: '#ffaa00'
              };
            } 
            // If no players and progress > 0, decay
            else if (playerUnitsInRange === 0 && cp.progress > 0) {
              return { ...cp, progress: Math.max(0, cp.progress - 5) };
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
}, []); // Empty dependency array - runs once

// GAME LOOP - Enhanced with enemy AI
const gameLoopRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (gameLoopRef.current) {
    clearInterval(gameLoopRef.current);
  }
  
  gameLoopRef.current = setInterval(() => {
    setUnits(prevUnits => {
      const updatedUnits = [...prevUnits];
      let unitsChanged = false;
      
      // Filter out destroyed units
      const aliveUnits = updatedUnits.filter(unit => {
        if (unit.health <= 0) {
          unitsChanged = true;
          
          // If this unit was being carried, update transport status
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
      
      // Move player units with terrain restrictions
      aliveUnits.forEach(unit => {
        if (unit.type === 'player' && unit.destination && unit.health > 0 && !unit.carriedBy) {
          const dx = unit.destination.x - unit.position.x;
          const dy = unit.destination.y - unit.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            let speed = 1;
            if (unit.category === 'recon') speed = 3.5;
            else if (unit.category === 'infantry') speed = 0.2;
            else if (unit.category === 'robotics') speed = 0.4; 
            else if (unit.category === 'pfvs') speed = 0.5;
            else if (unit.category === 'mbt') speed = 0.5;
            else if (unit.category === 'artillery') speed = 0.6; 
            else if (unit.category === 'aas') speed = 0.5; 
            else if (unit.category === 'helicopters') speed = 1; 
            else if (unit.category === 'fighterjets') speed = 2;
            else if (unit.category === 'transportation') speed = 2;
            else if (unit.category === 'bomber') speed = 1.5;
            else if (unit.category === 'destroyers') speed = 0.8;
            else if (unit.category === 'carrier') speed = 0.5;
            
            // Calculate next position
            const nextX = unit.position.x + (dx / distance) * speed;
            const nextY = unit.position.y + (dy / distance) * speed;
            
            // Check if unit can move to next position
            const canMove = canUnitMoveThroughPosition(unit, { x: nextX, y: nextY });
            
            if (canMove) {
              unit.position.x = nextX;
              unit.position.y = nextY;
              
              unit.position.x = Math.max(0, Math.min(mapDimensions.width, unit.position.x));
              unit.position.y = Math.max(0, Math.min(mapDimensions.height, unit.position.y));
            } else {
              // Unit cannot move into sea/land, stop movement
              unit.destination = null;
            }
          } else {
            unit.destination = null;
          }
        }
      });

      // ENEMY MOVEMENT AND COMBAT
      aliveUnits.forEach(unit => {
        if (unit.type === 'enemy' && unit.health > 0) {
          const enemyType = enemyTypes.find(et => et.id === unit.unitId);
          const speed = enemyType?.speed || 0.5;
          
          // Move towards destination
          if (unit.destination) {
            const dx = unit.destination.x - unit.position.x;
            const dy = unit.destination.y - unit.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 10) {
              unit.position.x += (dx / distance) * speed;
              unit.position.y += (dy / distance) * speed;
              
              // Keep within map bounds
              unit.position.x = Math.max(0, Math.min(mapDimensions.width, unit.position.x));
              unit.position.y = Math.max(0, Math.min(mapDimensions.height, unit.position.y));
            } else {
              // Reached destination, find new target
              unit.destination = null;
            }
          }
          
          // Find new target if needed
          if (!unit.destination) {
            const playerUnits = aliveUnits.filter(u => u.type === 'player' && u.health > 0);
            const playerPoints = controlPoints.filter(cp => cp.ownedByPlayer);
            
            // Prioritize nearby player units for attack
            let closestPlayerUnit: Unit | null = null;
            let minDistance = Infinity;
            
            playerUnits.forEach(playerUnit => {
              const dx = unit.position.x - playerUnit.position.x;
              const dy = unit.position.y - playerUnit.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < minDistance && distance < 500) { // Search radius
                minDistance = distance;
                closestPlayerUnit = playerUnit;
              }
            });
            
            if (closestPlayerUnit && minDistance < 300) {
              // Attack nearby player unit
              unit.destination = closestPlayerUnit.position;
            } else if (playerPoints.length > 0) {
              // Target nearest player-controlled point
              let nearestPoint = playerPoints[0];
              let minPointDistance = Infinity;
              
              playerPoints.forEach(point => {
                const dx = unit.position.x - point.position.x;
                const dy = unit.position.y - point.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < minPointDistance) {
                  minPointDistance = distance;
                  nearestPoint = point;
                }
              });
              
              unit.destination = nearestPoint.position;
            } else {
              // Wander randomly
              unit.destination = {
                x: unit.position.x + (Math.random() - 0.5) * 200,
                y: unit.position.y + (Math.random() - 0.5) * 200
              };
            }
          }
          
          // Attack nearby player units
          const attackRange = unit.attackRange || 50;
          aliveUnits.forEach(playerUnit => {
            if (playerUnit.type === 'player' && playerUnit.health > 0) {
              const dx = unit.position.x - playerUnit.position.x;
              const dy = unit.position.y - playerUnit.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < attackRange) {
                const enemyType = enemyTypes.find(et => et.id === unit.unitId);
                const damage = enemyType?.damage || 2;
                playerUnit.health = Math.max(0, playerUnit.health - damage);
                
                // Stop moving to attack
                if (distance < attackRange * 0.8) {
                  unit.destination = null;
                }
              }
            }
          });
        }
      });

      // Player combat against enemies
      aliveUnits.forEach(unit => {
        if (unit.type === 'player' && unit.health > 0) {
          aliveUnits.forEach(enemy => {
            if (enemy.type === 'enemy' && enemy.health > 0) {
              const dx = unit.position.x - enemy.position.x;
              const dy = unit.position.y - enemy.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < unit.attackRange) {
                let damage = 10;
                if (unit.category === 'artillery' || unit.category === 'bomber') damage = 25;
                else if (unit.category === 'mbt') damage = 20;
                else if (unit.category === 'pfvs') damage = 15;
                else if (unit.category === 'recon') damage = 8;
                else if (unit.category === 'infantry') damage = 5;
                else if (unit.category === 'helicopters') damage = 12;
                else if (unit.category === 'fighterjets') damage = 15;
                
                enemy.health = Math.max(0, enemy.health - damage);
              }
            }
          });
        }
      });

      // Transport loading/unloading logic
      aliveUnits.forEach(unit => {
        // If unit is moving to load onto a transport
        if (unit.loading) {
          const destination = unit.destination as DestinationWithTransportId | null;
          const transportId = destination?.transportId;
          
          if (transportId) {
            const transport = aliveUnits.find(t => t.id === transportId);
            if (transport && transport.health > 0) {
              const dx = unit.position.x - transport.position.x;
              const dy = unit.position.y - transport.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 50) { // Close enough to load
                unit.carriedBy = transportId;
                unit.position = transport.position; // Match transport position
                unit.destination = null;
                unit.loading = false;
                
                // Update transport status
                setTransports(prev => ({
                  ...prev,
                  [transportId]: {
                    ...prev[transportId],
                    carriedUnits: [...(prev[transportId]?.carriedUnits || []), unit.id],
                    capacityUsed: (prev[transportId]?.capacityUsed || 0) + (unit.transportSize || 1)
                  }
                }));
              }
            } else {
              // Transport no longer exists, stop loading
              unit.loading = false;
              unit.destination = null;
            }
          }
        }
        
        // If unit is being carried, follow transport exactly
        if (unit.carriedBy) {
          const transport = aliveUnits.find(t => t.id === unit.carriedBy);
          if (transport && transport.health > 0) {
            unit.position.x = transport.position.x;
            unit.position.y = transport.position.y;
          } else {
            // Transport destroyed, drop unit at transport's last position
            unit.carriedBy = undefined;
          }
        }
      });

      // Calculate visibility after all position updates
      const playerUnits = aliveUnits.filter(u => u.type === 'player' && u.health > 0);
      const enemyUnits = aliveUnits.filter(u => u.type === 'enemy' && u.health > 0);
      
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

      return aliveUnits;
    });
  }, 1000 / 60);

  return () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };
}, [mapDimensions, canUnitMoveThroughPosition, transports, enemyTypes, controlPoints]);


// Enemy AI and spawning system
const enemyAISpawnRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (enemyAISpawnRef.current) {
    clearInterval(enemyAISpawnRef.current);
  }

  enemyAISpawnRef.current = setInterval(() => {
    updateEnemySpawnPoints();
    updateEnemyAI();
  }, 5000); // Update AI every 5 seconds

  return () => {
    if (enemyAISpawnRef.current) {
      clearInterval(enemyAISpawnRef.current);
    }
  };
}, [updateEnemySpawnPoints, updateEnemyAI]);

// Event handlers (keep existing handlers, just updating handleMapClick)
const handleUnitDragStart = useCallback((e: React.DragEvent, unitType: string) => {
  e.dataTransfer.setData('unitType', unitType);
  setIsDragging(true);
  setDraggingUnitType(unitType);
}, []);

const handleUnitDragEnd = useCallback(() => {
  setIsDragging(false);
  setDraggingUnitType(null);
}, []);

const handleMapClick = useCallback((e: React.MouseEvent) => {
  if (!mapRef.current || showTransportUI) return;
  
  const rect = mapRef.current.getBoundingClientRect();
  const clickX = (e.clientX - rect.left - viewport.x) / viewport.scale;
  const clickY = (e.clientY - rect.top - viewport.y) / viewport.scale;
  
  const boundedX = Math.max(0, Math.min(mapDimensions.width, clickX));
  const boundedY = Math.max(0, Math.min(mapDimensions.height, clickY));
  
  if (draggingUnitType) {
    const template = unitTemplates.find(t => t.id === draggingUnitType);
    if (template) {
      // Check if position is valid for this unit
      const positionValidity = canPlaceUnitAtPosition(template, { x: boundedX, y: boundedY });
      
      if (!positionValidity.valid) {
        alert(positionValidity.reason || 'Cannot deploy unit here!');
        return;
      }
      
      if (!isInConqueredArea({ x: boundedX, y: boundedY })) {
        alert('You can only place units in conquered areas!');
        return;
      }
      
      if (economy.money < unitCost) {
        alert(`Insufficient funds! Need $${unitCost.toLocaleString()}`);
        return;
      }
      
      const newUnit: Unit = {
        id: `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'player',
        position: { x: boundedX, y: boundedY },
        destination: null,
        health: template.health,
        maxHealth: template.health,
        attackRange: template.attackRange,
        selected: false,
        unitId: template.id,
        name: template.name,
        category: template.category,
        imagePath: template.imagePath,
        transportCapabilities: template.transportCapabilities,
        maxCapacity: template.maxCapacity,
        canBeTransported: template.canBeTransported,
        transportSize: template.transportSize,
        isTransport: template.isTransport,
        capabilities: template.capabilities,
        visionRange: template.visionRange || 0,
      };
      
      setUnits(prev => [...prev, newUnit]);
      setEconomy(prev => ({ ...prev, money: prev.money - unitCost }));
      setDraggingUnitType(null);
      
      // If it's a transport, initialize its status
      if (template.isTransport) {
        setTransports(prev => ({
          ...prev,
          [newUnit.id]: {
            transportId: newUnit.id,
            carriedUnits: [],
            loadingQueue: [],
            unloadingQueue: [],
            capacityUsed: 0
          }
        }));
      }
    }
  } else {
    // Check if clicking on enemy spawn point (for debug)
    const clickedSpawnPoint = enemySpawnPoints.find(sp => {
      const dx = boundedX - sp.position.x;
      const dy = boundedY - sp.position.y;
      return Math.sqrt(dx * dx + dy * dy) < 60;
    });
    
    if (clickedSpawnPoint && e.shiftKey) {
      // Debug: Spawn test wave
      spawnEnemyWave(clickedSpawnPoint.id, 'tank', 3);
      return;
    }
    
    // For movement commands, check if destination is valid for all selected units
    const selectedUnits = units.filter(u => u.selected && u.type === 'player' && u.health > 0 && !u.carriedBy);
    
    selectedUnits.forEach(unit => {
      const canMove = canUnitMoveThroughPosition(unit, { x: boundedX, y: boundedY });
      if (canMove) {
        setUnits(prev => prev.map(u => 
          u.id === unit.id ? { ...u, destination: { x: boundedX, y: boundedY } } : u
        ));
      } else {
        alert(`${unit.name} cannot move to this terrain!`);
      }
    });
  }
}, [showTransportUI, viewport, mapDimensions, draggingUnitType, unitTemplates, canPlaceUnitAtPosition, isInConqueredArea, economy.money, unitCost, canUnitMoveThroughPosition, units, enemySpawnPoints, spawnEnemyWave]);

const handleUnitSelect = useCallback((id: string, e: React.MouseEvent) => {
  e.stopPropagation();
  
  const now = Date.now();
  const clickedUnit = units.find(u => u.id === id);
  
  // Check for double-click (within 300ms)
  if (lastClickedUnit?.id === id && now - lastClickedUnit.time < 300) {
    // Double-click detected
    if (clickedUnit?.isTransport) {
      setSelectedTransport(id);
      setShowTransportUI(true);
      setUnits(prev => prev.map(unit => ({
        ...unit,
        selected: unit.id === id
      })));
    }
    setLastClickedUnit(null);
    return;
  }
  
  // Single click - normal selection
  setLastClickedUnit({id, time: now});
  
  setUnits(prev => prev.map(unit => {
    if (isCtrlPressed) {
      return { ...unit, selected: unit.id === id ? !unit.selected : unit.selected };
    } else {
      return { ...unit, selected: unit.id === id };
    }
  }));
  
  // Don't show transport UI on single click
  if (!clickedUnit?.isTransport || !clickedUnit.selected) {
    setShowTransportUI(false);
    setSelectedTransport(null);
  }
}, [lastClickedUnit, isCtrlPressed, units]);

const handleMapDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  if (mapRef.current) {
    const rect = mapRef.current.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }
}, []);

const handleMapDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  handleUnitDragEnd();
  handleMapClick(e as any);
}, [handleUnitDragEnd, handleMapClick]);

const handleMapMouseDown = useCallback((e: React.MouseEvent) => {
  if (e.button === 1 || (e.button === 0 && !draggingUnitType && !showTransportUI)) {
    setIsMapDragging(true);
    setMapDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    setSelectedUnitInfo(null);
    setShowTransportUI(false);
    setSelectedTransport(null);
  }
}, [draggingUnitType, showTransportUI, viewport]);

const handleMapMouseMove = useCallback((e: React.MouseEvent) => {
  if (isMapDragging && mapRef.current) {
    const newX = e.clientX - mapDragStart.x;
    const newY = e.clientY - mapDragStart.y;
    
    const minX = -mapDimensions.width * viewport.scale + window.innerWidth - MAP_PADDING;
    const maxX = MAP_PADDING;
    const minY = -mapDimensions.height * viewport.scale + window.innerHeight - MAP_PADDING;
    const maxY = MAP_PADDING;
    
    setViewport(prev => ({
      ...prev,
      x: Math.min(maxX, Math.max(minX, newX)),
      y: Math.min(maxY, Math.max(minY, newY))
    }));
  }
}, [isMapDragging, mapDragStart, mapDimensions, viewport, MAP_PADDING]);

const handleMapMouseUp = useCallback(() => {
  setIsMapDragging(false);
}, []);

const handleMapWheel = useCallback((e: React.WheelEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const rect = mapRef.current?.getBoundingClientRect();
  if (!rect) return;

  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  const zoomIntensity = 0.1;
  const wheel = e.deltaY < 0 ? 1 : -1;
  const zoom = Math.exp(wheel * zoomIntensity);
  
  setViewport(prev => {
    const newScale = Math.max(0.1, Math.min(3, prev.scale * zoom));
    
    const dx = (mouseX - prev.x) / prev.scale;
    const dy = (mouseY - prev.y) / prev.scale;
    
    const newX = mouseX - dx * newScale;
    const newY = mouseY - dy * newScale;
    
    const minX = -mapDimensions.width * newScale + window.innerWidth - MAP_PADDING;
    const maxX = MAP_PADDING;
    const minY = -mapDimensions.height * newScale + window.innerHeight - MAP_PADDING;
    const maxY = MAP_PADDING;
    
    return {
      x: Math.min(maxX, Math.max(minX, newX)),
      y: Math.min(maxY, Math.max(minY, newY)),
      scale: newScale
    };
  });
}, [mapDimensions]);

// Transport functions (keep existing)
const handleLoadUnit = (unitId: string) => {
  if (!selectedTransport) return;
  
  setUnits(prev => prev.map(unit => {
    if (unit.id === unitId && unit.health > 0 && !unit.carriedBy) {
      const transport = prev.find(t => t.id === selectedTransport);
      if (transport && transport.health > 0) {
        const destination: DestinationWithTransportId = {
          ...transport.position,
          transportId: selectedTransport
        };
        
        return {
          ...unit,
          destination,
          loading: true
        };
      }
    }
    return unit;
  }));
};

const handleUnloadUnit = (unitId: string) => {
  if (!selectedTransport) return;
  
  setUnits(prev => prev.map(unit => {
    if (unit.id === unitId && unit.carriedBy === selectedTransport) {
      const transport = prev.find(t => t.id === selectedTransport);
      if (transport && transport.health > 0) {
        return {
          ...unit,
          carriedBy: undefined,
          loading: false,
          unloading: false,
          position: {
            x: transport.position.x,
            y: transport.position.y
          }
        };
      }
    }
    return unit;
  }));
  
  // Update transport status
  setTransports(prev => {
    const transportStatus = prev[selectedTransport];
    if (transportStatus) {
      const unit = units.find(u => u.id === unitId);
      const unitSize = unit?.transportSize || 1;
      
      return {
        ...prev,
        [selectedTransport]: {
          ...transportStatus,
          carriedUnits: transportStatus.carriedUnits.filter(id => id !== unitId),
          capacityUsed: Math.max(0, transportStatus.capacityUsed - unitSize)
        }
      };
    }
    return prev;
  });
};

const handleLoadAllCompatible = () => {
  if (!selectedTransport) return;
  
  const transport = units.find(t => t.id === selectedTransport);
  if (!transport || transport.health <= 0) return;
  
  const compatibleUnits = units.filter(unit => 
    unit.type === 'player' &&
    unit.id !== selectedTransport &&
    !unit.carriedBy &&
    unit.health > 0 &&
    transport.transportCapabilities?.[unit.category as keyof TransportCapabilities] &&
    Math.sqrt(
      Math.pow(unit.position.x - transport.position.x, 2) +
      Math.pow(unit.position.y - transport.position.y, 2)
    ) < 200 &&
    unit.transportSize && 
    (transports[selectedTransport]?.capacityUsed || 0) + unit.transportSize <= (transport.maxCapacity || 0)
  );
  
  compatibleUnits.forEach(unit => {
    handleLoadUnit(unit.id);
  });
};

const handleUnloadAll = () => {
  if (!selectedTransport) return;
  
  setUnits(prev => {
    const transport = prev.find(t => t.id === selectedTransport);
    if (!transport) return prev;
    
    return prev.map(unit => {
      if (unit.carriedBy === selectedTransport) {
        return {
          ...unit,
          carriedBy: undefined,
          loading: false,
          unloading: false,
          position: {
            x: transport.position.x,
            y: transport.position.y
          }
        };
      }
      return unit;
    });
  });
  
  // Update transport status
  setTransports(prev => {
    const transportStatus = prev[selectedTransport];
    if (transportStatus) {
      return {
        ...prev,
        [selectedTransport]: {
          ...transportStatus,
          carriedUnits: [],
          capacityUsed: 0
        }
      };
    }
    return prev;
  });
};

const handleTransportSelect = (transportId: string) => {
  const transport = units.find(u => u.id === transportId);
  if (transport?.isTransport) {
    setSelectedTransport(transportId);
    setShowTransportUI(true);
    
    // Select only this transport
    setUnits(prev => prev.map(unit => ({
      ...unit,
      selected: unit.id === transportId
    })));
  }
};

const transformPosition = useCallback((pos: Position) => {
  return {
    x: viewport.x + pos.x * viewport.scale,
    y: viewport.y + pos.y * viewport.scale
  };
}, [viewport]);

const transformSize = useCallback((size: number) => size * viewport.scale, [viewport.scale]);

const getCategoryCount = (category: string) => {
  return selectedArsenalUnits.filter(u => u.category === category).length;
};

const getUnitSize = (category: string): number => {
  switch(category) {
    case 'recon': return 28;
    case 'infantry': return 32;
    case 'robotics': return 36;
    case 'pfvs': return 44;
    case 'mbt': return 52;
    case 'artillery': return 48;
    case 'aas': return 40;
    case 'helicopters': return 44;
    case 'fighterjets': return 48;
    case 'transportation': return 52;
    case 'bomber': return 56;
    case 'destroyers': return 60;
    case 'carrier': return 68;
    default: return 36;
  }
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    setIsFullscreen(true);
  } else {
    document.exitFullscreen();
    setIsFullscreen(false);
  }
};

// Calculate game stats
const selectedUnitsCount = units.filter(u => u.selected && u.type === 'player').length;
const playerUnitsCount = units.filter(u => u.type === 'player').length;
const enemyUnitsCount = units.filter(u => u.type === 'enemy' && u.health > 0).length;
const controlledPointsCount = controlPoints.filter(cp => cp.ownedByPlayer).length;
const visibleEnemiesCount = units.filter(u => u.type === 'enemy' && u.health > 0 && u.isVisible).length;

// In the render section, add enemy spawn points visualization:
// Add this after the Conquered Areas section in the render

return (
      <div className="pt-[3rem] select-none fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        {/* Top Header */}
        <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold text-white">Dropzone Battlefield</h1>
            </div>
            
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs">MONEY</div>
                <div className="text-green-400 font-bold text-lg">${economy.money.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">INCOME</div>
                <div className="text-blue-400 font-bold">${economy.income.toLocaleString()}/s</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">CONTROL</div>
                <div className="text-emerald-400 font-bold">{controlledPointsCount}/{controlPoints.length}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">UNITS</div>
                <div className="text-yellow-400 font-bold">{playerUnitsCount}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">ENEMIES SPOTTED</div>
                  <div className="text-orange-400 font-bold">
                    {units.filter(u => u.type === 'enemy' && u.health > 0 && u.isVisible).length}
                  </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              onClick={() => setShowGrid(!showGrid)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              title="Toggle Grid"
            >
              {showGrid ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <div className="text-xs text-gray-500 px-3 py-1 bg-gray-900 rounded">
              {viewport.scale.toFixed(1)}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div 
            ref={sidebarRef}
            className="w-80 bg-black/70 backdrop-blur-sm border-r border-gray-800 flex flex-col overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1f2937' }}
          >
            {/* Arsenal Section */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Target size={18} className="text-blue-400" />
                Available Arsenal
              </h2>
              
              {selectedArsenalUnits.length === 0 ? (
                <div className="text-gray-400 text-sm italic p-4 text-center bg-gray-900/50 rounded-lg">
                  No units selected. Go to Arsenal tab to select units.
                </div>
              ) : (
                <div className="space-y-3">
                  {unitTemplatesMemo.map(template => (
                    <div
                      key={template.id}
                      className="group relative p-3 bg-gray-900/50 hover:bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all cursor-move"
                      draggable
                      onDragStart={(e) => handleUnitDragStart(e, template.id)}
                      onDragEnd={handleUnitDragEnd}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={template.imagePath}
                          className="w-12 h-12 object-contain rounded-md bg-gray-800"
                          alt={template.name}
                          onError={(e) => {
                            e.currentTarget.src = `../images/${template.category}/default.png`;
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white truncate">{template.name}</div>
                          <div className="text-xs text-gray-400 capitalize">{template.category}</div>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className="flex items-center gap-1 text-red-400">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              {template.health} HP
                            </span>
                            <span className="flex items-center gap-1 text-blue-400">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              {template.attackRange} Range
                            </span>
                            {/* Add deployment indicators */}
                            {template.capabilities?.canFloat && (
                              <span className="flex items-center gap-1 text-cyan-400" title="Naval Unit">
                                ⚓
                              </span>
                            )}
                            {template.capabilities?.canFly && (
                              <span className="flex items-center gap-1 text-sky-400" title="Air Unit">
                                ✈
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-yellow-400 text-sm font-bold">
                          ${unitCost.toLocaleString()}
                        </div>
                      </div>
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Summary */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Arsenal Composition</h3>
              <div className="space-y-2">
                {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
                  const count = getCategoryCount(category);
                  if (count === 0) return null;
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${(count / 3) * 100}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-6 text-right">{count}/3</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Units Info */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                <span>Selected Units ({selectedUnitsCount})</span>
                {selectedUnitsCount > 0 && (
                  <button 
                    onClick={() => setUnits(prev => prev.map(u => ({ ...u, selected: false })))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Deselect All
                  </button>
                )}
              </h3>
              
              {selectedUnitsCount === 0 ? (
                <div className="text-gray-500 text-sm italic text-center py-4">
                  No units selected
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {units
                    .filter(u => u.selected && u.type === 'player')
                    .map(unit => (
                      <div 
                        key={unit.id}
                        className="p-2 bg-gray-900/30 rounded border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                        onClick={() => {
                          const transformedPos = transformPosition(unit.position);
                          const offsetX = transformedPos.x - window.innerWidth / 2;
                          const offsetY = transformedPos.y - window.innerHeight / 2;
                          
                          setViewport(prev => ({
                            ...prev,
                            x: -offsetX,
                            y: -offsetY
                          }));
                          
                          setSelectedUnitInfo(unit);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <img 
                            src={unit.imagePath}
                            className="w-8 h-8 object-contain rounded bg-gray-800"
                            alt={unit.name}
                          />
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium truncate">{unit.name}</div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400 capitalize">{unit.category}</span>
                              <span className={`${unit.health < unit.maxHealth * 0.3 ? 'text-red-400' : 'text-green-400'}`}>
                                {unit.health}/{unit.maxHealth}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Controls Help */}
            <div className="p-4 mt-auto border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Info size={14} />
                Controls
              </h3>
              <div className="space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Drag & Drop</span>
                  <span className="text-gray-300">Deploy Units</span>
                </div>
                <div className="flex justify-between">
                  <span>Click</span>
                  <span className="text-gray-300">Move Selected</span>
                </div>
                <div className="flex justify-between">
                  <span>Ctrl + Click</span>
                  <span className="text-gray-300">Multi-Select</span>
                </div>
                <div className="flex justify-between">
                  <span>Middle Click Drag</span>
                  <span className="text-gray-300">Pan Map</span>
                </div>
                <div className="flex justify-between">
                  <span>Scroll</span>
                  <span className="text-gray-300">Zoom</span>
                </div>
                <div className="flex justify-between">
                  <span>S</span>
                  <span className="text-gray-300">Stop Units</span>
                </div>
                <div className="flex justify-between">
                  <span>ESC</span>
                  <span className="text-gray-300">Deselect</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 relative overflow-hidden">
            <div 
              ref={mapRef}
              className="absolute inset-0 bg-gray-950"
              onClick={handleMapClick}
              onDragOver={handleMapDragOver}
              onDrop={handleMapDrop}
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
              onWheel={handleMapWheel}
              style={{ cursor: isMapDragging ? 'grabbing' : draggingUnitType ? 'crosshair' : 'default' }}
            >
              {/* Map Background - 3X BIGGER */}
              <div 
                className="absolute"
                style={{ 
                  backgroundImage: "url(../images/map.png)",
                  transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
                  transformOrigin: '0 0',
                  width: `${mapDimensions.width}px`,
                  height: `${mapDimensions.height}px`,
                  opacity: 0.4
                }}
              >
                {/* Grid */}
                {showGrid && (
                  <>
                    {Array.from({ length: Math.ceil(mapDimensions.height / 50) }).map((_, i) => (
                      <div 
                        key={`h-${i}`} 
                        className="absolute w-full h-px bg-white/10" 
                        style={{ top: `${i * 50}px` }}
                      />
                    ))}
                    {Array.from({ length: Math.ceil(mapDimensions.width / 50) }).map((_, i) => (
                      <div 
                        key={`v-${i}`} 
                        className="absolute h-full w-px bg-white/10" 
                        style={{ left: `${i * 50}px` }}
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Sea Areas */}
              {seaAreas.map(sea => {
                const transformedPos = transformPosition(sea.position);
                const width = transformSize(sea.width);
                const height = transformSize(sea.height);
                
                return (
                  <div
                    key={sea.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: transformedPos.x,
                      top: transformedPos.y,
                      width,
                      height,
                      background: sea.type === 'deep-sea' 
                        ? 'linear-gradient(135deg, rgba(0, 50, 150, 0.4) 0%, rgba(0, 100, 200, 0.6) 100%)'
                        : 'linear-gradient(135deg, rgba(0, 100, 200, 0.3) 0%, rgba(0, 150, 255, 0.5) 100%)',
                      border: `2px ${sea.type === 'deep-sea' ? 'dashed' : 'dotted'} rgba(0, 150, 255, 0.7)`,
                      borderRadius: '10px'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white/70 text-sm font-bold bg-black/30 px-3 py-1 rounded">
                        {sea.type === 'deep-sea' ? '🌊 Deep Sea' : '💧 Sea'}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Conquered Areas */}
              {controlPoints
                .filter(cp => cp.ownedByPlayer)
                .map(cp => {
                  const transformedPos = transformPosition(cp.position);
                  const radius = transformSize(cp.radius);
                  
                  return (
                    <div
                      key={`area-${cp.id}`}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: transformedPos.x - radius,
                        top: transformedPos.y - radius,
                        width: radius * 2,
                        height: radius * 2,
                        background: 'radial-gradient(circle, rgba(0,255,0,0.1) 0%, rgba(0,255,0,0) 70%)',
                        border: '2px dashed rgba(0, 255, 0, 0.3)'
                      }}
                    />
                  );
                })}

                
              {/* Control Points */}
              {controlPoints.map(cp => {
                const transformedPos = transformPosition(cp.position);
                const radius = transformSize(cp.radius);
                
                return (
                  <div
                    key={cp.id}
                    className="absolute rounded-full"
                    style={{
                      left: transformedPos.x - radius,
                      top: transformedPos.y - radius,
                      width: radius * 2,
                      height: radius * 2,
                      border: `3px ${cp.ownedByPlayer ? 'solid' : 'dashed'} ${cp.color}`,
                      background: cp.ownedByPlayer 
                        ? `radial-gradient(circle, ${cp.color}40 0%, transparent 70%)`
                        : 'transparent',
                      opacity: 0.8
                    }}
                  >
                    {/* Capture Progress */}
                    {!cp.ownedByPlayer && cp.progress > 0 && (
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${cp.color} ${cp.progress * 3.6}deg, transparent 0deg)`
                        }}
                      />
                    )}
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        <div className={`text-lg ${cp.ownedByPlayer ? 'text-green-400' : 'text-red-400'}`}>
                          {cp.ownedByPlayer ? '✓' : '⚔'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Units */}
              {units.map(unit => {
                const transformedPos = transformPosition(unit.position);
                const size = transformSize(getUnitSize(unit.category));
                
                return (
                  <div key={unit.id}>
                    {/* Destination Path */}
                    {unit.destination && unit.health > 0 && unit.type === 'player' && !unit.carriedBy && (
                      <>
                        <div
                          className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping"
                          style={{ 
                            left: transformPosition(unit.destination).x - transformSize(1.5), 
                            top: transformPosition(unit.destination).y - transformSize(1.5),
                          }}
                        />
                        <div
                          className="absolute h-1 bg-green-500/50 origin-left"
                          style={{
                            left: transformedPos.x,
                            top: transformedPos.y,
                            width: Math.sqrt(
                              Math.pow(unit.destination.x - unit.position.x, 2) + 
                              Math.pow(unit.destination.y - unit.position.y, 2)
                            ) * viewport.scale,
                            transform: `rotate(${Math.atan2(
                              unit.destination.y - unit.position.y,
                              unit.destination.x - unit.position.x
                            ) * 180 / Math.PI}deg)`,
                            transformOrigin: '0 0'
                          }}
                        />
                      </>
                    )}

                    {/* Enemy Units */}
                    {unit.type === 'enemy' && unit.health > 0 && unit.isVisible && (
                      <div
                        className={`absolute rounded-full border-2 border-red-800 bg-red-600`}
                        style={{ 
                          left: transformedPos.x - transformSize(20), 
                          top: transformedPos.y - transformSize(20),
                          width: transformSize(40),
                          height: transformSize(40),
                        }}
                        onClick={(e) => handleUnitSelect(unit.id, e)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                          ENEMY
                        </div>
                        <div className="absolute -top-3 left-0 right-0 h-1 bg-gray-800 rounded">
                          <div 
                            className="h-full bg-red-500 rounded"
                            style={{ width: `${(unit.health / unit.maxHealth) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    
              {/* Enemy Spawn Points */}
              {enemySpawnPoints.map(spawnPoint => {
                const transformedPos = transformPosition(spawnPoint.position);
                const radius = transformSize(40);
                
                // Find the control point for this spawn
                const controlPoint = controlPoints.find(cp => cp.id === spawnPoint.controlPointId);
                const isActive = controlPoint && !controlPoint.ownedByPlayer;
                
                if (!isActive) return null;
                
                return (
                  <div
                    key={`spawn-${spawnPoint.id}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: transformedPos.x - radius,
                      top: transformedPos.y - radius,
                      width: radius * 2,
                      height: radius * 2,
                      border: '2px dashed rgba(255, 0, 0, 0.7)',
                      background: 'radial-gradient(circle, rgba(255,0,0,0.2) 0%, transparent 70%)',
                      animation: 'pulse 2s infinite'
                    }}
                    title={`Enemy Spawn Point (Power: ${spawnPoint.spawnPower.toFixed(1)})`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                        <div className="text-xs text-white font-bold">S</div>
                      </div>
                    </div>
                    {/* Spawn timer indicator */}
                    <div 
                      className="absolute -bottom-6 left-0 right-0 text-center"
                      style={{
                        color: '#ff5555',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textShadow: '0 0 3px black'
                      }}
                    >
                      {Math.max(0, Math.floor((spawnPoint.spawnInterval - (Date.now() - spawnPoint.lastSpawnTime)) / 1000))}s
                    </div>
                  </div>
                );
              })}

              {/* Enemy Units */}
              {unit.type === 'enemy' && unit.health > 0 && unit.isVisible && (
                <div
                  className={`absolute cursor-pointer transition-all duration-200 ${unit.selected ? 'scale-110 z-50' : 'z-40'}`}
                  style={{
                    left: transformedPos.x - size,
                    top: transformedPos.y - size,
                    width: size * 2,
                    height: size * 2,
                  }}
                  onClick={(e) => handleUnitSelect(unit.id, e)}
                >
                  {/* Enemy unit image */}
                  <div className="absolute inset-0">
                    <img 
                      src={unit.imagePath} 
                      className="w-full h-full object-contain pointer-events-none"
                      alt={unit.name}
                      onError={(e) => {
                        e.currentTarget.src = '../images/enemies/enemy_default.png';
                      }}
                    />
                  </div>
                  
                  {/* Health bar */}
                  <div className="absolute -top-2 left-1 right-1 h-1.5 bg-gray-900 rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${unit.health > unit.maxHealth * 0.5 ? 'bg-red-500' : unit.health > unit.maxHealth * 0.25 ? 'bg-orange-500' : 'bg-red-700'}`}
                      style={{ width: `${(unit.health / unit.maxHealth) * 100}%` }}
                    />
                  </div>
                  
                  {/* Enemy name */}
                  <div className="absolute -bottom-5 left-0 right-0 text-center">
                    <div className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded inline-block">
                      {unit.name}
                    </div>
                  </div>
                  
                  {/* Attack range when selected */}
                  {unit.selected && (
                    <div
                      className="absolute rounded-full border border-red-500/30 pointer-events-none"
                      style={{
                        width: (unit.attackRange * 2) * viewport.scale,
                        height: (unit.attackRange * 2) * viewport.scale,
                        left: size - (unit.attackRange * viewport.scale),
                        top: size - (unit.attackRange * viewport.scale),
                        background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)'
                      }}
                    />
                  )}
                  
                  {/* Destination indicator */}
                  {unit.destination && (
                    <>
                      <div
                        className="absolute w-2 h-2 bg-red-500 rounded-full border border-white animate-ping"
                        style={{
                          left: transformPosition(unit.destination).x - transformedPos.x + size - transformSize(1),
                          top: transformPosition(unit.destination).y - transformedPos.y + size - transformSize(1),
                        }}
                      />
                      <div
                        className="absolute h-1 bg-red-500/30 origin-left"
                        style={{
                          left: size,
                          top: size,
                          width: Math.sqrt(
                            Math.pow(unit.destination.x - unit.position.x, 2) +
                            Math.pow(unit.destination.y - unit.position.y, 2)
                          ) * viewport.scale,
                          transform: `rotate(${Math.atan2(
                            unit.destination.y - unit.position.y,
                            unit.destination.x - unit.position.x
                          ) * 180 / Math.PI}deg)`,
                          transformOrigin: '0 0'
                        }}
                      />
                    </>
                  )}
                </div>
              )}

                    {/* Vision Range - always show if unit has vision range and is not carried */}
                    {unit.health > 0 && !unit.carriedBy && unit.visionRange && unit.visionRange > 0 && (
                      <div 
                        className="absolute rounded-full border border-blue-300/30 pointer-events-none"
                        style={{ 
                          left: transformedPos.x + size - (unit.visionRange * viewport.scale),
                          top: transformedPos.y + size - (unit.visionRange * viewport.scale),
                          width: (unit.visionRange * 2) * viewport.scale, 
                          height: (unit.visionRange * 2) * viewport.scale,
                          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0) 70%)',
                          opacity: 0.7
                        }}
                      />
                    )}

                    {/* Player Units */}
                    {unit.type === 'player' && (
                      <div
                        key={`unit-${unit.id}`}
                        className={`absolute cursor-pointer transition-all duration-200 ${unit.selected ? 'scale-110 z-50' : 'z-40'} ${unit.health <= 0 ? 'opacity-0' : ''} ${unit.carriedBy ? 'hidden' : ''}`}
                        style={{ 
                          left: transformedPos.x - size, 
                          top: transformedPos.y - size,
                          width: size * 2,
                          height: size * 2,
                          display: unit.carriedBy ? 'none' : 'block'
                        }}
                        onClick={(e) => handleUnitSelect(unit.id, e)}
                      >
                        {/* Selection Ring - only show if not carried */}
                        {!!(unit.selected && !unit.carriedBy) && (
                          <div className="absolute inset-0 rounded-full border-3 border-yellow-400 animate-pulse"></div>
                        )}
                        
                        {/* Unit Image */}
                        <div className="absolute inset-0">
                          <img 
                            src={unit.imagePath} 
                            className="w-full h-full object-contain pointer-events-none"
                            alt={unit.name}
                            onError={(e) => {
                              e.currentTarget.src = `../images/${unit.category}/default.png`;
                            }}
                          />
                        </div>
                        
                        {/* Health Bar - only show if not carried */}
                        {!!(!unit.carriedBy) && (
                          <div className="absolute -top-2 left-1 right-1 h-1.5 bg-gray-900 rounded overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${unit.health > unit.maxHealth * 0.5 ? 'bg-green-500' : unit.health > unit.maxHealth * 0.25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${(unit.health / unit.maxHealth) * 100}%` }}
                            />
                          </div>
                        )}
                        
                        {/* Unit Name - only show if not carried */}
                        {!!(!unit.carriedBy) && (
                          <div className="absolute -bottom-5 left-0 right-0 text-center">
                            <div className="text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded inline-block truncate max-w-full">
                              {unit.name}
                            </div>
                          </div>
                        )}
                        
                        {/* Transport Indicator - only show if not carried */}
                        {!!(unit.isTransport && unit.type === 'player' && !unit.carriedBy) && (
                          <div className="absolute -top-8 left-0 right-0 text-center">
                            <div className="text-xs font-bold text-blue-300 bg-black/70 px-2 py-0.5 rounded inline-block">
                              <Truck size={10} className="inline mr-1" />
                              Transport ({transports[unit.id]?.carriedUnits?.length || 0}/{unit.maxCapacity})
                            </div>
                          </div>
                        )}
                        
                        {/* Attack Range (when selected) - only show if not carried */}
                        {!!(unit.selected && unit.health > 0 && !unit.carriedBy && unit.attackRange > 0) && (
                          <div 
                            className="absolute rounded-full border border-red-500/50 pointer-events-none"
                            style={{ 
                              width: unit.attackRange * 2 * viewport.scale, 
                              height: unit.attackRange * 2 * viewport.scale, 
                              left: size - (unit.attackRange * viewport.scale), 
                              top: size - (unit.attackRange * viewport.scale),
                              background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, transparent 70%)'
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Transport UI */}
              {selectedTransport && showTransportUI && (
                <TransportUI
                  transport={units.find(u => u.id === selectedTransport)!}
                  transports={transports}
                  units={units.filter(u => u.type === 'player' && u.health > 0)}
                  onLoadUnit={handleLoadUnit}
                  onUnloadUnit={handleUnloadUnit}
                  onLoadAllCompatible={handleLoadAllCompatible}
                  onUnloadAll={handleUnloadAll}
                  onClose={() => {
                    setShowTransportUI(false);
                    setSelectedTransport(null);
                    setUnits(prev => prev.map(u => ({ ...u, selected: false })));
                  }}
                />
              )}
              
              {/* Drag Preview */}
              {isDragging && draggingUnitType && (
                <div
                  className="absolute pointer-events-none"
                  style={{ left: dragPosition.x - 30, top: dragPosition.y - 30 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-20"></div>
                    <div className="w-12 h-12 bg-blue-600 rounded-full border-2 border-blue-400 flex items-center justify-center">
                      <Zap className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Unit Info Panel */}
            {selectedUnitInfo && !showTransportUI && (
              <div className="absolute top-20 right-4 w-80 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-2xl z-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-white text-lg">Unit Details</h3>
                  <button
                    onClick={() => setSelectedUnitInfo(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex items-start gap-3 mb-3">
                  <img 
                    src={selectedUnitInfo.imagePath}
                    className="w-16 h-16 object-contain rounded bg-gray-800"
                    alt={selectedUnitInfo.name}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{selectedUnitInfo.name}</h3>
                    <div className="text-sm text-gray-300 capitalize">{selectedUnitInfo.category}</div>
                  </div>
                  <div className={`text-lg font-bold ${
                    selectedUnitInfo.health > selectedUnitInfo.maxHealth * 0.5 
                      ? 'text-green-400' 
                      : selectedUnitInfo.health > selectedUnitInfo.maxHealth * 0.25 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`}>
                    {Math.round((selectedUnitInfo.health / selectedUnitInfo.maxHealth) * 100)}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Health</span>
                    <span className="text-white">{selectedUnitInfo.health}/{selectedUnitInfo.maxHealth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Attack Range</span>
                    <span className="text-white">{selectedUnitInfo.attackRange}</span>
                  </div>
                  {/* Add vision range if available */}
                  {selectedUnitInfo.visionRange && selectedUnitInfo.visionRange > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Vision Range</span>
                      <span className="text-cyan-400">
                        {selectedUnitInfo.visionRange}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-800">
                  <div className="text-xs text-gray-400">
                    {selectedUnitInfo.carriedBy 
                      ? 'Being transported' 
                      : 'Click anywhere to move, press S to stop'}
                  </div>
                </div>
              </div>
            )}

            {/* Viewport Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setViewport(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.2) }))}
                className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700"
              >
                +
              </button>
              <button 
                onClick={() => setViewport(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.2) }))}
                className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700"
              >
                -
              </button>
              <button 
                onClick={() => setViewport({ x: 0, y: 0, scale: 1 })}
                className="w-10 h-10 rounded-lg bg-black/70 hover:bg-black text-white flex items-center justify-center border border-gray-700 text-xs"
              >
                1:1
              </button>
            </div>

            {/* Bottom Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 px-4 py-2">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-400">
                  {units.filter(u => u.type === 'player' && u.health > 0).length} units deployed • 
                  {controlledPointsCount} control points • 
                  {economy.income.toLocaleString()}/s income
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-green-400 font-medium">
                    $<span className="text-lg">{Math.floor(economy.money / 1000000)}</span>M
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${draggingUnitType ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>
                    {draggingUnitType ? 'READY TO DEPLOY' : 'DRAG UNIT TO DEPLOY'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
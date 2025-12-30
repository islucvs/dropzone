export interface Position {
  x: number;
  y: number;
}

export interface UnitCapabilities {
  canFloat?: boolean;
  canFly?: boolean;
  isAmphibious?: boolean;
}

export interface TransportCapabilities {
  [key: string]: boolean;
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

export interface TransportStatus {
  transportId: string;
  carriedUnits: string[];
  loadingQueue: string[];
  unloadingQueue: string[];
  capacityUsed: number;
  loadingPoint?: Position;
  unloadingPoint?: Position;
}

export interface Unit {
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
  capabilities?: UnitCapabilities;
  visionRange?: number;
  isVisible?: boolean;
}

export interface UnitTemplate {
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
  capabilities?: UnitCapabilities;
  visionRange?: number;
}

export interface SelectedUnitFromDB {
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

export interface DestinationWithTransportId extends Position {
  transportId?: string;
}

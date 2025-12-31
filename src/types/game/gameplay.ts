import { Position } from './units';

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface ControlPoint {
  id: string;
  position: Position;
  radius: number;
  ownedByPlayer: boolean;
  color: string;
  progress: number;
}

export interface SeaArea {
  id: string;
  position: Position;
  width: number;
  height: number;
  type: 'deep-sea';
}

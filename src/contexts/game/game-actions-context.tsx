'use client';

import { createContext, useContext, ReactNode, useCallback, useRef, useState } from 'react';
import { useGameState } from './game-state-context';
import { useUnitMovement } from '@/hooks/game/use-unit-movement';
import type { Position, Unit, UnitTemplate } from '@/types/game';

interface GameActionsContextType {
  handleUnitDragStart: (e: React.DragEvent, unitType: string) => void;
  handleUnitDragEnd: () => void;
  handleMapClick: (e: React.MouseEvent) => void;
  handleMapDragOver: (e: React.DragEvent) => void;
  handleMapDrop: (e: React.DragEvent) => void;
  handleMapMouseDown: (e: React.MouseEvent) => void;
  handleMapMouseMove: (e: React.MouseEvent) => void;
  handleMapMouseUp: () => void;
  handleMapRightClick: (e: React.MouseEvent) => void;
  handleMapWheel: (e: React.WheelEvent) => void;
  handleUnitSelect: (id: string, e: React.MouseEvent) => void;
  toggleFullscreen: () => void;
  transformPosition: (pos: Position) => Position;
  transformSize: (size: number) => number;
  mapRef: React.RefObject<HTMLDivElement>;
  sidebarRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  lastClickedUnit: { id: string; time: number } | null;
  setLastClickedUnit: (unit: { id: string; time: number } | null) => void;
  mapDragStart: Position;
  setMapDragStart: (pos: Position) => void;
  dragPosition: Position;
  setDragPosition: (pos: Position) => void;
}

const GameActionsContext = createContext<GameActionsContextType | undefined>(undefined);

export function GameActionsProvider({ children }: { children: ReactNode }) {
  const gameState = useGameState();
  const { canUnitMoveThroughPosition } = useUnitMovement();
  const mapRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [lastClickedUnit, setLastClickedUnit] = useState<{ id: string; time: number } | null>(null);
  const [mapDragStart, setMapDragStart] = useState<Position>({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });

  const isInSeaArea = useCallback((position: Position): { isSea: boolean; type: 'sea' | 'deep-sea' | null } => {
    for (const seaArea of gameState.seaAreas) {
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
  }, [gameState.seaAreas]);

  const canPlaceUnitAtPosition = useCallback((unit: UnitTemplate, position: Position): { valid: boolean; reason?: string } => {
    const seaCheck = isInSeaArea(position);

    if (unit.category === 'destroyers' || unit.category === 'carrier') {
      if (!seaCheck.isSea || seaCheck.type !== 'deep-sea') {
        return {
          valid: false,
          reason: `${unit.name} can only be deployed in deep sea areas!`
        };
      }
      return { valid: true };
    }

    if (unit.capabilities?.canFly) {
      return { valid: true };
    }

    if (seaCheck.isSea) {
      return {
        valid: false,
        reason: `${unit.name} cannot be deployed in water!`
      };
    }

    return { valid: true };
  }, [isInSeaArea]);

  const isInConqueredArea = useCallback((position: Position): boolean => {
    return gameState.controlPoints.some(cp => {
      if (!cp.ownedByPlayer) return false;
      const dx = position.x - cp.position.x;
      const dy = position.y - cp.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= cp.radius;
    });
  }, [gameState.controlPoints]);

  const handleUnitDragStart = useCallback((e: React.DragEvent, unitType: string) => {
    gameState.setDraggingUnitType(unitType);
    gameState.setIsDragging(true);
  }, [gameState]);

  const handleUnitDragEnd = useCallback(() => {
    gameState.setDraggingUnitType(null);
    gameState.setIsDragging(false);
  }, [gameState]);

  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!mapRef.current || gameState.showTransportUI) return;

    const rect = mapRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - gameState.viewport.x) / gameState.viewport.scale;
    const clickY = (e.clientY - rect.top - gameState.viewport.y) / gameState.viewport.scale;

    const boundedX = Math.max(0, Math.min(gameState.mapDimensions.width, clickX));
    const boundedY = Math.max(0, Math.min(gameState.mapDimensions.height, clickY));

    if (gameState.draggingUnitType) {
      const template = gameState.unitTemplates.find(t => t.id === gameState.draggingUnitType);
      if (template) {
        const positionValidity = canPlaceUnitAtPosition(template, { x: boundedX, y: boundedY });

        if (!positionValidity.valid) {
          alert(positionValidity.reason || 'Cannot deploy unit here!');
          return;
        }

        if (!isInConqueredArea({ x: boundedX, y: boundedY })) {
          alert('You can only place units in conquered areas!');
          return;
        }

        if (gameState.economy.money < gameState.unitCost) {
          alert(`Insufficient funds! Need $${gameState.unitCost.toLocaleString()}`);
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

        gameState.setUnits(prev => [...prev, newUnit]);
        gameState.setEconomy(prev => ({ ...prev, money: prev.money - gameState.unitCost }));
        gameState.setDraggingUnitType(null);

        if (template.isTransport) {
          gameState.setTransports(prev => ({
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
      const selectedUnits = gameState.units.filter(u => u.selected && u.type === 'player' && u.health > 0 && !u.carriedBy);

      selectedUnits.forEach(unit => {
        const canMove = canUnitMoveThroughPosition(unit, { x: boundedX, y: boundedY });
        if (canMove) {
          gameState.setUnits(prev => prev.map(u =>
            u.id === unit.id ? { ...u, destination: { x: boundedX, y: boundedY } } : u
          ));
        } else {
          alert(`${unit.name} cannot move to this terrain!`);
        }
      });
    }
  }, [gameState, canPlaceUnitAtPosition, isInConqueredArea, canUnitMoveThroughPosition]);

  const handleMapDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleMapDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleUnitDragEnd();
    handleMapClick(e as any);
  }, [handleUnitDragEnd, handleMapClick]);

  const handleMapMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && !gameState.draggingUnitType && !gameState.showTransportUI)) {
      e.preventDefault();
      gameState.setIsMapDragging(true);
      setMapDragStart({ x: e.clientX - gameState.viewport.x, y: e.clientY - gameState.viewport.y });
      gameState.setSelectedUnitInfo(null);
      gameState.setShowTransportUI(false);
      gameState.setSelectedTransport(null);
    }
  }, [gameState]);

  const handleMapMouseMove = useCallback((e: React.MouseEvent) => {
    if (gameState.isMapDragging && mapRef.current) {
      const newX = e.clientX - mapDragStart.x;
      const newY = e.clientY - mapDragStart.y;

      const scaledMapWidth = gameState.mapDimensions.width * gameState.viewport.scale;
      const scaledMapHeight = gameState.mapDimensions.height * gameState.viewport.scale;

      const sidebarWidth = 320;
      const viewportWidth = window.innerWidth - sidebarWidth;
      const viewportHeight = window.innerHeight;

      let maxX: number, minX: number, maxY: number, minY: number;

      if (scaledMapWidth <= viewportWidth) {
        const centerX = (viewportWidth - scaledMapWidth) / 2;
        maxX = minX = centerX;
      } else {
        maxX = 0;
        minX = viewportWidth - scaledMapWidth;
      }

      if (scaledMapHeight <= viewportHeight) {
        const centerY = (viewportHeight - scaledMapHeight) / 2;
        maxY = minY = centerY;
      } else {
        maxY = 0;
        minY = viewportHeight - scaledMapHeight;
      }

      gameState.setViewport(prev => ({
        ...prev,
        x: Math.min(maxX, Math.max(minX, newX)),
        y: Math.min(maxY, Math.max(minY, newY))
      }));
    }
  }, [gameState.isMapDragging, mapDragStart, gameState, mapRef]);

  const handleMapMouseUp = useCallback(() => {
    gameState.setIsMapDragging(false);
  }, [gameState]);

  const handleMapRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    gameState.setUnits(prev => prev.map(unit => ({ ...unit, selected: false })));
    gameState.setSelectedUnitInfo(null);
  }, [gameState]);

  const handleMapWheel = useCallback((e: React.WheelEvent) => {
    const sidebarWidth = 320;
    const viewportWidth = window.innerWidth - sidebarWidth;
    const viewportHeight = window.innerHeight;

    const minScaleX = viewportWidth / gameState.mapDimensions.width;
    const minScaleY = viewportHeight / gameState.mapDimensions.height;
    const minScale = Math.max(minScaleX, minScaleY);

    const zoomMultiplier = gameState.isCtrlPressed ? 4 : 1;
    const baseDelta = e.deltaY > 0 ? -0.02 : 0.02;
    const delta = baseDelta * zoomMultiplier;
    const newScale = Math.max(minScale, Math.min(5, gameState.viewport.scale + delta));

    gameState.setViewport(prev => ({
      ...prev,
      scale: newScale
    }));
  }, [gameState]);

  const handleUnitSelect = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const now = Date.now();
    const clickedUnit = gameState.units.find(u => u.id === id);

    if (lastClickedUnit?.id === id && now - lastClickedUnit.time < 300) {
      if (clickedUnit?.isTransport) {
        gameState.setSelectedTransport(id);
        gameState.setShowTransportUI(true);
        gameState.setUnits(prev => prev.map(unit => ({
          ...unit,
          selected: unit.id === id
        })));
      }
      setLastClickedUnit(null);
      return;
    }

    setLastClickedUnit({ id, time: now });

    gameState.setUnits(prev => prev.map(unit => {
      if (gameState.isCtrlPressed) {
        return { ...unit, selected: unit.id === id ? !unit.selected : unit.selected };
      } else {
        return { ...unit, selected: unit.id === id };
      }
    }));

    if (!clickedUnit?.isTransport || !clickedUnit.selected) {
      gameState.setShowTransportUI(false);
      gameState.setSelectedTransport(null);
    }
  }, [lastClickedUnit, gameState]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      gameState.setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      gameState.setIsFullscreen(false);
    }
  }, [gameState]);

  const transformPosition = useCallback((pos: Position) => {
    return {
      x: pos.x * gameState.viewport.scale + gameState.viewport.x,
      y: pos.y * gameState.viewport.scale + gameState.viewport.y
    };
  }, [gameState.viewport]);

  const transformSize = useCallback((size: number) => {
    return size * gameState.viewport.scale;
  }, [gameState.viewport.scale]);

  return (
    <GameActionsContext.Provider value={{
      handleUnitDragStart,
      handleUnitDragEnd,
      handleMapClick,
      handleMapDragOver,
      handleMapDrop,
      handleMapMouseDown,
      handleMapMouseMove,
      handleMapMouseUp,
      handleMapRightClick,
      handleMapWheel,
      handleUnitSelect,
      toggleFullscreen,
      transformPosition,
      transformSize,
      mapRef,
      sidebarRef,
      canvasRef,
      lastClickedUnit,
      setLastClickedUnit,
      mapDragStart,
      setMapDragStart,
      dragPosition,
      setDragPosition
    }}>
      {children}
    </GameActionsContext.Provider>
  );
}

export function useGameActions() {
  const context = useContext(GameActionsContext);
  if (context === undefined) {
    throw new Error('useGameActions must be used within a GameActionsProvider');
  }
  return context;
}

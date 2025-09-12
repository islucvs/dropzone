'use client';
import { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Unit {
  id: string;
  type: 'player' | 'enemy';
  position: Position;
  destination: Position | null;
  health: number;
  attackRange: number;
  selected: boolean;
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
}

interface GameEconomy {
  money: number;
  income: number;
  lastUpdate: number;
}

export default function DropzoneGame() {
  const [units, setUnits] = useState<Unit[]>([
    { id: 'unit-1', type: 'player', position: { x: 100, y: 100 }, destination: null, health: 100, attackRange: 80, selected: false },
    { id: 'unit-2', type: 'player', position: { x: 150, y: 200 }, destination: null, health: 100, attackRange: 80, selected: false },
    { id: 'enemy-1', type: 'enemy', position: { x: 400, y: 300 }, destination: null, health: 100, attackRange: 0, selected: false },
    { id: 'enemy-2', type: 'enemy', position: { x: 550, y: 20 }, destination: null, health: 100, attackRange: 0, selected: false },
    { id: 'enemy-3', type: 'enemy', position: { x: 234, y: 197 }, destination: null, health: 100, attackRange: 0, selected: false },
    { id: 'enemy-4', type: 'enemy', position: { x: 456, y: 452 }, destination: null, health: 100, attackRange: 0, selected: false },
    { id: 'enemy-5', type: 'enemy', position: { x: 232, y: 300 }, destination: null, health: 100, attackRange: 0, selected: false },
    { id: 'enemy-6', type: 'enemy', position: { x: 500, y: 435 }, destination: null, health: 100, attackRange: 0, selected: false },
  ]);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [draggingUnitType, setDraggingUnitType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [mapDragStart, setMapDragStart] = useState<Position>({ x: 0, y: 0 });
  const [viewport, setViewport] = useState<Viewport>({ 
    x: 200, 
    y: 100, 
    scale: 1
  });
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([
  { id: 'cp-1', position: { x: 200, y: 150 }, radius: 60, ownedByPlayer: false, color: '#ff4444' },
  { id: 'cp-2', position: { x: 600, y: 300 }, radius: 60, ownedByPlayer: false, color: '#ff4444' },
  { id: 'cp-3', position: { x: 400, y: 450 }, radius: 60, ownedByPlayer: false, color: '#ff4444' },
  { id: 'cp-4', position: { x: 800, y: 200 }, radius: 60, ownedByPlayer: false, color: '#ff4444' },
  { id: 'cp-5', position: { x: 300, y: 500 }, radius: 60, ownedByPlayer: false, color: '#ff4444' }
  ]);
  const [economy, setEconomy] = useState<GameEconomy>({
    money: 0,
    income: 0,
    lastUpdate: Date.now()
  });
  const [unitCost] = useState(20000000);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const MAP_PADDING_PERCENT = 0.2;
  const MAP_PADDING_X = mapDimensions.width * MAP_PADDING_PERCENT;
  const MAP_PADDING_Y = mapDimensions.height * MAP_PADDING_PERCENT;
  const unitTemplates: UnitTemplate[] = [
    { id: 'soldier', type: 'player', class: 'infantry', name: 'Soldier', health: 100, attackRange: 80, color: '#2563eb', icon: '🔫' },
    { id: 'medic', type: 'player', class: 'infantry', name: 'Medic', health: 80, attackRange: 60, color: '#10b981', icon: '⛑️' },
    { id: 'sniper', type: 'player', class: 'infantry', name: 'Sniper', health: 70, attackRange: 150, color: '#8b5cf6', icon: '🎯' },
    { id: 'heavy', type: 'player', class: 'infantry', name: 'Heavy', health: 150, attackRange: 50, color: '#dc2626', icon: '💥' },
  ];
    useEffect(() => {
      const economyInterval = setInterval(() => {
        setEconomy(prev => {
          const now = Date.now();
          const elapsedSeconds = (now - prev.lastUpdate) / 1000;
          const newMoney = prev.money + prev.income * elapsedSeconds;
          
          return {
            money: newMoney,
            income: controlPoints.filter(cp => cp.ownedByPlayer).length * 1000000, // 1M per point
            lastUpdate: now
          };
        });
      }, 1000); // Update economy every second

      return () => clearInterval(economyInterval);
    }, [controlPoints]);

    useEffect(() => {
    const img = new Image();
    img.src = '../images/map.png';
    img.onload = () => {
        setMapDimensions({
        width: img.width,
        height: img.height,
        });
    };
    }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
      
      if (e.key === 'Escape') {
        // Deselect all units
        setUnits(prev => prev.map(unit => ({ ...unit, selected: false })));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
    
  // Handle unit movement and combat
  useEffect(() => {
    const interval = setInterval(() => {
      setUnits(prevUnits => {
        const updatedUnits = [...prevUnits];
        
        // Move player units toward their destinations
        updatedUnits.forEach(unit => {
        if (unit.type === 'player' && unit.destination && unit.health > 0) {
            const dx = unit.destination.x - unit.position.x;
            const dy = unit.destination.y - unit.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
            unit.position.x += (dx / distance) * 0.4;
            unit.position.y += (dy / distance) * 0.4;
            
            // Keep units within map boundaries
            unit.position.x = Math.max(0, Math.min(unit.position.x));
            unit.position.y = Math.max(0, Math.min(unit.position.y));
            } else {
            unit.destination = null;
            }
        }
        });

        // Check for combat
        updatedUnits.forEach(unit => {
          if (unit.type === 'player' && unit.health > 0) {
            updatedUnits.forEach(target => {
              if (target.type === 'enemy' && target.health > 0) {
                const dx = unit.position.x - target.position.x;
                const dy = unit.position.y - target.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < unit.attackRange) {
                  // Enemy is in range, destroy it
                  target.health = 0;
                }
              }
            });
          }
        });
        
        updatedUnits.forEach(unit => {
          if (unit.type === 'player' && unit.health > 0) {
            controlPoints.forEach(cp => {
              const dx = unit.position.x - cp.position.x;
              const dy = unit.position.y - cp.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < cp.radius) {
                // Player unit is in control point radius
                if (!cp.ownedByPlayer) {
                  // Capture the point
                  cp.ownedByPlayer = true;
                  cp.color = '#44ff44';
                }
              }
            });
          }
        });

        // Enemy hitbox logic - if player units get too close to enemies, they die
        updatedUnits.forEach(unit => {
          if (unit.type === 'player' && unit.health > 0) {
            updatedUnits.forEach(enemy => {
              if (enemy.type === 'enemy' && enemy.health > 0) {
                const dx = unit.position.x - enemy.position.x;
                const dy = unit.position.y - enemy.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If player unit gets too close to enemy (within 40 units), it dies
                if (distance < 40) {
                  unit.health = 0;
                }
              }
            });
          }
        });

        return updatedUnits;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleUnitDragStart = (e: React.DragEvent, unitType: string) => {
    e.dataTransfer.setData('unitType', unitType);
    setIsDragging(true);
    setDraggingUnitType(unitType);
  };

  const handleUnitDragEnd = () => {
    setIsDragging(false);
    setDraggingUnitType(null);
  };

const handleMapClick = (e: React.MouseEvent) => {
  if (mapRef.current && draggingUnitType) {
    // Place a new unit on the map
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const clickY = (e.clientY - rect.top - viewport.y) / viewport.scale;
    
    // Apply boundary constraints
    const boundedX = Math.max(0, Math.min(mapDimensions.width, clickX));
    const boundedY = Math.max(0, Math.min(mapDimensions.height, clickY));
    
    const template = unitTemplates.find(t => t.id === draggingUnitType);
    if (template) {
      const newUnit: Unit = {
        id: `unit-${Date.now()}`,
        type: 'player',
        position: { x: boundedX, y: boundedY },
        destination: null,
        health: template.health,
        attackRange: template.attackRange,
        selected: false
      };
      
      setUnits(prev => [...prev, newUnit]);
      setDraggingUnitType(null);
    }
  } else if (mapRef.current) {
    // Set destination for selected units
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const clickY = (e.clientY - rect.top - viewport.y) / viewport.scale;
    
    // Apply boundary constraints
    const boundedX = Math.max(0, Math.min(mapDimensions.width, clickX));
    const boundedY = Math.max(0, Math.min(mapDimensions.height, clickY));
    
    setUnits(prev => prev.map(unit => {
      if (unit.selected && unit.type === 'player' && unit.health > 0) {
        return {
          ...unit,
          destination: { x: boundedX, y: boundedY }
        };
      }
      return unit;
    }));
  }
};

  const handleUnitSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setUnits(prev => prev.map(unit => {
      if (isCtrlPressed) {
        // Multi-select: toggle selection for this unit
        return {
          ...unit,
          selected: unit.id === id ? !unit.selected : unit.selected
        };
      } else {
        // Single select: select only this unit
        return {
          ...unit,
          selected: unit.id === id
        };
      }
    }));
  };

  const handleMapDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setDragPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

const handleMapDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  if (economy.money < unitCost) {
    // Not enough money
    alert(`You need ${unitCost.toLocaleString()} dollars to place a unit!`);
    return;
  }
  setEconomy(prev => ({ ...prev, money: prev.money - unitCost }));
  if (mapRef.current) {
    const unitType = e.dataTransfer.getData('unitType');
    const rect = mapRef.current.getBoundingClientRect();
    const dropX = (e.clientX - rect.left - viewport.x) / viewport.scale;
    const dropY = (e.clientY - rect.top - viewport.y) / viewport.scale;
    
    // Apply boundary constraints
    const boundedX = Math.max(0, Math.min(mapDimensions.width, dropX));
    const boundedY = Math.max(0, Math.min(mapDimensions.height, dropY));
    
    const template = unitTemplates.find(t => t.id === unitType);
    if (template) {
      const newUnit: Unit = {
        id: `unit-${Date.now()}`,
        type: 'player',
        position: { x: boundedX, y: boundedY },
        destination: null,
        health: template.health,
        attackRange: template.attackRange,
        selected: false
      };
      
      setUnits(prev => [...prev, newUnit]);
    }
  }
};

  // Map navigation handlers
  const handleMapMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0) { // Middle click or left click
      setIsMapDragging(true);
      setMapDragStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

    const handleMapMouseMove = (e: React.MouseEvent) => {
    if (isMapDragging && mapRef.current) {
        const newX = e.clientX - mapDragStart.x;
        const newY = e.clientY - mapDragStart.y;
        
        // Calculate boundaries with padding
        const minX = -mapDimensions.width * viewport.scale + window.innerWidth - MAP_PADDING_X;
        const maxX = MAP_PADDING_X;
        const minY = -mapDimensions.height * viewport.scale + window.innerHeight - MAP_PADDING_Y;
        const maxY = MAP_PADDING_Y;
        
        setViewport(prev => ({
        ...prev,
        x: Math.min(maxX, Math.max(minX, newX)),
        y: Math.min(maxY, Math.max(minY, newY))
        }));
    }
    };

  const handleMapMouseUp = () => {
    setIsMapDragging(false);
  };

    const handleMapWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomIntensity = 0.1;
    const wheel = e.deltaY < 0 ? 1 : -1;
    const zoom = Math.exp(wheel * zoomIntensity);
    
    setViewport(prev => {
        const newScale = Math.max(0.5, Math.min(3, prev.scale * zoom));
        
        // Adjust viewport to zoom toward mouse position
        const dx = (mouseX - prev.x) / prev.scale;
        const dy = (mouseY - prev.y) / prev.scale;
        
        const newX = mouseX - dx * newScale;
        const newY = mouseY - dy * newScale;
        
        // Calculate boundaries with padding for new scale
        const minX = -mapDimensions.width * newScale + window.innerWidth - MAP_PADDING_X;
        const maxX = MAP_PADDING_X;
        const minY = -mapDimensions.height * newScale + window.innerHeight - MAP_PADDING_Y;
        const maxY = MAP_PADDING_Y;
        
        return {
        x: Math.min(maxX, Math.max(minX, newX)),
        y: Math.min(maxY, Math.max(minY, newY)),
        scale: newScale
        };
    });
    };

  // Helper function to transform coordinates based on viewport
  const transformPosition = (pos: Position) => {
    return {
      x: viewport.x + pos.x * viewport.scale,
      y: viewport.y + pos.y * viewport.scale
    };
  };

  // Helper function to transform size based on viewport
  const transformSize = (size: number) => size * viewport.scale;

  return (
    <div className="mt-[45px] select-none h-[80%] flex bt-[45px]" style={{backgroundImage: "url(../images/menu_image.png)"}}>
      {/* Sidebar with unit selection */}
      <div className="z-[1] w-[200px] mr-[30px] bg-[transparent] p-4 flex flex-col">
        <p className="text-white text-[20px] mb-4">Units</p>
        <div className="mt-4 p-2 bg-gray-800 rounded">
          <div className="text-white font-bold">Economy</div>
          <div className="text-green-400">${economy.money.toLocaleString()}</div>
          <div className="text-blue-400">Income: ${economy.income.toLocaleString()}/s</div>
          <div className="text-yellow-400 text-sm">Unit Cost: ${unitCost.toLocaleString()}</div>
        </div>
        <div className="space-y-3">
          {unitTemplates.map(template => (
            <div
              key={template.id}
              className="p-1 cursor-pointer border-2 border-b-[#fc5c00] hover:bg-[#fc5c00] transition-colors"
              draggable
              onDragStart={(e) => handleUnitDragStart(e, template.id)}
              onDragEnd={handleUnitDragEnd}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{template.icon}</span>
                <div>
                  <div className="font-medium text-white">{template.name}</div>
                  <div className="text-xs text-gray-400">
                    {template.class}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center p-1">        
        <div 
          ref={mapRef}
          className="z-[0] justify-center fixed start-0 w-full h-[100%] bg-[#090909] overflow-hidden border-2 border-[#505050]"
          onClick={handleMapClick}
          onDragOver={handleMapDragOver}
          onDrop={handleMapDrop}
          onMouseDown={handleMapMouseDown}
          onMouseMove={handleMapMouseMove}
          onMouseUp={handleMapMouseUp}
          onMouseLeave={handleMapMouseUp}
          onWheel={handleMapWheel}
          style={{ cursor: isMapDragging ? 'grabbing' : 'default' }}
        >
          {/* Map background with transform */}
          <div 
            style={{ 
              backgroundImage: "url(../images/map.png)",
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              transformOrigin: '0 0',
              width: '1008px',
              height: '663px',
              position: 'absolute',
              border: '2px solid #505050'
            }}
            className="opacity-20"
          >
            {Array.from({ length: 1 }).map((_, i) => (
              <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 20}%` }}></div>
            ))}
            {Array.from({ length: 1 }).map((_, i) => (
              <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${i * 20}%` }}></div>
            ))}
          </div>

          {/* Units with transformed positions */}
          {units.map(unit => {
            const transformedPos = transformPosition(unit.position);
            const size = transformSize(24);
            
            return (
              <div key={unit.id}>
                {/* Destination markers and path lines */}
                {unit.destination && unit.health > 0 && (
                  <>
                    <div
                      className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"
                      style={{ 
                        left: transformPosition(unit.destination).x - transformSize(1), 
                        top: transformPosition(unit.destination).y - transformSize(1),
                      }}
                    />
                    <div
                      className="absolute h-1 bg-green-500 origin-left"
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

                {/* Enemy units */}
                {unit.type === 'enemy' && unit.health > 0 && (
                  <div
                    className="absolute bg-red-600 rounded-full border-2 border-red-800 flex items-center justify-center text-white font-bold text-xs"
                    style={{ 
                      left: transformedPos.x - transformSize(20), 
                      top: transformedPos.y - transformSize(20),
                      width: transformSize(40),
                      height: transformSize(40),
                      fontSize: transformSize(12)
                    }}
                  >
                    Enemy
                  </div>
                )}

                {/* Enemy wreckage */}
                {unit.type === 'enemy' && unit.health <= 0 && (
                  <div
                    className="absolute bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white font-bold text-xs opacity-70"
                    style={{ 
                      left: transformedPos.x - transformSize(20), 
                      top: transformedPos.y - transformSize(20),
                      width: transformSize(40),
                      height: transformSize(40),
                      fontSize: transformSize(12)
                    }}
                  >
                    Destroyed
                  </div>
                )}

                {/* Player units */}
                {unit.type === 'player' && (
                  <div
                    className={`z-[100] absolute cursor-pointer transition-transform ${unit.selected ? 'scale-110' : ''} ${unit.health <= 0 ? 'opacity-50' : ''}`}
                    style={{ 
                      left: transformedPos.x - size, 
                      top: transformedPos.y - size,
                      width: transformSize(48),
                      height: transformSize(48)
                    }}
                    onClick={(e) => handleUnitSelect(unit.id, e)}
                  >
                    {/* Unit body */}
                    <img 
                      src="../images/mbt/mbt_abrams.png" 
                      className="w-full h-full"
                      alt="Unit"
                      z-index="100"
                    />
                    
                    {/* Attack range indicator (only when selected and alive) */}
                    {unit.selected && unit.health > 0 && (
                      <div 
                        className="z-[-10] absolute rounded-full border-2 border-red-500 border-dashed "
                        style={{ 
                          width: unit.attackRange * 2 * viewport.scale, 
                          height: unit.attackRange * 2 * viewport.scale, 
                          left: size - (unit.attackRange * viewport.scale), 
                          top: size - (unit.attackRange * viewport.scale) 
                        }}
                      ></div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Control Points */}
            {controlPoints.map(cp => {
              const transformedPos = transformPosition(cp.position);
              const radius = transformSize(cp.radius);
              
              return (
                <div
                  key={cp.id}
                  className="absolute rounded-full border-4 border-dashed opacity-70"
                  style={{
                    left: transformedPos.x - radius,
                    top: transformedPos.y - radius,
                    width: radius * 2,
                    height: radius * 2,
                    borderColor: cp.color,
                    backgroundColor: cp.ownedByPlayer ? `${cp.color}20` : 'transparent'
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
                    {cp.ownedByPlayer ? '✅' : '⚔️'}
                  </div>
                </div>
              );
            })}

          {/* Drag preview indicator */}
          {isDragging && draggingUnitType && (
            <div
              className="absolute w-12 h-12 pointer-events-none"
              style={{ left: dragPosition.x - 24, top: dragPosition.y - 24 }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" opacity="0.7">
                <circle cx="24" cy="24" r="20" fill="#2563eb" stroke="#1e40af" strokeWidth="2" />
                <circle cx="24" cy="24" r="8" fill="#93c5fd" />
                <path d="M24 4 L24 12 M24 36 L24 44 M4 24 L12 24 M36 24 L44 24" stroke="#93c5fd" strokeWidth="2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
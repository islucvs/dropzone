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
  name: string;
  health: number;
  attackRange: number;
  color: string;
  icon: string;
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

  const [draggingUnitType, setDraggingUnitType] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const unitTemplates: UnitTemplate[] = [
    { id: 'soldier', type: 'player', name: 'Soldier', health: 100, attackRange: 80, color: '#2563eb', icon: '🔫' },
    { id: 'medic', type: 'player', name: 'Medic', health: 80, attackRange: 60, color: '#10b981', icon: '⛑️' },
    { id: 'sniper', type: 'player', name: 'Sniper', health: 70, attackRange: 150, color: '#8b5cf6', icon: '🎯' },
    { id: 'heavy', type: 'player', name: 'Heavy', health: 150, attackRange: 50, color: '#dc2626', icon: '💥' },
  ];

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
              unit.position.x += (dx / distance) * 3;
              unit.position.y += (dy / distance) * 3;
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

        return updatedUnits;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleUnitDragStart = (e: React.DragEvent, unitType: string) => {
  e.dataTransfer.setData('unitType', unitType);
  setIsDragging(true);
};

  const handleUnitDragEnd = () => {
  setIsDragging(false);
  setDraggingUnitType(null);
};

  const handleMapClick = (e: React.MouseEvent) => {
    if (mapRef.current && draggingUnitType) {
      // Place a new unit on the map
      const rect = mapRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      const template = unitTemplates.find(t => t.id === draggingUnitType);
      if (template) {
        const newUnit: Unit = {
          id: `unit-${Date.now()}`,
          type: 'player',
          position: { x: clickX, y: clickY },
          destination: null,
          health: template.health,
          attackRange: template.attackRange,
          selected: false
        };
        
        setUnits(prev => [...prev, newUnit]);
        setDraggingUnitType(null);
      }
    } else if (mapRef.current && selectedUnit) {
      // Set destination for selected unit
      const rect = mapRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      setUnits(prev => prev.map(unit => {
        if (unit.id === selectedUnit && unit.type === 'player' && unit.health > 0) {
          return {
            ...unit,
            destination: { x: clickX, y: clickY }
          };
        }
        return unit;
      }));
    }
  };

  const handleUnitSelect = (id: string) => {
    setSelectedUnit(id);
    setUnits(prev => prev.map(unit => ({
      ...unit,
      selected: unit.id === id
    })));
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
  
  if (mapRef.current) {
    const unitType = e.dataTransfer.getData('unitType');
    const rect = mapRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    
    const template = unitTemplates.find(t => t.id === unitType);
    if (template) {
      const newUnit: Unit = {
        id: `unit-${Date.now()}`,
        type: 'player',
        position: { x: dropX, y: dropY },
        destination: null,
        health: template.health,
        attackRange: template.attackRange,
        selected: false
      };
      
      setUnits(prev => [...prev, newUnit]);
    }
  }
};

  return (
    <div className="min-h-screen flex mt-[45px]" style={{backgroundImage: "url(../images/menu_image.png)"}}>
      {/* Sidebar with unit selection */}
      <div className="w-[200px] mr-[30px] bg-transparent p-4 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">Units</h2>
        <p className="text-gray-400 text-sm mb-4">Drag units to the map or click to select</p>
        
        <div className="space-y-3">
          {unitTemplates.map(template => (
            <div
                key={template.id}
                className="p-3 cursor-pointer border-2 border-b-[#fc5c00] hover:bg-[#fc5c00] transition-colors"
                draggable
                onDragStart={(e) => handleUnitDragStart(e, template.id)}
                onDragEnd={handleUnitDragEnd}
            >
                <div className="flex items-center">
                <span className="text-2xl mr-3">{template.icon}</span>
                <div>
                    <div className="font-medium text-white">{template.name}</div>
                    <div className="text-xs text-gray-400">
                    Health: {template.health} | Range: {template.attackRange}
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
            className="relative w-full h-[100%] bg-[#090909] grounded-lg overflow-hidden border-2 border-[#505050]"
            onClick={handleMapClick}
            onDragOver={handleMapDragOver}
            onDrop={handleMapDrop}
            >
            {/* Map grid background */}
            <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${i * 5}%` }}></div>
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }}></div>
            ))}
            </div>

            {/* Destination markers and path lines */}
            {units.map(unit => (
            unit.destination && unit.health > 0 && (
                <div key={`dest-${unit.id}`}>
                <div
                    className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping"
                    style={{ 
                    left: unit.destination.x - 8, 
                    top: unit.destination.y - 8 
                    }}
                />
                <div
                    className="absolute h-1 bg-green-500 origin-left"
                    style={{
                    left: unit.position.x,
                    top: unit.position.y,
                    width: Math.sqrt(
                        Math.pow(unit.destination.x - unit.position.x, 2) + 
                        Math.pow(unit.destination.y - unit.position.y, 2)
                    ),
                    transform: `rotate(${Math.atan2(
                        unit.destination.y - unit.position.y,
                        unit.destination.x - unit.position.x
                    ) * 180 / Math.PI}deg)`,
                    transformOrigin: '0 0'
                    }}
                />
                </div>
            )
            ))}

            {/* Enemy units */}
            {units.filter(u => u.type === 'enemy' && u.health > 0).map(unit => (
            <div
                key={unit.id}
                className="absolute w-10 h-10 bg-red-600 rounded-full border-2 border-red-800 flex items-center justify-center text-white font-bold text-xs"
                style={{ left: unit.position.x - 20, top: unit.position.y - 20 }}
            >
                Enemy
            </div>
            ))}

            {/* Enemy wreckage */}
            {units.filter(u => u.type === 'enemy' && u.health <= 0).map(unit => (
            <div
                key={unit.id}
                className="absolute w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white font-bold text-xs opacity-70"
                style={{ left: unit.position.x - 20, top: unit.position.y - 20 }}
            >
                Destroyed
            </div>
            ))}

            {/* Player units */}
            {units.filter(u => u.type === 'player').map(unit => (
            <div
                key={unit.id}
                className={`absolute w-12 h-12 cursor-pointer transition-transform ${unit.selected ? 'scale-110' : ''} ${unit.health <= 0 ? 'opacity-50' : ''}`}
                style={{ left: unit.position.x - 24, top: unit.position.y - 24 }}
                onClick={(e) => {
                e.stopPropagation();
                handleUnitSelect(unit.id);
                }}
            >
                {/* Unit body */}
                <img src="../images/mbt/mbt_abrams.png" className='w-[500px]'/>
                
                {/* Attack range indicator (only when selected and alive) */}
                {unit.selected && unit.health > 0 && (
                <div 
                    className="absolute rounded-full border-2 border-blue-400 border-dashed opacity-50"
                    style={{ 
                    width: unit.attackRange * 2, 
                    height: unit.attackRange * 2, 
                    left: 24 - unit.attackRange, 
                    top: 24 - unit.attackRange 
                    }}
                ></div>
                )}
            </div>
            ))}

            {/* Add this drag preview indicator */}
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
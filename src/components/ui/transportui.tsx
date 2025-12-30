// components/TransportUI.tsx
'use client';
import { useState, useMemo } from 'react';
import { Truck, Users, Package, ArrowRightCircle, ArrowLeftCircle, X } from 'lucide-react';

// In transportui.tsx, ensure the interface has:
interface TransportCapabilities {
  [key: string]: boolean; // Add this line
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

interface Unit {
  id: string;
  name: string;
  type: string;
  category: string;
  carriedBy?: string;
  health: number;
  transportSize?: number;
  imagePath: string;
  transportCapabilities?: TransportCapabilities;
  maxCapacity?: number;
}

interface TransportStatus {
  transportId: string;
  carriedUnits: string[];
  loadingQueue: string[];
  unloadingQueue: string[];
  capacityUsed: number;
}

interface TransportUIProps {
  transport: Unit;
  transports: Record<string, TransportStatus>;
  units: Unit[];
  onLoadUnit: (unitId: string) => void;
  onUnloadUnit: (unitId: string) => void;
  onLoadAllCompatible: () => void;
  onUnloadAll: () => void;
  onClose: () => void;
}

export function TransportUI({
  transport,
  transports,
  units,
  onLoadUnit,
  onUnloadUnit,
  onLoadAllCompatible,
  onUnloadAll,
  onClose
}: TransportUIProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const transportStatus = transports[transport.id] || {
    transportId: transport.id,
    carriedUnits: [],
    loadingQueue: [],
    unloadingQueue: [],
    capacityUsed: 0
  };
  
  // Memoize calculations to improve performance
  const { compatibleUnits, carriedUnits, categoryGroups } = useMemo(() => {
    const carried = units.filter(unit => 
      unit.carriedBy === transport.id
    );
    
    const compatible = units.filter(unit => 
      unit.type === 'player' &&
      unit.id !== transport.id &&
      !unit.carriedBy &&
      unit.health > 0 &&
      transport.transportCapabilities?.[unit.category as keyof TransportCapabilities] &&
      unit.transportSize && 
      transportStatus.capacityUsed + unit.transportSize <= (transport.maxCapacity || 0)
    );
    
    const groups = compatible.reduce((groups, unit) => {
      if (!groups[unit.category]) {
        groups[unit.category] = [];
      }
      groups[unit.category].push(unit);
      return groups;
    }, {} as Record<string, Unit[]>);
    
    return { compatibleUnits: compatible, carriedUnits: carried, categoryGroups: groups };
  }, [units, transport.id, transport.transportCapabilities, transport.maxCapacity, transportStatus.capacityUsed]);
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Calculate remaining capacity
  const remainingCapacity = (transport.maxCapacity || 0) - transportStatus.capacityUsed;
  
  return (
    <div className="absolute top-20 right-4 w-96 bg-black/95 backdrop-blur-sm rounded-lg border border-gray-700 p-4 shadow-2xl z-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Truck className="text-blue-400" size={20} />
          <h3 className="font-bold text-white text-lg">Transport Control</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
          aria-label="Close transport panel"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Transport Status Panel */}
      <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-white font-medium truncate">{transport.name}</div>
            <div className="text-sm text-gray-400 capitalize">{transport.category}</div>
          </div>
          <div className="flex gap-2">
            {compatibleUnits.length > 0 && (
              <button
                onClick={onLoadAllCompatible}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Load all compatible units in range"
                disabled={remainingCapacity <= 0}
              >
                <ArrowRightCircle size={14} />
                Load All
              </button>
            )}
            {carriedUnits.length > 0 && (
              <button
                onClick={onUnloadAll}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white flex items-center gap-1 transition-colors"
                title="Unload all units"
              >
                <ArrowLeftCircle size={14} />
                Unload All
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Capacity:</span>
          <span className={`font-medium ${remainingCapacity > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {transportStatus.capacityUsed}/{(transport.maxCapacity || 0)}
          </span>
        </div>
        {remainingCapacity > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            {remainingCapacity} capacity remaining
          </div>
        )}
      </div>
      
      {/* Carried Units Section */}
      {carriedUnits.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <Package size={14} />
            Loaded Units ({carriedUnits.length})
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {carriedUnits.map(unit => (
              <div
                key={unit.id}
                className="p-2 bg-gray-900/30 rounded border border-gray-700 flex justify-between items-center hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img 
                    src={unit.imagePath}
                    className="w-6 h-6 object-contain rounded flex-shrink-0"
                    alt={unit.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/24?text=?';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{unit.name}</div>
                    <div className="text-xs text-gray-400 flex gap-2">
                      <span className="capitalize">{unit.category}</span>
                      <span>Size: {unit.transportSize || 1}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onUnloadUnit(unit.id)}
                  className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs text-red-300 hover:text-red-200 transition-colors flex-shrink-0 ml-2"
                  aria-label={`Unload ${unit.name}`}
                >
                  Unload
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Available Units Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Users size={14} />
            Available Units ({compatibleUnits.length})
          </h4>
          {compatibleUnits.length > 0 && (
            <button
              onClick={() => {
                const allCategories = Object.keys(categoryGroups);
                if (expandedCategories.length === allCategories.length) {
                  setExpandedCategories([]);
                } else {
                  setExpandedCategories(allCategories);
                }
              }}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {expandedCategories.length === Object.keys(categoryGroups).length ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>
        
        {compatibleUnits.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No compatible units available for transport
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {Object.entries(categoryGroups).map(([category, categoryUnits]) => (
              <div key={category} className="border border-gray-800 rounded overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full p-2 bg-gray-900/50 hover:bg-gray-800/50 flex justify-between items-center transition-colors"
                  aria-expanded={expandedCategories.includes(category)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium capitalize">{category}</span>
                    <span className="text-xs text-gray-400">({categoryUnits.length})</span>
                  </div>
                  <span className="text-gray-400 transition-transform duration-200">
                    {expandedCategories.includes(category) ? '▲' : '▼'}
                  </span>
                </button>
                
                {expandedCategories.includes(category) && (
                  <div className="p-2 space-y-1 bg-gray-900/20">
                    {categoryUnits.map(unit => {
                      const unitSize = unit.transportSize || 1;
                      const canLoad = unitSize <= remainingCapacity;
                      
                      return (
                        <div
                          key={unit.id}
                          className="p-2 bg-gray-900/30 rounded hover:bg-gray-800/30 flex justify-between items-center transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img 
                              src={unit.imagePath}
                              className="w-6 h-6 object-contain rounded flex-shrink-0"
                              alt={unit.name}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/24?text=?';
                              }}
                            />
                            <div className="min-w-0">
                              <div className="text-white text-sm font-medium truncate">{unit.name}</div>
                              <div className="text-xs text-gray-400 flex gap-2">
                                <span>Size: {unitSize}</span>
                                <span className={canLoad ? 'text-green-400' : 'text-red-400'}>
                                  {canLoad ? 'Fits' : 'Too large'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => onLoadUnit(unit.id)}
                            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-xs text-blue-300 hover:text-blue-200 transition-colors flex-shrink-0 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!canLoad}
                            aria-label={`Load ${unit.name}`}
                            title={canLoad ? `Load ${unit.name}` : 'Not enough capacity'}
                          >
                            Load
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
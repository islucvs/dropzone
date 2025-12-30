'use client'
import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Check, Plus, Minus, Shield, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

type Unit = {
  id: number;
  unit_id: string;
  name: string;
  category: string;
  class: string;
  image_path: string;
  description: string;
  stats?: any;
  created_at: string;
  updated_at: string;
}

type SelectedUnit = {
  id: number;
  unit_id: string;
  category: string;
  selected_order: number;
  name: string;
  image_path: string;
  description: string;
  stats?: any;
}

// Category labels for display
const CATEGORY_NAMES: Record<string, string> = {
  recon: 'Recon',
  robotics: 'Robotics',
  infantry: 'Infantry',
  pfvs: 'Armoured Vehicles',
  mbt: 'MBT\'s',
  artillery: 'Artillery',
  aas: 'Anti-Aircraft',
  helicopters: 'Helicopters',
  fighterjets: 'Fighter Jet',
  transportation: 'Transportation',
  bomber: 'Bomber',
  destroyers: 'Destroyers',
  carrier: 'Carrier',
};

// Category order for tabs
const CATEGORY_ORDER = [
  'recon', 'robotics', 'infantry', 'pfvs', 'mbt', 'artillery', 'aas', 
  'helicopters', 'fighterjets', 'transportation', 'bomber', 'destroyers', 'carrier'
];

export default function ArsenalSelector() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('recon');
  const [activeUnit, setActiveUnit] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingSelected, setLoadingSelected] = useState(true);

  // Fetch all units from database
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true);
        const response = await fetch('/api/units');
        if (response.ok) {
          const data = await response.json();
          setUnits(data);
          
          // Set first unit of first category as active
          if (data.length > 0) {
            const firstUnit = data.find((unit: Unit) => unit.category === activeCategory) || data[2];
            setActiveUnit(firstUnit.unit_id);
          }
        } else {
          toast.error('Failed to load units');
        }
      } catch (error) {
        console.error('Error fetching units:', error);
        toast.error('Failed to load units');
      } finally {
        setLoadingUnits(false);
      }
    };

    fetchUnits();
  }, []);

  // Fetch selected units
  useEffect(() => {
    const fetchSelectedUnits = async () => {
      try {
        setLoadingSelected(true);
        const response = await fetch('/api/units/selected?userId=default_user');
        if (response.ok) {
          const data = await response.json();
          setSelectedUnits(data);
        }
      } catch (error) {
        console.error('Error fetching selected units:', error);
      } finally {
        setLoadingSelected(false);
        setLoading(false);
      }
    };

    fetchSelectedUnits();
  }, []);

  // Handle unit selection toggle
  const handleToggleUnit = async (unitId: string, category: string) => {
    const isSelected = selectedUnits.some(u => u.unit_id === unitId);
    
    if (isSelected) {
      // Deselect the unit
      await handleRemoveUnit(unitId);
    } else {
      // Select the unit
      await handleSelectUnit(unitId, category);
    }
  };

  const handleSelectUnit = async (unitId: string, category: string) => {
    // Check if already selected in this category
    const alreadySelected = selectedUnits.filter(u => u.category === category);
    
    if (alreadySelected.length >= 3) {
      toast.error(`Maximum 3 units allowed in ${CATEGORY_NAMES[category] || category} category`);
      return;
    }
    
    try {
      const response = await fetch('/api/units/selected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId,
          category,
          userId: 'default_user'
        }),
      });
      
      if (response.ok) {
        const newUnit = await response.json();
        setSelectedUnits(prev => [...prev, newUnit]);
        const unit = units.find(u => u.unit_id === unitId);
        toast.success(`${unit?.name || 'Unit'} added to arsenal`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to select unit');
      }
    } catch (error) {
      console.error('Error selecting unit:', error);
      toast.error('Failed to select unit');
    }
  };

  const handleRemoveUnit = async (unitId: string) => {
    try {
      const response = await fetch(`/api/units/selected?unitId=${unitId}&userId=default_user`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const unitName = selectedUnits.find(u => u.unit_id === unitId)?.name;
        setSelectedUnits(prev => prev.filter(u => u.unit_id !== unitId));
        toast.success(`${unitName || 'Unit'} removed from arsenal`);
      }
    } catch (error) {
      console.error('Error removing unit:', error);
      toast.error('Failed to remove unit');
    }
  };

  // Get selected count for category
  const getSelectedCountForCategory = (category: string) => {
    return selectedUnits.filter(u => u.category === category).length;
  };

  // Check if unit is selected
  const isUnitSelected = (unitId: string) => {
    return selectedUnits.some(u => u.unit_id === unitId);
  };

  // Get units for current category
  const getUnitsForCategory = (category: string) => {
    return units.filter(unit => unit.category === category);
  };

  // Get current active unit details
  const getActiveUnit = () => {
    return units.find(unit => unit.unit_id === activeUnit) || units[0];
  };

  // Parse stats from JSON string
  const parseStats = (stats: any) => {
    if (!stats) return {};
    try {
      return typeof stats === 'string' ? JSON.parse(stats) : stats;
    } catch {
      return {};
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{backgroundImage: "url(../images/menu_image.png)"}}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading arsenal...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="inset-0 flex flex-col bg-cover bg-center pt-[3rem]"
      style={{ backgroundImage: "url(../images/menu_image.png)" }}
    >

      <div className="flex-1 overflow-hidden">
        <Tabs 
          defaultValue="recon" 
          className="h-full flex flex-col" 
          onValueChange={(value) => {
            setActiveCategory(value);
            const categoryUnits = getUnitsForCategory(value);
            if (categoryUnits.length > 0) {
              setActiveUnit(categoryUnits[0].unit_id);
            }
          }}
        >
          {/* Category Tabs */}
          <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
            <TabsList className="h-14 bg-transparent gap-1 px-4 overflow-x-auto">
              {CATEGORY_ORDER.map((categoryId) => {
                if (!units.some(u => u.category === categoryId)) return null;
                
                const count = getSelectedCountForCategory(categoryId);
                const isActive = activeCategory === categoryId;
                
                return (
                  <TabsTrigger 
                    key={categoryId}
                    value={categoryId}
                    className={`relative px-3 py-1 transition-all ${
                      isActive 
                        ? 'bg-gray-900/80 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {CATEGORY_NAMES[categoryId] || categoryId}
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      count >= 3 ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {count}
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-hidden">
            <TabsContent value={activeCategory} className="h-full mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Unit List Panel */}
                <div className="lg:col-span-1 h-full">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {CATEGORY_NAMES[activeCategory] || activeCategory} Units
                      <span className="ml-2 text-sm text-gray-400">
                        ({getSelectedCountForCategory(activeCategory)}/3 selected)
                      </span>
                    </h3>
                    
                    {loadingUnits ? (
                      <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      </div>
                    ) : (
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-2">
                          {getUnitsForCategory(activeCategory).map((unit) => {
                            const isSelected = isUnitSelected(unit.unit_id);
                            const stats = parseStats(unit.stats);
                            
                            return (
                              <div
                                key={unit.unit_id}
                                className={`relative rounded-lg border transition-all duration-200 hover:border-gray-400 cursor-pointer ${
                                  isSelected 
                                    ? 'border-green-500 bg-green-500/10' 
                                    : 'border-gray-700 bg-black/30'
                                } ${activeUnit === unit.unit_id ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setActiveUnit(unit.unit_id)}
                              >
                                <div className="p-3 flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium truncate">{unit.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{unit.class}</div>
                                    {stats.health && (
                                      <div className="flex items-center gap-3 mt-1 text-xs">
                                        <span className="text-red-400">❤️ {stats.health} HP</span>
                                        {stats.attackRange && (
                                          <span className="text-blue-400">🎯 {stats.attackRange} range</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isSelected && (
                                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                        SELECTED
                                      </span>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleUnit(unit.unit_id, unit.category);
                                      }}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isSelected 
                                          ? 'bg-red-500 hover:bg-red-600' 
                                          : getSelectedCountForCategory(unit.category) >= 3 
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                      disabled={!isSelected && getSelectedCountForCategory(unit.category) >= 3}
                                      title={!isSelected && getSelectedCountForCategory(unit.category) >= 3 
                                        ? 'Maximum 3 units allowed' 
                                        : isSelected ? 'Remove from arsenal' : 'Add to arsenal'
                                      }
                                    >
                                      {isSelected ? (
                                        <Minus size={16} className="text-white" />
                                      ) : (
                                        <Plus size={16} className="text-white" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          
                          {getUnitsForCategory(activeCategory).length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No units found in this category</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                {/* Unit Detail Panel */}
                <div className="lg:col-span-2 h-full">
                  <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 h-full overflow-auto">
                    {units.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg">No units loaded from database</p>
                        </div>
                      </div>
                    ) : (
                      (() => {
                        const unit = getActiveUnit();
                        if (!unit) return null;
                        
                        const isSelected = isUnitSelected(unit.unit_id);
                        const selectedInCategory = getSelectedCountForCategory(unit.category);
                        const stats = parseStats(unit.stats);
                        
                        return (
                          <Card className="bg-black/50 backdrop-blur-sm border-gray-700 text-white h-full">
                            <CardHeader>
                              <div className="flex flex-col items-center">
                                <div className="relative w-full max-w-md">
                                  <img 
                                    src="../images/items_bg.png" 
                                    className="w-full aspect-square object-contain"
                                    alt="Unit background"
                                  />
                                  <img 
                                    src={unit.image_path} 
                                    className="absolute inset-0 w-full h-full object-contain p-8"
                                    alt={unit.name}
                                    onError={(e) => {
                                      // Fallback image if specific unit image doesn't exist
                                      e.currentTarget.src = `../images/${unit.category}/default.png`;
                                    }}
                                  />
                                </div>
                                <div className="mt-4 w-full">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-2xl">{unit.name}</CardTitle>
                                      <CardDescription className="text-gray-300 mt-2">
                                        {unit.description}
                                      </CardDescription>
                                    </div>
                                    <Button
                                      onClick={() => handleToggleUnit(unit.unit_id, unit.category)}
                                      disabled={!isSelected && selectedInCategory >= 3}
                                      className={`min-w-[140px] ${
                                        isSelected 
                                          ? 'bg-red-600 hover:bg-red-700' 
                                          : selectedInCategory >= 3
                                            ? 'bg-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                      }`}
                                    >
                                      {isSelected ? (
                                        <>
                                          <Minus className="mr-2" size={16} />
                                          Remove
                                        </>
                                      ) : (
                                        <>
                                          <Plus className="mr-2" size={16} />
                                          Add to Arsenal
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-300 mb-2">Unit Stats</h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Health</span>
                                        <span className="text-white">{stats.health || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Attack Range</span>
                                        <span className="text-white">{stats.attackRange || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Speed</span>
                                        <span className="text-white">{stats.speed || 'N/A'}</span>
                                      </div>
                                      {stats.damage && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Damage</span>
                                          <span className="text-white">{stats.damage}</span>
                                        </div>
                                      )}
                                      {stats.armor && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Armor</span>
                                          <span className="text-white">{stats.armor}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-300 mb-2">Unit Information</h4>
                                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-gray-300">Category</span>
                                      <span className="text-white capitalize">{unit.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-300">Class</span>
                                      <span className="text-white">{unit.class}</span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-700">
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Selected in {CATEGORY_NAMES[unit.category] || unit.category}</span>
                                        <span className={`font-bold ${selectedInCategory >= 3 ? 'text-red-400' : 'text-green-400'}`}>
                                          {selectedInCategory}/3
                                        </span>
                                      </div>
                                      <div className="flex gap-1 mt-2">
                                        {[...Array(3)].map((_, i) => (
                                          <div 
                                            key={i}
                                            className={`flex-1 h-2 rounded ${
                                              i < selectedInCategory 
                                                ? 'bg-green-500' 
                                                : 'bg-gray-700'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
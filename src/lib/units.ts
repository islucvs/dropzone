export const unitCategories = [
  { id: 'recon', name: 'Recon', limit: 3 },
  { id: 'robotics', name: 'Robotics', limit: 3 },
  { id: 'infantry', name: 'Infantry', limit: 3 },
  { id: 'pfvs', name: 'Armoured Vehicles', limit: 3 },
  { id: 'mbt', name: 'MBT\'s', limit: 3 },
  { id: 'artillery', name: 'Artillery', limit: 3 },
  { id: 'aas', name: 'Anti-Aircraft', limit: 3 },
  { id: 'helicopters', name: 'Helicopters', limit: 3 },
  { id: 'fighterjets', name: 'Fighter Jet', limit: 3 },
  { id: 'transportation', name: 'Transportation', limit: 3 },
  { id: 'bomber', name: 'Bomber', limit: 3 },
  { id: 'destroyers', name: 'Destroyers', limit: 3 },
  { id: 'carrier', name: 'Carrier', limit: 3 },
];

export const getCategoryLimit = (category: string): number => {
  const cat = unitCategories.find(c => c.id === category);
  return cat ? cat.limit : 3;
};
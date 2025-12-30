'use client';

import { Shield, Maximize2, Minimize2, Eye, EyeOff, Play, Pause, Zap, Image, Satellite, Map } from 'lucide-react';
import { useGameState } from '@/contexts/game/game-state-context';
import { useGameActions } from '@/contexts/game/game-actions-context';
import { useEnemyAI } from '@/hooks/game/use-enemy-ai';
import { StatDisplay } from '../ui/stat-display';

export function GameHeader() {
  const { economy, controlPoints, units, viewport, isFullscreen, showGrid, autoSpawnEnabled, mapBackgroundType, setShowGrid, setAutoSpawnEnabled, setMapBackgroundType } = useGameState();
  const { toggleFullscreen } = useGameActions();
  const { forceSpawnWave } = useEnemyAI();

  const controlledPointsCount = controlPoints.filter(cp => cp.ownedByPlayer).length;
  const playerUnitsCount = units.filter(u => u.type === 'player').length;
  const visibleEnemies = units.filter(u => u.type === 'enemy' && u.health > 0 && u.isVisible).length;

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold text-white">Dropzone Battlefield</h1>
        </div>

        <div className="flex gap-6">
          <StatDisplay
            label="MONEY"
            value={`$${economy.money.toLocaleString()}`}
            valueClassName="text-green-400 font-bold text-lg"
          />
          <StatDisplay
            label="INCOME"
            value={`$${economy.income.toLocaleString()}/s`}
            valueClassName="text-blue-400 font-bold"
          />
          <StatDisplay
            label="CONTROL"
            value={`${controlledPointsCount}/${controlPoints.length}`}
            valueClassName="text-emerald-400 font-bold"
          />
          <StatDisplay
            label="UNITS"
            value={playerUnitsCount}
            valueClassName="text-yellow-400 font-bold"
          />
          <StatDisplay
            label="ENEMIES SPOTTED"
            value={visibleEnemies}
            valueClassName="text-orange-400 font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            console.log('🟢 PLAY button clicked');
            setAutoSpawnEnabled(true);
          }}
          disabled={autoSpawnEnabled}
          className={`p-2 rounded-lg transition-colors ${
            autoSpawnEnabled
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          title="Start Auto Spawn"
        >
          <Play size={18} />
        </button>
        <button
          onClick={() => {
            console.log('🔴 PAUSE button clicked');
            setAutoSpawnEnabled(false);
          }}
          disabled={!autoSpawnEnabled}
          className={`p-2 rounded-lg transition-colors ${
            !autoSpawnEnabled
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          title="Stop Auto Spawn"
        >
          <Pause size={18} />
        </button>
        <button
          onClick={forceSpawnWave}
          className="p-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          title="Spawn Enemy Wave Now"
        >
          <Zap size={18} />
        </button>
        <div className="w-px h-6 bg-gray-700"></div>
        <button
          onClick={() => setMapBackgroundType('static')}
          className={`p-2 rounded-lg transition-colors ${
            mapBackgroundType === 'static'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
          }`}
          title="Static Map"
        >
          <Image size={18} />
        </button>
        <button
          onClick={() => setMapBackgroundType('satellite')}
          className={`p-2 rounded-lg transition-colors ${
            mapBackgroundType === 'satellite'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
          }`}
          title="Satellite"
        >
          <Satellite size={18} />
        </button>
        <button
          onClick={() => setMapBackgroundType('satellite-streets')}
          className={`p-2 rounded-lg transition-colors ${
            mapBackgroundType === 'satellite-streets'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
          }`}
          title="Satellite + Streets"
        >
          <Map size={18} />
        </button>
        <div className="w-px h-6 bg-gray-700"></div>
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
  );
}

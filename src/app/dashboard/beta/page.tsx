'use client';

import { useEffect } from 'react';
import { GameStateProvider } from '@/contexts/game/game-state-context';
import { GameActionsProvider } from '@/contexts/game/game-actions-context';
import { GameHeader } from '@/components/game/layout/game-header';
import { GameSidebar } from '@/components/game/layout/game-sidebar';
import { GameViewportControls } from '@/components/game/layout/game-viewport-controls';
import { ArsenalList } from '@/components/game/arsenal/arsenal-list';
import { CategorySummary } from '@/components/game/arsenal/category-summary';
import { SelectedUnitsPanel } from '@/components/game/units/selected-units-panel';
import { ControlsHelp } from '@/components/game/units/controls-help';
import { GameMap } from '@/components/game/map/game-map';
import { BottomStatusBar } from '@/components/game/ui/bottom-status-bar';
import { TransportUIWrapper } from '@/components/game/ui/transport-ui-wrapper';
import { useGameState } from '@/contexts/game/game-state-context';
import { useKeyboardControls } from '@/hooks/game/use-keyboard-controls';
import { useEconomy } from '@/hooks/game/use-economy';
import { useControlPoints } from '@/hooks/game/use-control-points';
import { useTransport } from '@/hooks/game/use-transport';
import { useEnemyAI } from '@/hooks/game/use-enemy-ai';
import { useGameLoop } from '@/hooks/game/use-game-loop';
import { useGameLoading } from '@/hooks/game/use-game-loading';
import { BattleLoadingScreen } from '@/components/game/ui/battle-loading-screen';

function GameContent() {
  const {
    selectedArsenalUnits,
    setSelectedArsenalUnits,
    setUnitTemplates,
    setUnits,
    setControlPoints,
    controlPoints,
    isLoading,
    loadingProgress
  } = useGameState();

  const { spawnEnemyWaveFromAllPoints } = useEnemyAI();

  useKeyboardControls(spawnEnemyWaveFromAllPoints);
  useEconomy();
  useControlPoints();
  useTransport();
  useGameLoop();
  useGameLoading();

  useEffect(() => {
    const loadInitialData = async () => {
      if (selectedArsenalUnits.length > 0) return;

      try {
        const response = await fetch('/api/units/selected?userId=default_user');
        if (response.ok) {
          const data = await response.json();
          setSelectedArsenalUnits(data);

          const templates = data.map((unit: any) => {
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
              let capabilities: any = {};
              let visionRange = 0;

              switch (unit.category) {
                case 'recon':
                  health = 70; attackRange = 0; color = '#8b5cf6';
                  capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                  visionRange = 3000;
                  break;
                case 'infantry':
                  health = 100; attackRange = 50; color = '#10b981';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 200;
                  break;
                case 'robotics':
                  health = 120; attackRange = 60; color = '#f59e0b';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 250;
                  break;
                case 'pfvs':
                  health = 150; attackRange = 70; color = '#3b82f6';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 300;
                  break;
                case 'mbt':
                  health = 200; attackRange = 100; color = '#ef4444';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 350;
                  break;
                case 'artillery':
                  health = 80; attackRange = 200; color = '#dc2626';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 400;
                  break;
                case 'aas':
                  health = 100; attackRange = 150; color = '#8b5cf6';
                  capabilities = { canFloat: false, canFly: false, isAmphibious: false };
                  visionRange = 500;
                  break;
                case 'helicopters':
                  health = 90; attackRange = 120; color = '#06b6d4';
                  capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                  visionRange = 600;
                  break;
                case 'fighterjets':
                  health = 80; attackRange = 100; color = '#0ea5e9';
                  capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                  visionRange = 800;
                  break;
                case 'transportation':
                  health = 120; attackRange = 0; color = '#a855f7';
                  capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                  visionRange = 400;
                  break;
                case 'bomber':
                  health = 100; attackRange = 80; color = '#7c3aed';
                  capabilities = { canFloat: false, canFly: true, isAmphibious: false };
                  visionRange = 600;
                  break;
                case 'destroyers':
                  health = 250; attackRange = 150; color = '#0284c7';
                  capabilities = { canFloat: true, canFly: false, isAmphibious: false };
                  visionRange = 700;
                  break;
                case 'carrier':
                  health = 400; attackRange = 80; color = '#0369a1';
                  capabilities = { canFloat: true, canFly: false, isAmphibious: false };
                  visionRange = 800;
                  break;
              }

              return { health, attackRange, color, capabilities, visionRange };
            };

            const props = getUnitProperties();

            return {
              id: unit.unit_id,
              type: 'player',
              class: unit.category,
              name: unit.name,
              health: props.health,
              attackRange: props.attackRange,
              color: props.color,
              icon: '🎯',
              imagePath: unit.image_path,
              category: unit.category,
              transportCapabilities: safeParseJSON(unit.transport_capacity),
              maxCapacity: unit.max_capacity,
              canBeTransported: unit.can_be_transported,
              transportSize: unit.transport_size,
              isTransport: unit.max_capacity > 0,
              capabilities: props.capabilities,
              visionRange: props.visionRange
            };
          });

          setUnitTemplates(templates);
        }
      } catch (error) {
        console.error('Failed to load selected units:', error);
      }
    };

    loadInitialData();
  }, [selectedArsenalUnits.length, setSelectedArsenalUnits, setUnitTemplates]);

  useEffect(() => {
    const initialControlPoints = [
      { id: 'cp-1', position: { x: 200, y: 150 }, radius: 60, ownedByPlayer: true, color: '#44ff44ff', progress: 0 },
      { id: 'cp-2', position: { x: 600, y: 300 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-3', position: { x: 500, y: 700 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-4', position: { x: 800, y: 200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-5', position: { x: 250, y: 800 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-6', position: { x: 1300, y: 500 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
      { id: 'cp-7', position: { x: 1100, y: 200 }, radius: 60, ownedByPlayer: false, color: '#ff4444', progress: 0 },
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
    ];
    setControlPoints(initialControlPoints);
  }, [setControlPoints]);

  return (
    <div className="pt-[3rem] select-none fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      <GameHeader />

      <div className="flex-1 flex overflow-hidden">
        <GameSidebar>
          <ArsenalList />
          <CategorySummary />
          <SelectedUnitsPanel />
          <ControlsHelp />
        </GameSidebar>

        <div className="flex-1 relative overflow-hidden">
          <GameMap />
          <GameViewportControls />
          <BottomStatusBar />
        </div>
      </div>

      <TransportUIWrapper />
      <BattleLoadingScreen isLoading={isLoading} progress={loadingProgress} />
    </div>
  );
}

export default function DropzoneGame() {
  return (
    <GameStateProvider>
      <GameActionsProvider>
        <GameContent />
      </GameActionsProvider>
    </GameStateProvider>
  );
}

'use client';

import { useEffect } from 'react';
import { useGameState } from '@/contexts/game/game-state-context';
import { useGameActions } from '@/contexts/game/game-actions-context';
import { RealMapBackground } from './real-map-background';
import { MapSeaAreas } from './map-sea-areas';
import { MapControlPoints } from './map-control-points';
import { MapUnits } from './map-units';
import { UnitInfoCard } from '../units/unit-info-card';

export function GameMap() {
  const {
    mapDimensions,
    viewport,
    showGrid,
    draggingUnitType,
    isMapDragging,
    seaAreas,
    controlPoints,
    units,
    selectedUnitInfo,
    mapBackgroundType,
    setSelectedUnitInfo
  } = useGameState();

  const {
    mapRef,
    handleMapClick,
    handleMapDragOver,
    handleMapDrop,
    handleMapMouseDown,
    handleMapMouseMove,
    handleMapMouseUp,
    handleMapRightClick,
    handleMapWheel,
    handleUnitSelect,
    transformPosition,
    transformSize
  } = useGameActions();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [mapRef]);

  return (
    <div
      ref={mapRef}
      className="absolute inset-0 bg-gray-950"
      onClick={handleMapClick}
      onContextMenu={handleMapRightClick}
      onDragOver={handleMapDragOver}
      onDrop={handleMapDrop}
      onMouseDown={handleMapMouseDown}
      onMouseMove={handleMapMouseMove}
      onMouseUp={handleMapMouseUp}
      onMouseLeave={handleMapMouseUp}
      onWheel={handleMapWheel}
      style={{ cursor: isMapDragging ? 'grabbing' : draggingUnitType ? 'crosshair' : 'default' }}
    >
      {mapBackgroundType === 'static' ? (
        <div
          className="absolute"
          style={{
            backgroundImage: 'url(../images/map.png)',
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            transformOrigin: '0 0',
            width: `${mapDimensions.width}px`,
            height: `${mapDimensions.height}px`,
            opacity: 0.4,
          }}
        >
          {showGrid && (
            <>
              {Array.from({ length: Math.ceil(mapDimensions.height / 50) }).map((_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute w-full h-px bg-white/10"
                  style={{ top: `${i * 50}px` }}
                />
              ))}
              {Array.from({ length: Math.ceil(mapDimensions.width / 50) }).map((_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute h-full w-px bg-white/10"
                  style={{ left: `${i * 50}px` }}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <RealMapBackground
          mapDimensions={mapDimensions}
          viewport={viewport}
          showGrid={showGrid}
        />
      )}

      {/* <MapSeaAreas
        seaAreas={seaAreas}
        transformPosition={transformPosition}
        transformSize={transformSize}
      /> */}

      <MapControlPoints
        controlPoints={controlPoints}
        transformPosition={transformPosition}
        transformSize={transformSize}
      />

      <MapUnits
        units={units}
        transformPosition={transformPosition}
        transformSize={transformSize}
        onUnitSelect={handleUnitSelect}
      />

      {selectedUnitInfo && (
        <UnitInfoCard
          unit={selectedUnitInfo}
          onClose={() => setSelectedUnitInfo(null)}
        />
      )}
    </div>
  );
}

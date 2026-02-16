import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { MAP, MAP_WIDTH, MAP_HEIGHT } from './mapData';
import TileRenderer from './TileRenderer';
import PlayerSprite from './PlayerSprite';
import MobileControls from './MobileControls';
import { useGameEngine } from './useGameEngine';
import { useIsMobile } from '@/hooks/use-mobile';

const GameWorld: React.FC = () => {
  const isMobile = useIsMobile();
  const { playerPos, direction, isMoving, stepFrame, handleTapMove, movePlayer } = useGameEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Calculate tile size based on viewport
  const tileSize = useMemo(() => {
    if (dimensions.width === 0) return 32;
    // Show ~12 tiles across on mobile, ~18 on desktop
    const tilesAcross = isMobile ? 10 : 16;
    const controlsHeight = isMobile ? 160 : 0;
    const availableHeight = dimensions.height - controlsHeight;
    const fromWidth = Math.floor(dimensions.width / tilesAcross);
    const fromHeight = Math.floor(availableHeight / (isMobile ? 14 : 12));
    return Math.max(16, Math.min(fromWidth, fromHeight, 48));
  }, [dimensions, isMobile]);

  // Viewport tiles
  const viewportTilesX = useMemo(() => Math.ceil(dimensions.width / tileSize) + 2, [dimensions.width, tileSize]);
  const viewportTilesY = useMemo(() => {
    const controlsHeight = isMobile ? 160 : 0;
    return Math.ceil((dimensions.height - controlsHeight) / tileSize) + 2;
  }, [dimensions.height, tileSize, isMobile]);

  // Camera offset (center on player)
  const cameraX = useMemo(() => {
    const centerOffset = Math.floor(viewportTilesX / 2);
    let cx = playerPos.x - centerOffset;
    cx = Math.max(0, Math.min(cx, MAP_WIDTH - viewportTilesX));
    return cx;
  }, [playerPos.x, viewportTilesX]);

  const cameraY = useMemo(() => {
    const centerOffset = Math.floor(viewportTilesY / 2);
    let cy = playerPos.y - centerOffset;
    cy = Math.max(0, Math.min(cy, MAP_HEIGHT - viewportTilesY));
    return cy;
  }, [playerPos.y, viewportTilesY]);

  // Resize observer
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle tap/click on map
  const handleMapClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      const tileX = Math.floor(relX / tileSize) + cameraX;
      const tileY = Math.floor(relY / tileSize) + cameraY;

      if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
        handleTapMove(tileX, tileY);
      }
    },
    [tileSize, cameraX, cameraY, handleTapMove]
  );

  // Render visible tiles
  const visibleTiles = useMemo(() => {
    const tiles: React.ReactNode[] = [];
    const startX = Math.max(0, cameraX);
    const endX = Math.min(MAP_WIDTH, cameraX + viewportTilesX);
    const startY = Math.max(0, cameraY);
    const endY = Math.min(MAP_HEIGHT, cameraY + viewportTilesY);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        tiles.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: (x - cameraX) * tileSize,
              top: (y - cameraY) * tileSize,
              width: tileSize,
              height: tileSize,
            }}
          >
            <TileRenderer tile={MAP[y][x]} x={x} y={y} tileSize={tileSize} />
          </div>
        );
      }
    }
    return tiles;
  }, [cameraX, cameraY, viewportTilesX, viewportTilesY, tileSize]);

  const controlsHeight = isMobile ? 160 : 0;
  const mapHeight = dimensions.height - controlsHeight;

  return (
    <div className="fixed inset-0 bg-background flex flex-col overflow-hidden">
      {/* Game viewport */}
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-pointer flex-1"
        style={{ height: mapHeight }}
        onClick={handleMapClick}
        onTouchStart={isMobile ? handleMapClick : undefined}
      >
        {/* Tiles */}
        {visibleTiles}

        {/* Player */}
        <div
          style={{
            position: 'absolute',
            left: (playerPos.x - cameraX) * tileSize,
            top: (playerPos.y - cameraY) * tileSize,
            width: tileSize,
            height: tileSize,
            zIndex: 10,
            transition: `left ${100}ms linear, top ${100}ms linear`,
          }}
        >
          <PlayerSprite
            direction={direction}
            isMoving={isMoving}
            stepFrame={stepFrame}
            tileSize={tileSize}
          />
        </div>

        {/* HUD */}
        <div className="absolute top-2 left-2 z-20 bg-card/80 px-3 py-1 rounded pixel-border">
          <span className="text-foreground text-[8px] font-pixel">
            {isMobile ? 'Toque para mover' : 'WASD para mover'}
          </span>
        </div>
      </div>

      {/* Mobile D-Pad */}
      {isMobile && (
        <div
          className="flex items-center justify-center bg-card/90 border-t border-border"
          style={{ height: controlsHeight }}
        >
          <MobileControls onMove={movePlayer} />
        </div>
      )}
    </div>
  );
};

export default GameWorld;

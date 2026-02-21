import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAP, MAP_WIDTH, MAP_HEIGHT } from './mapData';
import TileRenderer from './TileRenderer';
import PlayerSprite from './PlayerSprite';
import RemotePlayerSprite from './RemotePlayerSprite';
import MobileControls from './MobileControls';
import { useGameEngine } from './useGameEngine';
import { useMultiplayer } from './useMultiplayer';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const CHUNK_SIZE = 15; // 15x15 visible chunk

const GameWorld: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { playerPos, direction, isMoving, stepFrame, handleTapMove, movePlayer } = useGameEngine();
  const { remotePlayers } = useMultiplayer(playerPos, direction, isMoving, stepFrame);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Calculate tile size to fit CHUNK_SIZE tiles in the viewport
  const tileSize = useMemo(() => {
    if (dimensions.width === 0) return 32;
    const controlsHeight = isMobile ? 160 : 0;
    const availableHeight = dimensions.height - controlsHeight;
    const fromWidth = Math.floor(dimensions.width / CHUNK_SIZE);
    const fromHeight = Math.floor(availableHeight / CHUNK_SIZE);
    return Math.max(16, Math.min(fromWidth, fromHeight, 64));
  }, [dimensions, isMobile]);

  // Camera offset (center on player, clamped)
  const cameraX = useMemo(() => {
    const half = Math.floor(CHUNK_SIZE / 2);
    return Math.max(0, Math.min(playerPos.x - half, MAP_WIDTH - CHUNK_SIZE));
  }, [playerPos.x]);

  const cameraY = useMemo(() => {
    const half = Math.floor(CHUNK_SIZE / 2);
    return Math.max(0, Math.min(playerPos.y - half, MAP_HEIGHT - CHUNK_SIZE));
  }, [playerPos.y]);

  // Resize observer
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
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
      const tileX = Math.floor((clientX - rect.left) / tileSize) + cameraX;
      const tileY = Math.floor((clientY - rect.top) / tileSize) + cameraY;

      if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
        handleTapMove(tileX, tileY);
      }
    },
    [tileSize, cameraX, cameraY, handleTapMove]
  );

  // Render visible 15x15 chunk
  const visibleTiles = useMemo(() => {
    const tiles: React.ReactNode[] = [];
    const endX = Math.min(MAP_WIDTH, cameraX + CHUNK_SIZE);
    const endY = Math.min(MAP_HEIGHT, cameraY + CHUNK_SIZE);

    for (let y = cameraY; y < endY; y++) {
      for (let x = cameraX; x < endX; x++) {
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
  }, [cameraX, cameraY, tileSize]);

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

        {/* Local Player */}
        <div
          style={{
            position: 'absolute',
            left: (playerPos.x - cameraX) * tileSize,
            top: (playerPos.y - cameraY) * tileSize,
            width: tileSize,
            height: tileSize,
            zIndex: 10,
            transition: 'left 100ms linear, top 100ms linear',
          }}
        >
          <PlayerSprite
            direction={direction}
            isMoving={isMoving}
            stepFrame={stepFrame}
            tileSize={tileSize}
          />
        </div>

        {/* Remote Players */}
        {remotePlayers.map(rp => (
          <RemotePlayerSprite
            key={rp.id}
            player={rp}
            tileSize={tileSize}
            cameraX={cameraX}
            cameraY={cameraY}
          />
        ))}

        {/* HUD */}
        <div className="absolute top-2 left-2 z-20 bg-card/80 px-3 py-2 rounded pixel-border flex items-center gap-3">
          <span className="text-primary text-[7px] font-pixel">
            {user?.name || 'Jogador'}
          </span>
          <span className="text-muted-foreground text-[6px]">|</span>
          <span className="text-muted-foreground text-[6px] font-pixel">
            {isMobile ? 'Toque para mover' : 'WASD'}
          </span>
        </div>

        {/* Online count + Logout */}
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <div className="bg-card/80 px-3 py-2 rounded pixel-border">
            <span className="text-accent text-[6px] font-pixel">
              🟢 {remotePlayers.length + 1} online
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="bg-destructive/80 text-destructive-foreground text-[6px] font-pixel px-3 py-2 rounded pixel-border hover:bg-destructive transition-colors"
          >
            SAIR
          </button>
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

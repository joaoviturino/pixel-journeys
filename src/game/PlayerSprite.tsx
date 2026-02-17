import React, { useEffect, useState } from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

// Layout: 4 columns x N rows
// Col 0: Back (up), Col 1: Left, Col 2: Front (down), Col 3: Right
// Rows = animation frames for walking
const COLS = 4;
const WALK_FRAMES = 4; // Use first 4 rows as walk cycle

const DIRECTION_COL: Record<Direction, number> = {
  up: 0,    // costas
  left: 1,
  down: 2,  // frente
  right: 3,
};

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, isMoving, stepFrame, tileSize }) => {
  const [sheetSize, setSheetSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setSheetSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = playerSpriteSheet;
  }, []);

  if (!sheetSize) return <div style={{ width: tileSize, height: tileSize }} />;

  const frameW = sheetSize.w / COLS;
  const frameH = frameW; // Square frames

  const col = DIRECTION_COL[direction];
  // Idle = row 0, walking cycles through rows 0-3
  const row = isMoving ? (stepFrame % WALK_FRAMES) : 0;

  const scaledSheetW = (sheetSize.w / frameW) * tileSize;
  const scaledSheetH = (sheetSize.h / frameH) * tileSize;

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        overflow: 'hidden',
        imageRendering: 'pixelated',
        backgroundImage: `url(${playerSpriteSheet})`,
        backgroundSize: `${scaledSheetW}px ${scaledSheetH}px`,
        backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default PlayerSprite;

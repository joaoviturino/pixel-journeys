import React, { useEffect, useState } from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

const COLS = 3;

const DIRECTION_ROW: Record<Direction, number> = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};

const WALK_CYCLE = [1, 0, 1, 2];

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

  const row = DIRECTION_ROW[direction];
  const col = isMoving ? WALK_CYCLE[stepFrame % WALK_CYCLE.length] : 1;

  // Scale entire sheet so each frame = tileSize
  const scaledSheetW = (sheetSize.w / frameW) * tileSize; // = COLS * tileSize
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

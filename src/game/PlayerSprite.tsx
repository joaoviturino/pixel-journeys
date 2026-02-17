import React, { useEffect, useState } from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

// Graal Online Classic body spritesheet format:
// 3 columns: left-step, standing, right-step
// Row 0: UP, Row 1: LEFT, Row 2: DOWN, Row 3: RIGHT
const COLS = 3;
const ROWS_USED = 4;

const DIRECTION_ROW: Record<Direction, number> = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};

// Walk cycle: standing -> left-step -> standing -> right-step
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
  const frameH = frameW; // Square frames typical for Graal

  const row = DIRECTION_ROW[direction];
  const col = isMoving ? WALK_CYCLE[stepFrame % WALK_CYCLE.length] : 1;

  const scale = tileSize / frameW;

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}
    >
      <img
        src={playerSpriteSheet}
        alt="player"
        draggable={false}
        style={{
          imageRendering: 'pixelated',
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          marginLeft: -col * frameW,
          marginTop: -row * frameH,
          display: 'block',
        }}
      />
    </div>
  );
};

export default PlayerSprite;

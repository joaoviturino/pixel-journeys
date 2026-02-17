import React from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

// Spritesheet layout: 4 columns x ~16 rows
// Rows by direction (typical RPG spritesheet):
// Row 0: down idle/walk frames
// Row 1: left idle/walk frames  
// Row 2: right idle/walk frames
// Row 3: up idle/walk frames
const SPRITE_SIZE = 32; // Each frame is ~32x32 in the sheet
const COLS = 4;

const DIRECTION_ROW: Record<Direction, number> = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, isMoving, stepFrame, tileSize }) => {
  const row = DIRECTION_ROW[direction];
  const col = isMoving ? (stepFrame % COLS) : 0;

  return (
    <div
      style={{
        width: tileSize,
        height: tileSize,
        overflow: 'hidden',
        imageRendering: 'pixelated',
      }}
    >
      <div
        style={{
          width: tileSize,
          height: tileSize,
          backgroundImage: `url(${playerSpriteSheet})`,
          backgroundSize: `${COLS * tileSize}px auto`,
          backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default PlayerSprite;

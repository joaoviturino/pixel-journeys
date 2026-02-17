import React from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

// Graal Online Classic / Zelda-style spritesheet format:
// 3 columns: left-step, standing, right-step
// Row 0: UP
// Row 1: LEFT
// Row 2: DOWN
// Row 3: RIGHT
const FRAME_W = 32;
const FRAME_H = 32;
const COLS = 3;

const DIRECTION_ROW: Record<Direction, number> = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};

// Walk cycle: standing(1) -> left-step(0) -> standing(1) -> right-step(2)
const WALK_CYCLE = [1, 0, 1, 2];

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, isMoving, stepFrame, tileSize }) => {
  const row = DIRECTION_ROW[direction];
  const col = isMoving ? WALK_CYCLE[stepFrame % WALK_CYCLE.length] : 1; // idle = col 1 (standing)

  const scaleX = tileSize / FRAME_W;
  const scaleY = tileSize / FRAME_H;

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
          backgroundSize: `${COLS * FRAME_W * scaleX}px auto`,
          backgroundPosition: `-${col * FRAME_W * scaleX}px -${row * FRAME_H * scaleY}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default PlayerSprite;

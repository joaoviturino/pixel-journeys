import React, { useEffect, useState } from 'react';
import type { Direction } from './mapData';
import playerSpriteSheet from '@/assets/player-sprite.png';
import headSpriteSheet from '@/assets/head-sprite.png';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

// Body: 4 columns x N rows
// Col 0: Back (up), Col 1: Left, Col 2: Front (down), Col 3: Right
// Rows = animation frames for walking
const BODY_COLS = 4;
const WALK_FRAMES = 4;

const DIRECTION_COL: Record<Direction, number> = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};

// Head: 1 column, 16 rows total (4 directions × 4 animation frames)
// Rows 0-3: Back (up), Rows 4-7: Left, Rows 8-11: Front (down), Rows 12-15: Right
const HEAD_TOTAL_ROWS = 16;
const HEAD_FRAMES_PER_DIR = 4;

const HEAD_DIRECTION_START: Record<Direction, number> = {
  up: 0,
  left: 4,
  down: 8,
  right: 12,
};

const HEAD_ROWS = 4; // not used anymore, kept for reference

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, isMoving, stepFrame, tileSize }) => {
  const [bodySheet, setBodySheet] = useState<{ w: number; h: number } | null>(null);
  const [headSheet, setHeadSheet] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const bodyImg = new Image();
    bodyImg.onload = () => setBodySheet({ w: bodyImg.naturalWidth, h: bodyImg.naturalHeight });
    bodyImg.src = playerSpriteSheet;

    const headImg = new Image();
    headImg.onload = () => setHeadSheet({ w: headImg.naturalWidth, h: headImg.naturalHeight });
    headImg.src = headSpriteSheet;
  }, []);

  if (!bodySheet || !headSheet) return <div style={{ width: tileSize, height: tileSize }} />;

  // Body frame calculations
  const bodyFrameW = bodySheet.w / BODY_COLS;
  const bodyFrameH = bodyFrameW;
  const col = DIRECTION_COL[direction];
  const row = isMoving ? (stepFrame % WALK_FRAMES) : 0;
  const bodyScaleX = tileSize / bodyFrameW;
  const bodyScaleY = tileSize / bodyFrameH;

  // Head frame calculations — single column, 16 rows (4 dirs × 4 frames)
  const headFrameW = headSheet.w;
  const headFrameH = headSheet.h / HEAD_TOTAL_ROWS;
  const headStartRow = HEAD_DIRECTION_START[direction];
  const headFrame = isMoving ? (stepFrame % HEAD_FRAMES_PER_DIR) : 0;
  const headRow = headStartRow + headFrame;
  const headScaleX = tileSize / headFrameW;
  const headScaledDisplayH = headFrameH * headScaleX;

  // Overlap: head sits partially over body
  const overlap = headScaledDisplayH * 0.35;

  return (
    <div style={{
      position: 'relative',
      width: tileSize,
      height: headScaledDisplayH + tileSize - overlap,
    }}>
      {/* Head */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: tileSize,
          height: headScaledDisplayH,
          overflow: 'hidden',
          imageRendering: 'pixelated',
          backgroundImage: `url(${headSpriteSheet})`,
          backgroundSize: `${tileSize}px ${headSheet.h * headScaleX}px`,
          backgroundPosition: `0px -${headRow * headScaledDisplayH}px`,
          backgroundRepeat: 'no-repeat',
          zIndex: 2,
        }}
      />
      {/* Body */}
      <div
        style={{
          position: 'absolute',
          top: headScaledDisplayH - overlap,
          left: 0,
          width: tileSize,
          height: tileSize,
          overflow: 'hidden',
          imageRendering: 'pixelated',
          backgroundImage: `url(${playerSpriteSheet})`,
          backgroundSize: `${bodySheet.w * bodyScaleX}px ${bodySheet.h * bodyScaleY}px`,
          backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default PlayerSprite;

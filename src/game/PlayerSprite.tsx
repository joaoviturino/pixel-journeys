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

// Head: 1 column x 4 rows
// Row 0: Back (up), Row 1: Left, Row 2: Front (down), Row 3: Right
const HEAD_DIRECTION_ROW: Record<Direction, number> = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
};

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
  const bodyFrameH = bodyFrameW; // Square frames
  const bodyRows = Math.round(bodySheet.h / bodyFrameH);

  const col = DIRECTION_COL[direction];
  const row = isMoving ? (stepFrame % WALK_FRAMES) : 0;

  const bodyScaledW = (bodySheet.w / bodyFrameW) * tileSize;
  const bodyScaledH = (bodySheet.h / bodyFrameH) * tileSize;

  // Head frame calculations (single column)
  const headFrameW = headSheet.w; // 1 column
  const headFrameH = headSheet.h / 4; // 4 rows
  const headRow = HEAD_DIRECTION_ROW[direction];

  // Scale head to match tile width
  const headScale = tileSize / headFrameW;
  const headScaledW = headSheet.w * headScale;
  const headScaledH = headSheet.h * headScale;
  const headDisplayH = headFrameH * headScale;

  return (
    <div style={{ position: 'relative', width: tileSize, height: tileSize * 1.5 }}>
      {/* Head - positioned above body */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: tileSize,
          height: headDisplayH,
          overflow: 'hidden',
          imageRendering: 'pixelated',
          backgroundImage: `url(${headSpriteSheet})`,
          backgroundSize: `${headScaledW}px ${headScaledH}px`,
          backgroundPosition: `0px -${headRow * headDisplayH}px`,
          backgroundRepeat: 'no-repeat',
          zIndex: 2,
        }}
      />
      {/* Body - below head */}
      <div
        style={{
          position: 'absolute',
          top: headDisplayH * 0.5,
          left: 0,
          width: tileSize,
          height: tileSize,
          overflow: 'hidden',
          imageRendering: 'pixelated',
          backgroundImage: `url(${playerSpriteSheet})`,
          backgroundSize: `${bodyScaledW}px ${bodyScaledH}px`,
          backgroundPosition: `-${col * tileSize}px -${row * tileSize}px`,
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default PlayerSprite;

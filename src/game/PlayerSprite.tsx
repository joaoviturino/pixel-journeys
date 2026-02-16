import React from 'react';
import type { Direction } from './mapData';

interface PlayerSpriteProps {
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
  tileSize: number;
}

const PlayerSprite: React.FC<PlayerSpriteProps> = ({ direction, isMoving, stepFrame, tileSize }) => {
  const s = tileSize;
  const bodyWidth = s * 0.5;
  const headSize = s * 0.4;

  // Simple pixel character
  const isLeft = direction === 'left';
  const isRight = direction === 'right';
  const isUp = direction === 'up';

  const legOffset = isMoving ? (stepFrame % 2 === 0 ? 2 : -2) : 0;

  return (
    <div
      className={isMoving ? 'animate-player-bounce' : ''}
      style={{
        width: s,
        height: s,
        position: 'relative',
      }}
    >
      {/* Shadow */}
      <div
        className="absolute bg-game-shadow/30 rounded-full"
        style={{
          width: bodyWidth * 1.2,
          height: s * 0.12,
          bottom: s * 0.05,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Legs */}
      <div
        className="absolute bg-game-player-pants"
        style={{
          width: bodyWidth * 0.35,
          height: s * 0.2,
          bottom: s * 0.08,
          left: `calc(50% - ${bodyWidth * 0.3}px)`,
          transform: `translateY(${legOffset}px)`,
        }}
      />
      <div
        className="absolute bg-game-player-pants"
        style={{
          width: bodyWidth * 0.35,
          height: s * 0.2,
          bottom: s * 0.08,
          left: `calc(50% + ${bodyWidth * 0.0}px)`,
          transform: `translateY(${-legOffset}px)`,
        }}
      />

      {/* Body */}
      <div
        className="absolute bg-game-player-shirt"
        style={{
          width: bodyWidth,
          height: s * 0.25,
          bottom: s * 0.25,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: 2,
        }}
      />

      {/* Head */}
      <div
        className="absolute bg-game-player-skin rounded-sm"
        style={{
          width: headSize,
          height: headSize,
          bottom: s * 0.48,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* Hair */}
      <div
        className="absolute bg-game-player-hair"
        style={{
          width: headSize * 1.1,
          height: headSize * 0.45,
          bottom: s * 0.48 + headSize * 0.55,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '3px 3px 0 0',
        }}
      />

      {/* Eyes (only when facing down or sides) */}
      {!isUp && (
        <>
          <div
            className="absolute bg-foreground rounded-full"
            style={{
              width: 2,
              height: 2,
              bottom: s * 0.55,
              left: `calc(50% - ${isLeft ? 1 : 4}px)`,
            }}
          />
          {!isLeft && !isRight && (
            <div
              className="absolute bg-foreground rounded-full"
              style={{
                width: 2,
                height: 2,
                bottom: s * 0.55,
                left: `calc(50% + 2px)`,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PlayerSprite;

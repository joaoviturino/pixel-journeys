import React from 'react';
import PlayerSprite from './PlayerSprite';
import type { RemotePlayer } from './useMultiplayer';

interface RemotePlayerSpriteProps {
  player: RemotePlayer;
  tileSize: number;
  cameraX: number;
  cameraY: number;
}

const RemotePlayerSprite: React.FC<RemotePlayerSpriteProps> = ({ player, tileSize, cameraX, cameraY }) => {
  const screenX = (player.pos.x - cameraX) * tileSize;
  const screenY = (player.pos.y - cameraY) * tileSize;

  // Don't render if off-screen
  if (screenX < -tileSize || screenY < -tileSize) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        width: tileSize,
        height: tileSize,
        zIndex: 10,
        transition: 'left 400ms linear, top 400ms linear',
      }}
    >
      <PlayerSprite
        direction={player.direction}
        isMoving={player.isMoving}
        stepFrame={player.stepFrame}
        tileSize={tileSize}
      />
      {/* Player name tag */}
      <div
        className="absolute text-center w-full pointer-events-none"
        style={{ top: -14, left: 0 }}
      >
        <span
          className="text-accent text-[6px] font-pixel bg-card/80 px-1 rounded"
          style={{ whiteSpace: 'nowrap' }}
        >
          {player.name}
        </span>
      </div>
    </div>
  );
};

export default RemotePlayerSprite;

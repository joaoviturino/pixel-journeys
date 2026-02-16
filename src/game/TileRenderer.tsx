import React from 'react';
import { Tile } from './mapData';

interface TileRendererProps {
  tile: Tile;
  x: number;
  y: number;
  tileSize: number;
}

const TileRenderer: React.FC<TileRendererProps> = React.memo(({ tile, tileSize }) => {
  const s = tileSize;
  const half = s / 2;
  const quarter = s / 4;

  const baseStyle: React.CSSProperties = {
    width: s,
    height: s,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  };

  switch (tile) {
    case Tile.GRASS:
      return (
        <div style={baseStyle} className="bg-game-grass">
          <div
            className="absolute bg-game-grass-dark"
            style={{ width: 2, height: 2, top: quarter, left: quarter }}
          />
          <div
            className="absolute bg-game-grass-dark"
            style={{ width: 2, height: 2, top: s * 0.7, left: s * 0.6 }}
          />
        </div>
      );

    case Tile.PATH:
      return (
        <div style={baseStyle} className="bg-game-path">
          <div
            className="absolute bg-game-path-dark rounded-full"
            style={{ width: 3, height: 2, top: half, left: quarter }}
          />
          <div
            className="absolute bg-game-path-dark rounded-full"
            style={{ width: 2, height: 2, top: quarter, left: s * 0.7 }}
          />
        </div>
      );

    case Tile.WATER:
      return (
        <div style={baseStyle} className="bg-game-water animate-water-shimmer">
          <div
            className="absolute bg-game-water-light"
            style={{ width: half, height: 2, top: quarter, left: quarter, borderRadius: 1 }}
          />
          <div
            className="absolute bg-game-water-light"
            style={{ width: quarter, height: 2, top: s * 0.65, left: s * 0.5, borderRadius: 1 }}
          />
        </div>
      );

    case Tile.TREE:
      return (
        <div style={baseStyle} className="bg-game-grass">
          {/* Trunk */}
          <div
            className="absolute bg-game-tree-trunk"
            style={{ width: quarter, height: half, bottom: 0, left: s * 0.38 }}
          />
          {/* Leaves */}
          <div
            className="absolute bg-game-tree-leaves rounded-full"
            style={{ width: s * 0.8, height: s * 0.6, top: 1, left: s * 0.1 }}
          />
          <div
            className="absolute bg-game-tree-leaves-light rounded-full"
            style={{ width: s * 0.4, height: s * 0.3, top: 2, left: s * 0.2 }}
          />
        </div>
      );

    case Tile.TALL_GRASS:
      return (
        <div style={baseStyle} className="bg-game-grass">
          {[0.2, 0.4, 0.6, 0.8].map((xp, i) => (
            <div
              key={i}
              className="absolute bg-game-tall-grass"
              style={{
                width: 3,
                height: half,
                bottom: 0,
                left: s * xp,
                borderRadius: '2px 2px 0 0',
              }}
            >
              <div
                className="absolute bg-game-tall-grass-tip"
                style={{ width: 3, height: 3, top: 0, left: 0, borderRadius: '50%' }}
              />
            </div>
          ))}
        </div>
      );

    case Tile.FLOWER_RED:
      return (
        <div style={baseStyle} className="bg-game-grass">
          <div
            className="absolute bg-game-flower-red rounded-full"
            style={{ width: 5, height: 5, top: half - 3, left: half - 3 }}
          />
          <div
            className="absolute bg-game-flower-yellow rounded-full"
            style={{ width: 2, height: 2, top: half - 1, left: half - 1 }}
          />
        </div>
      );

    case Tile.FLOWER_YELLOW:
      return (
        <div style={baseStyle} className="bg-game-grass">
          <div
            className="absolute bg-game-flower-yellow rounded-full"
            style={{ width: 5, height: 5, top: half - 3, left: half - 3 }}
          />
          <div
            className="absolute bg-game-flower-red rounded-full"
            style={{ width: 2, height: 2, top: half - 1, left: half - 1 }}
          />
        </div>
      );

    case Tile.FENCE:
      return (
        <div style={baseStyle} className="bg-game-grass">
          <div className="absolute bg-game-fence" style={{ width: s, height: 3, top: half - 1 }} />
          <div className="absolute bg-game-fence" style={{ width: 3, height: s * 0.7, top: s * 0.15, left: 1 }} />
          <div className="absolute bg-game-fence" style={{ width: 3, height: s * 0.7, top: s * 0.15, right: 1 }} />
        </div>
      );

    case Tile.BUILDING:
      return (
        <div style={baseStyle} className="bg-game-building pixel-border" />
      );

    case Tile.ROOF:
      return (
        <div style={baseStyle} className="bg-game-roof pixel-border" />
      );

    case Tile.DOOR:
      return (
        <div style={baseStyle} className="bg-game-path">
          <div
            className="absolute bg-game-building-dark"
            style={{ width: s * 0.5, height: s * 0.7, bottom: 0, left: quarter }}
          />
        </div>
      );

    case Tile.SIGN:
      return (
        <div style={baseStyle} className="bg-game-grass">
          <div
            className="absolute bg-game-fence"
            style={{ width: 2, height: half, bottom: 0, left: half - 1 }}
          />
          <div
            className="absolute bg-game-fence pixel-border"
            style={{ width: s * 0.6, height: quarter, top: quarter, left: s * 0.2 }}
          />
        </div>
      );

    default:
      return <div style={baseStyle} className="bg-game-grass" />;
  }
});

TileRenderer.displayName = 'TileRenderer';

export default TileRenderer;

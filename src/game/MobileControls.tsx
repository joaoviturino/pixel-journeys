import React from 'react';
import type { Direction } from './mapData';

interface MobileControlsProps {
  onMove: (dir: Direction) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onMove }) => {
  const btnClass =
    'flex items-center justify-center w-12 h-12 rounded-lg bg-muted/60 active:bg-primary/40 border border-border select-none touch-none text-foreground/80 text-lg font-pixel';

  return (
    <div className="flex flex-col items-center gap-1 pointer-events-auto">
      <button className={btnClass} onTouchStart={() => onMove('up')} onClick={() => onMove('up')}>
        ▲
      </button>
      <div className="flex gap-1">
        <button className={btnClass} onTouchStart={() => onMove('left')} onClick={() => onMove('left')}>
          ◄
        </button>
        <div className="w-12 h-12" />
        <button className={btnClass} onTouchStart={() => onMove('right')} onClick={() => onMove('right')}>
          ►
        </button>
      </div>
      <button className={btnClass} onTouchStart={() => onMove('down')} onClick={() => onMove('down')}>
        ▼
      </button>
    </div>
  );
};

export default MobileControls;

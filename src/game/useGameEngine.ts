import { useState, useEffect, useCallback, useRef } from 'react';
import { MAP, MAP_WIDTH, MAP_HEIGHT, SOLID_TILES, type Direction, type Position } from './mapData';

const MOVE_INTERVAL = 150; // ms between moves

export function useGameEngine() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 5, y: 12 });
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [stepFrame, setStepFrame] = useState(0);
  
  // For tap-to-move pathfinding
  const pathRef = useRef<Position[]>([]);
  const pathTimerRef = useRef<number | null>(null);
  
  // For keyboard movement
  const keysPressed = useRef<Set<string>>(new Set());
  const moveTimerRef = useRef<number | null>(null);

  const canMoveTo = useCallback((x: number, y: number) => {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
    return !SOLID_TILES.has(MAP[y][x]);
  }, []);

  const movePlayer = useCallback((dir: Direction) => {
    setDirection(dir);
    setPlayerPos(prev => {
      const delta = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
      const newX = prev.x + delta[dir].x;
      const newY = prev.y + delta[dir].y;
      if (canMoveTo(newX, newY)) {
        setIsMoving(true);
        setStepFrame(f => (f + 1) % 4);
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [canMoveTo]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault();
        keysPressed.current.add(key);
        // Stop any tap path
        pathRef.current = [];
        if (pathTimerRef.current) {
          clearInterval(pathTimerRef.current);
          pathTimerRef.current = null;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
      if (keysPressed.current.size === 0) {
        setIsMoving(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Keyboard movement loop
  useEffect(() => {
    const tick = () => {
      const keys = keysPressed.current;
      if (keys.has('w')) movePlayer('up');
      else if (keys.has('s')) movePlayer('down');
      else if (keys.has('a')) movePlayer('left');
      else if (keys.has('d')) movePlayer('right');
    };

    moveTimerRef.current = window.setInterval(tick, MOVE_INTERVAL);
    return () => {
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
    };
  }, [movePlayer]);

  // BFS pathfinding for tap-to-move
  const findPath = useCallback((from: Position, to: Position): Position[] => {
    if (!canMoveTo(to.x, to.y)) return [];
    
    const visited = new Set<string>();
    const queue: { pos: Position; path: Position[] }[] = [{ pos: from, path: [] }];
    visited.add(`${from.x},${from.y}`);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.pos.x === to.x && current.pos.y === to.y) {
        return current.path;
      }
      
      const neighbors = [
        { x: current.pos.x, y: current.pos.y - 1 },
        { x: current.pos.x, y: current.pos.y + 1 },
        { x: current.pos.x - 1, y: current.pos.y },
        { x: current.pos.x + 1, y: current.pos.y },
      ];
      
      for (const n of neighbors) {
        const key = `${n.x},${n.y}`;
        if (!visited.has(key) && canMoveTo(n.x, n.y)) {
          visited.add(key);
          queue.push({ pos: n, path: [...current.path, n] });
        }
      }
    }
    return [];
  }, [canMoveTo]);

  const handleTapMove = useCallback((targetX: number, targetY: number) => {
    // Clear existing path
    if (pathTimerRef.current) {
      clearInterval(pathTimerRef.current);
      pathTimerRef.current = null;
    }

    setPlayerPos(currentPos => {
      const path = findPath(currentPos, { x: targetX, y: targetY });
      if (path.length === 0) return currentPos;
      
      pathRef.current = path;
      let step = 0;
      
      pathTimerRef.current = window.setInterval(() => {
        if (step >= pathRef.current.length) {
          if (pathTimerRef.current) clearInterval(pathTimerRef.current);
          pathTimerRef.current = null;
          setIsMoving(false);
          return;
        }
        
        const next = pathRef.current[step];
        setPlayerPos(prev => {
          // Determine direction
          let dir: Direction = 'down';
          if (next.x > prev.x) dir = 'right';
          else if (next.x < prev.x) dir = 'left';
          else if (next.y > prev.y) dir = 'down';
          else if (next.y < prev.y) dir = 'up';
          setDirection(dir);
          setIsMoving(true);
          setStepFrame(f => (f + 1) % 4);
          return next;
        });
        step++;
      }, MOVE_INTERVAL);
      
      return currentPos;
    });
  }, [findPath]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (pathTimerRef.current) clearInterval(pathTimerRef.current);
    };
  }, []);

  return {
    playerPos,
    direction,
    isMoving,
    stepFrame,
    handleTapMove,
    movePlayer,
  };
}

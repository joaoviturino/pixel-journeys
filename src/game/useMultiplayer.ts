import { useState, useEffect, useCallback, useRef } from 'react';
import type { Direction, Position } from './mapData';
import { useAuth } from '@/contexts/AuthContext';

export interface RemotePlayer {
  id: number;
  name: string;
  pos: Position;
  direction: Direction;
  isMoving: boolean;
  stepFrame: number;
}

const SYNC_INTERVAL = 500; // ms between position broadcasts
const STORAGE_KEY = 'newera_players';

/**
 * Multiplayer hook using localStorage broadcast for same-browser testing.
 * Ready to swap to WebSocket when backend supports it.
 */
export function useMultiplayer(localPos: Position, direction: Direction, isMoving: boolean, stepFrame: number) {
  const { user } = useAuth();
  const [remotePlayers, setRemotePlayers] = useState<RemotePlayer[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Broadcast local player position
  const broadcastPosition = useCallback(() => {
    if (!user?.id) return;

    const now = Date.now();
    const playersRaw = localStorage.getItem(STORAGE_KEY);
    let players: Record<string, any> = {};
    try {
      players = playersRaw ? JSON.parse(playersRaw) : {};
    } catch { players = {}; }

    // Update our entry
    players[String(user.id)] = {
      id: user.id,
      name: user.name,
      pos: localPos,
      direction,
      isMoving,
      stepFrame,
      lastSeen: now,
    };

    // Remove stale players (>5s)
    for (const key of Object.keys(players)) {
      if (now - players[key].lastSeen > 5000) {
        delete players[key];
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));

    // Build remote list (exclude self)
    const remotes: RemotePlayer[] = Object.values(players)
      .filter((p: any) => p.id !== user.id)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        pos: p.pos,
        direction: p.direction,
        isMoving: p.isMoving,
        stepFrame: p.stepFrame,
      }));

    setRemotePlayers(remotes);
  }, [user, localPos, direction, isMoving, stepFrame]);

  useEffect(() => {
    broadcastPosition();
    intervalRef.current = window.setInterval(broadcastPosition, SYNC_INTERVAL);

    // Listen for changes from other tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        broadcastPosition();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('storage', onStorage);
      // Clean up our entry on unmount
      if (user?.id) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const players = JSON.parse(raw);
            delete players[String(user.id)];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
          }
        } catch {}
      }
    };
  }, [broadcastPosition, user]);

  return { remotePlayers };
}

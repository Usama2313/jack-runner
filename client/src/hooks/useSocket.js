import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';

import { SOCKET_URL } from '../config/api';

export const useSocket = () => {
  const socketRef = useRef(null);
  const setLeaderboard = useGameStore((s) => s.setLeaderboard);
  const setOnlineCount = useGameStore((s) => s.setOnlineCount);
  const username = useGameStore((s) => s.username);
  const gameState = useGameStore((s) => s.gameState);
  const score = useGameStore((s) => s.score);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);

  useEffect(() => {
    // Connect to backend socket
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 5,
      timeout: 4000,
      autoConnect: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to Subway Surfers Server');
    });

    socket.on('leaderboard:initial', (data) => {
      if (data.leaderboard) setLeaderboard(data.leaderboard);
      if (data.activePlayers) setOnlineCount(data.activePlayers);
    });

    socket.on('leaderboard:update', (data) => {
      if (data.leaderboard) setLeaderboard(data.leaderboard);
    });

    socket.on('players:count', (data) => {
      if (data.activePlayers !== undefined) setOnlineCount(data.activePlayers);
    });

    return () => {
      socket.disconnect();
    };
  }, [setLeaderboard, setOnlineCount]);

  // Periodic heartbeat broadcast of runner score
  useEffect(() => {
    if (gameState !== 'PLAYING' || !socketRef.current) return;

    const interval = setInterval(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('player:run_update', {
          username,
          score,
          distance: Math.round(distanceTraveled)
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [gameState, username, score, distanceTraveled]);

  return socketRef;
};

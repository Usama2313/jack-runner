import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_STATES } from '../utils/constants';

export const useInput = () => {
  const gameState = useGameStore((s) => s.gameState);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const roll = useGameStore((s) => s.roll);
  const activateHoverboard = useGameStore((s) => s.activateHoverboard);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startGame = useGameStore((s) => s.startGame);

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState === GAME_STATES.PLAYING) {
          pauseGame();
        } else if (gameState === GAME_STATES.PAUSED) {
          resumeGame();
        }
        return;
      }

      if (gameState !== GAME_STATES.PLAYING) {
        if ((e.key === 'Enter' || e.key === ' ') && gameState === GAME_STATES.MENU) {
          startGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          jump();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          roll();
          break;
        case 'b':
        case 'B':
        case 'h':
        case 'H':
          activateHoverboard();
          break;
        default:
          break;
      }
    };

    // Mobile touch and swipe handling
    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const now = Date.now();

      // Double tap detector for hoverboard
      if (now - lastTapRef.current < 300) {
        activateHoverboard();
      }
      lastTapRef.current = now;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now
      };
    };

    const handleTouchEnd = (e) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const minSwipeDistance = 30;

      if (Math.max(absX, absY) > minSwipeDistance) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            moveRight();
          } else {
            moveLeft();
          }
        } else {
          // Vertical swipe
          if (deltaY < 0) {
            jump();
          } else {
            roll();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, moveLeft, moveRight, jump, roll, activateHoverboard, pauseGame, resumeGame, startGame]);
};

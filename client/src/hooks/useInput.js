import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_STATES, POWERUP_TYPES } from '../utils/constants';

export const useInput = () => {
  const gameState = useGameStore((s) => s.gameState);
  const moveLeft = useGameStore((s) => s.moveLeft);
  const moveRight = useGameStore((s) => s.moveRight);
  const jump = useGameStore((s) => s.jump);
  const roll = useGameStore((s) => s.roll);
  const activateHoverboard = useGameStore((s) => s.activateHoverboard);
  const activatePowerup = useGameStore((s) => s.activatePowerup);
  const quickBuyPowerup = useGameStore((s) => s.quickBuyPowerup);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startGame = useGameStore((s) => s.startGame);

  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef(0);

  useEffect(() => {
    const powerupCycleList = [
      POWERUP_TYPES.HOVERBOARD,
      POWERUP_TYPES.PLASMA_SHIELD,
      POWERUP_TYPES.KINETIC_BLASTER,
      POWERUP_TYPES.JETPACK,
      POWERUP_TYPES.MAGNET,
      POWERUP_TYPES.MULTIPLIER_2X,
      POWERUP_TYPES.SUPER_SNEAKERS,
      POWERUP_TYPES.ROBOT_REPAIR,
      POWERUP_TYPES.SPEED_BOOST,
      POWERUP_TYPES.COIN_RAIN,
      POWERUP_TYPES.INVINCIBILITY
    ];
    let cycleIndex = 0;

    const handleKeyDown = (e) => {
      // Prevent default scrolling and tab focusing for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space', 'Tab'].includes(e.key)) {
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
        case 'Tab':
          // Cycle and activate next available powerup / hoverboard
          cycleIndex = (cycleIndex + 1) % powerupCycleList.length;
          activateHoverboard();
          break;
        case '1':
          quickBuyPowerup(POWERUP_TYPES.HOVERBOARD, 300);
          break;
        case '2':
          quickBuyPowerup(POWERUP_TYPES.MAGNET, 250);
          break;
        case '3':
          quickBuyPowerup(POWERUP_TYPES.JETPACK, 400);
          break;
        case '4':
          quickBuyPowerup(POWERUP_TYPES.MULTIPLIER_2X, 350);
          break;
        case '5':
          quickBuyPowerup(POWERUP_TYPES.SUPER_SNEAKERS, 250);
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
  }, [gameState, moveLeft, moveRight, jump, roll, activateHoverboard, activatePowerup, quickBuyPowerup, pauseGame, resumeGame, startGame]);
};

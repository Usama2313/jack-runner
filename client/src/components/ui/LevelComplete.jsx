import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES, LEVELS } from '../../utils/constants';
import { Play, Home, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

export const LevelComplete = () => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);
  const advanceLevel = useGameStore((s) => s.advanceLevel);
  const setGameState = useGameStore((s) => s.setGameState);

  const levelInfo = LEVELS[currentLevel - 1] || LEVELS[0];
  const isFinalLevel = currentLevel >= LEVELS.length;
  const nextLevelInfo = !isFinalLevel ? LEVELS[currentLevel] : null;

  // Confetti explosion on clear
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  }, []);

  const { animScore, animCoins } = useSpring({
    from: { animScore: 0, animCoins: 0 },
    to: { animScore: score, animCoins: coinsCollected },
    config: { tension: 120, friction: 14 }
  });

  return (
    <div className="level-complete-overlay">
      <div className="level-complete-card">
        {/* Glow Header */}
        <div className="level-complete-badge">
          <Sparkles size={20} className="sparkle-icon" />
          <span>LEVEL CLEARED!</span>
          <Sparkles size={20} className="sparkle-icon" />
        </div>

        <h1 className="level-title-cleared">{levelInfo.label}</h1>
        <p className="level-subtitle">Stage objective completed with flying colors!</p>

        {/* Stats Grid */}
        <div className="level-stats-grid">
          <div className="level-stat-item">
            <span className="stat-label-mini">STAGE SCORE</span>
            <animated.span className="stat-number-glow">
              {animScore.to((n) => Math.floor(n).toLocaleString())}
            </animated.span>
          </div>
          <div className="level-stat-item">
            <span className="stat-label-mini">COINS GRABBED</span>
            <animated.span className="stat-number-coins">
              🪙 {animCoins.to((n) => Math.floor(n).toLocaleString())}
            </animated.span>
          </div>
        </div>

        {/* Next level unlock preview */}
        {!isFinalLevel && (
          <div className="next-level-preview">
            <div className="next-level-header">
              <CheckCircle2 size={18} color="#10b981" />
              <span>UNLOCKED: {nextLevelInfo.label}</span>
            </div>
            <div className="next-level-specs">
              <span>⏱️ {nextLevelInfo.timeLimit}s Time Limit</span>
              <span>⚡ {nextLevelInfo.speedMult}x Speed Multiplier</span>
            </div>
          </div>
        )}

        {isFinalLevel && (
          <div className="grand-champion-banner">
            🏆 ALL 5 LEVELS MASTERED! YOU ARE THE ULTIMATE RUNNER! 🏆
          </div>
        )}

        {/* Action Buttons */}
        <div className="level-complete-actions">
          {!isFinalLevel ? (
            <button className="level-next-btn" onClick={advanceLevel}>
              <Play size={24} />
              <span>NEXT LEVEL</span>
            </button>
          ) : (
            <button className="level-next-btn" onClick={advanceLevel}>
              <Play size={24} />
              <span>REPLAY HYPER LOOP</span>
            </button>
          )}

          <button
            className="level-menu-btn"
            onClick={() => setGameState(GAME_STATES.MENU)}
          >
            <Home size={20} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

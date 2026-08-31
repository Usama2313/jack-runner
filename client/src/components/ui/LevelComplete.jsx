import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES, LEVELS } from '../../utils/constants';
import { Play, Home, Trophy, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
import { LevelSelectModal } from './LevelSelectModal';

const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

export const LevelComplete = () => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const advanceLevel = useGameStore((s) => s.advanceLevel);
  const setGameState = useGameStore((s) => s.setGameState);
  const isActivated = useGameStore((s) => s.isActivated);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels) || [1];

  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const safeLevel = parseValidLevel(currentLevel);
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];
  const isFinalLevel = safeLevel >= LEVELS.length;
  const nextLevelInfo = !isFinalLevel ? (LEVELS[safeLevel] || LEVELS[LEVELS.length - 1]) : null;

  // Confetti explosion on stage clear
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {}
  }, []);

  const { animScore, animCoins } = useSpring({
    from: { animScore: 0, animCoins: 0 },
    to: { animScore: score || 0, animCoins: coinsCollected || 0 },
    config: { tension: 120, friction: 14 }
  });

  return (
    <>
      <div className="level-complete-overlay">
        <div className="level-complete-card">
          {/* Glow Header */}
          <div className="level-complete-badge">
            <Sparkles size={20} className="sparkle-icon" />
            <span>STAGE {safeLevel}/30 CLEARED!</span>
            <Sparkles size={20} className="sparkle-icon" />
          </div>

          <h1 className="level-title-cleared">{levelInfo.label || levelInfo.name}</h1>
          <p className="level-subtitle">Reflex matrix synchronized! Stage completed with flying colors!</p>

          {/* Stats Grid */}
          <div className="level-stats-grid">
            <div className="level-stat-item">
              <span className="stat-label-mini">STAGE SCORE</span>
              <animated.span className="stat-number-glow">
                {animScore.to((n) => Math.floor(n).toLocaleString())}
              </animated.span>
            </div>
            <div className="level-stat-item">
              <span className="stat-label-mini">CELESTIAL RINGS</span>
              <div className="stat-number-coins">
                💎 <animated.span>{animCoins.to((n) => Math.floor(n).toLocaleString())}</animated.span>
              </div>
            </div>
          </div>

          {/* Next level unlock preview */}
          {!isFinalLevel && nextLevelInfo && (
            <div className="next-level-preview">
              <div className="next-level-header">
                <CheckCircle2 size={18} color="#10b981" />
                <span>NEXT: {nextLevelInfo.label || nextLevelInfo.name}</span>
              </div>
              <div className="next-level-specs">
                <span>⏱️ {nextLevelInfo.timeLimit}s Time Limit</span>
                <span>⚡ {nextLevelInfo.speedMult}x Speed Multiplier</span>
              </div>
              {!isActivated && !unlockedLevels.includes(safeLevel + 1) && (
                <div style={{ 
                  marginTop: '8px', padding: '6px 12px', 
                  background: 'rgba(250,204,21,0.15)', border: '1px solid #facc15',
                  borderRadius: '8px', color: '#facc15', fontSize: '0.8rem', fontWeight: '700',
                  textAlign: 'center'
                }}>
                  🔒 Requires Rs. 40 payment via JazzCash to unlock
                </div>
              )}
            </div>
          )}

          {isFinalLevel && (
            <div className="grand-champion-banner">
              👑 ALL 30 STAGES CONQUERED! YOU ARE THE ULTIMATE KINETIC JACK! 👑
            </div>
          )}

          {/* Action Buttons */}
          <div className="level-complete-actions">
            {!isFinalLevel ? (
              <button className="level-next-btn" onClick={() => {
                const nextId = safeLevel + 1;
                const isNextUnlocked = isActivated || (unlockedLevels || []).includes(nextId);
                if (isNextUnlocked) {
                  advanceLevel();
                } else {
                  // Must pay to proceed
                  useGameStore.getState().triggerPayment('stage', nextId, 40);
                }
              }}>
                <Play size={24} />
                <span>
                  {isActivated || (unlockedLevels || []).includes(safeLevel + 1) 
                    ? `NEXT STAGE (STAGE ${safeLevel + 1})` 
                    : `UNLOCK STAGE ${safeLevel + 1} — Rs. 40`}
                </span>
              </button>
            ) : (
              <button className="level-next-btn" onClick={advanceLevel}>
                <Play size={24} />
                <span>REPLAY INFINITE STAGE</span>
              </button>
            )}

            <button
              className="level-menu-btn"
              onClick={() => setShowLevelSelect(true)}
            >
              <MapPin size={20} />
              <span>30 STAGES MAP</span>
            </button>

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

      {showLevelSelect && (
        <LevelSelectModal onClose={() => setShowLevelSelect(false)} />
      )}
    </>
  );
};

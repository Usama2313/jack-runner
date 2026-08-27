import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_CONFIG, POWERUP_TYPES, LEVELS } from '../../utils/constants';
import { Pause, Volume2, VolumeX, Sparkles, Gift, Rocket, Shield, Magnet } from 'lucide-react';

export const HUD = () => {
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);
  const activePowerups = useGameStore((s) => s.activePowerups);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const activateHoverboard = useGameStore((s) => s.activateHoverboard);
  const quickBuyPowerup = useGameStore((s) => s.quickBuyPowerup);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelTimeLeft = useGameStore((s) => s.levelTimeLeft);
  const giftCollectedType = useGameStore((s) => s.giftCollectedType);

  const levelInfo = LEVELS[currentLevel - 1] || LEVELS[0];
  const maxLevelTime = levelInfo.timeLimit;
  const timePercent = Math.max(0, Math.min(100, (levelTimeLeft / maxLevelTime) * 100));

  // Score bounce spring animation
  const { scoreVal } = useSpring({
    scoreVal: score,
    config: { tension: 280, friction: 20 }
  });

  const is2xActive = activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0;
  const isHoverboardActive = activePowerups[POWERUP_TYPES.HOVERBOARD] > 0;
  const isJetpackActive = activePowerups[POWERUP_TYPES.JETPACK] > 0;

  return (
    <div className="hud-overlay">
      {/* Top Left: Score & Distance */}
      <div className="hud-score-card">
        <div className="hud-label">SCORE</div>
        <animated.div className="hud-score-number">
          {scoreVal.to((val) => Math.floor(val).toLocaleString())}
        </animated.div>
        <div className="hud-sub-stats">
          <span className="hud-distance">{Math.floor(distanceTraveled)} m</span>
          {is2xActive && <span className="hud-badge-2x">⚡ 2X ACTIVE</span>}
          {isJetpackActive && <span className="hud-badge-sky">🚀 SKY FLIGHT</span>}
        </div>
      </div>

      {/* Top Center: World-Class Level Status & Timer Ring */}
      <div className="hud-level-center">
        <div className="hud-level-badge">
          <span className="hud-level-tag">STAGE {currentLevel}/5</span>
          <span className="hud-level-name">{levelInfo.name}</span>
        </div>
        <div className="hud-timer-container">
          <div className="hud-timer-bar-bg">
            <div
              className={`hud-timer-bar-fill ${levelTimeLeft < 10 ? 'urgent' : ''}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>
          <span className={`hud-timer-text ${levelTimeLeft < 10 ? 'urgent-pulse' : ''}`}>
            ⏱️ {Math.ceil(levelTimeLeft)}s
          </span>
        </div>
      </div>

      {/* Top Right: Coins, Mute & Pause */}
      <div className="hud-right-panel">
        <div className="hud-coins-pill" title="Coins collected this run + Banked">
          <span className="hud-coin-icon">🪙</span>
          <span className="hud-coin-count">{coinsCollected}</span>
          <span className="hud-total-coins-badge">Bank: {totalCoins}</span>
        </div>

        <button className="hud-icon-btn" onClick={toggleMute} title="Toggle Sound">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <button className="hud-icon-btn" onClick={pauseGame} title="Pause Game (ESC)">
          <Pause size={20} />
        </button>
      </div>

      {/* Center Left: Active Powerups Countdown Timers */}
      <div className="hud-powerups-list">
        {Object.entries(activePowerups).map(([type, timeLeft]) => {
          if (timeLeft <= 0) return null;
          const config = POWERUP_CONFIG[type];
          const maxDur = type === POWERUP_TYPES.JETPACK ? 7 : (type === POWERUP_TYPES.HOVERBOARD ? 25 : 10);
          const percent = Math.min(100, (timeLeft / maxDur) * 100);

          return (
            <div key={type} className="hud-powerup-bar" style={{ borderColor: config.color }}>
              <span className="hud-pw-icon">{config.icon}</span>
              <div className="hud-pw-info">
                <div className="hud-pw-name">{config.name}</div>
                <div className="hud-pw-progress-bg">
                  <div
                    className="hud-pw-progress-fill"
                    style={{ width: `${percent}%`, backgroundColor: config.color }}
                  />
                </div>
              </div>
              <span className="hud-pw-time">{Math.ceil(timeLeft)}s</span>
            </div>
          );
        })}
      </div>

      {/* Gift Mystery Box Notification Toast */}
      {giftCollectedType && (
        <div className="hud-gift-toast">
          <Gift size={28} className="gift-toast-icon" />
          <div className="gift-toast-text">
            <span className="gift-toast-title">MYSTERY GIFT UNBOXED! 🎁</span>
            <span className="gift-toast-desc">
              Powerup Granted: {POWERUP_CONFIG[giftCollectedType]?.name || 'Special Power'}!
            </span>
          </div>
        </div>
      )}

      {/* Bottom Left: In-Run Coin Powerup Quick-Buy Shop */}
      <div className="hud-quickbuy-panel">
        <div className="hud-quickbuy-title">
          <span>⚡ INSTANT POWER SHOP</span>
        </div>
        <div className="hud-quickbuy-buttons">
          <button
            className={`quickbuy-btn ${totalCoins < 50 ? 'disabled' : ''}`}
            onClick={() => quickBuyPowerup(POWERUP_TYPES.MAGNET, 50)}
            title="Buy Magnet (50 Coins)"
          >
            <span className="quickbuy-icon">🧲</span>
            <span className="quickbuy-name">Magnet</span>
            <span className="quickbuy-cost">🪙 50</span>
          </button>

          <button
            className={`quickbuy-btn hoverboard-btn ${totalCoins < 80 ? 'disabled' : ''}`}
            onClick={() => quickBuyPowerup(POWERUP_TYPES.HOVERBOARD, 80)}
            title="Buy Skateboard / Hoverboard (80 Coins)"
          >
            <span className="quickbuy-icon">🛹</span>
            <span className="quickbuy-name">Skate</span>
            <span className="quickbuy-cost">🪙 80</span>
          </button>

          <button
            className={`quickbuy-btn jetpack-btn ${totalCoins < 120 ? 'disabled' : ''}`}
            onClick={() => quickBuyPowerup(POWERUP_TYPES.JETPACK, 120)}
            title="Buy Sky Flyer Jetpack (120 Coins)"
          >
            <span className="quickbuy-icon">🚀</span>
            <span className="quickbuy-name">Sky Jet</span>
            <span className="quickbuy-cost">🪙 120</span>
          </button>
        </div>
      </div>

      {/* Bottom Center: Quick Hoverboard Key Reminder */}
      {!isHoverboardActive && (
        <button className="hud-hoverboard-quick-btn" onClick={activateHoverboard}>
          <span>🛹</span>
          <span>ACTIVATE SKATEBOARD (B)</span>
        </button>
      )}
    </div>
  );
};

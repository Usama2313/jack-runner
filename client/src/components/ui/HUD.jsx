import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_CONFIG, POWERUP_TYPES } from '../../utils/constants';
import { Pause, Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';

export const HUD = () => {
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);
  const speed = useGameStore((s) => s.speed);
  const activePowerups = useGameStore((s) => s.activePowerups);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const activateHoverboard = useGameStore((s) => s.activateHoverboard);

  // Score bounce spring animation
  const { scoreVal } = useSpring({
    scoreVal: score,
    config: { tension: 280, friction: 20 }
  });

  const is2xActive = activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0;
  const isHoverboardActive = activePowerups[POWERUP_TYPES.HOVERBOARD] > 0;

  return (
    <div className="hud-overlay">
      {/* Top Left: Score & Multiplier */}
      <div className="hud-score-card">
        <div className="hud-label">SCORE</div>
        <animated.div className="hud-score-number">
          {scoreVal.to((val) => Math.floor(val).toLocaleString())}
        </animated.div>
        <div className="hud-sub-stats">
          <span className="hud-distance">{Math.floor(distanceTraveled)} m</span>
          {is2xActive && <span className="hud-badge-2x">⚡ 2X ACTIVE</span>}
        </div>
      </div>

      {/* Top Right: Coins, Mute & Pause */}
      <div className="hud-right-panel">
        <div className="hud-coins-pill">
          <span className="hud-coin-icon">🪙</span>
          <span className="hud-coin-count">{coinsCollected}</span>
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

      {/* Bottom Center: Quick Hoverboard Button */}
      {!isHoverboardActive && (
        <button className="hud-hoverboard-quick-btn" onClick={activateHoverboard}>
          <span>🛹</span>
          <span>ACTIVATE HOVERBOARD (B)</span>
        </button>
      )}
    </div>
  );
};

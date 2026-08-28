import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_CONFIG, POWERUP_TYPES, LEVELS, CHARACTERS } from '../../utils/constants';
import { Pause, Volume2, VolumeX, MapPin, AlertTriangle, Users, Sparkles, Shield } from 'lucide-react';
import { LevelSelectModal } from './LevelSelectModal';
import { ShopModal } from './ShopModal';

const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

export const HUD = () => {
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);
  const activePowerups = useGameStore((s) => s.activePowerups);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelTimeLeft = useGameStore((s) => s.levelTimeLeft);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const unlockedCharacters = useGameStore((s) => s.unlockedCharacters) || ['jack'];
  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const speed = useGameStore((s) => s.speed);
  const isStumbling = useGameStore((s) => s.isStumbling);
  const chaserDistance = useGameStore((s) => s.chaserDistance);
  const mysteryBoxCount = useGameStore((s) => s.mysteryBoxCount);
  const isActivated = useGameStore((s) => s.isActivated);

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showCharDropdown, setShowCharDropdown] = useState(false);

  const safeLevel = parseValidLevel(currentLevel);
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];
  const activeChar = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];
  const safeTimeLeft = Math.max(0, Math.ceil(levelTimeLeft || 0));
  const isLowTime = safeTimeLeft <= 10;
  const isChaserClose = chaserDistance < 4.5;

  const { animatedScore } = useSpring({
    animatedScore: score || 0,
    config: { tension: 160, friction: 16 }
  });

  const { animatedCoins } = useSpring({
    animatedCoins: coinsCollected || 0,
    config: { tension: 160, friction: 16 }
  });

  // Active powerup list
  const activePowerupList = Object.entries(activePowerups)
    .filter(([, time]) => time > 0)
    .map(([type, time]) => ({
      type,
      time,
      config: POWERUP_CONFIG[type]
    }));

  return (
    <>
      <div className="hud-overlay" style={{ pointerEvents: 'none' }}>
        {/* ─── TOP BAR ──────────────────────────────────────────────── */}
        <div className="hud-top-bar" style={{ pointerEvents: 'auto' }}>
          {/* Score */}
          <div className="hud-score-card">
            <div className="hud-score-label">SCORE</div>
            <animated.div className="hud-score-number">
              {animatedScore.to((n) => Math.floor(n).toLocaleString())}
            </animated.div>
          </div>

          {/* Stage Center Banner */}
          <div
            className="hud-level-center"
            style={{
              borderColor: levelInfo.neonColor || '#38bdf8',
              boxShadow: `0 0 15px ${levelInfo.neonColor || '#38bdf8'}40`,
              position: 'relative'
            }}
            onClick={() => setShowLevelSelect(true)}
          >
            <div className="hud-level-tag" style={{ color: levelInfo.neonColor || '#38bdf8' }}>
              STAGE {safeLevel}/30
            </div>
            <div className="hud-level-name">{levelInfo.name}</div>
            {levelInfo.city && <div className="hud-level-city">{levelInfo.city}</div>}
          </div>

          {/* Timer */}
          <div className={`hud-timer-card ${isLowTime ? 'low-time' : ''}`}>
            <div className="hud-timer-label">⏱️ TIME</div>
            <div className="hud-timer-number">{safeTimeLeft}s</div>
          </div>

          {/* Coins */}
          <div className="hud-coins-pill">
            💎 <animated.span>{animatedCoins.to((n) => Math.floor(n))}</animated.span>
            <span className="hud-coin-total">(🪙 {(totalCoins || 0).toLocaleString()})</span>
          </div>

          {/* Mystery Box Count */}
          {mysteryBoxCount > 0 && (
            <div className="hud-mystery-pill">
              🎁 <span>x{mysteryBoxCount}</span>
            </div>
          )}

          {/* Speed Indicator */}
          <div className="hud-speed-pill" style={{ borderColor: levelInfo.railColor }}>
            ⚡ {Math.round(speed || 0)} km/h
          </div>

          {/* Trial Unlock Button */}
          {!isActivated && (
            <button className="hud-trial-unlock-btn animate-pulse-slow" onClick={() => useGameStore.getState().setShowPaymentModal(true)}>
              🔓 UNLOCK FULL GAME
            </button>
          )}

          {/* Quick Action Buttons */}
          <div className="hud-quick-btns">
            {/* Character Pill */}
            <div
              className="hud-char-pill"
              onClick={() => setShowCharDropdown(!showCharDropdown)}
            >
              <span className="hud-char-avatar">{activeChar.avatar}</span>
              <span className="hud-char-name">{activeChar.name.split(' ')[0]}</span>
            </div>

            <button className="top-quick-btn" onClick={toggleMute}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button className="top-quick-btn" onClick={pauseGame}>
              <Pause size={18} />
            </button>
          </div>
        </div>

        {/* ─── Character Quick-Switch Dropdown ──────────────────────── */}
        {showCharDropdown && (
          <div className="hud-char-dropdown" style={{ pointerEvents: 'auto' }}>
            <div className="hud-char-dropdown-title">⚡ SWITCH RUNNER</div>
            <div className="hud-char-dropdown-list">
              {CHARACTERS.map((char) => {
                const isUnlocked = unlockedCharacters.includes(char.id);
                const isActive = selectedCharacter === char.id;
                return (
                  <div
                    key={char.id}
                    className={`hud-char-option ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                    style={{ borderColor: isActive ? char.color : 'transparent' }}
                    onClick={() => {
                      if (isUnlocked) {
                        selectCharacter(char.id);
                        setShowCharDropdown(false);
                      } else {
                        setShowShop(true);
                        setShowCharDropdown(false);
                      }
                    }}
                  >
                    <span className="hud-char-option-avatar">{char.avatar}</span>
                    <div className="hud-char-option-info">
                      <span className="hud-char-option-name">{char.name}</span>
                      <span className="hud-char-option-bonus">{isUnlocked ? char.bonus : `🔒 ${char.price} coins`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Stage Perk Banner ────────────────────────────────────── */}
        {levelInfo.stagePerk && (
          <div className="hud-stage-perk" style={{ pointerEvents: 'none' }}>
            <Shield size={14} />
            <span>{levelInfo.stagePerk}</span>
          </div>
        )}

        {/* ─── Active Powerups Bar ─────────────────────────────────── */}
        {activePowerupList.length > 0 && (
          <div className="hud-powerups-bar" style={{ pointerEvents: 'none' }}>
            {activePowerupList.map(({ type, time, config }) => (
              <div
                key={type}
                className="hud-powerup-pill"
                style={{ borderColor: config.color, boxShadow: `0 0 10px ${config.color}50` }}
              >
                <span className="hud-powerup-icon">{config.icon}</span>
                <span className="hud-powerup-name">{config.name}</span>
                <span className="hud-powerup-timer" style={{ color: config.color }}>
                  {Math.ceil(time)}s
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ─── Robot Destroyer / Chaser Alert ──────────────────────── */}
        {(isStumbling || isChaserClose) && (
          <div className={`chaser-alert-banner ${isStumbling ? 'stumbling' : 'close'}`} style={{ pointerEvents: 'none' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div className="chaser-alert-content">
              <span className="chaser-alert-title">
                {isStumbling ? '⚠️ ROBOT DESTROYER INCOMING!' : '🔴 DESTROYER CLOSING IN!'}
              </span>
              <span className="chaser-alert-sub">
                {isStumbling ? 'Stumble detected! Run faster or get captured!' : `Distance: ${chaserDistance.toFixed(1)}m — EVADE NOW!`}
              </span>
            </div>
          </div>
        )}

        {/* ─── Distance Meter ──────────────────────────────────────── */}
        <div className="hud-distance-bar" style={{ pointerEvents: 'none' }}>
          <span>🏃‍♂️ {Math.floor(distanceTraveled || 0).toLocaleString()}m</span>
        </div>
      </div>

      {/* Modals */}
      {showLevelSelect && <LevelSelectModal onClose={() => setShowLevelSelect(false)} />}
      {showShop && <ShopModal onClose={() => setShowShop(false)} />}
    </>
  );
};

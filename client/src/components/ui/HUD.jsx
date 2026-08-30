import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_CONFIG, POWERUP_TYPES, LEVELS, CHARACTERS } from '../../utils/constants';
import { Pause, Volume2, VolumeX, MapPin, AlertTriangle, Users, Sparkles, Shield, HelpCircle } from 'lucide-react';
import { LevelSelectModal } from './LevelSelectModal';
import { ShopModal } from './ShopModal';
import { Toaster } from './Toaster';
import { HelpModal } from './HelpModal';

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
  const [showHelp, setShowHelp] = useState(false);

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
      <Toaster />
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      <div className="hud-overlay" style={{ pointerEvents: 'none' }}>
        {/* ─── TOP BAR (Responsive 3-Column Header) ──────────────────── */}
        <div className="hud-top-bar" style={{ pointerEvents: 'auto' }}>
          
          {/* Left Group: Score & Coins */}
          <div className="hud-left-group">
            {/* Score Card */}
            <div className="hud-score-card">
              <div className="hud-score-label">SCORE</div>
              <animated.div className="hud-score-number">
                {animatedScore.to((n) => Math.floor(n).toLocaleString())}
              </animated.div>
            </div>

            {/* Rings Collected This Run */}
            <div className="hud-coins-pill" onClick={() => setShowShop(true)} title="Rings collected this run" style={{ gap: '6px', cursor: 'pointer' }}>
              <span>💍</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#60a5fa' }}>RINGS:</span>
              <animated.span className="hud-coins-val">
                {animatedCoins.to((n) => Math.floor(n))}
              </animated.span>
            </div>

            {/* Total Rings (Always Visible) */}
            <div className="hud-coins-pill hud-total-coins" title="Total rings balance" style={{
              borderColor: 'rgba(16, 185, 129, 0.5)',
              background: 'rgba(16, 185, 129, 0.12)',
              gap: '6px'
            }}>
              <span>👑</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#34d399' }}>TOTAL RINGS:</span>
              <span className="hud-coins-val" style={{ color: '#6ee7b7' }}>
                {(totalCoins || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Center Group: Stage & Timer & Speed */}
          <div className="hud-center-group">
            {/* Stage Center Banner */}
            <div
              className="hud-level-center"
              style={{
                borderColor: levelInfo.neonColor || '#38bdf8',
                boxShadow: `0 0 15px ${levelInfo.neonColor || '#38bdf8'}40`,
              }}
              onClick={() => setShowLevelSelect(true)}
              title="Click to view stages"
            >
              <div className="hud-level-tag" style={{ color: levelInfo.neonColor || '#38bdf8' }}>
                STAGE {safeLevel}/30
              </div>
              <div className="hud-level-name">{levelInfo.name}</div>
            </div>

            {/* Timer & Speed Row */}
            <div className="hud-meta-row">
              <div className={`hud-timer-card ${isLowTime ? 'low-time' : ''}`}>
                <span>⏱️ {safeTimeLeft}s</span>
              </div>
              <div className="hud-speed-pill">
                <span>⚡ {Math.round(speed || 0)} km/h</span>
              </div>
            </div>
          </div>

          {/* Right Group: Action Controls (Always Visible & Accessible on Mobile) */}
          <div className="hud-right-group">
            {/* Runner Selector Pill */}
            <div
              className="hud-char-pill"
              onClick={() => setShowCharDropdown(!showCharDropdown)}
              title="Switch Runner"
            >
              <span className="hud-char-avatar">{activeChar.avatar}</span>
              <span className="hud-char-name">{activeChar.name.split(' ')[0]}</span>
            </div>

            {/* Help / Guide Button */}
            <button
              className="hud-action-btn hud-help-btn"
              onClick={() => setShowHelp(true)}
              title="How to Play"
              aria-label="How to Play"
            >
              <HelpCircle size={20} />
            </button>

            {/* Audio Mute/Unmute */}
            <button
              className="hud-action-btn hud-mute-btn"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label="Mute or Unmute Audio"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {/* Pause Button (Always Top-Right & High Contrast) */}
            <button
              className="hud-action-btn hud-pause-btn"
              onClick={pauseGame}
              title="Pause Game (ESC / P)"
              aria-label="Pause Game"
            >
              <Pause size={22} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* ─── Character Quick-Switch Dropdown ──────────────────────── */}
        {showCharDropdown && (
          <div className="hud-char-dropdown" style={{ pointerEvents: 'auto' }}>
            <div className="hud-char-dropdown-title">⚡ SWITCH RUNNER</div>
            <div className="hud-char-dropdown-list">
              {CHARACTERS.map((char) => {
                const isUnlocked = isActivated || unlockedCharacters.includes(char.id) || char.isFree;
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
                      <span className="hud-char-option-bonus">
                        {isActivated ? '✅ VIP UNLOCKED' : isUnlocked ? char.bonus : `🔒 ${char.price} coins`}
                      </span>
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

        {/* ─── Character Shouting Speech Bubble ("TERRIFIC GOO!!") ─── */}
        {isStumbling && (
          <div style={{
            position: 'absolute',
            top: '110px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #dc2626, #f97316)',
            border: '2px solid #fde047',
            borderRadius: '20px',
            padding: '8px 20px',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.8), 0 4px 15px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'bounce 0.6s infinite alternate',
            zIndex: 100,
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '1.4rem' }}>💥</span>
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: '900',
              fontSize: 'clamp(1rem, 3.5vw, 1.35rem)',
              color: '#ffffff',
              letterSpacing: '1px',
              textShadow: '0 2px 4px #000, 0 0 10px #fde047'
            }}>
              TERRIFIC GOO!!
            </span>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
          </div>
        )}

        {/* ─── Robot Destroyer / Chaser Alert ──────────────────────── */}
        {(isStumbling || isChaserClose) && (
          <div className={`chaser-alert-banner ${isStumbling ? 'stumbling' : 'close'}`} style={{ pointerEvents: 'none' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div className="chaser-alert-content">
              <span className="chaser-alert-title">
                {isStumbling ? '⚠️ HURDLE HIT — ROBOT DESTROYER INCOMING!' : '🔴 DESTROYER CLOSING IN!'}
              </span>
              <span className="chaser-alert-sub">
                {isStumbling ? '"TERRIFIC GOO!" — Armor absorbed hit! Evade 2nd collision!' : `Distance: ${chaserDistance.toFixed(1)}m — EVADE NOW!`}
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

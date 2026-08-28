import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS, LEVELS } from '../../utils/constants';
import { Play, Trophy, ShoppingBag, MapPin, User, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { LevelSelectModal } from './LevelSelectModal';

const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

export const MainMenu = ({ onOpenLeaderboard, onOpenShop, onOpenAuth }) => {
  const startGame = useGameStore((s) => s.startGame);
  const highscore = useGameStore((s) => s.highscore);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const unlockedCharacters = useGameStore((s) => s.unlockedCharacters) || ['jack'];
  const username = useGameStore((s) => s.username);
  const authUser = useGameStore((s) => s.authUser);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const currentLevel = useGameStore((s) => s.currentLevel);

  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const safeLevel = parseValidLevel(currentLevel);
  const activeChar = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];
  const isActivated = useGameStore((s) => s.isActivated);

  return (
    <>
      <div className="main-menu-overlay">
        {/* Top Header Navigation */}
        <div className="menu-header">
          <div className="menu-profile-pill" onClick={onOpenAuth}>
            <User size={18} />
            <span>{authUser ? authUser.username : username}</span>
            {!authUser && <span className="menu-guest-badge">Guest</span>}
          </div>

          <div className="menu-header-right">
            {/* Unlock Pill */}
            {!isActivated && (
              <div className="menu-unlock-pill animate-pulse-slow" onClick={() => useGameStore.getState().setShowPaymentModal(true)}>
                <span>🔓 ACTIVATE</span>
              </div>
            )}

            {/* Level Quick Jump Pill */}
            <div className="menu-level-pill" onClick={() => setShowLevelSelect(true)}>
              <MapPin size={16} color="#38bdf8" />
              <span>STAGE {safeLevel}/30</span>
            </div>

            <div className="menu-coins-pill" onClick={onOpenShop}>
              <span>🪙</span>
              <span>{(totalCoins || 0).toLocaleString()}</span>
            </div>

            <button className="menu-icon-btn" onClick={toggleMute} title="Mute/Unmute Audio">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* Hero Title & Logo: KINETIC JACK */}
        <div className="menu-hero">
          <div className="menu-logo-container">
            <h1 className="menu-logo-sub">KINETIC</h1>
            <h1 className="menu-logo-main">JACK</h1>
            <div className="menu-logo-tagline">3D CYBER ENDLESS RUNNER • 30 STAGES</div>
          </div>

          {/* Highscore Pill */}
          <div className="menu-highscore-badge">
            <Trophy size={18} color="#facc15" />
            <span>BEST SCORE: <strong>{(highscore || 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Character Showcase & Instant Selector */}
        <div className="menu-char-showcase">
          <div className="menu-char-card" style={{ borderColor: activeChar.color }}>
            <div className="menu-char-avatar">{activeChar.avatar}</div>
            <div className="menu-char-name">{activeChar.name}</div>
            <div className="menu-char-title">{activeChar.title}</div>
            <div className="menu-char-bonus">{activeChar.bonus}</div>
          </div>

          {/* Quick Character Selector */}
          <div className="menu-char-selector">
            {CHARACTERS.map((char) => {
              const isUnlocked = unlockedCharacters.includes(char.id);
              const isSelected = selectedCharacter === char.id;

              return (
                <button
                  key={char.id}
                  className={`menu-char-dot ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => {
                    if (isUnlocked) {
                      selectCharacter(char.id);
                    } else {
                      onOpenShop();
                    }
                  }}
                  title={isUnlocked ? `Select ${char.name}` : `Unlock ${char.name} in Shop`}
                >
                  <span>{char.avatar}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="menu-actions-grid">
          <button className="menu-play-btn" onClick={() => startGame(safeLevel)}>
            <Play size={32} fill="currentColor" />
            <span>START RUN (STAGE {safeLevel})</span>
          </button>

          <div className="menu-sub-actions">
            <button className="menu-secondary-btn" onClick={() => setShowLevelSelect(true)}>
              <MapPin size={20} />
              <span>30 STAGES</span>
            </button>

            <button className="menu-secondary-btn" onClick={onOpenShop}>
              <ShoppingBag size={20} />
              <span>SHOP & GEAR</span>
            </button>

            <button className="menu-secondary-btn" onClick={onOpenLeaderboard}>
              <Trophy size={20} />
              <span>RANKS</span>
            </button>
          </div>
        </div>

        {/* Controls Hint */}
        <div className="menu-controls-hint">
          <span>🎮 CONTROLS: <strong>ARROW KEYS / WASD / SWIPE</strong> to Move, Jump & Slide • <strong>B</strong> for Plasma Board • <strong>ESC</strong> to Pause</span>
        </div>
      </div>

      {/* Level Select Modal */}
      {showLevelSelect && (
        <LevelSelectModal onClose={() => setShowLevelSelect(false)} />
      )}
    </>
  );
};

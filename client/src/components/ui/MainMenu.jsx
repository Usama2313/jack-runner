import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS, LEVELS } from '../../utils/constants';
import { Play, Trophy, ShoppingBag, MapPin, User, Volume2, VolumeX, HelpCircle, LogIn, Shield } from 'lucide-react';
import { LevelSelectModal } from './LevelSelectModal';
import { HelpModal } from './HelpModal';


const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

export const MainMenu = ({ onOpenLeaderboard, onOpenShop, onOpenAuth }) => {
  const navigate = useNavigate();
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
  const isActivated = useGameStore((s) => s.isActivated);

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const safeLevel = parseValidLevel(currentLevel);
  const activeChar = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];

  // Login gate - user must be authenticated to play
  const requireLogin = () => {
    if (!authUser) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      onOpenAuth();
      return true;
    }
    return false;
  };

  const handlePlay = () => {
    if (requireLogin()) return;
    startGame(safeLevel);
  };

  const handleOpenShop = () => {
    if (requireLogin()) return;
    onOpenShop();
  };

  return (
    <>
      <div className="main-menu-overlay">
        {/* Top Header Navigation */}
        <div className="menu-header">
          <div className="menu-profile-pill" onClick={onOpenAuth}>
            <User size={18} />
            <span>{authUser ? authUser.username : username}</span>
            {!authUser && <span className="menu-guest-badge">Guest</span>}
            {authUser && <span className="menu-online-badge">Online</span>}
          </div>

          <div className="menu-header-right">
            {!isActivated && (
              <div className="menu-unlock-pill animate-pulse-slow" onClick={() => useGameStore.getState().setShowPaymentModal(true)}>
                <span>🔓 VIP</span>
              </div>
            )}
            <div className="menu-level-pill" onClick={() => setShowLevelSelect(true)}>
              <MapPin size={16} color="#38bdf8" />
              <span>STAGE {safeLevel}/30</span>
            </div>
            <div className="menu-coins-pill" onClick={handleOpenShop}>
              <span>💍</span>
              <span>{(totalCoins || 0).toLocaleString()}</span>
            </div>
            <button className="menu-icon-btn admin-btn" onClick={() => navigate('/admin')} title="Admin Portal">
              <Shield size={18} color="#ec4899" />
            </button>
            <button className="menu-icon-btn" onClick={toggleMute} title="Mute/Unmute Audio">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button className="menu-icon-btn help-btn" onClick={() => setShowHelp(true)} title="How to Play">
              <HelpCircle size={20} />
            </button>
          </div>
        </div>


        {/* Login Required Prompt */}
        {showLoginPrompt && !authUser && (
          <div className="login-required-banner">
            <LogIn size={18} />
            <span>⚠️ Please LOGIN or REGISTER first to play the game!</span>
          </div>
        )}

        {/* 💰 Pricing Banner */}
        <div className="menu-stage-price-banner">
          <span>🎮 STAGE 1 FREE!</span>
          <span className="menu-stage-price-badge">🔓 All Items: Rs. 40</span>
          <span className="menu-stage-price-badge">🤖 Robots + 🎵 Songs + 🗺️ Stages</span>
          <span>JazzCash → Syed Usama · +923211808390</span>
        </div>

        {/* WhatsApp Screenshot Info */}
        <div className="menu-whatsapp-banner">
          <span>📱 After payment, send screenshot on WhatsApp:</span>
          <a href="https://wa.me/97332377688" target="_blank" rel="noopener noreferrer" className="whatsapp-link">+973 3237 7688</a>
          <span>or</span>
          <a href="https://wa.me/923211808390" target="_blank" rel="noopener noreferrer" className="whatsapp-link">+92 321 1808390</a>
        </div>

        {/* Hero Title */}
        <div className="menu-hero">
          <div className="menu-logo-container">
            <h1 className="menu-logo-sub">KINETIC</h1>
            <h1 className="menu-logo-main">JACK</h1>
            <div className="menu-logo-tagline">3D CYBER ENDLESS RUNNER • 30 STAGES</div>
          </div>
          <div className="menu-highscore-badge">
            <Trophy size={18} color="#facc15" />
            <span>BEST SCORE: <strong>{(highscore || 0).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Character Showcase */}
        <div className="menu-char-showcase">
          <div className="menu-char-card" style={{ borderColor: activeChar.color }}>
            <div className="menu-char-avatar">{activeChar.avatar}</div>
            <div className="menu-char-name">{activeChar.name}</div>
            <div className="menu-char-title">{activeChar.title}</div>
            <div className="menu-char-bonus">{activeChar.bonus}</div>
            {activeChar.isFree && (
              <div style={{ marginTop: '6px', fontSize: '0.7rem', color: '#34d399', fontWeight: '700', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '999px', border: '1px solid #10b981', display: 'inline-block' }}>
                🆓 FREE CHARACTER
              </div>
            )}
          </div>

          <div className="menu-char-selector">
            {CHARACTERS.map((char) => {
              const isUnlocked = unlockedCharacters.includes(char.id) || char.isFree;
              const isSelected = selectedCharacter === char.id;
              const needsPayment = !char.isFree && !isActivated && !unlockedCharacters.includes(char.id);

              return (
                <button
                  key={char.id}
                  className={`menu-char-dot ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => {
                    if (isUnlocked && !needsPayment) {
                      selectCharacter(char.id);
                    } else {
                      useGameStore.getState().triggerPayment('character', char.id, 40);
                    }
                  }}
                  title={needsPayment ? `💰 Rs. 40 via JazzCash to unlock ${char.name}` : isUnlocked ? `Select ${char.name}` : `Unlock ${char.name}`}
                  style={{ position: 'relative' }}
                >
                  <span>{char.avatar}</span>
                  {needsPayment && (
                    <span style={{
                      position: 'absolute', bottom: '-2px', right: '-2px', fontSize: '0.55rem',
                      background: '#facc15', color: '#000', borderRadius: '999px', padding: '1px 3px', fontWeight: '900'
                    }}>₨</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="menu-actions-grid">
          <button className="menu-play-btn" onClick={handlePlay}>
            <Play size={32} fill="currentColor" />
            <span>{authUser ? `START RUN (STAGE ${safeLevel})` : 'LOGIN TO PLAY'}</span>
          </button>
          <div className="menu-sub-actions">
            <button className="menu-secondary-btn" onClick={() => setShowLevelSelect(true)}>
              <MapPin size={20} />
              <span>30 STAGES</span>
            </button>
            <button className="menu-secondary-btn" onClick={handleOpenShop}>
              <ShoppingBag size={20} />
              <span>SHOP</span>
            </button>
            <button className="menu-secondary-btn" onClick={onOpenLeaderboard}>
              <Trophy size={20} />
              <span>RANKS</span>
            </button>
            <button className="menu-secondary-btn help-secondary-btn" onClick={() => setShowHelp(true)}>
              <HelpCircle size={20} />
              <span>HOW TO PLAY</span>
            </button>
          </div>
        </div>

        {/* Controls Label */}
        <div className="menu-controls-label">
          <div className="controls-label-title">🎮 CONTROLS</div>
          <div className="controls-label-grid">
            <div className="control-item">
              <span className="control-key">← → ↑ ↓</span>
              <span className="control-desc">Move / Jump / Slide</span>
            </div>
            <div className="control-item">
              <span className="control-key">W A S D</span>
              <span className="control-desc">Alternative Move</span>
            </div>
            <div className="control-item">
              <span className="control-key">B</span>
              <span className="control-desc">Activate Skateboard</span>
            </div>
            <div className="control-item">
              <span className="control-key">Tab / 1-5</span>
              <span className="control-desc">Switch Power-ups</span>
            </div>
            <div className="control-item">
              <span className="control-key">Swipe</span>
              <span className="control-desc">Mobile Controls</span>
            </div>
            <div className="control-item">
              <span className="control-key">ESC / P</span>
              <span className="control-desc">Pause Game</span>
            </div>
          </div>
          <div className="controls-purchase-note">
            💡 After purchasing a Skateboard skin, press <strong>B</strong> (or tap the 🛹 button on mobile) to ride it during gameplay!
          </div>
        </div>

        {/* Footer Controls Hint */}
        <div className="menu-controls-hint">
          <span>🎮 CONTROLS: <strong>ARROW KEYS / WASD / SWIPE</strong> to Move, Jump &amp; Slide • <strong>B</strong> for Plasma Board • <strong>ESC</strong> to Pause • <strong>?</strong> for Help</span>
        </div>
      </div>

      {showLevelSelect && <LevelSelectModal onClose={() => setShowLevelSelect(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
};

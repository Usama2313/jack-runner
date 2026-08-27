import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS } from '../../utils/constants';
import { Play, Trophy, ShoppingBag, Settings, User, Volume2, VolumeX } from 'lucide-react';

export const MainMenu = ({ onOpenLeaderboard, onOpenShop, onOpenAuth }) => {
  const startGame = useGameStore((s) => s.startGame);
  const highscore = useGameStore((s) => s.highscore);
  const totalCoins = useGameStore((s) => s.totalCoins);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const unlockedCharacters = useGameStore((s) => s.unlockedCharacters);
  const username = useGameStore((s) => s.username);
  const authUser = useGameStore((s) => s.authUser);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);

  const activeChar = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];

  return (
    <div className="main-menu-overlay">
      {/* Top Header Navigation */}
      <div className="menu-header">
        <div className="menu-profile-pill" onClick={onOpenAuth}>
          <User size={18} />
          <span>{authUser ? authUser.username : username}</span>
          {!authUser && <span className="menu-guest-badge">Guest</span>}
        </div>

        <div className="menu-header-right">
          <div className="menu-coins-pill" onClick={onOpenShop}>
            <span>🪙</span>
            <span>{totalCoins.toLocaleString()}</span>
          </div>
          <button className="menu-icon-btn" onClick={toggleMute} title="Mute/Unmute Audio">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Hero Title & Logo */}
      <div className="menu-hero">
        <div className="menu-logo-container">
          <h1 className="menu-logo-sub">SUBWAY</h1>
          <h1 className="menu-logo-main">SURFERS</h1>
          <div className="menu-logo-tagline">3D WEB RUNNER EDITION</div>
        </div>

        {/* Highscore Pill */}
        <div className="menu-highscore-badge">
          <Trophy size={18} color="#facc15" />
          <span>BEST SCORE: <strong>{highscore.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Character Carousel Preview */}
      <div className="menu-char-showcase">
        <div className="menu-char-card" style={{ borderColor: activeChar.color }}>
          <div className="menu-char-avatar">{activeChar.avatar}</div>
          <div className="menu-char-name">{activeChar.name}</div>
          <div className="menu-char-title">{activeChar.title}</div>
          <div className="menu-char-bonus">{activeChar.bonus}</div>
        </div>

        {/* Quick Character Selector Dots */}
        <div className="menu-char-selector">
          {CHARACTERS.map((char) => {
            const isUnlocked = unlockedCharacters.includes(char.id);
            const isSelected = selectedCharacter === char.id;

            return (
              <button
                key={char.id}
                className={`menu-char-dot ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && selectCharacter(char.id)}
                title={char.name}
              >
                <span>{char.avatar}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="menu-actions-grid">
        <button className="menu-play-btn" onClick={startGame}>
          <Play size={32} fill="currentColor" />
          <span>START RUN</span>
        </button>

        <div className="menu-sub-actions">
          <button className="menu-secondary-btn" onClick={onOpenLeaderboard}>
            <Trophy size={20} />
            <span>LEADERBOARD</span>
          </button>

          <button className="menu-secondary-btn" onClick={onOpenShop}>
            <ShoppingBag size={20} />
            <span>SHOP & UPGRADES</span>
          </button>
        </div>
      </div>

      {/* Keyboard Controls Guide */}
      <div className="menu-controls-hint">
        <span>🎮 CONTROLS: <strong>ARROW KEYS / WASD</strong> to Move, Jump & Roll • <strong>B</strong> for Hoverboard • <strong>ESC</strong> to Pause</span>
      </div>
    </div>
  );
};

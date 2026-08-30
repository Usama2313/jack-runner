import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { LEVELS, GAME_STATES } from '../../utils/constants';
import { MapPin, X, Play, Lock, CheckCircle2, Zap } from 'lucide-react';

const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

export const LevelSelectModal = ({ onClose }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const unlockedLevels = useGameStore((s) => s.unlockedLevels) || [1];
  const selectLevel = useGameStore((s) => s.selectLevel);
  const startGame = useGameStore((s) => s.startGame);
  const gameState = useGameStore((s) => s.gameState);

  const safeCurrentLevel = parseValidLevel(currentLevel);

  const handleLevelClick = (levelId, isUnlocked) => {
    if (!isUnlocked) return;
    const safeId = parseValidLevel(levelId);
    selectLevel(safeId);
    if (gameState === GAME_STATES.PLAYING) {
      startGame(safeId);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container level-select-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <MapPin size={26} color="#38bdf8" />
            <h2>30 STAGE MISSION SELECTOR</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Subtitle & Pricing Banner */}
        <div className="level-select-subtitle" style={{
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(220, 38, 38, 0.15))',
          border: '1px solid #facc15',
          borderRadius: '12px',
          padding: '12px 16px',
          margin: '10px 0 20px',
          textAlign: 'center',
          color: '#fff',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          <strong style={{ color: '#facc15', fontSize: '1rem', display: 'block', marginBottom: '4px' }}>
            💳 JAZZ CASH PREMIUM ACCESS
          </strong>
          Unlock next stage for <span style={{ color: '#38bdf8', fontWeight: '800' }}>Rs 40</span> OR 
          get <span style={{ color: '#10b981', fontWeight: '800' }}>VIP FULL ACCESS</span> (All 30 Stages + Free Robots) for <span style={{ color: '#f43f5e', fontWeight: '800' }}>Rs 1,000</span>!
        </div>

        {/* 30-Level Grid */}
        <div className="level-grid-scroll">
          <div className="level-grid">
            {LEVELS.map((lvl) => {
              const isUnlocked = unlockedLevels.includes(lvl.id);
              const isSelected = safeCurrentLevel === lvl.id;

              return (
                <div
                  key={lvl.id}
                  className={`level-grid-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  style={{
                    borderColor: isSelected ? lvl.neonColor || '#38bdf8' : (isUnlocked ? '#334155' : '#1e293b'),
                    background: isSelected
                      ? `linear-gradient(135deg, rgba(30,27,75,0.9), rgba(15,23,42,0.9))`
                      : undefined
                  }}
                  onClick={() => handleLevelClick(lvl.id, isUnlocked)}
                >
                  <div className="level-card-top">
                    <span className="level-num-badge" style={{ backgroundColor: lvl.neonColor || '#38bdf8' }}>
                      #{lvl.id}
                    </span>
                    {isUnlocked ? (
                      isSelected ? (
                        <span className="level-status-tag active">ACTIVE</span>
                      ) : (
                        <CheckCircle2 size={16} color="#10b981" />
                      )
                    ) : (
                      <Lock size={16} color="#64748b" />
                    )}
                  </div>

                  <h3 className="level-card-name">{lvl.name}</h3>

                  <div className="level-card-meta">
                    <span>⏱️ {lvl.timeLimit}s</span>
                    <span>⚡ {lvl.speedMult}x</span>
                  </div>

                  <div className="level-card-color-strip">
                    <div className="color-pip" style={{ backgroundColor: lvl.skyColor }} />
                    <div className="color-pip" style={{ backgroundColor: lvl.railColor }} />
                    <div className="color-pip" style={{ backgroundColor: lvl.neonColor }} />
                  </div>

                  {isUnlocked && (
                    <button className="level-play-mini-btn">
                      <Play size={14} />
                      <span>{isSelected ? 'SELECTED' : 'PLAY'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

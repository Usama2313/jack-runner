import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS, HOVERBOARD_SKINS, POWERUP_CONFIG, POWERUP_TYPES, MUSIC_PLAYLIST } from '../../utils/constants';
import { ShoppingBag, X, Check, Lock, ArrowUpCircle, Sparkles } from 'lucide-react';

export const ShopModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('characters'); // 'characters' | 'boards' | 'upgrades' | 'songs'
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const totalCoins = useGameStore((s) => s.totalCoins) || 0;
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const unlockedCharacters = useGameStore((s) => s.unlockedCharacters) || ['jack'];
  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const buyCharacter = useGameStore((s) => s.buyCharacter);

  const selectedBoard = useGameStore((s) => s.selectedBoard);
  const unlockedBoards = useGameStore((s) => s.unlockedBoards) || ['classic'];
  const selectBoard = useGameStore((s) => s.selectBoard);
  const buyBoard = useGameStore((s) => s.buyBoard);

  const upgrades = useGameStore((s) => s.upgrades) || {};
  const upgradePowerup = useGameStore((s) => s.upgradePowerup);

  const isActivated = useGameStore((s) => s.isActivated);
  const selectedSong = useGameStore((s) => s.selectedSong) || 'song-1';
  const unlockedSongs = useGameStore((s) => s.unlockedSongs) || ['song-1'];
  const selectSong = useGameStore((s) => s.selectSong);
  const triggerPayment = useGameStore((s) => s.triggerPayment);

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleCharacterAction = (char) => {
    const isUnlocked = unlockedCharacters.includes(char.id);
    const isPremiumRobot = char.id !== 'blitz' && !char.isHuman;
    if (isPremiumRobot && !isActivated) {
      showToast(`🔒 Premium Robot! Requires VIP Game Activation.`);
      setTimeout(() => triggerPayment('vip', null, 1000), 1200);
      return;
    }

    if (isUnlocked) {
      const success = selectCharacter(char.id);
      if (success) {
        showToast(`⚡ Equipped ${char.name}!`);
      } else {
        showToast(`🔒 Equip failed. Requires VIP Game Activation.`);
      }
    } else if (totalCoins >= char.price) {
      const success = buyCharacter(char.id, char.price);
      if (success) {
        showToast(`🎉 Unlocked & Equipped ${char.name}!`);
      } else {
        showToast(`🔒 Unlock failed. Requires VIP Game Activation.`);
      }
    } else {
      showToast(`❌ Need ${(char.price - totalCoins).toLocaleString()} more coins!`);
    }
  };

  const handleBoardAction = (board) => {
    const isUnlocked = unlockedBoards.includes(board.id);
    if (isUnlocked) {
      selectBoard(board.id);
      showToast(`🛹 Equipped ${board.name}!`);
    } else if (totalCoins >= board.price) {
      buyBoard(board.id, board.price);
      showToast(`🎉 Unlocked & Equipped ${board.name}!`);
    } else {
      showToast(`❌ Need ${(board.price - totalCoins).toLocaleString()} more coins!`);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container shop-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <ShoppingBag size={26} color="#38bdf8" />
            <h2>KINETIC JACK GEAR & SHOP</h2>
          </div>
          <div className="shop-balance-badge">
            <span>🪙</span>
            <span>{totalCoins.toLocaleString()}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Action Feedback Toast */}
        {feedbackMsg && (
          <div className="shop-feedback-toast">
            <Sparkles size={16} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="shop-tabs">
          <button
            className={`shop-tab ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            ROBOTS & RUNNERS
          </button>
          <button
            className={`shop-tab ${activeTab === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveTab('boards')}
          >
            PLASMA BOARDS
          </button>
          <button
            className={`shop-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
            onClick={() => setActiveTab('upgrades')}
          >
            POWERUP UPGRADES
          </button>
          <button
            className={`shop-tab ${activeTab === 'songs' ? 'active' : ''}`}
            onClick={() => setActiveTab('songs')}
          >
            🎵 SONGS PLAYLIST
          </button>
        </div>

        {/* Tab Content */}
        <div className="shop-content-scroll">
          {/* CHARACTERS TAB */}
          {activeTab === 'characters' && (
            <div className="shop-cards-grid">
              {CHARACTERS.map((char) => {
                const isUnlocked = unlockedCharacters.includes(char.id);
                const isSelected = selectedCharacter === char.id;
                const canAfford = totalCoins >= char.price;

                return (
                  <div
                    key={char.id}
                    className={`shop-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                    style={{ borderColor: isSelected ? char.color : '#334155' }}
                    onClick={() => handleCharacterAction(char)}
                  >
                    <div className="shop-card-avatar" style={{ backgroundColor: `${char.color}22` }}>
                      {char.avatar}
                    </div>
                    <h3 className="shop-card-name">{char.name}</h3>
                    <p className="shop-card-title">{char.title}</p>
                    <div className="shop-card-bonus">{char.bonus}</div>

                    <div className="shop-card-action">
                      {isSelected ? (
                        <div className="status-badge selected-badge">
                          <Check size={16} /> ACTIVE RUNNER
                        </div>
                      ) : isUnlocked ? (
                        <button
                          className="shop-action-btn select-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCharacterAction(char);
                          }}
                        >
                          SELECT & EQUIP
                        </button>
                      ) : (
                        <button
                          className={`shop-action-btn buy-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCharacterAction(char);
                          }}
                          disabled={!canAfford}
                        >
                          <Lock size={14} /> {char.priceLabel || `🪙 ${char.price.toLocaleString()}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PLASMA BOARDS TAB */}
          {activeTab === 'boards' && (
            <div className="shop-cards-grid">
              {HOVERBOARD_SKINS.map((board) => {
                const isUnlocked = unlockedBoards.includes(board.id);
                const isSelected = selectedBoard === board.id;
                const canAfford = totalCoins >= board.price;

                return (
                  <div
                    key={board.id}
                    className={`shop-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                    style={{ borderColor: isSelected ? board.color : '#334155' }}
                    onClick={() => handleBoardAction(board)}
                  >
                    <div className="shop-board-preview" style={{ backgroundColor: board.color }}>
                      🛹
                    </div>
                    <h3 className="shop-card-name">{board.name}</h3>
                    <p className="shop-card-title">Shields from 1 collision crash</p>

                    <div className="shop-card-action">
                      {isSelected ? (
                        <div className="status-badge selected-badge">
                          <Check size={16} /> ACTIVE BOARD
                        </div>
                      ) : isUnlocked ? (
                        <button
                          className="shop-action-btn select-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBoardAction(board);
                          }}
                        >
                          SELECT & EQUIP
                        </button>
                      ) : (
                        <button
                          className={`shop-action-btn buy-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBoardAction(board);
                          }}
                          disabled={!canAfford}
                        >
                          <Lock size={14} /> 🪙 {board.price.toLocaleString()}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* POWERUP UPGRADES TAB */}
          {activeTab === 'upgrades' && (
            <div className="shop-upgrades-list">
              {Object.entries(POWERUP_CONFIG).map(([type, config]) => {
                if (type === POWERUP_TYPES.HOVERBOARD) return null;
                const currentLevel = upgrades[type] || 1;
                const isMax = currentLevel >= 5;
                const cost = currentLevel * 300;
                const canAfford = totalCoins >= cost;

                return (
                  <div key={type} className="upgrade-row">
                    <div className="upgrade-icon-box" style={{ borderColor: config.color }}>
                      {config.icon}
                    </div>

                    <div className="upgrade-details">
                      <div className="upgrade-name">{config.name}</div>
                      <div className="upgrade-desc">{config.description}</div>
                      {/* Level Pips */}
                      <div className="upgrade-pips">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <div
                            key={lvl}
                            className={`upgrade-pip ${lvl <= currentLevel ? 'filled' : ''}`}
                            style={{ backgroundColor: lvl <= currentLevel ? config.color : '#334155' }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="upgrade-action">
                      {isMax ? (
                        <div className="max-badge">MAX LEVEL</div>
                      ) : (
                        <button
                          className={`upgrade-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => {
                            if (canAfford) {
                              upgradePowerup(type, cost);
                              showToast(`⚡ Upgraded ${config.name}!`);
                            }
                          }}
                          disabled={!canAfford}
                        >
                          <ArrowUpCircle size={16} />
                          <span>UPGRADE (🪙 {cost})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SONGS TAB */}
          {activeTab === 'songs' && (
            <div className="shop-upgrades-list">
              <div style={{ color: '#94a3b8', fontSize: '0.8rem', padding: '10px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Motivational background songs that play during runs. Stage 1 is free!</span>
                <strong style={{ color: '#38bdf8' }}>Price: Rs. 30 each</strong>
              </div>
              {MUSIC_PLAYLIST.map((song) => {
                const isUnlocked = isActivated || unlockedSongs.includes(song.id) || song.isFree;
                const isSelected = selectedSong === song.id;
                
                return (
                  <div key={song.id} className="upgrade-row" style={{ padding: '16px' }}>
                    <div className="upgrade-icon-box" style={{ borderColor: isSelected ? '#10b981' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      {song.type === 'vocal' ? '🎤' : '🎵'}
                    </div>

                    <div className="upgrade-details" style={{ flex: 1 }}>
                      <div className="upgrade-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{song.name}</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: song.type === 'vocal' ? 'rgba(168,85,247,0.2)' : 'rgba(56,189,248,0.2)', color: song.type === 'vocal' ? '#c084fc' : '#38bdf8', border: '1px solid currentColor' }}>
                          {song.type === 'vocal' ? 'VOCAL' : 'INSTRUMENTAL'}
                        </span>
                      </div>
                      <div className="upgrade-desc">Artist: {song.author} • Plays on Level: {song.level}</div>
                    </div>

                    <div className="upgrade-action">
                      {isSelected ? (
                        <div className="max-badge" style={{ color: '#10b981', border: '1px solid #10b981', background: 'rgba(16,185,129,0.1)' }}>PLAYING</div>
                      ) : isUnlocked ? (
                        <button
                          className="upgrade-btn"
                          onClick={() => {
                            selectSong(song.id);
                            showToast(`🎵 Equipped Song: ${song.name}!`);
                          }}
                          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none' }}
                        >
                          EQUIP SONG
                        </button>
                      ) : (
                        <button
                          className="upgrade-btn"
                          onClick={() => {
                            triggerPayment('song', song.id, 30);
                          }}
                          style={{ background: 'linear-gradient(135deg, #a16207, #eab308)', color: '#000' }}
                        >
                          UNLOCK (Rs. 30)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

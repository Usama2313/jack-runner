import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS, HOVERBOARD_SKINS, POWERUP_CONFIG, POWERUP_TYPES } from '../../utils/constants';
import { ShoppingBag, X, Check, Lock, ArrowUpCircle } from 'lucide-react';

export const ShopModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('characters'); // 'characters' | 'boards' | 'upgrades'

  const totalCoins = useGameStore((s) => s.totalCoins);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const unlockedCharacters = useGameStore((s) => s.unlockedCharacters);
  const selectCharacter = useGameStore((s) => s.selectCharacter);
  const buyCharacter = useGameStore((s) => s.buyCharacter);

  const selectedBoard = useGameStore((s) => s.selectedBoard);
  const unlockedBoards = useGameStore((s) => s.unlockedBoards);
  const selectBoard = useGameStore((s) => s.selectBoard);
  const buyBoard = useGameStore((s) => s.buyBoard);

  const upgrades = useGameStore((s) => s.upgrades);
  const upgradePowerup = useGameStore((s) => s.upgradePowerup);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container shop-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <ShoppingBag size={26} color="#38bdf8" />
            <h2>SUBWAY SHOP & UPGRADES</h2>
          </div>
          <div className="shop-balance-badge">
            <span>🪙</span>
            <span>{totalCoins.toLocaleString()}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="shop-tabs">
          <button
            className={`shop-tab ${activeTab === 'characters' ? 'active' : ''}`}
            onClick={() => setActiveTab('characters')}
          >
            CHARACTERS
          </button>
          <button
            className={`shop-tab ${activeTab === 'boards' ? 'active' : ''}`}
            onClick={() => setActiveTab('boards')}
          >
            HOVERBOARDS
          </button>
          <button
            className={`shop-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
            onClick={() => setActiveTab('upgrades')}
          >
            POWERUP UPGRADES
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
                    className={`shop-card ${isSelected ? 'selected' : ''}`}
                    style={{ borderColor: isSelected ? char.color : '#334155' }}
                  >
                    <div className="shop-card-avatar">{char.avatar}</div>
                    <h3 className="shop-card-name">{char.name}</h3>
                    <p className="shop-card-title">{char.title}</p>
                    <div className="shop-card-bonus">{char.bonus}</div>

                    <div className="shop-card-action">
                      {isSelected ? (
                        <div className="status-badge selected-badge">
                          <Check size={16} /> SELECTED
                        </div>
                      ) : isUnlocked ? (
                        <button
                          className="shop-action-btn select-btn"
                          onClick={() => selectCharacter(char.id)}
                        >
                          EQUIP
                        </button>
                      ) : (
                        <button
                          className={`shop-action-btn buy-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => canAfford && buyCharacter(char.id, char.price)}
                          disabled={!canAfford}
                        >
                          <Lock size={14} /> 🪙 {char.price.toLocaleString()}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HOVERBOARDS TAB */}
          {activeTab === 'boards' && (
            <div className="shop-cards-grid">
              {HOVERBOARD_SKINS.map((board) => {
                const isUnlocked = unlockedBoards.includes(board.id);
                const isSelected = selectedBoard === board.id;
                const canAfford = totalCoins >= board.price;

                return (
                  <div
                    key={board.id}
                    className={`shop-card ${isSelected ? 'selected' : ''}`}
                    style={{ borderColor: isSelected ? board.color : '#334155' }}
                  >
                    <div className="shop-board-preview" style={{ backgroundColor: board.color }}>
                      🛹
                    </div>
                    <h3 className="shop-card-name">{board.name}</h3>
                    <p className="shop-card-title">Protects against 1 crash</p>

                    <div className="shop-card-action">
                      {isSelected ? (
                        <div className="status-badge selected-badge">
                          <Check size={16} /> EQUIPPED
                        </div>
                      ) : isUnlocked ? (
                        <button
                          className="shop-action-btn select-btn"
                          onClick={() => selectBoard(board.id)}
                        >
                          EQUIP
                        </button>
                      ) : (
                        <button
                          className={`shop-action-btn buy-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => canAfford && buyBoard(board.id, board.price)}
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
                        <div className="max-badge">MAXED OUT</div>
                      ) : (
                        <button
                          className={`upgrade-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => canAfford && upgradePowerup(type, cost)}
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
        </div>
      </div>
    </div>
  );
};

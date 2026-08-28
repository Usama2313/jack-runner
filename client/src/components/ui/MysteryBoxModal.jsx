import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_CONFIG } from '../../utils/constants';
import { Sparkles, Gift, Check, Zap, Coins } from 'lucide-react';

export const MysteryBoxModal = () => {
  const activeMysteryBox = useGameStore((s) => s.activeMysteryBox);
  const closeMysteryBox = useGameStore((s) => s.closeMysteryBox);

  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (activeMysteryBox) {
      setIsOpened(false);
      // Auto-trigger open animation after 350ms
      const timer = setTimeout(() => {
        setIsOpened(true);
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeMysteryBox]);

  if (!activeMysteryBox) return null;

  // Extract batch rewards or single reward
  const rewards = activeMysteryBox.rewards || [];
  const isBatch = rewards.length > 0;
  const singleCoins = activeMysteryBox.coins || 0;
  const singlePowerup = activeMysteryBox.powerup;
  const totalCoins = activeMysteryBox.totalCoins || singleCoins;

  return (
    <div className="mystery-box-backdrop" onClick={closeMysteryBox}>
      <div className="mystery-box-modal batch-mystery-modal" onClick={(e) => e.stopPropagation()}>
        {/* Glowing Aura rays */}
        <div className="mystery-aura-rays" />

        <div className="mystery-box-header">
          <Sparkles className="mystery-sparkle-icon animate-spin-slow" size={24} />
          <h2>{isBatch ? `${rewards.length} MYSTERY BOXES UNBOXED!` : 'MYSTERY BOX UNBOXED!'}</h2>
          <Sparkles className="mystery-sparkle-icon animate-spin-slow" size={24} />
        </div>

        {/* 3D Animated Chest / Box Representation */}
        <div className={`mystery-chest-visual ${isOpened ? 'opened' : 'shaking'}`}>
          <div className="mystery-chest-lid">{isBatch ? '🎁' : '📦'}</div>
          <div className="mystery-burst-glow" />
        </div>

        {/* Rewards Reveal */}
        {isOpened && (
          <div className="mystery-rewards-container">
            {/* Total Coins Summary Card */}
            <div className="mystery-reward-card coins-card main-coins-reward">
              <span className="reward-icon">🪙</span>
              <div className="reward-details">
                <span className="reward-label">TOTAL COINS ACQUIRED</span>
                <span className="reward-value">+{totalCoins.toLocaleString()} COINS</span>
              </div>
            </div>

            {/* List of unboxed items */}
            {isBatch ? (
              <div className="batch-rewards-scroll-list">
                {rewards.map((reward, idx) => {
                  const pInfo = reward.powerup ? POWERUP_CONFIG[reward.powerup] : null;
                  return (
                    <div key={idx} className="batch-reward-row">
                      <div className="batch-row-header">
                        <span>📦 BOX #{idx + 1} REWARDS</span>
                        <span className="batch-box-coins">🪙 +{reward.coins}</span>
                      </div>

                      <div className="batch-row-items">
                        {pInfo && (
                          <div className="batch-row-item-badge" style={{ borderColor: pInfo.color }}>
                            <span>{pInfo.icon}</span>
                            <span>{pInfo.name}</span>
                          </div>
                        )}
                        {(reward.bonusItems || []).map((bonus, bidx) => {
                          const bpInfo = POWERUP_CONFIG[bonus];
                          if (!bpInfo) return null;
                          return (
                            <div key={bidx} className="batch-row-item-badge bonus" style={{ borderColor: bpInfo.color }}>
                              <span>🎁</span>
                              <span>{bpInfo.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Single Reward Fallback */
              singlePowerup && (
                <div className="mystery-reward-card powerup-card" style={{ borderColor: POWERUP_CONFIG[singlePowerup]?.color }}>
                  <span className="reward-icon">{POWERUP_CONFIG[singlePowerup]?.icon}</span>
                  <div className="reward-details">
                    <span className="reward-label">INSTANT POWERUP ACTIVATED</span>
                    <span className="reward-value" style={{ color: POWERUP_CONFIG[singlePowerup]?.color }}>
                      {POWERUP_CONFIG[singlePowerup]?.name} (+{POWERUP_CONFIG[singlePowerup]?.duration}s)
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <button className="mystery-claim-btn" onClick={closeMysteryBox}>
          <Check size={22} />
          <span>CLAIM REWARDS</span>
        </button>
      </div>
    </div>
  );
};

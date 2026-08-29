import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES, POWERUP_CONFIG } from '../../utils/constants';
import { Sparkles, Gift, Check, Home, Brain, HelpCircle, ArrowRight } from 'lucide-react';

const AI_TRIVIA = [
  {
    q: "🤖 What does GPT stand for in Artificial Intelligence?",
    a: "Generative Pre-trained Transformer",
    fact: "Transformers process words in relation to all other words in a sentence concurrently!"
  },
  {
    q: "🧠 What biological structure inspired Artificial Neural Networks?",
    a: "Human brain neurons & synaptic connections",
    fact: "Neural layers adjust weights during backpropagation to learn features automatically."
  },
  {
    q: "⚡ Who proposed the Turing Test to measure machine intelligence?",
    a: "Alan Turing (1950)",
    fact: "Alan Turing is universally celebrated as the father of modern computing and AI."
  },
  {
    q: "🎯 What does NLP stand for in machine learning?",
    a: "Natural Language Processing",
    fact: "NLP enables computers to understand, interpret, and generate human languages."
  },
  {
    q: "🚀 What is Reinforcement Learning from Human Feedback (RLHF)?",
    a: "Training models to align with human preferences and safety",
    fact: "RLHF fine-tunes AI agents to be helpful, harmless, and honest."
  },
  {
    q: "💡 What is an AI Autonomous Agent?",
    a: "A system that perceives its environment and autonomously takes actions to achieve goals",
    fact: "AI Agents can use tools, write code, run browsers, and orchestrate complex tasks!"
  }
];

export const MysteryBoxModal = () => {
  const activeMysteryBox = useGameStore((s) => s.activeMysteryBox);
  const closeMysteryBox = useGameStore((s) => s.closeMysteryBox);
  const setGameState = useGameStore((s) => s.setGameState);

  const [isOpened, setIsOpened] = useState(false);
  const [selectedTrivia, setSelectedTrivia] = useState(AI_TRIVIA[0]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (activeMysteryBox) {
      setIsOpened(false);
      setShowAnswer(false);
      // Pick a random AI question for the gift
      const randomQ = AI_TRIVIA[Math.floor(Math.random() * AI_TRIVIA.length)];
      setSelectedTrivia(randomQ);

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

  const rewards = activeMysteryBox.rewards || [];
  const isBatch = rewards.length > 0;
  const singleCoins = activeMysteryBox.coins || 0;
  const singlePowerup = activeMysteryBox.powerup;
  const totalCoins = activeMysteryBox.totalCoins || singleCoins;

  const handleClaim = () => {
    closeMysteryBox();
  };

  const handleClaimAndMenu = () => {
    closeMysteryBox();
    setGameState(GAME_STATES.MENU);
  };

  return (
    <div className="mystery-box-backdrop" onClick={handleClaim}>
      <div
        className="mystery-box-modal batch-mystery-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
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
          <div className="mystery-rewards-container" style={{ width: '100%' }}>
            {/* Total Coins Summary Card */}
            <div className="mystery-reward-card coins-card main-coins-reward">
              <span className="reward-icon">🪙</span>
              <div className="reward-details">
                <span className="reward-label">TOTAL COINS ACQUIRED</span>
                <span className="reward-value">+{totalCoins.toLocaleString()} COINS</span>
              </div>
            </div>

            {/* Hidden AI General Knowledge Gift Card */}
            {selectedTrivia && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(56, 189, 248, 0.15))',
                border: '1px solid rgba(139, 92, 246, 0.45)',
                borderRadius: '16px',
                padding: '16px',
                margin: '12px 0',
                textAlign: 'left',
                width: '100%',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#c084fc', fontSize: '0.82rem', fontWeight: '800' }}>
                  <Brain size={18} />
                  <span>HIDDEN AI KNOWLEDGE REWARD</span>
                </div>
                <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>
                  {selectedTrivia.q}
                </p>
                {showAnswer ? (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    borderLeft: '3px solid #38bdf8'
                  }}>
                    <div style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>
                      💡 Answer: {selectedTrivia.a}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.78rem' }}>
                      {selectedTrivia.fact}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAnswer(true)}
                    style={{
                      background: 'rgba(139, 92, 246, 0.25)',
                      border: '1px solid #a855f7',
                      color: '#e9d5ff',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <HelpCircle size={14} /> Reveal AI Answer
                  </button>
                )}
              </div>
            )}

            {/* List of unboxed items */}
            {isBatch ? (
              <div className="batch-rewards-scroll-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
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

        {/* Buttons Row */}
        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '16px' }}>
          <button
            className="mystery-claim-btn"
            onClick={handleClaim}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Check size={20} />
            <span>CLAIM REWARDS</span>
          </button>

          <button
            onClick={handleClaimAndMenu}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '12px 18px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Home size={18} />
            <span>FRONT PAGE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

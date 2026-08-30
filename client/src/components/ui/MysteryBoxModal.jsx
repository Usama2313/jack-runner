import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES, POWERUP_CONFIG, YOUTUBE_REWARD_VIDEOS } from '../../utils/constants';
import { Sparkles, Gift, Check, Home, Brain, HelpCircle, Play, Tv, Award, ExternalLink } from 'lucide-react';

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
  const addBonusCoins = useGameStore((s) => s.addBonusCoins);

  const [isOpened, setIsOpened] = useState(false);
  const [selectedTrivia, setSelectedTrivia] = useState(AI_TRIVIA[0]);
  const [showAnswer, setShowAnswer] = useState(false);

  // YouTube Video Reward state
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoClaimed, setVideoClaimed] = useState(false);

  useEffect(() => {
    if (activeMysteryBox) {
      setIsOpened(false);
      setShowAnswer(false);
      setIsVideoPlaying(false);
      setVideoClaimed(false);
      setSelectedVideoIdx(Math.floor(Math.random() * YOUTUBE_REWARD_VIDEOS.length));

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

  const currentVideo = YOUTUBE_REWARD_VIDEOS[selectedVideoIdx] || YOUTUBE_REWARD_VIDEOS[0];

  const handleClaim = () => {
    closeMysteryBox();
  };

  const handleClaimAndMenu = () => {
    closeMysteryBox();
    setGameState(GAME_STATES.MENU);
  };

  const handleClaimVideoReward = () => {
    if (videoClaimed) return;
    setVideoClaimed(true);
    addBonusCoins(currentVideo.bonusCoins);
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.4 }
    });
  };

  return (
    <div className="mystery-box-backdrop" onClick={handleClaim}>
      <div
        className="mystery-box-modal batch-mystery-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '92vh',
          width: '95%',
          maxWidth: '560px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px'
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
                <span className="reward-label">BASE REWARD COINS</span>
                <span className="reward-value">+{totalCoins.toLocaleString()} COINS</span>
              </div>
            </div>

            {/* ─── YOUTUBE VIDEO GIFT ANIMATION SECTION ─── */}
            {rewards.some(r => r.isVideo) && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(168, 85, 247, 0.18))',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '16px',
                padding: '16px',
                margin: '12px 0',
                textAlign: 'left',
                width: '100%',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.85rem', fontWeight: '800' }}>
                    <Tv size={18} />
                    <span>🎬 EXCLUSIVE YOUTUBE VIDEO GIFT</span>
                  </div>
                  <div style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(250, 204, 21, 0.2)',
                    border: '1px solid #facc15',
                    color: '#facc15',
                    fontSize: '0.75rem',
                    fontWeight: '800'
                  }}>
                    {currentVideo.rewardLabel}
                  </div>
                </div>

                {/* Video Title & Episode Selector */}
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                  {currentVideo.title}
                </div>



                {/* Video Embed Player or Watch Trigger */}
                {isVideoPlaying ? (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', background: '#000' }}>
                    <iframe
                      src={currentVideo.embedUrl}
                      title={currentVideo.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '12px'
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsVideoPlaying(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                      border: '1px solid #f87171',
                      color: '#fff',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '10px',
                      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                    }}
                  >
                    <Play size={18} fill="#fff" />
                    <span>▶️ PLAY REWARD VIDEO ANIMATION</span>
                  </button>
                )}

                {/* Bonus Coins Claim Action */}
                <button
                  onClick={handleClaimVideoReward}
                  disabled={videoClaimed}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: videoClaimed ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #a16207, #eab308)',
                    border: `1px solid ${videoClaimed ? '#10b981' : '#fde047'}`,
                    color: videoClaimed ? '#6ee7b7' : '#000',
                    fontWeight: '900',
                    fontSize: '0.85rem',
                    cursor: videoClaimed ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Award size={16} />
                  <span>{videoClaimed ? '✅ EXTRA COIN REWARD CLAIMED!' : `🎁 CLAIM +${(currentVideo.bonusCoins).toLocaleString()} EXTRA COINS`}</span>
                </button>
              </div>
            )}

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
                <p style={{ fontSize: '0.92rem', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>
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
              <div className="batch-rewards-scroll-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {rewards.map((reward, idx) => {
                  const pInfo = reward.powerup ? POWERUP_CONFIG[reward.powerup] : null;
                  return (
                    <div key={idx} className="batch-reward-row">
                      <div className="batch-row-header">
                        <span>📦 BOX #{idx + 1} REWARDS</span>
                        <span className="batch-box-coins">🪙 +{reward.coins}</span>
                      </div>

                      <div className="batch-row-items">
                        {reward.isVideo && (
                          <div className="batch-row-item-badge bonus" style={{ borderColor: '#ef4444' }}>
                            <span>🎬</span>
                            <span>YOUTUBE REWARD</span>
                          </div>
                        )}
                        {pInfo && (
                          <div className="batch-row-item-badge" style={{ borderColor: pInfo.color }}>
                            <span>{pInfo.icon}</span>
                            <span>{pInfo.name}</span>
                          </div>
                        )}
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
            <span>CLAIM ALL REWARDS</span>
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

export default MysteryBoxModal;

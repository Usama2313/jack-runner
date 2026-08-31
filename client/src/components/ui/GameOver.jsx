import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES } from '../../utils/constants';
import { RotateCcw, Home, Trophy, Send, Check } from 'lucide-react';

import { API_BASE } from '../../config/api';

export const GameOver = ({ onOpenLeaderboard }) => {
  const score = useGameStore((s) => s.score);
  const highscore = useGameStore((s) => s.highscore);
  const coinsCollected = useGameStore((s) => s.coinsCollected);
  const distanceTraveled = useGameStore((s) => s.distanceTraveled);
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const deathReason = useGameStore((s) => s.deathReason);
  const isCaptured = useGameStore((s) => s.isCaptured);
  const username = useGameStore((s) => s.username);
  const authToken = useGameStore((s) => s.authToken);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const pendingBoxRewards = useGameStore((s) => s.pendingBoxRewards) || [];
  const openAllMysteryBoxes = useGameStore((s) => s.openAllMysteryBoxes);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [playerRank, setPlayerRank] = useState(null);

  const isNewRecord = score >= highscore && score > 0;

  // React Spring animated score reveal
  const { animatedScore, animatedCoins, animatedDist } = useSpring({
    from: { animatedScore: 0, animatedCoins: 0, animatedDist: 0 },
    to: {
      animatedScore: score,
      animatedCoins: coinsCollected,
      animatedDist: distanceTraveled
    },
    config: { tension: 120, friction: 14 },
    delay: 200
  });

  // Launch confetti if high score broken
  useEffect(() => {
    if (isNewRecord) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isNewRecord]);

  const handleSubmitScore = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

      const res = await fetch(`${API_BASE}/api/scores`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          score,
          coins: coinsCollected,
          distance: Math.round(distanceTraveled),
          character: selectedCharacter,
          username
        })
      });
      const rawText = await res.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }
      if (data && data.success) {
        setSubmitted(true);
        if (data.rank) setPlayerRank(data.rank);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.warn('Could not submit score to online server, saved locally:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        {deathReason === 'captured_by_destroyer' || isCaptured ? (
          <div className="record-banner" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)' }}>
            🤖 CAPTURED BY ROBOT DESTROYER!
          </div>
        ) : isNewRecord ? (
          <div className="record-banner">🎉 NEW PERSONAL RECORD! 🎉</div>
        ) : (
          <div className="game-over-title">RUN CRASHED!</div>
        )}

        {/* Main Score Ticker */}
        <div className="game-over-score-box">
          <div className="score-sub-label">FINAL SCORE</div>
          <animated.div className="score-number-big">
            {animatedScore.to((n) => Math.floor(n).toLocaleString())}
          </animated.div>
        </div>

        {/* Run Details Grid */}
        <div className="game-over-stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🪙</span>
            <div className="stat-info">
              <span className="stat-label">Coins Collected</span>
              <animated.span className="stat-value">
                {animatedCoins.to((n) => Math.floor(n).toLocaleString())}
              </animated.span>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🏃</span>
            <div className="stat-info">
              <span className="stat-label">Distance Run</span>
              <animated.span className="stat-value">
                {animatedDist.to((n) => `${Math.floor(n)} m`)}
              </animated.span>
            </div>
          </div>
        </div>

        {/* Open Mystery Boxes Section */}
        {pendingBoxRewards.length > 0 && (
          <div className="game-over-mystery-section">
            <button
              className="open-mystery-boxes-btn animate-pulse-slow"
              onClick={openAllMysteryBoxes}
            >
              🎁 OPEN {pendingBoxRewards.length} MYSTERY BOXES!
            </button>
          </div>
        )}

        {/* Submit to Online Leaderboard */}
        <div className="submit-score-section">
          {submitted ? (
            <div className="submit-success-badge">
              <Check size={18} />
              <span>Score Saved! {playerRank ? `Global Rank: #${playerRank}` : ''}</span>
            </div>
          ) : (
            <button
              className="submit-score-btn"
              onClick={handleSubmitScore}
              disabled={submitting}
            >
              <Send size={18} />
              <span>{submitting ? 'Submitting...' : 'POST SCORE TO LEADERBOARD'}</span>
            </button>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="game-over-actions">
          <button className="play-again-btn" onClick={resetGame}>
            <RotateCcw size={24} />
            <span>PLAY AGAIN</span>
          </button>

          <div className="sub-buttons-row">
            <button className="secondary-action-btn" onClick={onOpenLeaderboard}>
              <Trophy size={18} />
              <span>LEADERBOARD</span>
            </button>

            <button
              className="secondary-action-btn"
              onClick={() => setGameState(GAME_STATES.MENU)}
            >
              <Home size={18} />
              <span>MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

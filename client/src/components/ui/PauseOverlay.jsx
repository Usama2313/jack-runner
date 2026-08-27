import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { GAME_STATES } from '../../utils/constants';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

export const PauseOverlay = () => {
  const resumeGame = useGameStore((s) => s.resumeGame);
  const startGame = useGameStore((s) => s.startGame);
  const setGameState = useGameStore((s) => s.setGameState);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const score = useGameStore((s) => s.score);
  const coinsCollected = useGameStore((s) => s.coinsCollected);

  return (
    <div className="pause-overlay-backdrop">
      <div className="pause-modal-card">
        <h2 className="pause-title">GAME PAUSED</h2>

        <div className="pause-stats-summary">
          <div className="pause-stat">
            <span className="pause-stat-label">Current Score</span>
            <span className="pause-stat-value">{score.toLocaleString()}</span>
          </div>
          <div className="pause-stat">
            <span className="pause-stat-label">Coins This Run</span>
            <span className="pause-stat-value">🪙 {coinsCollected}</span>
          </div>
        </div>

        <div className="pause-actions-list">
          <button className="pause-btn-primary" onClick={resumeGame}>
            <Play size={22} fill="currentColor" />
            <span>RESUME RUN (ESC)</span>
          </button>

          <button className="pause-btn-secondary" onClick={startGame}>
            <RotateCcw size={20} />
            <span>RESTART</span>
          </button>

          <button className="pause-btn-secondary" onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            <span>{isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}</span>
          </button>

          <button
            className="pause-btn-secondary"
            onClick={() => setGameState(GAME_STATES.MENU)}
          >
            <Home size={20} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

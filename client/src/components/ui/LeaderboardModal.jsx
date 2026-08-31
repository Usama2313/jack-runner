import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Trophy, X, RefreshCw, Medal, Users } from 'lucide-react';

import { API_BASE } from '../../config/api';

export const LeaderboardModal = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boardData, setBoardData] = useState([]);
  const onlineCount = useGameStore((s) => s.onlineCount);
  const currentUsername = useGameStore((s) => s.username);
  const storeLeaderboard = useGameStore((s) => s.leaderboard);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = API_BASE ? `${API_BASE}/api/scores/leaderboard?limit=15` : '/api/scores/leaderboard?limit=15';
      const res = await fetch(url);
      const rawText = await res.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }
      if (data && data.leaderboard) {
        setBoardData(data.leaderboard);
      } else if (storeLeaderboard && storeLeaderboard.length > 0) {
        setBoardData(storeLeaderboard);
      } else {
        // Mock fallback ranks
        setBoardData([
          { username: 'Jack Pioneer', score: 125400, level: 12 },
          { username: 'Cyber Runner', score: 98200, level: 9 },
          { username: 'Tokyo Speedster', score: 74500, level: 7 },
          { username: 'Neon Starlight', score: 53100, level: 5 },
          { username: currentUsername || 'Player', score: useGameStore.getState().highscore || 0, level: 1 }
        ]);
      }
    } catch (err) {
      if (storeLeaderboard && storeLeaderboard.length > 0) {
        setBoardData(storeLeaderboard);
      } else {
        setBoardData([
          { username: 'Jack Pioneer', score: 125400, level: 12 },
          { username: 'Cyber Runner', score: 98200, level: 9 },
          { username: 'Tokyo Speedster', score: 74500, level: 7 },
          { username: currentUsername || 'Player', score: useGameStore.getState().highscore || 0, level: 1 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Update when store gets live socket update
  useEffect(() => {
    if (storeLeaderboard && storeLeaderboard.length > 0) {
      setBoardData(storeLeaderboard);
    }
  }, [storeLeaderboard]);

  const getMedalColor = (rank) => {
    if (rank === 1) return '#facc15'; // Gold
    if (rank === 2) return '#e2e8f0'; // Silver
    if (rank === 3) return '#b45309'; // Bronze
    return '#64748b';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container leaderboard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Trophy size={26} color="#facc15" />
            <h2>GLOBAL LEADERBOARD</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="leaderboard-status-bar">
          <div className="live-pill">
            <span className="live-pulse-dot" />
            <span>LIVE</span>
          </div>
          <div className="online-runners-count">
            <Users size={16} />
            <span>{onlineCount} Surfers Online</span>
          </div>
          <button className="refresh-icon-btn" onClick={fetchLeaderboard} disabled={loading} title="Refresh">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>

        {/* Leaderboard Table List */}
        <div className="leaderboard-list">
          {loading && boardData.length === 0 ? (
            <div className="leaderboard-empty">Loading top surfers...</div>
          ) : error && boardData.length === 0 ? (
            <div className="leaderboard-error">{error}</div>
          ) : boardData.length === 0 ? (
            <div className="leaderboard-empty">No scores recorded yet. Be the first!</div>
          ) : (
            boardData.map((item, idx) => {
              const rank = idx + 1;
              const isCurrentUser = item.username.toLowerCase() === currentUsername.toLowerCase();

              return (
                <div
                  key={item.id || idx}
                  className={`leaderboard-row ${isCurrentUser ? 'current-user-row' : ''}`}
                >
                  <div className="leaderboard-rank" style={{ color: getMedalColor(rank) }}>
                    {rank <= 3 ? <Medal size={22} /> : `#${rank}`}
                  </div>

                  <div className="leaderboard-user-info">
                    <div className="leaderboard-name">
                      {item.username}
                      {isCurrentUser && <span className="you-tag">YOU</span>}
                    </div>
                    <div className="leaderboard-sub">
                      <span>{item.distance || 0}m run</span>
                      <span>•</span>
                      <span>🪙 {item.coins || 0}</span>
                    </div>
                  </div>

                  <div className="leaderboard-score-val">
                    {Number(item.score).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

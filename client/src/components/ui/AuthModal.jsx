import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { User, Lock, X, LogIn, UserPlus, LogOut, Check } from 'lucide-react';

import { API_BASE } from '../../config/api';

export const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const authUser = useGameStore((s) => s.authUser);
  const setAuth = useGameStore((s) => s.setAuth);
  const setUsername = useGameStore((s) => s.setUsername);

  const handleLogout = () => {
    setAuth(null, null);
    setUsername('Jake Runner');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setAuth(data.user, data.token);
      setSuccessMsg(`Welcome, ${data.user.username}!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <User size={24} color="#38bdf8" />
            <h2>{authUser ? 'PLAYER PROFILE' : isRegister ? 'CREATE ACCOUNT' : 'PLAYER LOGIN'}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {authUser ? (
          <div className="auth-profile-view">
            <div className="profile-avatar-circle">🏃</div>
            <h3 className="profile-username">{authUser.username}</h3>
            <p className="profile-status">Signed In • Scores Synced Online</p>

            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>SIGN OUT</span>
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error-badge">{error}</div>}
            {successMsg && (
              <div className="auth-success-badge">
                <Check size={16} /> {successMsg}
              </div>
            )}

            <div className="auth-input-group">
              <label>RUNNER USERNAME</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  placeholder="e.g. SpeedSurfer99"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>PASSWORD</label>
              <div className="input-with-icon">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
              <span>{loading ? 'Please wait...' : isRegister ? 'CREATE RUNNER ACCOUNT' : 'LOGIN & PLAY'}</span>
            </button>

            <div className="auth-toggle-mode">
              <span>{isRegister ? 'Already have an account?' : "Don't have an account yet?"}</span>
              <button
                type="button"
                className="toggle-link-btn"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
              >
                {isRegister ? 'Sign In Here' : 'Create One Here'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

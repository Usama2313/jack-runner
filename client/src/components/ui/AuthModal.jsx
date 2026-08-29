import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { API_BASE } from '../../config/api';

export const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const authUser = useGameStore(s => s.authUser);
  const setAuth = useGameStore(s => s.setAuth);
  const setUsername_ = useGameStore(s => s.setUsername);

  const handleLogout = () => {
    setAuth(null, null);
    setUsername_('Kinetic Jack');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccessMsg(null); setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister
      ? { email: email.trim(), username: username.trim(), password }
      : { identifier: email.trim() || username.trim(), password };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setAuth(data.user, data.token);
      setSuccessMsg(`Welcome, ${data.user.username}! 🎮`);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    backdrop: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
    },
    modal: {
      width: '100%', maxWidth: '420px', background: 'rgba(8, 14, 28, 0.97)',
      border: '1px solid rgba(56,189,248,0.3)', borderRadius: '20px', padding: '28px 24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(56,189,248,0.1)',
      overflowY: 'auto', maxHeight: '90vh'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'
    },
    title: {
      fontFamily: "'Orbitron', sans-serif", fontSize: '1.1rem', fontWeight: '900',
      color: '#fff', letterSpacing: '1px'
    },
    closeBtn: {
      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
      color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
    },
    input: {
      width: '100%', padding: '11px 14px', borderRadius: '10px', boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(56,189,248,0.25)',
      color: '#fff', fontSize: '0.95rem', outline: 'none', marginBottom: '14px',
      fontFamily: "'Outfit', sans-serif"
    },
    label: { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '6px', letterSpacing: '0.5px' },
    btn: (bg) => ({
      background: bg, color: '#000', fontWeight: '800', border: 'none', borderRadius: '10px',
      padding: '12px', cursor: 'pointer', fontSize: '0.95rem', width: '100%', marginTop: '4px',
      transition: 'opacity 0.2s'
    }),
    errorBox: {
      background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#fca5a5',
      padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: '600'
    },
    successBox: {
      background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#6ee7b7',
      padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px', fontWeight: '600'
    }
  };

  if (authUser) {
    return (
      <div style={s.backdrop} onClick={onClose}>
        <div style={s.modal} onClick={e => e.stopPropagation()}>
          <div style={s.header}>
            <span style={s.title}>👤 PLAYER PROFILE</span>
            <button style={s.closeBtn} onClick={onClose}>✕</button>
          </div>
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
            }}>🏃</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>{authUser.username}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '6px' }}>{authUser.email || ''}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px',
              background: authUser.is_activated ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
              border: `1px solid ${authUser.is_activated ? '#10b981' : '#334155'}`,
              color: authUser.is_activated ? '#34d399' : '#64748b', fontSize: '0.8rem', fontWeight: '700', marginBottom: '24px'
            }}>
              {authUser.is_activated ? '⭐ VIP Premium' : '🎮 Free Runner'}
            </div>
            <br />
            <button style={{ ...s.btn('linear-gradient(135deg, #ef4444, #dc2626)'), color: '#fff', width: 'auto', padding: '10px 24px' }} onClick={handleLogout}>
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <span style={s.title}>
            {isRegister ? '🚀 CREATE ACCOUNT' : '🔐 PLAYER LOGIN'}
          </span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '10px' }}>
          {[false, true].map(reg => (
            <button key={reg} onClick={() => { setIsRegister(reg); setError(null); }} style={{
              flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', border: 'none', transition: 'all 0.2s',
              background: isRegister === reg ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: isRegister === reg ? '#38bdf8' : '#64748b'
            }}>
              {reg ? '✨ Register' : '🔑 Login'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          {successMsg && <div style={s.successBox}>✅ {successMsg}</div>}

          {isRegister ? (
            <>
              <label style={s.label}>EMAIL ADDRESS</label>
              <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="player@email.com" required />
              <label style={s.label}>DISPLAY USERNAME</label>
              <input style={s.input} type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="e.g. SpeedRunner99" required minLength={2} maxLength={20} />
            </>
          ) : (
            <>
              <label style={s.label}>EMAIL OR USERNAME</label>
              <input style={s.input} type="text" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email or username..." required />
            </>
          )}

          <label style={s.label}>PASSWORD</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required minLength={6} />

          <button style={s.btn('linear-gradient(135deg, #0284c7, #38bdf8)')} type="submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : isRegister ? '🚀 Create Runner Account' : '🎮 Login & Play'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: '#475569' }}>
          {isRegister ? 'Already a runner? ' : 'New to Jack Runner? '}
          <button onClick={() => { setIsRegister(!isRegister); setError(null); }} style={{
            background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer',
            fontWeight: '700', fontSize: '0.85rem', textDecoration: 'underline'
          }}>
            {isRegister ? 'Sign in here' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { API_BASE } from '../../config/api';

const getLocalAccounts = () => {
  try {
    const raw = localStorage.getItem('kinetic_local_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAccounts = (accounts) => {
  try {
    localStorage.setItem('kinetic_local_accounts', JSON.stringify(accounts));
  } catch {}
};

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
    // Notify AdminPanel immediately (same-tab CustomEvent)
    window.dispatchEvent(new CustomEvent('admin_refresh_users'));
    onClose();
  };

  const handleOfflineAuthFallback = (isReg, userEmail, userName, userPass) => {
    const accounts = getLocalAccounts();
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const cleanUser = (userName || (cleanEmail ? cleanEmail.split('@')[0] : 'Jack Runner')).trim();

    if (isReg) {
      const existing = accounts.find(a => a.email === cleanEmail);
      if (existing) {
        throw new Error('Email already registered. Please login.');
      }
      const newAccount = {
        id: 'local_' + Date.now(),
        email: cleanEmail,
        username: cleanUser,
        password: userPass,
        is_activated: false,
        unlocked_levels: [1],
        unlocked_songs: ['song-1']
      };
      accounts.push(newAccount);
      saveLocalAccounts(accounts);
      const token = 'local_jwt_' + Date.now();
      setAuth(newAccount, token);
      return newAccount;
    } else {
      // Login mode
      let account = accounts.find(a => a.email === cleanEmail || a.username.toLowerCase() === cleanEmail);
      if (!account) {
        // Create an account on the fly for seamless offline gameplay
        account = {
          id: 'local_' + Date.now(),
          email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@kineticjack.com`,
          username: cleanUser,
          password: userPass,
          is_activated: false,
          unlocked_levels: [1],
          unlocked_songs: ['song-1']
        };
        accounts.push(account);
        saveLocalAccounts(accounts);
      } else if (account.password && userPass && account.password !== userPass) {
        throw new Error('Incorrect password. Please check your credentials.');
      }
      const token = 'local_jwt_' + Date.now();
      setAuth(account, token);
      return account;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail && !cleanUsername) {
      setError('Please enter your email address or username.');
      setLoading(false);
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      setLoading(false);
      return;
    }

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const body = isRegister
      ? { email: cleanEmail, username: cleanUsername || cleanEmail.split('@')[0], password: cleanPassword }
      : { identifier: cleanEmail || cleanUsername, password: cleanPassword };

    let onlineSuccess = false;

    // Try online API first if API_BASE is reachable
    try {
      const url = API_BASE ? `${API_BASE}${endpoint}` : endpoint;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const rawText = await res.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (res.ok && data && (data.user || data.token)) {
        setAuth(data.user, data.token);
        setSuccessMsg(`Welcome, ${data.user.username}! 🎮`);
        onlineSuccess = true;
        // Notify AdminPanel immediately
        window.dispatchEvent(new CustomEvent('admin_refresh_users'));
        setTimeout(() => onClose(), 1200);
      } else if (data && data.error && !res.ok) {
        throw new Error(data.error);
      } else {
        throw new Error('Server offline or invalid response');
      }
    } catch (networkOrApiErr) {
      // If error is explicit user credentials conflict (e.g. email taken or wrong password from API), show it
      if (networkOrApiErr.message && !networkOrApiErr.message.includes('Server offline') && !networkOrApiErr.message.includes('Failed to fetch') && !networkOrApiErr.message.includes('Unexpected')) {
        setError(networkOrApiErr.message);
        setLoading(false);
        return;
      }

      // Seamless local offline fallback so game is ALWAYS playable!
      try {
        const user = handleOfflineAuthFallback(isRegister, cleanEmail, cleanUsername, cleanPassword);
        setSuccessMsg(`Welcome, ${user.username}! 🎮 (Ready to Play)`);
        onlineSuccess = true;
        // Notify AdminPanel immediately
        window.dispatchEvent(new CustomEvent('admin_refresh_users'));
        setTimeout(() => onClose(), 1000);
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'Authentication error.');
      }
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
            <button key={String(reg)} onClick={() => { setIsRegister(reg); setError(null); }} style={{
              flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', border: 'none', transition: 'all 0.2s',
              background: isRegister === reg ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: isRegister === reg ? '#38bdf8' : '#64748b'
            }}>
              {reg ? '✨ Register' : '🔑 Login'}
            </button>
          ))}
        </div>

        {error && (
          <div style={s.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div style={s.successBox}>
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={s.label}>EMAIL ADDRESS</label>
            <input
              style={s.input}
              type="email"
              placeholder="e.g. runner@cyber.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div>
              <label style={s.label}>RUNNER USERNAME</label>
              <input
                style={s.input}
                type="text"
                placeholder="e.g. NeonJack"
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={20}
                required
              />
            </div>
          )}

          <div>
            <label style={s.label}>PASSWORD</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            style={s.btn(isRegister ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #0284c7, #38bdf8)')}
            type="submit"
            disabled={loading}
          >
            {loading ? '⏳ Synchronizing...' : isRegister ? '🚀 Create Account & Play' : '🔓 Sign In & Play'}
          </button>
        </form>
      </div>
    </div>
  );
};

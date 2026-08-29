import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';

const MASTER_KEY = 'jack-runner-admin-2026';

export const AdminPanel = () => {
  const navigate = useNavigate();

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@jackrunner.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginKey, setLoginKey] = useState('');
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'key'
  const [authToken, setAuthToken] = useState(localStorage.getItem('admin_auth_token') || '');
  const [adminInfo, setAdminInfo] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Management state
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [levels, setLevels] = useState('1,2,3,4,5,6,7,8,9,10');
  const [stageCountInput, setStageCountInput] = useState(10);
  const [activate, setActivate] = useState(true);
  const [message, setMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_auth_token') || authToken;
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  const verifyToken = async (tokenToVerify) => {
    const t = tokenToVerify || authToken || localStorage.getItem('admin_auth_token');
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsLoggedIn(true);
        setUsers(data.users || []);
      } else {
        localStorage.removeItem('admin_auth_token');
        setAuthToken('');
        setIsLoggedIn(false);
      }
    } catch {
      // If network error, still allow if master key was saved
      if (t === MASTER_KEY || t === 'admin2026') {
        setIsLoggedIn(true);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      let token = '';
      if (loginMode === 'key') {
        const keyVal = loginKey.trim();
        const res = await fetch(`${API_BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminKey: keyVal })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Invalid master key');
        token = data.token || keyVal;
        setAdminInfo(data.admin || { email: 'admin@jackrunner.com', username: 'JackAdmin' });
      } else {
        const res = await fetch(`${API_BASE}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Invalid credentials');
        token = data.token;
        setAdminInfo(data.admin);
      }
      setAuthToken(token);
      localStorage.setItem('admin_auth_token', token);
      setIsLoggedIn(true);
      fetchUsers(token);
    } catch (err) {
      setLoginError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchUsers = async (token) => {
    const t = token || authToken || localStorage.getItem('admin_auth_token') || MASTER_KEY;
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!identifier.trim()) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || MASTER_KEY;
    try {
      const levelArray = levels.split(',').map(l => Number(l.trim())).filter(l => !isNaN(l) && l > 0);
      const res = await fetch(`${API_BASE}/api/admin/unlock-levels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: identifier.trim(), levels: levelArray })
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Done'); setStatusType(data.success ? 'success' : 'error');
      if (data.success) fetchUsers(t);
    } catch { setMessage('Network error'); setStatusType('error'); }
    setLoading(false);
  };

  const handleSetStageCount = async (targetId, count) => {
    const target = targetId || identifier;
    const finalCount = count !== undefined ? count : stageCountInput;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || MASTER_KEY;
    try {
      const res = await fetch(`${API_BASE}/api/admin/set-stage-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), stageCount: Number(finalCount) })
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Done'); setStatusType(data.success ? 'success' : 'error');
      if (data.success) fetchUsers(t);
    } catch { setMessage('Network error'); setStatusType('error'); }
    setLoading(false);
  };

  const handleActivate = async () => {
    if (!identifier.trim()) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || MASTER_KEY;
    try {
      const res = await fetch(`${API_BASE}/api/admin/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: identifier.trim(), activated: activate })
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Done'); setStatusType(data.success ? 'success' : 'error');
      if (data.success) fetchUsers(t);
    } catch { setMessage('Network error'); setStatusType('error'); }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    setAuthToken(''); setIsLoggedIn(false); setAdminInfo(null); setUsers([]);
  };

  const quickUnlockAll = (userIdentifier) => {
    setIdentifier(userIdentifier);
    setLevels('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30');
    setActiveTab('manage');
  };

  const quickActivate = (userIdentifier) => {
    setIdentifier(userIdentifier);
    setActivate(true);
    setActiveTab('manage');
  };

  // ─── Styles ──────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #05080f 0%, #0d1528 50%, #080d1a 100%)',
      color: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif", overflowY: 'auto', overflowX: 'auto',
      padding: '20px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    card: {
      width: '100%', maxWidth: '900px', background: 'rgba(10, 18, 35, 0.95)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '24px', padding: '32px 28px',
      boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(56,189,248,0.08)'
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px',
      flexWrap: 'wrap', gap: '12px'
    },
    badge: (color = '#38bdf8') => ({
      display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px',
      border: `1px solid ${color}`, color: color, fontSize: '0.8rem', fontWeight: '800',
      background: `${color}18`
    }),
    h1: {
      fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '900',
      letterSpacing: '1px', color: '#fff', marginBottom: '6px', textAlign: 'center',
      textShadow: '0 0 20px rgba(56,189,248,0.5)'
    },
    input: {
      width: '100%', padding: '12px 16px', borderRadius: '12px', boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(56,189,248,0.25)',
      color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s'
    },
    label: { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '7px', letterSpacing: '0.5px' },
    btn: (bg, c = '#000') => ({
      background: bg, color: c, fontWeight: '800', border: 'none', borderRadius: '12px',
      padding: '12px 22px', cursor: 'pointer', fontSize: '0.95rem', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
      transition: 'opacity 0.2s, transform 0.15s'
    }),
    tab: (active) => ({
      padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
      fontSize: '0.9rem', border: 'none', transition: 'all 0.2s',
      background: active ? 'rgba(56,189,248,0.2)' : 'transparent',
      color: active ? '#38bdf8' : '#64748b',
      borderBottom: active ? '2px solid #38bdf8' : '2px solid transparent'
    }),
    alert: (type) => ({
      display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
      borderRadius: '14px', marginBottom: '20px',
      backgroundColor: type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
      border: `1px solid ${type === 'success' ? '#10b981' : '#ef4444'}`,
      color: type === 'success' ? '#6ee7b7' : '#fca5a5', fontSize: '0.9rem', fontWeight: '600'
    }),
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' },
    th: { padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' },
    td: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1', verticalAlign: 'middle' }
  };

  // ─── Login Screen ─────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={s.page}>
        <div style={{ ...s.card, maxWidth: '460px' }}>
          <div style={s.header}>
            <button onClick={() => navigate('/')} style={{
              background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.35)',
              color: '#38bdf8', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem'
            }}>← Back to Game</button>
            <div style={s.badge('#ec4899')}>🛡️ ADMIN PORTAL</div>
          </div>

          <h1 style={s.h1}>⚡ JACK RUNNER</h1>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: '28px' }}>
            Admin Control Panel — Secure Access
          </p>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px' }}>
            {['password', 'key'].map(mode => (
              <button key={mode} onClick={() => { setLoginMode(mode); setLoginError(''); }}
                style={{ ...s.tab(loginMode === mode), flex: 1, borderRadius: '10px', borderBottom: 'none' }}>
                {mode === 'password' ? '📧 Email Login' : '🔑 Master Key'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div style={{ ...s.alert('error'), marginBottom: '16px' }}>
                ⚠️ {loginError}
              </div>
            )}

            {loginMode === 'password' ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={s.label}>ADMIN EMAIL</label>
                  <input style={s.input} type="email" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)} placeholder="admin@jackrunner.com" required />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={s.label}>ADMIN PASSWORD</label>
                  <input style={s.input} type="password" value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)} placeholder="Enter password..." required />
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.08)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem', color: '#64748b' }}>
                  💡 Default credentials: <strong style={{ color: '#38bdf8' }}>admin@jackrunner.com</strong> / <strong style={{ color: '#38bdf8' }}>admin1234</strong>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={s.label}>MASTER ADMIN KEY</label>
                  <input style={s.input} type="password" value={loginKey}
                    onChange={e => setLoginKey(e.target.value)} placeholder="Enter master key..." required />
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.08)', borderRadius: '10px', marginBottom: '20px', fontSize: '0.82rem', color: '#64748b' }}>
                  💡 Master Key: <strong style={{ color: '#38bdf8' }}>admin2026</strong> or <strong style={{ color: '#38bdf8' }}>jack-runner-admin-2026</strong>
                </div>
              </>
            )}

            <button style={s.btn('linear-gradient(135deg, #0284c7, #38bdf8)')} type="submit" disabled={loginLoading}>
              {loginLoading ? '⏳ Authenticating...' : '🔓 Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Admin Dashboard ──────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <button onClick={() => navigate('/')} style={{
            background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.35)',
            color: '#38bdf8', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem'
          }}>← Game</button>
          <h1 style={{ ...s.h1, margin: 0, fontSize: '1.3rem' }}>⚡ JACK RUNNER ADMIN</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={s.badge('#10b981')}>✅ {adminInfo?.email || 'admin@jackrunner.com'}</div>
            <button onClick={handleLogout} style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444',
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
            }}>Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '4px' }}>
          {[['users', '👥 Users'], ['manage', '⚙️ Manage'], ['info', '📊 Info']].map(([key, label]) => (
            <button key={key} style={s.tab(activeTab === key)} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {message && (
          <div style={s.alert(statusType)}>
            {statusType === 'success' ? '✅' : '⚠️'} {message}
          </div>
        )}

        {/* ─── USERS TAB ─── */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ color: '#38bdf8', fontWeight: '800', fontSize: '1rem', margin: 0 }}>Registered Players ({users.length})</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Live Database Sync</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  style={{ ...s.input, width: '220px', padding: '6px 12px', fontSize: '0.85rem' }}
                  placeholder="🔍 Search email/name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <button onClick={() => fetchUsers()} style={{
                  background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8',
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
                }}>🔄 Refresh</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '450px' }}>
              {usersLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>⏳ Loading users...</div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No registered players found.</div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>#</th>
                      <th style={s.th}>Email Address</th>
                      <th style={s.th}>Username</th>
                      <th style={s.th}>Allowed Stages</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Admin</th>
                      <th style={s.th}>Set Stages & Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => {
                        if (!searchTerm) return true;
                        const term = searchTerm.toLowerCase();
                        return (u.email && u.email.toLowerCase().includes(term)) ||
                               (u.username && u.username.toLowerCase().includes(term));
                      })
                      .map(u => (
                      <tr key={u.id}>
                        <td style={s.td}>{u.id}</td>
                        <td style={s.td}><span style={{ color: '#38bdf8', fontWeight: '600' }}>{u.email || '—'}</span></td>
                        <td style={s.td}><strong>{u.username}</strong></td>
                        <td style={s.td}>
                          <span style={{ color: '#fbbf24', fontWeight: '800', fontSize: '0.9rem' }}>
                            {Array.isArray(u.unlocked_levels) ? u.unlocked_levels.length : 0} / 30 Stages
                          </span>
                        </td>
                        <td style={s.td}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700',
                            background: u.is_activated ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)',
                            color: u.is_activated ? '#34d399' : '#64748b',
                            border: `1px solid ${u.is_activated ? '#10b981' : '#334155'}`
                          }}>
                            {u.is_activated ? '✅ VIP Full' : '🔒 Free'}
                          </span>
                        </td>
                        <td style={s.td}>{u.is_admin ? <span style={{ color: '#ec4899', fontWeight: '700' }}>⚡ Admin</span> : '—'}</td>
                        <td style={s.td}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {/* Quick Stage buttons */}
                            {[5, 10, 15, 30].map(cnt => (
                              <button
                                key={cnt}
                                onClick={() => handleSetStageCount(u.email || u.username, cnt)}
                                style={{
                                  background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)',
                                  color: '#7dd3fc', padding: '3px 7px', borderRadius: '6px', cursor: 'pointer',
                                  fontSize: '0.72rem', fontWeight: '700'
                                }}
                              >
                                {cnt === 30 ? '🔓 All 30' : `+${cnt} Lvl`}
                              </button>
                            ))}
                            <button onClick={() => quickActivate(u.email || u.username)} style={{
                              background: 'rgba(250,204,21,0.15)', border: '1px solid #facc15', color: '#facc15',
                              padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700'
                            }}>⭐ VIP</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── MANAGE TAB ─── */}
        {activeTab === 'manage' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Shared identifier input */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={s.label}>TARGET USER EMAIL / USERNAME / ID</label>
              <input style={s.input} type="text" value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. syedusamatanveer@gmail.com or jake@speed.com or 4" />
            </div>

            {/* Quick Stage Count Setter */}
            <div style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>
                🎯 Set Exact Number of Allowed Stages for Email
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px' }}>
                Type the total number of stages (1 to 30) this specific email user is permitted to play.
              </p>
              <label style={s.label}>NUMBER OF STAGES (1 – 30)</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input
                  style={{ ...s.input, width: '100px', fontWeight: '800', textAlign: 'center', fontSize: '1.1rem' }}
                  type="number"
                  min="1"
                  max="30"
                  value={stageCountInput}
                  onChange={e => setStageCountInput(Number(e.target.value))}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[1, 5, 10, 15, 20, 30].map(n => (
                    <button
                      key={n}
                      onClick={() => setStageCountInput(n)}
                      style={{
                        background: stageCountInput === n ? 'rgba(56,189,248,0.35)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${stageCountInput === n ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                        color: stageCountInput === n ? '#fff' : '#94a3b8',
                        padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button
                style={s.btn('linear-gradient(135deg, #0284c7, #38bdf8)')}
                onClick={() => handleSetStageCount()}
                disabled={loading}
              >
                {loading ? '⏳ Updating Stages...' : `⚡ Allow ${stageCountInput} Stages for User`}
              </button>
            </div>

            {/* Manual Stage IDs */}
            <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>🔓 Unlock Stages (1–30)</h3>
              <label style={s.label}>STAGE IDs (comma-separated)</label>
              <input style={{ ...s.input, marginBottom: '12px' }} type="text" value={levels}
                onChange={e => setLevels(e.target.value)} placeholder="1,2,3,4,5,10,15,20,25,30" />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {['1-5', '1-10', '1-20', 'All 30'].map((label, i) => {
                  const vals = [
                    '1,2,3,4,5',
                    '1,2,3,4,5,6,7,8,9,10',
                    Array.from({length:20},(_,i)=>i+1).join(','),
                    Array.from({length:30},(_,i)=>i+1).join(',')
                  ];
                  return (
                    <button key={label} onClick={() => setLevels(vals[i])} style={{
                      background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: '#7dd3fc',
                      padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700'
                    }}>{label}</button>
                  );
                })}
              </div>
              <button style={s.btn('linear-gradient(135deg, #0284c7, #38bdf8)')} onClick={handleUnlock} disabled={loading}>
                {loading ? '⏳ Processing...' : '⚡ Apply Stage Unlocks'}
              </button>
            </div>

            {/* VIP Activation */}
            <div style={{ background: 'rgba(250,204,21,0.05)', border: '1px solid rgba(250,204,21,0.2)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#facc15', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>⭐ VIP Premium Access</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '16px' }}>
                VIP activates full game access: all robots, unlimited gifts, all 30 stages.
              </p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
                <input type="checkbox" checked={activate} onChange={e => setActivate(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#facc15', cursor: 'pointer' }} />
                <span style={{ color: '#fef08a', fontSize: '0.9rem', fontWeight: '700' }}>
                  {activate ? '✅ Grant Full Premium Access' : '❌ Revoke Premium (Downgrade to Free)'}
                </span>
              </label>
              <button style={s.btn('linear-gradient(135deg, #a16207, #facc15)')} onClick={handleActivate} disabled={loading}>
                {loading ? '⏳ Processing...' : '🛡️ Update VIP Status'}
              </button>
            </div>
          </div>
        )}

        {/* ─── INFO TAB ─── */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Total Players', value: users.length, icon: '👥', color: '#38bdf8' },
              { label: 'VIP Users', value: users.filter(u => u.is_activated).length, icon: '⭐', color: '#facc15' },
              { label: 'Free Players', value: users.filter(u => !u.is_activated).length, icon: '🎮', color: '#94a3b8' },
              { label: 'Admin Accounts', value: users.filter(u => u.is_admin).length, icon: '🛡️', color: '#ec4899' }
            ].map(stat => (
              <div key={stat.label} style={{
                background: `${stat.color}10`, border: `1px solid ${stat.color}30`,
                borderRadius: '16px', padding: '20px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '900', color: stat.color, fontFamily: "'Orbitron', sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}

            <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#38bdf8', fontWeight: '800', marginBottom: '12px' }}>🔑 Quick Reference Credentials</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { label: 'Admin Email', val: 'admin@jackrunner.com' },
                  { label: 'Admin Password', val: 'admin1234' },
                  { label: 'Master Key 1', val: 'admin2026' },
                  { label: 'Master Key 2', val: 'jack-runner-admin-2026' }
                ].map(c => (
                  <div key={c.label} style={{ background: 'rgba(56,189,248,0.06)', padding: '10px 14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>{c.label}</div>
                    <code style={{ color: '#38bdf8', fontWeight: '700', fontSize: '0.9rem' }}>{c.val}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

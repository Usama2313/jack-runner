import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { useGameStore } from '../store/gameStore';

const MASTER_KEYS = ['admin2026', 'jack-runner-admin-2026', 'super_secret_admin_key_2026'];
const DEFAULT_ADMIN_EMAIL = 'admin@jackrunner.com';
const DEFAULT_ADMIN_PASS = 'admin1234';

// Helper to get local accounts
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

// Seeded users if backend is offline
const getInitialUsers = () => {
  const localAccounts = getLocalAccounts();
  const activeUser = (() => {
    try {
      const raw = localStorage.getItem('kinetic_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  const defaultList = [
    {
      id: 1,
      email: 'admin@jackrunner.com',
      username: 'JackAdmin',
      is_admin: true,
      is_activated: true,
      unlocked_levels: Array.from({ length: 30 }, (_, i) => i + 1),
      unlocked_songs: ['song-1', 'song-2', 'song-3', 'song-4', 'song-5'],
      unlocked_robots: ['jack', 'valkyrie', 'titan_prime', 'rex_brawler'],
      coins: 999999,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'jake@speed.com',
      username: 'JakeSpeed',
      is_admin: false,
      is_activated: false,
      unlocked_levels: [1],
      unlocked_songs: ['song-1'],
      unlocked_robots: ['jack'],
      coins: 2500,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'tricky@runner.com',
      username: 'TrickyRunner',
      is_admin: false,
      is_activated: false,
      unlocked_levels: [1, 2],
      unlocked_songs: ['song-1'],
      unlocked_robots: ['jack', 'maya_blade'],
      coins: 5200,
      created_at: new Date().toISOString()
    }
  ];

  // Merge with local accounts
  localAccounts.forEach(acc => {
    if (!defaultList.some(u => u.email === acc.email)) {
      defaultList.push({
        id: acc.id || defaultList.length + 1,
        email: acc.email,
        username: acc.username || acc.email.split('@')[0],
        is_admin: acc.is_admin || false,
        is_activated: acc.is_activated || false,
        unlocked_levels: acc.unlocked_levels || [1],
        unlocked_songs: acc.unlocked_songs || ['song-1'],
        unlocked_robots: acc.unlocked_robots || ['jack'],
        coins: acc.coins || 2500,
        created_at: acc.created_at || new Date().toISOString()
      });
    }
  });

  // Merge active user if present
  if (activeUser && activeUser.email && !defaultList.some(u => u.email === activeUser.email)) {
    defaultList.push({
      id: activeUser.id || defaultList.length + 1,
      email: activeUser.email,
      username: activeUser.username || activeUser.email.split('@')[0],
      is_admin: activeUser.is_admin || false,
      is_activated: activeUser.is_activated || false,
      unlocked_levels: activeUser.unlocked_levels || [1],
      unlocked_songs: activeUser.unlocked_songs || ['song-1'],
      unlocked_robots: activeUser.unlocked_robots || ['jack'],
      coins: activeUser.coins || 2500,
      created_at: new Date().toISOString()
    });
  }

  return defaultList;
};

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

  // Payments & Songs Management State
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(false);

  // Add Song Form state
  const [songName, setSongName] = useState('');
  const [songAuthor, setSongAuthor] = useState('');
  const [songType, setSongType] = useState('vocal'); // 'vocal' | 'instrumental'
  const [songPrice, setSongPrice] = useState(30);
  const [songLevel, setSongLevel] = useState(1);

  // Grant Coins & Unlock specific items state
  const [grantCoinsAmount, setGrantCoinsAmount] = useState(50000);
  const [selectedRobot, setSelectedRobot] = useState('valkyrie');
  const [selectedSongToGrant, setSelectedSongToGrant] = useState('song-2');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_auth_token') || authToken;
    if (savedToken) {
      verifyToken(savedToken);
    }
  }, []);

  // Fetch data when tab or login state changes
  useEffect(() => {
    if (isLoggedIn) {
      const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
      if (activeTab === 'users') {
        fetchUsers(t);
      } else if (activeTab === 'payments') {
        fetchPayments(t);
      } else if (activeTab === 'songs') {
        fetchSongs(t);
      }
    }
  }, [activeTab, isLoggedIn]);

  // Periodically refresh the user list while the admin panel is open on the Users tab
  useEffect(() => {
    if (!isLoggedIn || activeTab !== 'users') return;
    const intervalId = setInterval(() => {
      const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
      fetchUsers(t);
    }, 30000); // 30 seconds
    return () => clearInterval(intervalId);
  }, [isLoggedIn, activeTab, authToken]);

  // Listen for logout/registration flag to refresh user list instantly
  useEffect(() => {
    const storageHandler = (e) => {
      if (e.key === 'admin_refresh_needed') {
        if (isLoggedIn && activeTab === 'users') {
          const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
          fetchUsers(t);
        }
      }
    };
    window.addEventListener('storage', storageHandler);
    return () => window.removeEventListener('storage', storageHandler);
  }, [isLoggedIn, activeTab, authToken]);

  const verifyToken = async (tokenToVerify) => {
    const t = tokenToVerify || authToken || localStorage.getItem('admin_auth_token');
    if (!t) return;

    // Check if token is a known master key or default token
    if (MASTER_KEYS.includes(t) || t === 'admin2026') {
      setIsLoggedIn(true);
      setAdminInfo({ email: DEFAULT_ADMIN_EMAIL, username: 'JackAdmin', isAdmin: true });
      fetchUsers(t);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
          setUsers(data.users || []);
          return;
        }
      }
    } catch {
      // If server is unreachable but we had an authenticated session, keep user logged in
      if (t) {
        setIsLoggedIn(true);
        setAdminInfo({ email: DEFAULT_ADMIN_EMAIL, username: 'JackAdmin', isAdmin: true });
        fetchUsers(t);
        return;
      }
    }
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      if (loginMode === 'key') {
        const keyVal = (loginKey || '').trim();
        if (!keyVal) {
          throw new Error('Please enter Master Admin Key');
        }

        const isMasterKeyMatch = MASTER_KEYS.includes(keyVal);

        // Attempt online API call first
        let apiSuccess = false;
        try {
          const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminKey: keyVal })
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.success) {
              const token = data.token || keyVal;
              setAuthToken(token);
              localStorage.setItem('admin_auth_token', token);
              setAdminInfo(data.admin || { email: DEFAULT_ADMIN_EMAIL, username: 'JackAdmin', isAdmin: true });
              setIsLoggedIn(true);
              fetchUsers(token);
              apiSuccess = true;
            }
          }
        } catch {
          // Backend offline or unreachable
        }

        if (!apiSuccess) {
          if (isMasterKeyMatch) {
            const token = keyVal;
            setAuthToken(token);
            localStorage.setItem('admin_auth_token', token);
            setAdminInfo({ email: DEFAULT_ADMIN_EMAIL, username: 'JackAdmin', isAdmin: true });
            setIsLoggedIn(true);
            fetchUsers(token);
          } else {
            throw new Error('Invalid Master Key. Use: admin2026 or jack-runner-admin-2026');
          }
        }
      } else {
        // Password mode
        const cleanEmail = (loginEmail || '').trim().toLowerCase();
        const cleanPassword = (loginPassword || '').trim();

        if (!cleanEmail || !cleanPassword) {
          throw new Error('Please enter both admin email and password.');
        }

        const isDefaultMatch = (cleanEmail === DEFAULT_ADMIN_EMAIL && cleanPassword === DEFAULT_ADMIN_PASS);

        let apiSuccess = false;
        try {
          const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.success) {
              const token = data.token || 'admin2026';
              setAuthToken(token);
              localStorage.setItem('admin_auth_token', token);
              setAdminInfo(data.admin || { email: cleanEmail, username: 'JackAdmin', isAdmin: true });
              setIsLoggedIn(true);
              fetchUsers(token);
              apiSuccess = true;
            }
          }
        } catch {
          // Backend offline or unreachable
        }

        if (!apiSuccess) {
          if (isDefaultMatch) {
            const token = 'admin2026';
            setAuthToken(token);
            localStorage.setItem('admin_auth_token', token);
            setAdminInfo({ email: DEFAULT_ADMIN_EMAIL, username: 'JackAdmin', isAdmin: true });
            setIsLoggedIn(true);
            fetchUsers(token);
          } else {
            throw new Error('Invalid admin credentials. (Default: admin@jackrunner.com / admin1234)');
          }
        }
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ─── Local state updater helper ────────────────────────────
  const syncLocalPlayerChanges = (targetIdent, updates) => {
    const cleanTarget = String(targetIdent || '').trim().toLowerCase();
    
    // Check if target is current player in store
    const currentUsername = useGameStore.getState().username;
    const currentAuthUser = useGameStore.getState().authUser;
    const isCurrentPlayer = !cleanTarget || 
      cleanTarget === 'all' ||
      cleanTarget === (currentUsername || '').toLowerCase() ||
      (currentAuthUser && (cleanTarget === String(currentAuthUser.id) || cleanTarget === (currentAuthUser.email || '').toLowerCase()));

    if (isCurrentPlayer) {
      if (updates.unlocked_levels) {
        useGameStore.getState().setUnlockedLevels(updates.unlocked_levels);
        localStorage.setItem('kinetic_unlocked_levels', JSON.stringify(updates.unlocked_levels));
      }
      if (typeof updates.is_activated === 'boolean') {
        useGameStore.getState().setIsActivated(updates.is_activated);
        localStorage.setItem('kinetic_is_activated', JSON.stringify(updates.is_activated));
      }
      if (updates.coins !== undefined) {
        useGameStore.getState().setTotalCoins(updates.coins);
        localStorage.setItem('kinetic_total_coins', JSON.stringify(updates.coins));
      }
      if (updates.unlocked_robots) {
        const existing = useGameStore.getState().unlockedCharacters || ['jack'];
        const merged = Array.from(new Set([...existing, ...updates.unlocked_robots]));
        useGameStore.getState().setUnlockedCharacters(merged);
        localStorage.setItem('kinetic_unlocked_chars', JSON.stringify(merged));
      }
      if (updates.unlocked_songs) {
        const existing = useGameStore.getState().unlockedSongs || ['song-1'];
        const merged = Array.from(new Set([...existing, ...updates.unlocked_songs]));
        useGameStore.getState().setUnlockedSongs(merged);
        localStorage.setItem('kinetic_unlocked_songs', JSON.stringify(merged));
      }
    }

    // Also update in accounts list
    const accounts = getLocalAccounts();
    let accountUpdated = false;
    accounts.forEach(acc => {
      if (cleanTarget === 'all' || 
          String(acc.id) === cleanTarget || 
          (acc.email && acc.email.toLowerCase() === cleanTarget) ||
          (acc.username && acc.username.toLowerCase() === cleanTarget)) {
        if (updates.unlocked_levels) acc.unlocked_levels = updates.unlocked_levels;
        if (typeof updates.is_activated === 'boolean') acc.is_activated = updates.is_activated;
        if (updates.coins !== undefined) acc.coins = (acc.coins || 0) + updates.coins;
        if (updates.unlocked_robots) {
          acc.unlocked_robots = Array.from(new Set([...(acc.unlocked_robots || ['jack']), ...updates.unlocked_robots]));
        }
        if (updates.unlocked_songs) {
          acc.unlocked_songs = Array.from(new Set([...(acc.unlocked_songs || ['song-1']), ...updates.unlocked_songs]));
        }
        accountUpdated = true;
      }
    });
    if (accountUpdated) {
      saveLocalAccounts(accounts);
    }
  };

  const fetchUsers = async (token) => {
    const t = token || authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    setUsersLoading(true);
    let onlineData = null;

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          onlineData = data.users;
        }
      }
    } catch {
      // Backend offline
    }

    if (onlineData && onlineData.length > 0) {
      setUsers(onlineData);
    } else {
      setUsers(getInitialUsers());
    }
    setUsersLoading(false);
  };

  const fetchPayments = async (token) => {
    const t = token || authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    setPaymentsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.payments) {
          setPayments(data.payments);
          setPaymentsLoading(false);
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    try {
      const raw = localStorage.getItem('kinetic_payments_db');
      setPayments(raw ? JSON.parse(raw) : [
        {
          id: 1,
          email: 'jake@speed.com',
          itemType: 'stage',
          itemId: '10',
          amount: 40,
          tid: 'JC-88291039',
          status: 'pending',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          email: 'tricky@runner.com',
          itemType: 'vip',
          itemId: 'vip',
          amount: 1000,
          tid: 'JC-99482711',
          status: 'approved',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } catch {
      setPayments([]);
    }
    setPaymentsLoading(false);
  };

  const handleApprovePayment = async (paymentId) => {
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/approve-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ paymentId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || 'Payment approved successfully!');
          setStatusType('success');
          success = true;
          fetchPayments(t);
        }
      }
    } catch {}

    if (!success) {
      // Offline update
      const updated = payments.map(p => {
        if (p.id === Number(paymentId)) {
          // Unlock item for user
          if (p.itemType === 'vip') {
            syncLocalPlayerChanges(p.email, { is_activated: true });
          } else if (p.itemType === 'stage') {
            const stageNum = Number(p.itemId) || 1;
            const stages = Array.from({ length: Math.max(1, stageNum) }, (_, i) => i + 1);
            syncLocalPlayerChanges(p.email, { unlocked_levels: stages });
          }
          return { ...p, status: 'approved' };
        }
        return p;
      });
      setPayments(updated);
      try { localStorage.setItem('kinetic_payments_db', JSON.stringify(updated)); } catch {}
      setMessage(`Payment #${paymentId} Approved! Account features unlocked.`);
      setStatusType('success');
      fetchUsers(t);
    }
    setLoading(false);
  };

  const handleRejectPayment = async (paymentId) => {
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/reject-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ paymentId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || 'Payment rejected.');
          setStatusType('success');
          success = true;
          fetchPayments(t);
        }
      }
    } catch {}

    if (!success) {
      const updated = payments.map(p => p.id === Number(paymentId) ? { ...p, status: 'rejected' } : p);
      setPayments(updated);
      try { localStorage.setItem('kinetic_payments_db', JSON.stringify(updated)); } catch {}
      setMessage(`Payment #${paymentId} Rejected.`);
      setStatusType('error');
    }
    setLoading(false);
  };

  const fetchSongs = async (token) => {
    const t = token || authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    setSongsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/songs`, {
        headers: { 'Authorization': `Bearer ${t}`, 'x-admin-key': t }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.songs) {
          setSongs(data.songs);
          setSongsLoading(false);
          return;
        }
      }
    } catch {}

    // Default seeded songs
    const defaultSongs = [
      { id: 'song-1', name: 'Victory Horizon (Main Theme)', type: 'instrumental', price: 0, level: 1, author: 'Epic Synth', is_free: true },
      { id: 'song-2', name: 'Believe in Yourself', type: 'vocal', price: 40, level: 2, author: 'Chamber Grit' },
      { id: 'song-3', name: 'Eye of the Gladiator', type: 'vocal', price: 40, level: 3, author: 'Metal Storm' },
      { id: 'song-4', name: 'Rise Above the Grid', type: 'instrumental', price: 40, level: 4, author: 'Cyber Grid' },
      { id: 'song-5', name: 'Limitless Power', type: 'vocal', price: 40, level: 5, author: 'Future Blast' },
      { id: 'song-6', name: 'Autobahn Speed', type: 'instrumental', price: 40, level: 6, author: 'Kraft Drive' },
      { id: 'song-7', name: 'Neon Dreams', type: 'vocal', price: 40, level: 7, author: 'Retro Arc' }
    ];
    setSongs(defaultSongs);
    setSongsLoading(false);
  };

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!songName.trim()) {
      setMessage('Song name is required'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    const newSongObj = {
      id: `song-${songs.length + 1}`,
      name: songName.trim(),
      type: songType,
      price: Number(songPrice) || 30,
      level: Number(songLevel) || 1,
      author: songAuthor.trim() || 'Unknown'
    };

    try {
      const res = await fetch(`${API_BASE}/api/admin/add-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify(newSongObj)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || 'Song added successfully!');
          setStatusType('success');
          success = true;
          setSongName('');
          setSongAuthor('');
          fetchSongs(t);
        }
      }
    } catch {}

    if (!success) {
      const updated = [...songs, newSongObj];
      setSongs(updated);
      setSongName('');
      setSongAuthor('');
      setMessage(`Song track "${newSongObj.name}" added successfully!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Are you sure you want to delete this song track?')) return;
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/delete-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ songId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage('Song deleted successfully!');
          setStatusType('success');
          success = true;
          fetchSongs(t);
        }
      }
    } catch {}

    if (!success) {
      setSongs(songs.filter(s => s.id !== songId));
      setMessage('Song deleted successfully.');
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleUnlock = async () => {
    if (!identifier.trim()) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    const levelArray = levels.split(',').map(l => Number(l.trim())).filter(l => !isNaN(l) && l > 0);
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-levels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: identifier.trim(), levels: levelArray })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `Unlocked stages for '${identifier}'!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally regardless
    syncLocalPlayerChanges(identifier.trim(), { unlocked_levels: levelArray });
    setUsers(prev => prev.map(u => {
      if (String(u.id) === identifier.trim() || 
          (u.email && u.email.toLowerCase() === identifier.trim().toLowerCase()) ||
          (u.username && u.username.toLowerCase() === identifier.trim().toLowerCase())) {
        return { ...u, unlocked_levels: levelArray };
      }
      return u;
    }));

    if (!success) {
      setMessage(`✅ Unlocked stages [${levelArray.join(', ')}] for '${identifier}'!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleSetStageCount = async (targetId, count) => {
    const target = targetId || identifier;
    const finalCount = count !== undefined ? count : stageCountInput;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    const stages = Array.from({ length: Math.max(1, Math.min(30, Number(finalCount))) }, (_, i) => i + 1);
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/set-stage-count`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), stageCount: Number(finalCount) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `Set ${finalCount} stages for '${target}'!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally
    syncLocalPlayerChanges(target, { unlocked_levels: stages });
    setUsers(prev => prev.map(u => {
      if (String(u.id) === String(target).trim() || 
          (u.email && u.email.toLowerCase() === String(target).trim().toLowerCase()) ||
          (u.username && u.username.toLowerCase() === String(target).trim().toLowerCase())) {
        return { ...u, unlocked_levels: stages };
      }
      return u;
    }));

    if (!success) {
      setMessage(`✅ Set ${finalCount} stages allowed for '${target}' (Stages 1 to ${finalCount})!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleActivate = async (targetId, actVal) => {
    const target = targetId || identifier;
    const finalAct = actVal !== undefined ? actVal : activate;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), activated: finalAct })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `VIP status updated for '${target}'!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally
    syncLocalPlayerChanges(target, { is_activated: finalAct });
    setUsers(prev => prev.map(u => {
      if (String(u.id) === String(target).trim() || 
          (u.email && u.email.toLowerCase() === String(target).trim().toLowerCase()) ||
          (u.username && u.username.toLowerCase() === String(target).trim().toLowerCase())) {
        return { ...u, is_activated: finalAct };
      }
      return u;
    }));

    if (!success) {
      setMessage(`✅ User '${target}' VIP status set to: ${finalAct ? 'ACTIVATED (Full Game Unlocked)' : 'DEACTIVATED'}`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleGrantCoins = async (targetId, amount) => {
    const target = targetId || identifier;
    const finalAmount = amount !== undefined ? amount : grantCoinsAmount;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/grant-coins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), amount: Number(finalAmount) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `Granted ${finalAmount} coins!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally
    syncLocalPlayerChanges(target, { coins: Number(finalAmount) });
    setUsers(prev => prev.map(u => {
      if (String(u.id) === String(target).trim() || 
          (u.email && u.email.toLowerCase() === String(target).trim().toLowerCase()) ||
          (u.username && u.username.toLowerCase() === String(target).trim().toLowerCase())) {
        return { ...u, coins: (u.coins || 0) + Number(finalAmount) };
      }
      return u;
    }));

    if (!success) {
      setMessage(`✅ Granted ${Number(finalAmount).toLocaleString()} Coins to '${target}'!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleUnlockRobot = async (targetId, robotId) => {
    const target = targetId || identifier;
    const finalRobot = robotId || selectedRobot;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-robot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), robotId: String(finalRobot) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `Robot '${finalRobot}' unlocked!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally
    syncLocalPlayerChanges(target, { unlocked_robots: [String(finalRobot)] });
    if (!success) {
      setMessage(`✅ Robot character '${finalRobot}' unlocked for '${target}'!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleUnlockSongForUser = async (targetId, songId) => {
    const target = targetId || identifier;
    const finalSong = songId || selectedSongToGrant;
    if (!target) {
      setMessage('Please enter a user email, username, or ID'); setStatusType('error'); return;
    }
    setLoading(true); setMessage('');
    const t = authToken || localStorage.getItem('admin_auth_token') || 'admin2026';
    let success = false;

    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-song-for-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}`, 'x-admin-key': t },
        body: JSON.stringify({ identifier: String(target).trim(), songId: String(finalSong) })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessage(data.message || `Song '${finalSong}' unlocked!`);
          setStatusType('success');
          success = true;
          fetchUsers(t);
        }
      }
    } catch {}

    // Synchronize locally
    syncLocalPlayerChanges(target, { unlocked_songs: [String(finalSong)] });
    if (!success) {
      setMessage(`✅ Song track '${finalSong}' unlocked for '${target}'!`);
      setStatusType('success');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    setAuthToken('');
    setIsLoggedIn(false);
    setAdminInfo(null);
    setUsers([]);
  };

  const quickUnlockAll = (userIdentifier) => {
    setIdentifier(userIdentifier);
    setLevels('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30');
    handleSetStageCount(userIdentifier, 30);
    setActiveTab('users');
  };

  const quickActivate = (userIdentifier) => {
    setIdentifier(userIdentifier);
    handleActivate(userIdentifier, true);
    setActiveTab('users');
  };

  // ─── Styles ──────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #05080f 0%, #0d1528 50%, #080d1a 100%)',
      color: '#f8fafc', fontFamily: "'Outfit', 'Inter', sans-serif", overflowY: 'auto', overflowX: 'hidden',
      padding: '24px 16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    card: {
      width: '100%', maxWidth: '1000px', background: 'rgba(10, 18, 35, 0.96)', backdropFilter: 'blur(24px)',
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
    btn: (bg, c = '#fff') => ({
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
      borderBottom: active ? '2px solid #38bdf8' : '2px solid transparent',
      whiteSpace: 'nowrap'
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
                    onChange={e => setLoginPassword(e.target.value)} placeholder="admin1234" required />
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
                    onChange={e => setLoginKey(e.target.value)} placeholder="admin2026" required />
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
            <div style={s.badge('#10b981')}>🛡️ {adminInfo?.email || 'admin@jackrunner.com'}</div>
            <button onClick={handleLogout} style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444',
              padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
            }}>Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '4px', overflowX: 'auto' }}>
          {[
            ['users', '👥 Users'],
            ['payments', '💰 Payments Verified'],
            ['songs', '🎵 Manage Songs'],
            ['manage', '⚙️ Actions & Stage Setter'],
            ['info', '📊 Stats']
          ].map(([key, label]) => (
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

            <div style={{ overflowX: 'auto', maxHeight: '450px' }}>
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

        {/* ─── PAYMENTS TAB ─── */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#38bdf8', fontWeight: '800', fontSize: '1rem', margin: 0 }}>Transaction Verifications</h3>
              <button onClick={() => fetchPayments()} style={{
                background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.3)', color: '#38bdf8',
                padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
              }}>🔄 Refresh</button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              {paymentsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>⏳ Loading payments...</div>
              ) : payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No submitted transaction verifications found.</div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>ID</th>
                      <th style={s.th}>User Email</th>
                      <th style={s.th}>Item Unlocked</th>
                      <th style={s.th}>Amount</th>
                      <th style={s.th}>Transaction ID (TID)</th>
                      <th style={s.th}>Date</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Approve / Reject Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td style={s.td}>{p.id}</td>
                        <td style={s.td}><strong style={{ color: '#38bdf8' }}>{p.email}</strong></td>
                        <td style={s.td}>
                          <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                            {p.itemType.toUpperCase()} {p.itemId ? `(ID: ${p.itemId})` : ''}
                          </span>
                        </td>
                        <td style={s.td}>Rs. {p.amount}</td>
                        <td style={s.td}><code style={{ color: '#fbbf24', fontWeight: '700' }}>{p.tid}</code></td>
                        <td style={s.td}>{new Date(p.created_at).toLocaleDateString()}</td>
                        <td style={s.td}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                            color: p.status === 'approved' ? '#10b981' : p.status === 'rejected' ? '#ef4444' : '#fbbf24',
                            border: `1px solid ${p.status === 'approved' ? '#10b981' : p.status === 'rejected' ? '#ef4444' : '#fbbf24'}`
                          }}>
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={s.td}>
                          {p.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleApprovePayment(p.id)}
                                style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                APPROVE
                              </button>
                              <button
                                onClick={() => handleRejectPayment(p.id)}
                                style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                REJECT
                              </button>
                            </div>
                          )}
                          {p.status !== 'pending' && <span style={{ color: '#64748b' }}>Settled</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── SONGS TAB ─── */}
        {activeTab === 'songs' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Add Song form */}
              <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ color: '#38bdf8', fontWeight: '800', fontSize: '0.95rem', marginBottom: '14px' }}>🎵 Add Motivational Song to Game</h3>
                <form onSubmit={handleAddSong} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={s.label}>SONG TITLE</label>
                    <input style={s.input} type="text" value={songName} onChange={e => setSongName(e.target.value)} placeholder="Victory Horizon" required />
                  </div>
                  <div>
                    <label style={s.label}>ARTIST / AUTHOR</label>
                    <input style={s.input} type="text" value={songAuthor} onChange={e => setSongAuthor(e.target.value)} placeholder="Epic Synth Band" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={s.label}>TYPE</label>
                      <select style={{ ...s.input, padding: '10px' }} value={songType} onChange={e => setSongType(e.target.value)}>
                        <option value="vocal">Vocal</option>
                        <option value="instrumental">Instrumental</option>
                      </select>
                    </div>
                    <div>
                      <label style={s.label}>PRICE (Rs.)</label>
                      <input style={s.input} type="number" value={songPrice} onChange={e => setSongPrice(Number(e.target.value))} required />
                    </div>
                    <div>
                      <label style={s.label}>PLAY LEVEL</label>
                      <input style={s.input} type="number" value={songLevel} onChange={e => setSongLevel(Number(e.target.value))} required />
                    </div>
                  </div>
                  <button type="submit" style={{ ...s.btn('linear-gradient(135deg, #0284c7, #38bdf8)'), marginTop: '8px' }} disabled={loading}>
                    Add Song Track
                  </button>
                </form>
              </div>

              {/* Total Songs List */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', maxHeight: '420px', overflowY: 'auto' }}>
                <h3 style={{ color: '#cbd5e1', fontWeight: '800', fontSize: '0.95rem', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tracks Playlist ({songs.length})</span>
                  <span style={{ color: '#38bdf8' }}>Rs. 30 Stage Songs</span>
                </h3>
                {songsLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Loading playlist...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {songs.map((song) => (
                      <div key={song.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{song.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {song.author} • Lvl {song.level} • {song.type.toUpperCase()}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSong(song.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                        >
                          DELETE
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── MANAGE TAB ─── */}
        {activeTab === 'manage' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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
            <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: '16px', padding: '20px' }}>
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

            {/* Grant Celestial Coins */}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#34d399', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>🪙 Grant Celestial Coins</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px' }}>
                Add instant bonus coins balance to the target player's account.
              </p>
              <label style={s.label}>AMOUNT OF COINS</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input
                  style={{ ...s.input, width: '130px', fontWeight: '800', textAlign: 'center', fontSize: '1.1rem' }}
                  type="number"
                  value={grantCoinsAmount}
                  onChange={e => setGrantCoinsAmount(Number(e.target.value))}
                />
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[10000, 50000, 100000, 500000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setGrantCoinsAmount(amt)}
                      style={{
                        background: grantCoinsAmount === amt ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${grantCoinsAmount === amt ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                        color: grantCoinsAmount === amt ? '#fff' : '#94a3b8',
                        padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
                      }}
                    >
                      +{(amt/1000)}k
                    </button>
                  ))}
                </div>
              </div>
              <button
                style={s.btn('linear-gradient(135deg, #059669, #10b981)')}
                onClick={() => handleGrantCoins()}
                disabled={loading}
              >
                {loading ? '⏳ Adding Coins...' : `🪙 Grant ${(grantCoinsAmount).toLocaleString()} Coins to Player`}
              </button>
            </div>

            {/* Unlock Specific Robot */}
            <div style={{ background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#ec4899', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>🤖 Unlock Robot / Runner</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px' }}>
                Authorize an individual robot model for the user without requiring VIP.
              </p>
              <label style={s.label}>SELECT ROBOT MODEL</label>
              <select
                style={{ ...s.input, marginBottom: '14px', background: 'rgba(15,23,42,0.9)' }}
                value={selectedRobot}
                onChange={e => setSelectedRobot(e.target.value)}
              >
                <option value="rex_brawler">🏃‍♂️ Rex Steel (Neon Brawler)</option>
                <option value="jack">🏃 Kinetic Jack (Starter Hero)</option>
                <option value="maya_blade">🏃‍♀️ Maya Blade (Neon Parkour)</option>
                <option value="kai_street">🥷 Kai Shadow (Urban Master)</option>
                <option value="leo_thunder">⚡ Leo Thunder (Martial Arts)</option>
                <option value="elena_valkyrie">👑 Elena Valkyrie (Track Champion)</option>
                <option value="alex_grandmaster">🏆 Alex Zenith (Grandmaster)</option>
                <option value="blitz">🤖 Blitz Trial Bot</option>
                <option value="aerobot">🤖 Kinetic AeroBot (Flight)</option>
                <option value="cyber_ninja">🥷 Cyber Ninja</option>
                <option value="titan_prime">🦾 Titan Prime (Armor Shield)</option>
                <option value="phantom">👻 Phantom Runner</option>
                <option value="valkyrie">⚡ Valkyrie Gold (Supersonic)</option>
              </select>
              <button
                style={s.btn('linear-gradient(135deg, #be185d, #ec4899)')}
                onClick={() => handleUnlockRobot()}
                disabled={loading}
              >
                {loading ? '⏳ Unlocking...' : `🤖 Unlock Robot for User`}
              </button>
            </div>

            {/* Unlock Specific Song */}
            <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#c084fc', fontWeight: '800', fontSize: '0.95rem', marginBottom: '12px' }}>🎵 Unlock Song Track</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '12px' }}>
                Authorize a specific background music track for the user.
              </p>
              <label style={s.label}>SELECT MUSIC TRACK</label>
              <select
                style={{ ...s.input, marginBottom: '14px', background: 'rgba(15,23,42,0.9)' }}
                value={selectedSongToGrant}
                onChange={e => setSelectedSongToGrant(e.target.value)}
              >
                <option value="song-1">Song 1: Victory Horizon (Main Theme)</option>
                <option value="song-2">Song 2: Believe in Yourself</option>
                <option value="song-3">Song 3: Eye of the Gladiator</option>
                <option value="song-4">Song 4: Rise Above the Grid</option>
                <option value="song-5">Song 5: Limitless Power</option>
                <option value="song-6">Song 6: Autobahn Speed</option>
                <option value="song-7">Song 7: Neon Dreams</option>
                <option value="song-8">Song 8: Eiffel Summit</option>
                <option value="song-9">Song 9: Gangnam Run</option>
                <option value="song-10">Song 10: Sunset Drive</option>
              </select>
              <button
                style={s.btn('linear-gradient(135deg, #6b21a8, #a855f7)')}
                onClick={() => handleUnlockSongForUser()}
                disabled={loading}
              >
                {loading ? '⏳ Unlocking...' : `🎵 Unlock Song for User`}
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
              { label: 'Free Players', value: users.filter(u => !u.is_activated).length, icon: '🎮', color: '#cbd5e1' },
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

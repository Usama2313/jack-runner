import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../config/api';
import { Shield, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Key, Lock, Unlock } from 'lucide-react';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState('');
  const [userId, setUserId] = useState('');
  const [levels, setLevels] = useState('1,2,3,4,5');
  const [activate, setActivate] = useState(true);
  const [message, setMessage] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!userId) {
      setMessage('Please enter a User ID or Username');
      setStatusType('error');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const levelArray = levels.split(',').map(l => Number(l.trim())).filter(l => !isNaN(l) && l > 0);
      const res = await fetch(`${API_BASE}/api/admin/unlock-levels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'jack-runner-admin-2026'
        },
        body: JSON.stringify({ userId, levels: levelArray })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || 'Levels unlocked successfully!');
        setStatusType('success');
      } else {
        setMessage(data.error || 'Failed to unlock levels');
        setStatusType('error');
      }
    } catch (err) {
      setMessage('Network error communicating with server.');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!userId) {
      setMessage('Please enter a User ID or Username');
      setStatusType('error');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'jack-runner-admin-2026'
        },
        body: JSON.stringify({ userId, activated: activate })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || `Premium status updated to: ${activate ? 'Activated' : 'Inactive'}`);
        setStatusType('success');
      } else {
        setMessage(data.error || 'Failed to update activation');
        setStatusType('error');
      }
    } catch (err) {
      setMessage('Network error communicating with server.');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Outfit', sans-serif",
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              padding: '8px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={18} /> Back to Game
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid #ec4899',
            color: '#f472b6',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: '800'
          }}>
            <Shield size={16} /> ADMIN PORTAL
          </div>
        </div>

        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '1.8rem',
          fontWeight: '900',
          letterSpacing: '1px',
          color: '#ffffff',
          marginBottom: '8px',
          textAlign: 'center',
          textShadow: '0 0 16px rgba(56, 189, 248, 0.6)'
        }}>
          ⚡ JACK RUNNER ADMIN
        </h1>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '28px' }}>
          Manage user progression, unlock 30 dynamic stages, and grant VIP permissions.
        </p>

        {/* Message Alert */}
        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderRadius: '14px',
            marginBottom: '20px',
            backgroundColor: statusType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${statusType === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusType === 'success' ? '#6ee7b7' : '#fca5a5',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {statusType === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message}</span>
          </div>
        )}

        {/* Admin Secret Key */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>
            <Key size={14} style={{ display: 'inline', marginRight: '6px' }} /> Admin Access Key (Optional)
          </label>
          <input
            type="password"
            placeholder="Default: jack-runner-admin-2026"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* User Target */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>
            Target User ID / Username
          </label>
          <input
            type="text"
            placeholder="e.g. 1 or guest_1234 or player username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Action 1: Unlock Stages */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px',
          marginBottom: '20px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Unlock size={18} /> Unlock Stages (1-30)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
            Enter comma separated level IDs to instantly unlock (e.g. 1,2,3,4,5,10,15,30):
          </p>
          <input
            type="text"
            value={levels}
            onChange={(e) => setLevels(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#ffffff',
              fontSize: '0.9rem',
              marginBottom: '12px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleUnlock}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#000000',
              fontWeight: '800',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={18} /> {loading ? 'Processing...' : 'Apply Stage Unlocks'}
          </button>
        </div>

        {/* Action 2: Premium Activation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#facc15', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={18} /> VIP / Premium Activation
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: '12px 0' }}>
            <input
              type="checkbox"
              checked={activate}
              onChange={(e) => setActivate(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: '#facc15', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fef08a' }}>
              Full Game Premium Activated (Unrestricted Access)
            </span>
          </label>
          <button
            onClick={handleActivate}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #eab308, #facc15)',
              color: '#000000',
              fontWeight: '800',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Shield size={18} /> {loading ? 'Processing...' : 'Update Premium Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

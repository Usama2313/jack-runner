import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { API_BASE } from '../../config/api';
import { Lock, X, Check, Copy, Smartphone, Sparkles, Send, ShieldCheck } from 'lucide-react';

export const PaymentModal = () => {
  const showPaymentModal = useGameStore((s) => s.showPaymentModal);
  const setShowPaymentModal = useGameStore((s) => s.setShowPaymentModal);
  const setActivated = useGameStore((s) => s.setActivated);
  const isActivated = useGameStore((s) => s.isActivated);
  const authUser = useGameStore((s) => s.authUser);

  // Dynamic payment info from state store
  const paymentItemType = useGameStore((s) => s.paymentItemType) || 'vip';
  const paymentItemId = useGameStore((s) => s.paymentItemId);
  const paymentAmount = useGameStore((s) => s.paymentAmount) || 1000;

  const [tid, setTid] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(''); // '', 'submitting', 'submitted', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Sync email input with logged-in user
  useEffect(() => {
    if (authUser?.email) {
      setEmailInput(authUser.email);
    }
  }, [authUser]);

  if (!showPaymentModal) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+923211808390');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalEmail = authUser?.email || emailInput.trim();
    if (!finalEmail || !finalEmail.includes('@')) {
      setStatus('error');
      setErrorMessage('❌ Please enter a valid registered email address.');
      return;
    }
    if (!tid.trim() || tid.trim().length < 6) {
      setStatus('error');
      setErrorMessage('❌ Please enter a valid Transaction ID (minimum 6 characters).');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(`${API_BASE}/api/auth/submit-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail.toLowerCase(),
          itemType: paymentItemType,
          itemId: paymentItemId,
          amount: paymentAmount,
          tid: tid.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit payment');
      
      setStatus('submitted');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || '❌ Network error submitting TID verification.');
    }
  };

  const handleDemoBypass = () => {
    if (paymentItemType === 'vip') {
      setActivated(true);
    } else if (paymentItemType === 'stage') {
      const unlocked = useGameStore.getState().unlockedLevels || [1];
      const newUnlocked = Array.from(new Set([...unlocked, Number(paymentItemId)]));
      useGameStore.setState({ unlockedLevels: newUnlocked });
      localStorage.setItem('kinetic_unlocked_levels', JSON.stringify(newUnlocked));
    } else if (paymentItemType === 'song') {
      const unlocked = useGameStore.getState().unlockedSongs || ['song-1'];
      const newUnlocked = Array.from(new Set([...unlocked, String(paymentItemId)]));
      useGameStore.setState({ unlockedSongs: newUnlocked });
      localStorage.setItem('kinetic_unlocked_songs', JSON.stringify(newUnlocked));
    } else if (paymentItemType === 'character') {
      const unlocked = useGameStore.getState().unlockedCharacters || ['jack'];
      const newUnlocked = Array.from(new Set([...unlocked, String(paymentItemId)]));
      useGameStore.setState({ unlockedCharacters: newUnlocked, selectedCharacter: String(paymentItemId) });
      localStorage.setItem('kinetic_unlocked_chars', JSON.stringify(newUnlocked));
      localStorage.setItem('kinetic_selected_char', String(paymentItemId));
    }
    setShowPaymentModal(false);
    setStatus('');
    setTid('');
  };

  // Get item display name
  const getItemName = () => {
    if (paymentItemType === 'stage') return `Stage ${paymentItemId} Access — Rs. 40`;
    if (paymentItemType === 'song') return `Background Song Unlock — Rs. 30`;
    if (paymentItemType === 'character') return `Premium Robot Unlock — Rs. 40`;
    return 'Full VIP Game Activation';
  };

  return (
    <div className="modal-backdrop payment-modal-backdrop" onClick={() => setShowPaymentModal(false)}>
      <div className="modal-container payment-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header payment-header">
          <div className="modal-title-row">
            <Lock size={24} className="lock-pulse-icon" />
            <h2>{paymentItemType === 'vip' ? 'PREMIUM ACTIVATION REQUIRED' : 'ITEM UNLOCK REQUIRED'}</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="payment-body">
          <div className="trial-badge-container">
            <span className="trial-badge">JazzCash Payment Gateway</span>
          </div>

          <p className="payment-desc">
            You are unlocking <strong>{getItemName()}</strong>. 
            Send the exact payment to our official JazzCash account to authorize access.
          </p>

          {/* Payment Card Info */}
          <div className="jazzcash-card">
            <div className="jc-logo-row">
              <span className="jc-brand">JazzCash Mobile</span>
              <span className="jc-fee">Rs. {paymentAmount.toLocaleString()} Only</span>
            </div>

            <div className="jc-instructions">
              <p>Transfer <strong>Rs. {paymentAmount.toLocaleString()}</strong> to the following JazzCash Mobile Account:</p>
              
              <div className="account-number-box">
                <span className="account-label">ACCOUNT NUMBER:</span>
                <div className="account-action-row">
                  <strong className="account-number">+92 321 1808390</strong>
                  <button className="copy-btn" onClick={handleCopyNumber}>
                    {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="holder-row">
                <span>Account Title: <strong>Syed Usama</strong></span>
              </div>
            </div>
          </div>

          {/* Transaction Verification Form */}
          {status !== 'submitted' ? (
            <form className="activation-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!authUser && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>Registered Account Email:</label>
                  <input
                    type="email"
                    placeholder="e.g. yourname@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="tid-input"
                    style={{ width: '100%', marginBottom: '6px' }}
                    required
                  />
                </div>
              )}
              {authUser && (
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                  Logged-in User Account: <strong style={{ color: '#6ee7b7' }}>{authUser.email}</strong>
                </div>
              )}
              
              <label className="form-label">Enter JazzCash Transaction ID (TID):</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="e.g. 023456789123"
                  value={tid}
                  onChange={(e) => setTid(e.target.value)}
                  className="tid-input"
                  required
                />
                <button type="submit" className="submit-tid-btn" disabled={status === 'submitting'}>
                  <Send size={16} />
                  <span>{status === 'submitting' ? 'Verifying...' : 'Submit Verification'}</span>
                </button>
              </div>
              
              {status === 'error' && (
                <p className="error-message" style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>{errorMessage}</p>
              )}
              <p className="form-note">
                * Submit the TID. Admin will verify the transaction and unlock your item in the panel instantly!
              </p>
            </form>
          ) : (
            <div className="activation-success-card">
              <ShieldCheck size={42} color="#10b981" />
              <h3>Verification Request Sent!</h3>
              <p>
                Your TID is submitted for verification. The admin will verify the payment and authorize your email address shortly. 
                For testing/review, click below to bypass and activate instantly!
              </p>
            </div>
          )}

          {/* Tester/Bypass Row */}
          <div className="tester-action-row">
            <button className="demo-bypass-btn" onClick={handleDemoBypass}>
              <Sparkles size={16} />
              <span>Simulate Admin Activation (Free Demo)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

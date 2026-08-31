import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { API_BASE } from '../../config/api';
import { Lock, X, Check, Copy, Send, ShieldCheck, MessageCircle } from 'lucide-react';

export const PaymentModal = () => {
  const showPaymentModal = useGameStore((s) => s.showPaymentModal);
  const setShowPaymentModal = useGameStore((s) => s.setShowPaymentModal);
  const authUser = useGameStore((s) => s.authUser);

  // Dynamic payment info from state store
  const paymentItemType = useGameStore((s) => s.paymentItemType) || 'vip';
  const paymentItemId = useGameStore((s) => s.paymentItemId);
  const paymentAmount = useGameStore((s) => s.paymentAmount) || 40;

  const [tid, setTid] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(''); // '', 'submitting', 'submitted', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Sync email input with logged-in user
  useEffect(() => {
    if (authUser?.email) {
      setEmailInput(authUser.email);
    }
  }, [authUser]);

  // Generate unique reference number on mount
  useEffect(() => {
    if (showPaymentModal) {
      const ref = 'KJ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setReferenceNumber(ref);
      setStatus('');
      setTid('');
      setErrorMessage('');
    }
  }, [showPaymentModal]);

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
      const url = API_BASE ? `${API_BASE}/api/auth/submit-payment` : '/api/auth/submit-payment';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: finalEmail.toLowerCase(),
          itemType: paymentItemType,
          itemId: paymentItemId,
          amount: paymentAmount,
          tid: tid.trim(),
          referenceNumber: referenceNumber
        })
      });

      const rawText = await res.text();
      let data = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = null;
      }

      if (res.ok && (!data || !data.error)) {
        setStatus('submitted');
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        // Fallback: save payment record to localStorage
        try {
          const raw = localStorage.getItem('kinetic_local_payments') || '[]';
          const arr = JSON.parse(raw);
          arr.push({
            id: 'pay_' + Date.now(),
            email: finalEmail.toLowerCase(),
            itemType: paymentItemType,
            itemId: paymentItemId,
            amount: paymentAmount,
            tid: tid.trim(),
            referenceNumber,
            created_at: new Date().toISOString(),
            status: 'pending'
          });
          localStorage.setItem('kinetic_local_payments', JSON.stringify(arr));
        } catch {}
        setStatus('submitted');
      }
    } catch (err) {
      // If network failed, still record submission locally so reference number is preserved
      try {
        const raw = localStorage.getItem('kinetic_local_payments') || '[]';
        const arr = JSON.parse(raw);
        arr.push({
          id: 'pay_' + Date.now(),
          email: finalEmail.toLowerCase(),
          itemType: paymentItemType,
          itemId: paymentItemId,
          amount: paymentAmount,
          tid: tid.trim(),
          referenceNumber,
          created_at: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem('kinetic_local_payments', JSON.stringify(arr));
        setStatus('submitted');
      } catch {
        setStatus('error');
        setErrorMessage(err.message || '❌ Network error submitting TID verification.');
      }
    }
  };

  // Get item display name
  const getItemName = () => {
    if (paymentItemType === 'stage') return `Stage ${paymentItemId} Access`;
    if (paymentItemType === 'song') return `Background Song Unlock`;
    if (paymentItemType === 'character') return `Premium Robot Unlock`;
    return 'Full VIP Game Activation';
  };

  const getPrice = () => {
    if (paymentItemType === 'vip') return 1000;
    return 40;
  };

  const actualPrice = getPrice();

  // WhatsApp message with reference
  const whatsappMessage = encodeURIComponent(
    `Hi! I've made a payment for Kinetic Jack Runner.\n\nItem: ${getItemName()}\nAmount: Rs. ${actualPrice}\nReference #: ${referenceNumber}\nTID: ${tid || '(pending)'}\nEmail: ${authUser?.email || emailInput || '(not set)'}\n\nPlease verify and activate my account.`
  );

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
            You are unlocking <strong>{getItemName()} — Rs. {actualPrice}</strong>. 
            Send the exact payment to our official JazzCash account to authorize access.
          </p>

          {/* Reference Number Display */}
          <div className="reference-number-box">
            <span className="ref-label">YOUR REFERENCE #</span>
            <span className="ref-number">{referenceNumber}</span>
            <span className="ref-note">Save this reference number! Include it when sending screenshot.</span>
          </div>

          {/* Payment Card Info */}
          <div className="jazzcash-card">
            <div className="jc-logo-row">
              <span className="jc-brand">JazzCash Mobile</span>
              <span className="jc-fee">Rs. {actualPrice.toLocaleString()} Only</span>
            </div>

            <div className="jc-instructions">
              <p>Transfer <strong>Rs. {actualPrice.toLocaleString()}</strong> to the following JazzCash Mobile Account:</p>
              
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

          {/* WhatsApp Screenshot Section */}
          <div className="whatsapp-section">
            <div className="whatsapp-title">
              <MessageCircle size={18} />
              <span>Send Payment Screenshot via WhatsApp</span>
            </div>
            <div className="whatsapp-buttons">
              <a 
                href={`https://wa.me/97332377688?text=${whatsappMessage}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                📱 +973 3237 7688
              </a>
              <a 
                href={`https://wa.me/923211808390?text=${whatsappMessage}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                📱 +92 321 1808390
              </a>
            </div>
            <p className="whatsapp-note">Include your Reference # <strong>{referenceNumber}</strong> with the screenshot</p>
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
                * Submit the TID. Admin will verify the transaction and unlock your item via the dashboard.
              </p>
            </form>
          ) : (
            <div className="activation-success-card">
              <ShieldCheck size={42} color="#10b981" />
              <h3>Verification Request Sent!</h3>
              <p>
                Your TID and Reference # <strong>{referenceNumber}</strong> have been submitted for verification. 
                The admin will verify the payment and authorize your account shortly.
              </p>
              <p style={{ color: '#facc15', fontWeight: '700', marginTop: '8px' }}>
                📱 Don't forget to send the payment screenshot on WhatsApp!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

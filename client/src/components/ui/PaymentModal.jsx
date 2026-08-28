import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Lock, X, Check, Copy, Smartphone, Sparkles, Send, ShieldCheck } from 'lucide-react';

export const PaymentModal = () => {
  const showPaymentModal = useGameStore((s) => s.showPaymentModal);
  const setShowPaymentModal = useGameStore((s) => s.setShowPaymentModal);
  const setActivated = useGameStore((s) => s.setActivated);
  const isActivated = useGameStore((s) => s.isActivated);

  const [tid, setTid] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState(''); // 'submitting', 'submitted', 'error'

  if (!showPaymentModal) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('+923211808390');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tid.trim() || tid.length < 6) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setTimeout(() => {
      setStatus('submitted');
    }, 1500);
  };

  const handleDemoBypass = () => {
    setActivated(true);
    setShowPaymentModal(false);
    setStatus('');
    setTid('');
  };

  return (
    <div className="modal-backdrop payment-modal-backdrop" onClick={() => setShowPaymentModal(false)}>
      <div className="modal-container payment-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header payment-header">
          <div className="modal-title-row">
            <Lock size={24} className="lock-pulse-icon" />
            <h2>PREMIUM ACTIVATION REQUIRED</h2>
          </div>
          <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="payment-body">
          <div className="trial-badge-container">
            <span className="trial-badge">TRIAL VERSION LIMIT REACHED</span>
          </div>

          <p className="payment-desc">
            You are playing the trial version of <strong>Kinetic Jack 3D</strong>. 
            To unlock all <strong>30 stages</strong>, <strong>20 custom robots</strong>, and play for free indefinitely, please submit the one-time registration fee.
          </p>

          {/* Payment Card Info */}
          <div className="jazzcash-card">
            <div className="jc-logo-row">
              <span className="jc-brand">JazzCash</span>
              <span className="jc-fee">Rs. 1,000 Only</span>
            </div>

            <div className="jc-instructions">
              <p>Transfer <strong>Rs. 1,000</strong> to the following JazzCash Mobile Account:</p>
              
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
            <form className="activation-form" onSubmit={handleSubmit}>
              <label className="form-label">Enter Transaction ID (TID):</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="e.g. 023456789123"
                  value={tid}
                  onChange={(e) => setTid(e.target.value)}
                  className="tid-input"
                />
                <button type="submit" className="submit-tid-btn" disabled={status === 'submitting'}>
                  <Send size={16} />
                  <span>{status === 'submitting' ? 'Verifying...' : 'Submit Verification'}</span>
                </button>
              </div>
              {status === 'error' && (
                <p className="error-message">❌ Please enter a valid Transaction ID.</p>
              )}
              <p className="form-note">
                * Transact Rs. 1000 fee. Admin will verify the TID and approve your access to play for free.
              </p>
            </form>
          ) : (
            <div className="activation-success-card">
              <ShieldCheck size={42} color="#10b981" />
              <h3>Verification Request Sent!</h3>
              <p>
                Your TID is submitted. The admin will verify the payment and authorize your device. 
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

import React, { useState, useEffect, useRef } from 'react';

const GAME_TIPS = [
  { icon: '🔥', text: 'FIRE PILLAR ahead! Use Plasma Shield or jump over!', color: '#ef4444' },
  { icon: '💧', text: 'WATER SURGE! Jump HIGH to clear the wave!', color: '#38bdf8' },
  { icon: '🌪️', text: 'TORNADO! Switch lane NOW to escape the vortex!', color: '#a855f7' },
  { icon: '⚡', text: 'THUNDER STRIKE! Only Plasma Shield can destroy it!', color: '#facc15' },
  { icon: '🏜️', text: 'SAND STORM! Roll under the cyclone cloud!', color: '#f97316' },
  { icon: '🤖', text: 'Robot Destroyer is close! Speed up and dodge!', color: '#ec4899' },
  { icon: '🧲', text: 'Ring Magnet active — coins pulling in from all lanes!', color: '#38bdf8' },
  { icon: '🚀', text: 'Jetpack ignited! Soaring above obstacles!', color: '#ec4899' },
  { icon: '🛹', text: 'Plasma Board active — one free crash protection!', color: '#8b5cf6' },
  { icon: '🔧', text: 'Nano Repair Kit used! Armor restored — 6s shield!', color: '#34d399' },
  { icon: '💡', text: 'Tip: Collect rings to fill your powerup meter faster!', color: '#fbbf24' },
  { icon: '💡', text: 'Tip: Switch lanes early to avoid oncoming obstacles!', color: '#fbbf24' },
  { icon: '💡', text: 'Tip: VIP players unlock all robots and gifts!', color: '#fbbf24' },
  { icon: '💡', text: 'Tip: Higher stages = faster speed and bigger rewards!', color: '#fbbf24' },
];

let toasterCallbacks = [];
let toasterIdCounter = 0;

export const triggerToast = (text, icon = '💡', color = '#38bdf8', duration = 3500) => {
  const toast = { id: ++toasterIdCounter, text, icon, color, duration };
  toasterCallbacks.forEach(cb => cb(toast));
};

export const Toaster = () => {
  const [toasts, setToasts] = useState([]);
  const cbRef = useRef(null);

  useEffect(() => {
    const cb = (toast) => {
      setToasts(prev => [...prev.slice(-4), toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, toast.duration);
    };
    cbRef.current = cb;
    toasterCallbacks.push(cb);
    return () => {
      toasterCallbacks = toasterCallbacks.filter(c => c !== cbRef.current);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 8888, display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '8px', pointerEvents: 'none', width: '90%', maxWidth: '420px'
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(5,10,25,0.95)', backdropFilter: 'blur(16px)',
          border: `1px solid ${toast.color}60`, borderRadius: '14px',
          padding: '10px 16px', width: '100%', boxSizing: 'border-box',
          boxShadow: `0 4px 20px rgba(0,0,0,0.6), 0 0 15px ${toast.color}20`,
          animation: 'toastSlideIn 0.3s ease-out',
          borderLeft: `3px solid ${toast.color}`
        }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{toast.icon}</span>
          <span style={{
            color: '#e2e8f0', fontSize: '0.85rem', fontWeight: '600', lineHeight: '1.4',
            fontFamily: "'Outfit', sans-serif"
          }}>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};

export default Toaster;

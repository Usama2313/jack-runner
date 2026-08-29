import React, { useState } from 'react';

const HOW_TO_PLAY = [
  {
    icon: '🏃',
    title: 'Running & Controls',
    color: '#38bdf8',
    tips: [
      '📱 Mobile: Swipe LEFT/RIGHT to change lanes, swipe UP to jump, swipe DOWN to slide/roll',
      '⌨️ PC: Arrow Keys or WASD — Left/Right to switch lanes, Up/Space to jump, Down/S to roll',
      '🎮 D-Pad: Tap on-screen arrows (hidden in landscape mobile view)',
      'You automatically run forward — dodge everything in your path!'
    ]
  },
  {
    icon: '🚧',
    title: 'Standard Hurdles',
    color: '#facc15',
    tips: [
      '🚂 TRAIN: Dodge by switching lanes — fastest moving obstacle!',
      '🚌 BUS: Switch lane or jump over low buses',
      '🏍️ MOTORBIKE: Weave through or jump',
      '🔲 LOW BARRIER: Jump over it',
      '🔲 HIGH BARRIER: Roll/Slide under it',
      '⚙️ CONSTRUCTION: Any direction dodge works'
    ]
  },
  {
    icon: '🔥',
    title: 'Elemental Hurdles (DANGER!)',
    color: '#ef4444',
    tips: [
      '🔥 FIRE PILLAR: Jump over or activate Plasma Shield/Kinetic Blaster to destroy it',
      '💧 WATER SURGE: Jump UP high over the wave — sliding into it causes damage',
      '🏜️ SAND STORM: Roll/slide UNDER the storm cloud — jumping into it damages you',
      '🌪️ TORNADO: Switch lane AWAY quickly — it pulls you in if you\'re too close',
      '⚡ THUNDER STRIKE: ONLY a Plasma Shield or Kinetic Blaster destroys it — otherwise dodge!',
      '⚠️ WARNING: Elemental hurdles are 2-hit destroyers — see Robot Damage below!'
    ]
  },
  {
    icon: '🤖',
    title: '2-Hit Robot Destruction',
    color: '#f97316',
    tips: [
      '💥 HIT 1 (Any hurdle): Your robot\'s armor CRACKS — sparks fly, you stumble, speed drops',
      '🚨 HIT 2 (While stumbling): The Robot Destroyer INTERCEPTS and BREAKS your robot — GAME OVER',
      '🔧 Collect the NANO REPAIR KIT (🔧) gift to instantly fix your cracked armor!',
      '🛡️ A PLASMA BOARD absorbs 1 hit — acts as your safety armor layer',
      'The Robot Destroyer always trails behind you — avoid being caught!'
    ]
  },
  {
    icon: '⚡',
    title: 'Robot Powers & Gifts',
    color: '#a855f7',
    tips: [
      '🧲 RING MAGNET: Auto-collects all coins from all 3 lanes',
      '🚀 KINETIC JETPACK: Fly above all obstacles for 8 seconds',
      '⚡ 2X SCORE BOOST: Double all points for 14 seconds',
      '👟 KINETIC THRUSTERS: Jump 50% higher to clear tall obstacles',
      '🛹 PLASMA BOARD: Absorbs 1 crash — your safety net!',
      '🔧 NANO REPAIR KIT: Fixes cracked armor + 6s invulnerability',
      '🛡️ PLASMA SHIELD: Creates force field — DESTROYS elemental hurdles on contact!',
      '💥 KINETIC BLASTER: Fires energy — SMASHES through Fire, Water, Sand, Tornado & Thunder!'
    ]
  },
  {
    icon: '🎁',
    title: 'Mystery Boxes & Gifts',
    color: '#ec4899',
    tips: [
      '📦 Collect glowing Mystery Boxes during your run',
      '🔓 VIP players unlock ALL gifts for free — Free players need to pay to open premium boxes',
      '🧠 Some boxes contain AI General Knowledge Questions — answer to earn bonus coins!',
      '🎁 Free players can open 1 gift box per run, VIP gets unlimited',
      'Mystery boxes appear more frequently on higher stages'
    ]
  },
  {
    icon: '🤖',
    title: 'Robots & Unlocking',
    color: '#34d399',
    tips: [
      '🆓 FREE ROBOTS: Jack (Kinetic Pioneer), Neon Striker, Blitz Runner — free for all!',
      '💰 PREMIUM ROBOTS (17 total): Require VIP activation or admin unlock',
      '⭐ Get VIP: Complete the payment via JazzCash or ask the admin to activate your account',
      'Each robot has unique stat bonuses — higher-tier robots have better abilities!'
    ]
  },
  {
    icon: '🗺️',
    title: 'Stages & Progression',
    color: '#fbbf24',
    tips: [
      '🌏 30 World Stages: Tokyo → New York → Dubai → Space Singularity',
      '🔐 Stage 1 is free — all higher stages require VIP or admin stage unlock',
      '⬆️ Each stage increases speed, adds more complex obstacle patterns',
      '🏆 Complete stages to earn bonus coins and unlock new biomes',
      'Admin can unlock any stages for you — contact via the Admin Panel'
    ]
  },
  {
    icon: '🏆',
    title: 'Score & Leaderboard',
    color: '#38bdf8',
    tips: [
      '📊 Score = Distance × Multiplier + Coins Collected',
      '⚡ Using 2X Boost powerup doubles ALL points earned',
      '🏅 Your best score is saved and uploaded to the global leaderboard',
      '🔗 Login with email to sync scores online and compete worldwide',
      'Challenge friends — share your leaderboard rank!'
    ]
  }
];

export const HelpModal = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState(0);

  const s = {
    backdrop: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '12px'
    },
    modal: {
      width: '100%', maxWidth: '680px', maxHeight: '90vh',
      background: 'linear-gradient(160deg, #070e1f 0%, #0d1a2e 100%)',
      border: '1px solid rgba(56,189,248,0.3)', borderRadius: '22px', overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(56,189,248,0.1)',
      display: 'flex', flexDirection: 'column'
    },
    header: {
      padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0
    },
    title: {
      fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.3rem)',
      fontWeight: '900', color: '#fff', letterSpacing: '1px',
      textShadow: '0 0 20px rgba(56,189,248,0.4)'
    },
    closeBtn: {
      background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444',
      width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
      flexShrink: 0
    },
    tabs: {
      display: 'flex', overflowX: 'auto', gap: '6px', padding: '16px 20px 0',
      flexShrink: 0, scrollbarWidth: 'thin'
    },
    tab: (active, color) => ({
      padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700',
      fontSize: '0.8rem', border: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
      background: active ? `${color}25` : 'rgba(255,255,255,0.04)',
      color: active ? color : '#64748b',
      boxShadow: active ? `0 0 12px ${color}30` : 'none',
      borderBottom: active ? `2px solid ${color}` : '2px solid transparent'
    }),
    content: {
      flex: 1, overflowY: 'auto', overflowX: 'auto', padding: '20px 24px 24px'
    },
    section: (color) => ({
      background: `${color}08`, border: `1px solid ${color}25`, borderRadius: '16px', padding: '20px'
    }),
    sectionTitle: (color) => ({
      fontSize: '1.05rem', fontWeight: '900', color: color, marginBottom: '14px',
      display: 'flex', alignItems: 'center', gap: '10px'
    }),
    tip: {
      display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 12px', marginBottom: '8px',
      background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.88rem',
      color: '#cbd5e1', lineHeight: '1.5'
    }
  };

  const section = HOW_TO_PLAY[activeSection];

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <span style={s.title}>📖 HOW TO PLAY — JACK RUNNER</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.tabs}>
          {HOW_TO_PLAY.map((sec, i) => (
            <button key={i} style={s.tab(activeSection === i, sec.color)} onClick={() => setActiveSection(i)}>
              {sec.icon} {sec.title.split(' ')[0]}
            </button>
          ))}
        </div>

        <div style={s.content}>
          <div style={s.section(section.color)}>
            <div style={s.sectionTitle(section.color)}>
              <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
              {section.title}
            </div>
            {section.tips.map((tip, i) => (
              <div key={i} style={s.tip}>
                <span style={{ marginTop: '1px', flexShrink: 0 }}>›</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              style={{
                background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)',
                color: activeSection === 0 ? '#334155' : '#38bdf8', padding: '8px 18px',
                borderRadius: '10px', cursor: activeSection === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '0.9rem'
              }}
            >← Prev</button>
            <span style={{ color: '#475569', fontSize: '0.85rem', alignSelf: 'center' }}>
              {activeSection + 1} / {HOW_TO_PLAY.length}
            </span>
            <button
              onClick={() => setActiveSection(Math.min(HOW_TO_PLAY.length - 1, activeSection + 1))}
              disabled={activeSection === HOW_TO_PLAY.length - 1}
              style={{
                background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)',
                color: activeSection === HOW_TO_PLAY.length - 1 ? '#334155' : '#38bdf8', padding: '8px 18px',
                borderRadius: '10px', cursor: activeSection === HOW_TO_PLAY.length - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '0.9rem'
              }}
            >Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

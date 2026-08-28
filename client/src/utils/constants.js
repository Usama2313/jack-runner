export const GAME_STATES = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE'
};

// 3 Lanes: Left (-2.6), Center (0), Right (2.6)
export const LANES = {
  LEFT: -2.6,
  CENTER: 0,
  RIGHT: 2.6
};

export const LANE_INDICES = [-1, 0, 1];
export const LANE_WIDTH = 2.6;

// Speeds & Physics
export const INITIAL_SPEED = 25.0;
export const MAX_SPEED = 78.0;
export const SPEED_ACCELERATION = 0.35; // Speed increase per 100 meters
export const JETPACK_SPEED_MULTIPLIER = 1.45; // Supersonic speed boost on jetpack!

export const NUM_SECTIONS = 1;
export const JUMP_HEIGHT = 3.6;
export const JUMP_DURATION = 0.58; // seconds
export const ROLL_DURATION = 0.62; // seconds

export const PLAYER_Y_BASE = 0.75;
export const PLAYER_RADIUS = 0.55;
export const PLAYER_HEIGHT = 1.6;

// Track Generation
export const CHUNK_LENGTH = 70;
export const VISIBLE_CHUNKS = 4; // Smooth track buffer
export const DESPAWN_Z = 20;

// Robot Destroyer Pursuer Settings
export const CHASER_CONFIG = {
  NORMAL_DISTANCE: 7.5,    // Normal trailing distance behind player (in meters)
  CLOSE_DISTANCE: 2.2,     // Distance when player stumbles on a hurdle
  CAPTURE_DISTANCE: 1.1,   // Distance at which player is captured
  STUMBLE_DURATION: 3.8,   // Seconds the chaser stays aggressively close
  APPROACH_SPEED: 22.0,    // Speed at which chaser surges forward
  RETREAT_SPEED: 2.5       // Speed at which chaser recedes back
};

// Powerup types
export const POWERUP_TYPES = {
  MAGNET: 'MAGNET',
  JETPACK: 'JETPACK',
  MULTIPLIER_2X: 'MULTIPLIER_2X',
  SUPER_SNEAKERS: 'SUPER_SNEAKERS',
  HOVERBOARD: 'HOVERBOARD'
};

export const POWERUP_CONFIG = {
  [POWERUP_TYPES.MAGNET]: {
    name: 'Ring Magnet',
    duration: 10,
    color: '#38bdf8',
    icon: '🧲',
    description: 'Pulls in all celestial rings from all lanes & sky'
  },
  [POWERUP_TYPES.JETPACK]: {
    name: 'Kinetic Jetpack',
    duration: 8,
    color: '#ec4899',
    icon: '🚀',
    description: 'Supersonic flight (+45% Speed) soaring high above ground hazards'
  },
  [POWERUP_TYPES.MULTIPLIER_2X]: {
    name: '2X Score Boost',
    duration: 14,
    color: '#eab308',
    icon: '⚡',
    description: 'Doubles all score and celestial ring points'
  },
  [POWERUP_TYPES.SUPER_SNEAKERS]: {
    name: 'Kinetic Thrusters',
    duration: 12,
    color: '#10b981',
    icon: '👟',
    description: 'High-jump booster to leap easily over tall obstacles'
  },
  [POWERUP_TYPES.HOVERBOARD]: {
    name: 'Plasma Board',
    duration: 25,
    color: '#8b5cf6',
    icon: '🛹',
    description: 'Absorbs 1 collision crash and prevents robot capture'
  }
};

// Realistic Vehicles, City Obstacles & Biome Hurdles
export const OBSTACLE_TYPES = {
  TRAIN: 'TRAIN',                       // High-speed Cyber Express Bullet Train
  BUS: 'BUS',                           // Double-decker Cyber City Transit Bus
  MOTORBIKE: 'MOTORBIKE',               // Cyber Superbike / Motorcycle
  BARRIER_LOW: 'BARRIER_LOW',           // Low Roadblock Guardrail (Jump over)
  BARRIER_HIGH: 'BARRIER_HIGH',         // Overhead Overhead Traffic Sign / Arch (Slide under)
  CONCRETE_BARRIER: 'CONCRETE_BARRIER', // Concrete Highway K-Rail Barricade
  CONSTRUCTION: 'CONSTRUCTION',         // Flashing Highway Caution Barrier
  // Biome-specific futuristic hurdles:
  TESLA_COIL: 'TESLA_COIL',             // Electric pulsating arc tower
  MAGMA_PYLON: 'MAGMA_PYLON',           // Molten volcanic fissure vent
  PLASMA_WALL: 'PLASMA_WALL',           // High-voltage laser grid gate
  ICE_SPIKE: 'ICE_SPIKE',               // Cryo crystal spikes
  TITAN_PISTON: 'TITAN_PISTON',         // Industrial crusher piston
  VOID_CRYSTAL: 'VOID_CRYSTAL',         // Dark matter anomaly monolith
  ROBOT_BARRIER: 'ROBOT_BARRIER'        // Autonomous police sentry barricade
};

// 30 Progressive World-Class Real-World & Futuristic Stages
export const LEVELS = [
  {
    id: 1,
    name: 'Tokyo Shibuya Crossing',
    city: 'Tokyo, Japan',
    timeLimit: 50,
    speedMult: 1.00,
    skyColor: '#87CEEB',
    fogColor: '#b0d9f0',
    roadColor: '#374151',
    railColor: '#38bdf8',
    neonColor: '#ec4899',
    hurdleSet: ['BARRIER_LOW', 'BUS', 'MOTORBIKE', 'TRAIN'],
    label: '🗾 STAGE 1: Tokyo Shibuya Crossing',
    stagePerk: '🔰 Starter Matrix: Standard Speed & Balanced Traffic'
  },
  {
    id: 2,
    name: 'Manhattan Expressway',
    city: 'New York, USA',
    timeLimit: 48,
    speedMult: 1.06,
    skyColor: '#5B9BD5',
    fogColor: '#a8c8e8',
    roadColor: '#374151',
    railColor: '#f59e0b',
    neonColor: '#3b82f6',
    hurdleSet: ['BUS', 'CONCRETE_BARRIER', 'TRAIN', 'MOTORBIKE'],
    label: '🗽 STAGE 2: Manhattan Expressway',
    stagePerk: '🚕 Transit Grid: +10% Magnet Pull Radius'
  },
  {
    id: 3,
    name: 'Dubai Golden Skyway',
    city: 'Dubai, UAE',
    timeLimit: 47,
    speedMult: 1.12,
    skyColor: '#FFD580',
    fogColor: '#f0c060',
    roadColor: '#525252',
    railColor: '#eab308',
    neonColor: '#facc15',
    hurdleSet: ['MOTORBIKE', 'BARRIER_LOW', 'BUS', 'TRAIN'],
    label: '✨ STAGE 3: Dubai Golden Skyway',
    stagePerk: '🪙 Gold Rush: +15% Extra Celestial Ring Value'
  },
  {
    id: 4,
    name: 'London Tower Bridge',
    city: 'London, UK',
    timeLimit: 46,
    speedMult: 1.18,
    skyColor: '#8ab0c8',
    fogColor: '#c0d8e8',
    roadColor: '#374151',
    railColor: '#ef4444',
    neonColor: '#38bdf8',
    hurdleSet: ['BUS', 'BARRIER_HIGH', 'CONSTRUCTION', 'MOTORBIKE'],
    label: '🎡 STAGE 4: London Tower Bridge',
    stagePerk: '⚡ Bridge Surge: Longer Hoverboard Shield Time'
  },
  {
    id: 5,
    name: 'Singapore Marina Bay',
    city: 'Singapore',
    timeLimit: 45,
    speedMult: 1.24,
    skyColor: '#4A90D9',
    fogColor: '#a0c8e8',
    roadColor: '#374151',
    railColor: '#10b981',
    neonColor: '#34d399',
    hurdleSet: ['MOTORBIKE', 'TESLA_COIL', 'BUS', 'TRAIN'],
    label: '🦁 STAGE 5: Singapore Marina Bay',
    stagePerk: '🔋 Bio-Plasma: Jetpack Fuel Duration +2s'
  },
  {
    id: 6,
    name: 'Berlin Skyline Autobahn',
    city: 'Berlin, Germany',
    timeLimit: 44,
    speedMult: 1.30,
    skyColor: '#6EA8D0',
    fogColor: '#b0ccdd',
    roadColor: '#4b5563',
    railColor: '#a855f7',
    neonColor: '#f43f5e',
    hurdleSet: ['TRAIN', 'BARRIER_LOW', 'PLASMA_WALL', 'CONCRETE_BARRIER'],
    label: '🚇 STAGE 6: Berlin Skyline Autobahn',
    stagePerk: '🥷 Autobahn Rush: Faster Slide Under Bridge Recovery'
  },
  {
    id: 7,
    name: 'Hong Kong Victoria Peak',
    city: 'Hong Kong',
    timeLimit: 43,
    speedMult: 1.36,
    skyColor: '#FF8C66',
    fogColor: '#f0a070',
    roadColor: '#4b5563',
    railColor: '#f43f5e',
    neonColor: '#facc15',
    hurdleSet: ['MOTORBIKE', 'BUS', 'BARRIER_HIGH', 'TRAIN'],
    label: '🏮 STAGE 7: Hong Kong Victoria Peak',
    stagePerk: '💫 Neon Overdrive: Double 2X Multiplier Frequency'
  },
  {
    id: 8,
    name: 'Paris Arc de Triomphe',
    city: 'Paris, France',
    timeLimit: 42,
    speedMult: 1.42,
    skyColor: '#C4A882',
    fogColor: '#e0c8a0',
    roadColor: '#6b7280',
    railColor: '#60a5fa',
    neonColor: '#f472b6',
    hurdleSet: ['BUS', 'ROBOT_BARRIER', 'CONSTRUCTION', 'MOTORBIKE'],
    label: '🗼 STAGE 8: Paris Arc de Triomphe',
    stagePerk: '🛡️ Kinetic Barrier: +1 Free Emergency Recovery Shield'
  },
  {
    id: 9,
    name: 'Seoul Gangnam District',
    city: 'Seoul, South Korea',
    timeLimit: 41,
    speedMult: 1.48,
    skyColor: '#3A7BD5',
    fogColor: '#90b8e0',
    roadColor: '#374151',
    railColor: '#818cf8',
    neonColor: '#06b6d4',
    hurdleSet: ['TESLA_COIL', 'MOTORBIKE', 'TRAIN', 'BUS'],
    label: '🇰🇷 STAGE 9: Seoul Gangnam District',
    stagePerk: '⚡ Quantum EMP: Stumble duration reduced by 40%'
  },
  {
    id: 10,
    name: 'Los Angeles Sunset Highway',
    city: 'Los Angeles, USA',
    timeLimit: 40,
    speedMult: 1.54,
    skyColor: '#FF7043',
    fogColor: '#f0906a',
    roadColor: '#4b5563',
    railColor: '#f97316',
    neonColor: '#fbbf24',
    hurdleSet: ['MOTORBIKE', 'BUS', 'CONCRETE_BARRIER', 'TRAIN'],
    label: '🌴 STAGE 10: Los Angeles Sunset Highway',
    stagePerk: '🚀 Supersonic Thruster: Jetpack Speed +15%'
  },
  {
    id: 11,
    name: 'Sydney Harbour Cyberway',
    city: 'Sydney, Australia',
    timeLimit: 40,
    speedMult: 1.60,
    skyColor: '#083344',
    fogColor: '#031a24',
    roadColor: '#0f172a',
    railColor: '#06b6d4',
    neonColor: '#38bdf8',
    hurdleSet: ['BUS', 'ICE_SPIKE', 'BARRIER_LOW', 'TRAIN'],
    label: '🌊 STAGE 11: Sydney Harbour Cyberway',
    stagePerk: '🧲 Super Vortex: Automatic celestial ring attraction'
  },
  {
    id: 12,
    name: 'Cairo Cyber Pyramids',
    city: 'Cairo, Egypt',
    timeLimit: 39,
    speedMult: 1.66,
    skyColor: '#422006',
    fogColor: '#241003',
    roadColor: '#292524',
    railColor: '#eab308',
    neonColor: '#ea580c',
    hurdleSet: ['MAGMA_PYLON', 'MOTORBIKE', 'ROBOT_BARRIER', 'TRAIN'],
    label: '🏜️ STAGE 12: Cairo Cyber Pyramids',
    stagePerk: '☀️ Solar Flare: Score points increment +25%'
  },
  {
    id: 13,
    name: 'Toronto Frost Valley',
    city: 'Toronto, Canada',
    timeLimit: 39,
    speedMult: 1.72,
    skyColor: '#0c4a6e',
    fogColor: '#06283d',
    roadColor: '#1e293b',
    railColor: '#7dd3fc',
    neonColor: '#e0f2fe',
    hurdleSet: ['ICE_SPIKE', 'BUS', 'CONCRETE_BARRIER', 'TRAIN'],
    label: '❄️ STAGE 13: Toronto Frost Valley',
    stagePerk: '⛸️ Frost Glide: Frictionless jump and high aerial arcs'
  },
  {
    id: 14,
    name: 'Rome Imperial Cyber Coliseum',
    city: 'Rome, Italy',
    timeLimit: 38,
    speedMult: 1.78,
    skyColor: '#4a044e',
    fogColor: '#2a022d',
    roadColor: '#1f1315',
    railColor: '#f43f5e',
    neonColor: '#facc15',
    hurdleSet: ['MOTORBIKE', 'PLASMA_WALL', 'BUS', 'TRAIN'],
    label: '🏛️ STAGE 14: Rome Imperial Cyber Coliseum',
    stagePerk: '👑 Imperial Crown: +30% Ring Multiplier'
  },
  {
    id: 15,
    name: 'Rio Horizon Carnival',
    city: 'Rio de Janeiro, Brazil',
    timeLimit: 38,
    speedMult: 1.84,
    skyColor: '#064e3b',
    fogColor: '#022c22',
    roadColor: '#0f172a',
    railColor: '#10b981',
    neonColor: '#facc15',
    hurdleSet: ['BUS', 'MOTORBIKE', 'BARRIER_HIGH', 'TRAIN'],
    label: '🎭 STAGE 15: Rio Horizon Carnival',
    stagePerk: '🎉 Samba Reflex: Ultra-fast lane switching response'
  },
  {
    id: 16,
    name: 'Reykjavik Aurora Glade',
    city: 'Reykjavik, Iceland',
    timeLimit: 37,
    speedMult: 1.90,
    skyColor: '#042f2e',
    fogColor: '#021e1d',
    roadColor: '#0f172a',
    railColor: '#2dd4bf',
    neonColor: '#a7f3d0',
    hurdleSet: ['ICE_SPIKE', 'TESLA_COIL', 'TRAIN', 'MOTORBIKE'],
    label: '🌌 STAGE 16: Reykjavik Aurora Glade',
    stagePerk: '✨ Aurora Field: Powerup durations extended by +3s'
  },
  {
    id: 17,
    name: 'San Francisco Neon Bay',
    city: 'San Francisco, USA',
    timeLimit: 37,
    speedMult: 1.96,
    skyColor: '#1e3a8a',
    fogColor: '#0f2252',
    roadColor: '#1e293b',
    railColor: '#ef4444',
    neonColor: '#38bdf8',
    hurdleSet: ['BUS', 'CONSTRUCTION', 'MOTORBIKE', 'TRAIN'],
    label: '🌉 STAGE 17: San Francisco Neon Bay',
    stagePerk: '🚠 Cable Vault: Higher jumping ceiling over buses'
  },
  {
    id: 18,
    name: 'Kyoto Cyber Shrine',
    city: 'Kyoto, Japan',
    timeLimit: 36,
    speedMult: 2.02,
    skyColor: '#3b0764',
    fogColor: '#20053b',
    roadColor: '#18181b',
    railColor: '#d946ef',
    neonColor: '#f43f5e',
    hurdleSet: ['VOID_CRYSTAL', 'MOTORBIKE', 'ROBOT_BARRIER', 'TRAIN'],
    label: '⛩️ STAGE 18: Kyoto Cyber Shrine',
    stagePerk: '🌸 Blossom Dash: Ghost evasion through minor stumbles'
  },
  {
    id: 19,
    name: 'Chicago Industrial Loop',
    city: 'Chicago, USA',
    timeLimit: 36,
    speedMult: 2.08,
    skyColor: '#0f172a',
    fogColor: '#030712',
    roadColor: '#1e293b',
    railColor: '#94a3b8',
    neonColor: '#f59e0b',
    hurdleSet: ['TITAN_PISTON', 'BUS', 'CONCRETE_BARRIER', 'TRAIN'],
    label: '🏙️ STAGE 19: Chicago Industrial Loop',
    stagePerk: '🦾 Titanium Plating: Immune to 1 stumble penalty'
  },
  {
    id: 20,
    name: 'Cyber Sahara Overpass',
    city: 'Sahara Megastructure',
    timeLimit: 35,
    speedMult: 2.14,
    skyColor: '#431407',
    fogColor: '#270b04',
    roadColor: '#292524',
    railColor: '#ea580c',
    neonColor: '#fdba74',
    hurdleSet: ['MAGMA_PYLON', 'MOTORBIKE', 'TITAN_PISTON', 'TRAIN'],
    label: '🏜️ STAGE 20: Cyber Sahara Overpass',
    stagePerk: '🔥 Overheat Boost: Ultra fast maximum running speed'
  },
  {
    id: 21,
    name: 'Barcelona Pulse Arc',
    city: 'Barcelona, Spain',
    timeLimit: 35,
    speedMult: 2.20,
    skyColor: '#312e81',
    fogColor: '#1e1b4b',
    roadColor: '#1e293b',
    railColor: '#818cf8',
    neonColor: '#ec4899',
    hurdleSet: ['PLASMA_WALL', 'BUS', 'TESLA_COIL', 'TRAIN'],
    label: '🎨 STAGE 21: Barcelona Pulse Arc',
    stagePerk: '⚡ Pulse Arc: High-yield gift box drop frequency'
  },
  {
    id: 22,
    name: 'Amsterdam Cyber Canals',
    city: 'Amsterdam, Netherlands',
    timeLimit: 34,
    speedMult: 2.26,
    skyColor: '#064e3b',
    fogColor: '#022c22',
    roadColor: '#0f172a',
    railColor: '#34d399',
    neonColor: '#06b6d4',
    hurdleSet: ['MOTORBIKE', 'BARRIER_LOW', 'BUS', 'TRAIN'],
    label: '🚲 STAGE 22: Amsterdam Cyber Canals',
    stagePerk: '🛹 Glide Velocity: Plasma board lasts +10 seconds'
  },
  {
    id: 23,
    name: 'Bangkok Electric Riverway',
    city: 'Bangkok, Thailand',
    timeLimit: 34,
    speedMult: 2.32,
    skyColor: '#701a75',
    fogColor: '#4a044e',
    roadColor: '#18181b',
    railColor: '#e879f9',
    neonColor: '#facc15',
    hurdleSet: ['MOTORBIKE', 'BUS', 'TESLA_COIL', 'TRAIN'],
    label: '🛺 STAGE 23: Bangkok Electric Riverway',
    stagePerk: '⚡ Voltage Flow: Magnet pulls powerups from distance'
  },
  {
    id: 24,
    name: 'Vancouver Cyber Pines',
    city: 'Vancouver, Canada',
    timeLimit: 33,
    speedMult: 2.38,
    skyColor: '#065f46',
    fogColor: '#022c22',
    roadColor: '#1e293b',
    railColor: '#10b981',
    neonColor: '#6ee7b7',
    hurdleSet: ['ICE_SPIKE', 'CONCRETE_BARRIER', 'BUS', 'TRAIN'],
    label: '🌲 STAGE 24: Vancouver Cyber Pines',
    stagePerk: '👟 Super Thrusters: 2x Airborne Hang-time'
  },
  {
    id: 25,
    name: 'Zurich Quantum Vaults',
    city: 'Zurich, Switzerland',
    timeLimit: 33,
    speedMult: 2.44,
    skyColor: '#172554',
    fogColor: '#0f172a',
    roadColor: '#1e293b',
    railColor: '#38bdf8',
    neonColor: '#a855f7',
    hurdleSet: ['VOID_CRYSTAL', 'TITAN_PISTON', 'MOTORBIKE', 'TRAIN'],
    label: '🇨🇭 STAGE 25: Zurich Quantum Vaults',
    stagePerk: '💎 Vault Multiplier: 3x Celestial Ring Score'
  },
  {
    id: 26,
    name: 'Shanghai Maglev Hyperway',
    city: 'Shanghai, China',
    timeLimit: 32,
    speedMult: 2.50,
    skyColor: '#4c0519',
    fogColor: '#1a0108',
    roadColor: '#111827',
    railColor: '#f43f5e',
    neonColor: '#38bdf8',
    hurdleSet: ['TRAIN', 'BUS', 'MOTORBIKE', 'PLASMA_WALL'],
    label: '🚅 STAGE 26: Shanghai Maglev Hyperway',
    stagePerk: '🚄 Hyper Maglev: Rapid distance score acceleration'
  },
  {
    id: 27,
    name: 'Moscow Orbital Station',
    city: 'Moscow Orbital',
    timeLimit: 32,
    speedMult: 2.56,
    skyColor: '#1e1b4b',
    fogColor: '#0b092b',
    roadColor: '#1e1b4b',
    railColor: '#818cf8',
    neonColor: '#facc15',
    hurdleSet: ['TITAN_PISTON', 'TESLA_COIL', 'VOID_CRYSTAL', 'TRAIN'],
    label: '🚀 STAGE 27: Moscow Orbital Station',
    stagePerk: '🛰️ Zero Gravity: Sky rings generate continuously'
  },
  {
    id: 28,
    name: 'Cape Town Solar Peninsula',
    city: 'Cape Town, South Africa',
    timeLimit: 31,
    speedMult: 2.62,
    skyColor: '#451a03',
    fogColor: '#200a01',
    roadColor: '#292524',
    railColor: '#f97316',
    neonColor: '#38bdf8',
    hurdleSet: ['MOTORBIKE', 'BUS', 'MAGMA_PYLON', 'TRAIN'],
    label: '🇿🇦 STAGE 28: Cape Town Solar Peninsula',
    stagePerk: '🌅 Solar Overcharge: +40% All Multipliers'
  },
  {
    id: 29,
    name: 'Neo Mega Zenith Metropolis',
    city: 'Zenith Prime',
    timeLimit: 30,
    speedMult: 2.70,
    skyColor: '#0f172a',
    fogColor: '#000000',
    roadColor: '#090d16',
    railColor: '#eab308',
    neonColor: '#ec4899',
    hurdleSet: ['TRAIN', 'BUS', 'MOTORBIKE', 'TESLA_COIL', 'TITAN_PISTON'],
    label: '👑 STAGE 29: Neo Mega Zenith Metropolis',
    stagePerk: '👑 Grandmaster Core: Maximum starting score multipliers'
  },
  {
    id: 30,
    name: 'Infinite Kinetic Singularity',
    city: 'The Infinite Grid',
    timeLimit: 30,
    speedMult: 2.80,
    skyColor: '#09090b',
    fogColor: '#000000',
    roadColor: '#000000',
    railColor: '#38bdf8',
    neonColor: '#f43f5e',
    hurdleSet: ['VOID_CRYSTAL', 'MAGMA_PYLON', 'TESLA_COIL', 'TRAIN', 'BUS', 'MOTORBIKE'],
    label: '🌠 STAGE 30: Infinite Kinetic Singularity',
    stagePerk: '🏆 Godspeed: The Ultimate Kinetic Champion'
  }
];

// Characters — featuring Jack, Aero Bot, Cyber Titan, Neon Phantom, and Solar Valkyrie
export const CHARACTERS = [
  {
    id: 'jack',
    name: 'Kinetic Jack',
    title: 'The Cyber Pioneer',
    avatar: '🏃‍♂️',
    type: 'jack',
    color: '#38bdf8',
    accent: '#facc15',
    shirtColor: '#0284c7',
    pantsColor: '#1e293b',
    capColor: '#facc15',
    price: 0,
    unlocked: true,
    bonus: '+10% Ring Collection Points'
  },
  {
    id: 'aerobot',
    name: 'Aero Bot',
    title: 'High-Altitude Aerial Runner',
    avatar: '🤖',
    type: 'aerobot',
    color: '#06b6d4',
    accent: '#ffffff',
    shirtColor: '#f8fafc',
    pantsColor: '#0f172a',
    capColor: '#0f172a',
    price: 200,
    unlocked: false,
    bonus: '+20% Jetpack Flight Time'
  },
  {
    id: 'cybertitan',
    name: 'Cyber Titan',
    title: 'Titan Exoskeleton',
    avatar: '🛡️',
    type: 'cybertitan',
    color: '#0284c7',
    accent: '#38bdf8',
    shirtColor: '#1e293b',
    pantsColor: '#0f172a',
    capColor: '#38bdf8',
    price: 400,
    unlocked: false,
    bonus: '+25% Magnet Pull Radius'
  },
  {
    id: 'phantom',
    name: 'Neon Phantom',
    title: 'Plasma Shadow Runner',
    avatar: '🥷',
    type: 'phantom',
    color: '#a855f7',
    accent: '#f472b6',
    shirtColor: '#581c87',
    pantsColor: '#1e1b4b',
    capColor: '#d946ef',
    price: 600,
    unlocked: false,
    bonus: 'Start with 1 Free Plasma Board'
  },
  {
    id: 'valkyrie',
    name: 'Solar Valkyrie',
    title: 'Celestial Kinetic Champ',
    avatar: '👑',
    type: 'valkyrie',
    color: '#eab308',
    accent: '#fde047',
    shirtColor: '#ca8a04',
    pantsColor: '#271003',
    capColor: '#f59e0b',
    price: 800,
    unlocked: false,
    bonus: '+30% All Score Multiplier'
  },
  {
    id: 'steelvanguard',
    name: 'Steel Vanguard',
    title: 'Armored Defense Mech',
    avatar: '⚙️',
    type: 'cybertitan',
    color: '#64748b',
    accent: '#f43f5e',
    shirtColor: '#475569',
    pantsColor: '#0f172a',
    capColor: '#f43f5e',
    price: 1000,
    unlocked: false,
    bonus: 'Immune to first Stumble collision'
  },
  {
    id: 'quantumflash',
    name: 'Quantum Flash',
    title: 'Sub-atomic speed runner',
    avatar: '⚡',
    type: 'aerobot',
    color: '#facc15',
    accent: '#38bdf8',
    shirtColor: '#eab308',
    pantsColor: '#0f172a',
    capColor: '#38bdf8',
    price: 1200,
    unlocked: false,
    bonus: '+20% Base Speed Boost'
  },
  {
    id: 'crimsonravager',
    name: 'Crimson Ravager',
    title: 'High-Impact Destroyer',
    avatar: '👹',
    type: 'cybertitan',
    color: '#ef4444',
    accent: '#fb7185',
    shirtColor: '#991b1b',
    pantsColor: '#1e293b',
    capColor: '#fb7185',
    price: 1400,
    unlocked: false,
    bonus: 'Double point value for Gold Coins'
  },
  {
    id: 'shadowstrike',
    name: 'Shadow Strike',
    title: 'Stealth Infiltration Unit',
    avatar: '🛸',
    type: 'phantom',
    color: '#2dd4bf',
    accent: '#06b6d4',
    shirtColor: '#0f172a',
    pantsColor: '#111827',
    capColor: '#06b6d4',
    price: 1600,
    unlocked: false,
    bonus: '+5 seconds Hoverboard duration'
  },
  {
    id: 'hyperion',
    name: 'Hyperion Prime',
    title: 'Heavy Aerospace Engine Bot',
    avatar: '🚀',
    type: 'aerobot',
    color: '#f97316',
    accent: '#ea580c',
    shirtColor: '#c2410c',
    pantsColor: '#1e293b',
    capColor: '#ea580c',
    price: 1800,
    unlocked: false,
    bonus: 'Start with 1 Free Jetpack powerup'
  },
  {
    id: 'nebulaglider',
    name: 'Nebula Glider',
    title: 'Galactic Cosmic Cruiser',
    avatar: '🌌',
    type: 'aerobot',
    color: '#c084fc',
    accent: '#a855f7',
    shirtColor: '#6b21a8',
    pantsColor: '#0f172a',
    capColor: '#a855f7',
    price: 2000,
    unlocked: false,
    bonus: '2x Ring Attraction Force in all lanes'
  },
  {
    id: 'chronoweaver',
    name: 'Chrono Weaver',
    title: 'Time-dilating runner',
    avatar: '⏳',
    type: 'jack',
    color: '#a3e635',
    accent: '#84cc16',
    shirtColor: '#4d7c0f',
    pantsColor: '#1e293b',
    capColor: '#84cc16',
    price: 2200,
    unlocked: false,
    bonus: '+4 seconds to all Powerup durations'
  },
  {
    id: 'sparksentinel',
    name: 'Spark Sentinel',
    title: 'Voltage lightning rod',
    avatar: '🔋',
    type: 'jack',
    color: '#fb7185',
    accent: '#f43f5e',
    shirtColor: '#be123c',
    pantsColor: '#0f172a',
    capColor: '#f43f5e',
    price: 2400,
    unlocked: false,
    bonus: 'Stumbles recede chaser 2x faster'
  },
  {
    id: 'glacierwarden',
    name: 'Glacier Warden',
    title: 'Frost Control Engine',
    avatar: '❄️',
    type: 'jack',
    color: '#38bdf8',
    accent: '#7dd3fc',
    shirtColor: '#0369a1',
    pantsColor: '#1e293b',
    capColor: '#7dd3fc',
    price: 2600,
    unlocked: false,
    bonus: '3x Score Multiplier when jumping'
  },
  {
    id: 'inferno',
    name: 'Inferno Overlord',
    title: 'Volcano Core Thermal Bot',
    avatar: '🔥',
    type: 'cybertitan',
    color: '#dc2626',
    accent: '#f97316',
    shirtColor: '#7f1d1d',
    pantsColor: '#0f172a',
    capColor: '#f97316',
    price: 2800,
    unlocked: false,
    bonus: '+40% Distance Score multiplier'
  },
  {
    id: 'helixsynth',
    name: 'Helix Synth',
    title: 'Bio-cybernetic Clone',
    avatar: '🧬',
    type: 'jack',
    color: '#fb7185',
    accent: '#f472b6',
    shirtColor: '#9d174d',
    pantsColor: '#1e293b',
    capColor: '#f472b6',
    price: 3000,
    unlocked: false,
    bonus: 'Start with 1 Free Magnet powerup'
  },
  {
    id: 'voidphantom',
    name: 'Void Phantom',
    title: 'Dark matter shifting bot',
    avatar: '🌀',
    type: 'cybertitan',
    color: '#a855f7',
    accent: '#c084fc',
    shirtColor: '#581c87',
    pantsColor: '#0f172a',
    capColor: '#c084fc',
    price: 3200,
    unlocked: false,
    bonus: 'Leap 25% higher over high obstacles'
  },
  {
    id: 'solarflare',
    name: 'Solar Flare',
    title: 'Thermonuclear Reactor Bot',
    avatar: '☀️',
    type: 'jack',
    color: '#eab308',
    accent: '#fbbf24',
    shirtColor: '#a16207',
    pantsColor: '#1e293b',
    capColor: '#fbbf24',
    price: 3400,
    unlocked: false,
    bonus: '+35% Coin multiplier'
  },
  {
    id: 'zenithapex',
    name: 'Zenith Apex',
    title: 'Infinite Grid Champion',
    avatar: '🏆',
    type: 'aerobot',
    color: '#34d399',
    accent: '#10b981',
    shirtColor: '#065f46',
    pantsColor: '#0f172a',
    capColor: '#10b981',
    price: 4000,
    unlocked: false,
    bonus: 'Gain 2x Coins from all Mystery Boxes'
  },
  {
    id: 'singularity',
    name: 'Singularity X',
    title: 'Cosmic Gravity Controller',
    avatar: '🌀',
    type: 'aerobot',
    color: '#6366f1',
    accent: '#818cf8',
    shirtColor: '#3730a3',
    pantsColor: '#0f172a',
    capColor: '#818cf8',
    price: 5000,
    unlocked: false,
    bonus: 'Absolute Immunity to all minor stumbles'
  }
];

export const HOVERBOARD_SKINS = [
  { id: 'classic', name: 'Plasma Glide', color: '#8b5cf6', price: 0, unlocked: true },
  { id: 'fire', name: 'Inferno Wave', color: '#ef4444', price: 300, unlocked: false },
  { id: 'cyber', name: 'Cyan Vortex', color: '#06b6d4', price: 750, unlocked: false },
  { id: 'gold', name: 'Celestial Gold', color: '#eab308', price: 1500, unlocked: false }
];

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
  HOVERBOARD: 'HOVERBOARD',
  ROBOT_REPAIR: 'ROBOT_REPAIR',
  PLASMA_SHIELD: 'PLASMA_SHIELD',
  KINETIC_BLASTER: 'KINETIC_BLASTER',
  SPEED_BOOST: 'SPEED_BOOST',
  COIN_RAIN: 'COIN_RAIN',
  INVINCIBILITY: 'INVINCIBILITY'
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
  },
  [POWERUP_TYPES.ROBOT_REPAIR]: {
    name: 'Nano Repair Kit',
    duration: 6,
    color: '#34d399',
    icon: '🔧',
    description: 'Instantly repairs robot armor damage — grants 6s invulnerability shield'
  },
  [POWERUP_TYPES.PLASMA_SHIELD]: {
    name: 'Plasma Shield',
    duration: 8,
    color: '#06b6d4',
    icon: '🛡️',
    description: 'Activates protective force field — destroy elemental hurdles on contact!'
  },
  [POWERUP_TYPES.KINETIC_BLASTER]: {
    name: 'Kinetic Blaster',
    duration: 6,
    color: '#f97316',
    icon: '💥',
    description: 'Fires energy blasts — smash through Fire, Water, Sand, Tornado & Thunder obstacles!'
  },
  [POWERUP_TYPES.SPEED_BOOST]: {
    name: 'Turbo Overdrive',
    duration: 5,
    color: '#fbbf24',
    icon: '⚡',
    description: 'Maximum speed burst — rocket forward at top velocity for 5 seconds!'
  },
  [POWERUP_TYPES.COIN_RAIN]: {
    name: 'Coin Rain',
    duration: 3,
    color: '#facc15',
    icon: '💰',
    description: 'Instantly rains 50 celestial rings onto the player!'
  },
  [POWERUP_TYPES.INVINCIBILITY]: {
    name: 'Invincibility Star',
    duration: 5,
    color: '#ffffff',
    icon: '⭐',
    description: 'Full star power — completely immune to ALL obstacles for 5 seconds!'
  }
};

// Realistic Vehicles, City Obstacles & Biome Hurdles
export const OBSTACLE_TYPES = {
  TRAIN: 'TRAIN',                       // High-speed Cyber Express Bullet Train
  BUS: 'BUS',                           // Double-decker Cyber City Transit Bus
  MOTORBIKE: 'MOTORBIKE',               // Cyber Superbike / Motorcycle
  AMBULANCE: 'AMBULANCE',               // Emergency Ambulance with flashing lights
  POLICE_CAR: 'POLICE_CAR',             // Police patrol car with sirens
  TRUCK: 'TRUCK',                       // Heavy freight truck
  TAXI: 'TAXI',                         // Classic yellow taxi cab
  SPORTS_CAR: 'SPORTS_CAR',             // Low-profile fast sports car
  HELICOPTER: 'HELICOPTER',             // Aerial helicopter — hazard when Jetpack active
  BARRIER_LOW: 'BARRIER_LOW',           // Low Roadblock Guardrail (Jump over)
  BARRIER_HIGH: 'BARRIER_HIGH',         // Overhead Traffic Sign / Arch (Slide under)
  CONCRETE_BARRIER: 'CONCRETE_BARRIER', // Concrete Highway K-Rail Barricade
  CONSTRUCTION: 'CONSTRUCTION',         // Flashing Highway Caution Barrier
  // Biome-specific futuristic hurdles:
  TESLA_COIL: 'TESLA_COIL',             // Electric pulsating arc tower
  MAGMA_PYLON: 'MAGMA_PYLON',           // Molten volcanic fissure vent
  PLASMA_WALL: 'PLASMA_WALL',           // High-voltage laser grid gate
  ICE_SPIKE: 'ICE_SPIKE',               // Cryo crystal spikes
  TITAN_PISTON: 'TITAN_PISTON',         // Industrial crusher piston
  VOID_CRYSTAL: 'VOID_CRYSTAL',         // Dark matter anomaly monolith
  ROBOT_BARRIER: 'ROBOT_BARRIER',       // Autonomous police sentry barricade
  // Elemental Destruction Hurdles (destroys robot on 2nd hit):
  FIRE_PILLAR: 'FIRE_PILLAR',           // 🔥 Roaring molten fire vortex — dodge or blast through
  WATER_SURGE: 'WATER_SURGE',           // 💧 Hydro tsunami wave — jump over or shield
  SAND_STORM: 'SAND_STORM',             // 🏜️ Whirling desert sand cyclone — slide under
  TORNADO: 'TORNADO',                   // 🌪️ Spinning twister with suction vortex — lane-switch escape
  THUNDER_STRIKE: 'THUNDER_STRIKE'      // ⚡ Lightning arc pillar — only Plasma Shield or Blaster destroys
};

// Elemental hurdle config — these cause 2-hit robot destruction
export const ELEMENTAL_HURDLES = [
  'FIRE_PILLAR', 'WATER_SURGE', 'SAND_STORM', 'TORNADO', 'THUNDER_STRIKE'
];

// Hurdles that can be destroyed by Plasma Shield or Kinetic Blaster
export const DESTRUCTIBLE_HURDLES = [
  'FIRE_PILLAR', 'WATER_SURGE', 'SAND_STORM', 'TORNADO', 'THUNDER_STRIKE',
  'TESLA_COIL', 'MAGMA_PYLON'
];

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
    hurdleSet: ['BARRIER_LOW', 'BUS', 'MOTORBIKE', 'TRAIN', 'TAXI'],
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
    hurdleSet: ['BUS', 'CONCRETE_BARRIER', 'TRAIN', 'MOTORBIKE', 'TAXI', 'POLICE_CAR'],
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
    hurdleSet: ['MOTORBIKE', 'BARRIER_LOW', 'BUS', 'TRAIN', 'SPORTS_CAR', 'TRUCK'],
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
    hurdleSet: ['BUS', 'BARRIER_HIGH', 'CONSTRUCTION', 'MOTORBIKE', 'AMBULANCE', 'TAXI'],
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
    hurdleSet: ['MOTORBIKE', 'TESLA_COIL', 'BUS', 'TRAIN', 'SPORTS_CAR', 'POLICE_CAR'],
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
    hurdleSet: ['TRAIN', 'BARRIER_LOW', 'PLASMA_WALL', 'CONCRETE_BARRIER', 'TRUCK', 'AMBULANCE'],
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
    hurdleSet: ['MOTORBIKE', 'BUS', 'BARRIER_HIGH', 'TRAIN', 'TAXI', 'SPORTS_CAR'],
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
    hurdleSet: ['BUS', 'ROBOT_BARRIER', 'CONSTRUCTION', 'MOTORBIKE', 'FIRE_PILLAR', 'TAXI'],
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
    hurdleSet: ['TESLA_COIL', 'MOTORBIKE', 'TRAIN', 'BUS', 'FIRE_PILLAR', 'POLICE_CAR'],
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
    hurdleSet: ['MOTORBIKE', 'BUS', 'CONCRETE_BARRIER', 'TRAIN', 'WATER_SURGE', 'SPORTS_CAR', 'HELICOPTER'],
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
    hurdleSet: ['BUS', 'ICE_SPIKE', 'BARRIER_LOW', 'TRAIN', 'WATER_SURGE', 'THUNDER_STRIKE', 'HELICOPTER'],
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
    hurdleSet: ['MAGMA_PYLON', 'MOTORBIKE', 'ROBOT_BARRIER', 'TRAIN', 'FIRE_PILLAR', 'SAND_STORM', 'TRUCK'],
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
    hurdleSet: ['ICE_SPIKE', 'BUS', 'CONCRETE_BARRIER', 'TRAIN', 'THUNDER_STRIKE', 'WATER_SURGE', 'HELICOPTER'],
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
    hurdleSet: ['MOTORBIKE', 'PLASMA_WALL', 'BUS', 'TRAIN', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'AMBULANCE'],
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
    hurdleSet: ['BUS', 'MOTORBIKE', 'BARRIER_HIGH', 'TRAIN', 'WATER_SURGE', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['ICE_SPIKE', 'TESLA_COIL', 'TRAIN', 'MOTORBIKE', 'THUNDER_STRIKE', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['BUS', 'CONSTRUCTION', 'MOTORBIKE', 'TRAIN', 'FIRE_PILLAR', 'WATER_SURGE', 'HELICOPTER', 'SPORTS_CAR'],
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
    hurdleSet: ['VOID_CRYSTAL', 'MOTORBIKE', 'ROBOT_BARRIER', 'TRAIN', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'TORNADO'],
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
    hurdleSet: ['TITAN_PISTON', 'BUS', 'CONCRETE_BARRIER', 'TRAIN', 'FIRE_PILLAR', 'SAND_STORM', 'HELICOPTER', 'TRUCK'],
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
    hurdleSet: ['MAGMA_PYLON', 'MOTORBIKE', 'TITAN_PISTON', 'TRAIN', 'FIRE_PILLAR', 'SAND_STORM', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['PLASMA_WALL', 'BUS', 'TESLA_COIL', 'TRAIN', 'THUNDER_STRIKE', 'TORNADO', 'HELICOPTER', 'FIRE_PILLAR'],
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
    hurdleSet: ['MOTORBIKE', 'BARRIER_LOW', 'BUS', 'TRAIN', 'WATER_SURGE', 'FIRE_PILLAR', 'HELICOPTER', 'SPORTS_CAR'],
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
    hurdleSet: ['MOTORBIKE', 'BUS', 'TESLA_COIL', 'TRAIN', 'THUNDER_STRIKE', 'WATER_SURGE', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['ICE_SPIKE', 'CONCRETE_BARRIER', 'BUS', 'TRAIN', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'HELICOPTER', 'TORNADO'],
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
    hurdleSet: ['VOID_CRYSTAL', 'TITAN_PISTON', 'MOTORBIKE', 'TRAIN', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'SAND_STORM', 'HELICOPTER'],
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
    hurdleSet: ['TRAIN', 'BUS', 'MOTORBIKE', 'PLASMA_WALL', 'FIRE_PILLAR', 'WATER_SURGE', 'THUNDER_STRIKE', 'HELICOPTER'],
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
    hurdleSet: ['TITAN_PISTON', 'TESLA_COIL', 'VOID_CRYSTAL', 'TRAIN', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['MOTORBIKE', 'BUS', 'MAGMA_PYLON', 'TRAIN', 'FIRE_PILLAR', 'WATER_SURGE', 'SAND_STORM', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['TRAIN', 'BUS', 'MOTORBIKE', 'TESLA_COIL', 'TITAN_PISTON', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'TORNADO', 'HELICOPTER'],
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
    hurdleSet: ['VOID_CRYSTAL', 'MAGMA_PYLON', 'TESLA_COIL', 'TRAIN', 'BUS', 'MOTORBIKE', 'FIRE_PILLAR', 'THUNDER_STRIKE', 'WATER_SURGE', 'TORNADO', 'HELICOPTER'],
    label: '🌠 STAGE 30: Infinite Kinetic Singularity',
    stagePerk: '🏆 Godspeed: The Ultimate Kinetic Champion'
  }
];

// YouTube Reward Video Playlist for Gift Boxes
export const YOUTUBE_REWARD_VIDEOS = [
  {
    id: 'Grz_jFLw8pY',
    title: 'Cyber Kinetic Surge — Episode 1',
    url: 'https://www.youtube.com/shorts/Grz_jFLw8pY',
    embedUrl: 'https://www.youtube.com/embed/Grz_jFLw8pY?autoplay=1&enablejsapi=1',
    bonusCoins: 100,
    rewardLabel: '🎁 +100 COINS BONUS'
  },
  {
    id: 'iN4KfmwatCk',
    title: 'Kinetic Parkour Blitz — Episode 2',
    url: 'https://www.youtube.com/shorts/iN4KfmwatCk',
    embedUrl: 'https://www.youtube.com/embed/iN4KfmwatCk?autoplay=1&enablejsapi=1',
    bonusCoins: 200,
    rewardLabel: '🎁 +200 COINS BONUS'
  },
  {
    id: 'IqGi185af2k',
    title: 'World-Class Runner Epic Quest — Episode 3',
    url: 'https://www.youtube.com/watch?v=IqGi185af2k',
    embedUrl: 'https://www.youtube.com/embed/IqGi185af2k?autoplay=1&enablejsapi=1',
    bonusCoins: 300,
    rewardLabel: '🎁 +300 COINS BONUS'
  },
  {
    id: '1khij1WgrSE',
    title: 'Neon Horizon Championship — Episode 4',
    url: 'https://www.youtube.com/watch?v=1khij1WgrSE',
    embedUrl: 'https://www.youtube.com/embed/1khij1WgrSE?autoplay=1&enablejsapi=1',
    bonusCoins: 400,
    rewardLabel: '🎁 +400 COINS BONUS'
  },
  {
    id: 'wymQ4S1KRTc',
    title: 'Singularity Overdrive — Episode 5',
    url: 'https://www.youtube.com/watch?v=wymQ4S1KRTc',
    embedUrl: 'https://www.youtube.com/embed/wymQ4S1KRTc?autoplay=1&enablejsapi=1',
    bonusCoins: 500,
    rewardLabel: '🎁 +500 COINS BONUS'
  },
  {
    id: 'zQjyMIrVj44',
    title: 'Grandmaster Kinetic Apex — Episode 6',
    url: 'https://www.youtube.com/watch?v=zQjyMIrVj44',
    embedUrl: 'https://www.youtube.com/embed/zQjyMIrVj44?autoplay=1&enablejsapi=1',
    bonusCoins: 600,
    rewardLabel: '🎁 +600 ULTRA COINS BONUS'
  }
];

// Hurt and action speech phrases coming from character's mouth!
export const HURDLE_HIT_PHRASES = [
  'TERRIFIC GOO!!',
  'TERRIFIC GOO! OOF!',
  'POWER OVERDRIVE!',
  'WATCH OUT!',
  'I CAN HANDLE THIS!',
  'TERRIFIC GOO! SURGING BACK!',
  'NEVER STOP RUNNING!'
];

// Characters — Diverse Human Athletes & Robots (Prices in Lacs / Thousands)
export const FREE_ROBOT_IDS = ['rex_brawler', 'jack', 'blitz'];

export const CHARACTERS = [
  // ─── 1. HUMAN ATHLETES ───
  {
    id: 'rex_brawler',
    name: 'Rex Steel',
    title: 'The Neon Brawler Runner',
    avatar: '🏃‍♂️',
    type: 'human_brawler',
    color: '#38bdf8',
    accent: '#facc15',
    shirtColor: '#f1f5f9',
    pantsColor: '#1e293b',
    capColor: '#0f172a',
    price: 0,
    priceLabel: 'FREE STARTER',
    unlocked: true,
    isFree: true,
    isHuman: true,
    bonus: '+15% Ring Collection & Shouts "Terrific Goo!"'
  },
  {
    id: 'jack',
    name: 'Kinetic Jack',
    title: 'Cyber Pioneer Athlete',
    avatar: '🏃',
    type: 'jack',
    color: '#0284c7',
    accent: '#38bdf8',
    shirtColor: '#0284c7',
    pantsColor: '#1e293b',
    capColor: '#06b6d4',
    price: 0,
    priceLabel: 'FREE HERO',
    unlocked: true,
    isFree: true,
    isHuman: true,
    bonus: '+10% Speed Recovery from hurdles'
  },
  {
    id: 'maya_blade',
    name: 'Maya Blade',
    title: 'Neon Parkour Sprinter',
    avatar: '🏃‍♀️',
    type: 'human_female',
    color: '#ec4899',
    accent: '#f472b6',
    shirtColor: '#be185d',
    pantsColor: '#0f172a',
    capColor: '#f472b6',
    price: 150000,
    priceLabel: '1.50 LAC COINS',
    unlocked: false,
    isHuman: true,
    bonus: '+25% Extra Airborne Hang-time'
  },
  {
    id: 'kai_street',
    name: 'Kai Shadow',
    title: 'Urban Parkour Master',
    avatar: '🥷',
    type: 'human_brawler',
    color: '#8b5cf6',
    accent: '#c084fc',
    shirtColor: '#4c1d95',
    pantsColor: '#111827',
    capColor: '#a855f7',
    price: 250000,
    priceLabel: '2.50 LAC COINS',
    unlocked: false,
    isHuman: true,
    bonus: '+20% Magnet Pull Radius'
  },
  {
    id: 'leo_thunder',
    name: 'Leo Thunder',
    title: 'Martial Arts Runner',
    avatar: '⚡',
    type: 'human_brawler',
    color: '#f59e0b',
    accent: '#fde047',
    shirtColor: '#b45309',
    pantsColor: '#1c1917',
    capColor: '#1c1917',
    price: 350000,
    priceLabel: '3.50 LAC COINS',
    unlocked: false,
    isHuman: true,
    bonus: 'Start with 1 Free Kinetic Blaster'
  },
  {
    id: 'elena_valkyrie',
    name: 'Elena Valkyrie',
    title: 'Olympic Track Champion',
    avatar: '👑',
    type: 'human_female',
    color: '#10b981',
    accent: '#34d399',
    shirtColor: '#047857',
    pantsColor: '#064e3b',
    capColor: '#34d399',
    price: 500000,
    priceLabel: '5.00 LAC COINS',
    unlocked: false,
    isHuman: true,
    bonus: '+30% All Score Multipliers'
  },
  {
    id: 'alex_grandmaster',
    name: 'Alex Zenith',
    title: 'World Grandmaster Champion',
    avatar: '🏆',
    type: 'human_brawler',
    color: '#eab308',
    accent: '#ffffff',
    shirtColor: '#ca8a04',
    pantsColor: '#0f172a',
    capColor: '#1e293b',
    price: 1000000,
    priceLabel: '10.00 LAC COINS',
    unlocked: false,
    isHuman: true,
    bonus: 'Double Points on All Rings & Gifts'
  },

  // ─── 2. ROBOTS & CYBORGS ───
  {
    id: 'blitz',
    name: 'Blitz Trial Bot',
    title: 'Trial Armored Sprint Bot',
    avatar: '🤖',
    type: 'aerobot',
    color: '#10b981',
    accent: '#34d399',
    shirtColor: '#065f46',
    pantsColor: '#0f172a',
    capColor: '#34d399',
    price: 0,
    priceLabel: 'FREE TRIAL ROBOT',
    unlocked: true,
    isFree: true,
    bonus: '1 free armor hit before stumble'
  },
  {
    id: 'aerobot',
    name: 'Aero Bot Alpha',
    title: 'High-Altitude Aerial Robot',
    avatar: '🛸',
    type: 'aerobot',
    color: '#06b6d4',
    accent: '#ffffff',
    shirtColor: '#f8fafc',
    pantsColor: '#0f172a',
    capColor: '#0f172a',
    price: 200000,
    priceLabel: '2.00 LAC COINS',
    unlocked: false,
    bonus: '+20% Jetpack Flight Time'
  },
  {
    id: 'cybertitan',
    name: 'Cyber Titan Mech',
    title: 'Heavy Titan Exoskeleton',
    avatar: '🛡️',
    type: 'cybertitan',
    color: '#0284c7',
    accent: '#38bdf8',
    shirtColor: '#1e293b',
    pantsColor: '#0f172a',
    capColor: '#38bdf8',
    price: 400000,
    priceLabel: '4.00 LAC COINS',
    unlocked: false,
    bonus: '+25% Magnet Pull Radius'
  },
  {
    id: 'steelvanguard',
    name: 'Steel Vanguard',
    title: 'Heavy Armored Defense Mech',
    avatar: '⚙️',
    type: 'cybertitan',
    color: '#64748b',
    accent: '#f43f5e',
    shirtColor: '#475569',
    pantsColor: '#0f172a',
    capColor: '#f43f5e',
    price: 600000,
    priceLabel: '6.00 LAC COINS',
    unlocked: false,
    bonus: 'Immune to first stumble obstacle'
  },
  {
    id: 'inferno',
    name: 'Inferno Overlord',
    title: 'Thermal Volcano Core Mech',
    avatar: '🔥',
    type: 'cybertitan',
    color: '#dc2626',
    accent: '#f97316',
    shirtColor: '#7f1d1d',
    pantsColor: '#0f172a',
    capColor: '#f97316',
    price: 800000,
    priceLabel: '8.00 LAC COINS',
    unlocked: false,
    bonus: '+40% Distance Score multiplier'
  },
  {
    id: 'zenithapex',
    name: 'Zenith Apex Prime',
    title: 'Infinite Grid Mech Champion',
    avatar: '🏆',
    type: 'aerobot',
    color: '#34d399',
    accent: '#10b981',
    shirtColor: '#065f46',
    pantsColor: '#0f172a',
    capColor: '#10b981',
    price: 1500000,
    priceLabel: '15.00 LAC COINS',
    unlocked: false,
    bonus: 'Gain 2x Coins from all Mystery Boxes'
  },
  {
    id: 'singularity',
    name: 'Singularity X Mecha',
    title: 'Cosmic Singularity Overlord',
    avatar: '🌀',
    type: 'aerobot',
    color: '#6366f1',
    accent: '#818cf8',
    shirtColor: '#3730a3',
    pantsColor: '#0f172a',
    capColor: '#818cf8',
    price: 2500000,
    priceLabel: '25.00 LAC COINS',
    unlocked: false,
    bonus: 'Absolute Immunity to minor stumbles'
  }
];

// 12 Hoverboard Skins — purchaseable with coins
export const HOVERBOARD_SKINS = [
  { id: 'classic',    name: 'Plasma Glide',      color: '#8b5cf6', price: 0,      unlocked: true,  icon: '🛹', desc: 'Starter board' },
  { id: 'fire',       name: 'Inferno Wave',       color: '#ef4444', price: 300,    unlocked: false, icon: '🔥', desc: 'Blazing fire board' },
  { id: 'cyber',      name: 'Cyan Vortex',        color: '#06b6d4', price: 750,    unlocked: false, icon: '🌀', desc: 'Cyber neon board' },
  { id: 'gold',       name: 'Celestial Gold',     color: '#eab308', price: 1500,   unlocked: false, icon: '✨', desc: 'Golden prestige board' },
  { id: 'ice',        name: 'Arctic Frost',       color: '#67e8f9', price: 2000,   unlocked: false, icon: '❄️', desc: 'Cryo frost board' },
  { id: 'thunder',    name: 'Thunder Strike',     color: '#fbbf24', price: 2500,   unlocked: false, icon: '⚡', desc: 'Electric lightning board' },
  { id: 'shadow',     name: 'Shadow Void',        color: '#6366f1', price: 3000,   unlocked: false, icon: '🌑', desc: 'Dark matter board' },
  { id: 'neon',       name: 'Neon Overdrive',     color: '#ec4899', price: 3500,   unlocked: false, icon: '💜', desc: 'Pink neon racing board' },
  { id: 'emerald',    name: 'Emerald Rush',       color: '#10b981', price: 4000,   unlocked: false, icon: '💚', desc: 'Toxic emerald board' },
  { id: 'magma',      name: 'Magma Core',         color: '#f97316', price: 5000,   unlocked: false, icon: '🌋', desc: 'Volcanic magma board' },
  { id: 'galaxy',     name: 'Galaxy Rider',       color: '#818cf8', price: 7500,   unlocked: false, icon: '🌌', desc: 'Galactic cosmic board' },
  { id: 'singularity',name: 'Singularity Board',  color: '#f43f5e', price: 10000,  unlocked: false, icon: '🔴', desc: 'Ultimate singularity board' }
];

export const MUSIC_PLAYLIST = [
  { id: 'song-1',  name: 'Victory Horizon (Main Theme)',  type: 'instrumental', price: 0,  level: 1,  author: 'Epic Synth',         isFree: true },
  { id: 'song-2',  name: 'Believe in Yourself',           type: 'vocal',        price: 40, level: 2,  author: 'Chamber Grit' },
  { id: 'song-3',  name: 'Eye of the Gladiator',          type: 'vocal',        price: 40, level: 3,  author: 'Metal Storm' },
  { id: 'song-4',  name: 'Rise Above the Grid',           type: 'instrumental', price: 40, level: 4,  author: 'Cyber Grid' },
  { id: 'song-5',  name: 'Limitless Power',               type: 'vocal',        price: 40, level: 5,  author: 'Future Blast' },
  { id: 'song-6',  name: 'Autobahn Speed',                type: 'instrumental', price: 40, level: 6,  author: 'Kraft Drive' },
  { id: 'song-7',  name: 'Neon Dreams',                   type: 'vocal',        price: 40, level: 7,  author: 'Retro Arc' },
  { id: 'song-8',  name: 'Eiffel Summit',                 type: 'instrumental', price: 40, level: 8,  author: 'Parisian Synth' },
  { id: 'song-9',  name: 'Gangnam Run',                   type: 'vocal',        price: 40, level: 9,  author: 'Seoul K-Pop' },
  { id: 'song-10', name: 'Sunset Drive',                  type: 'instrumental', price: 40, level: 10, author: 'California Wave' },
  { id: 'song-11', name: 'Harbour Cyberway',              type: 'vocal',        price: 40, level: 11, author: 'Sydney Vox' },
  { id: 'song-12', name: 'Solar Flare Fissure',           type: 'instrumental', price: 40, level: 12, author: 'Cairo Dunes' },
  { id: 'song-13', name: 'Frost Valley Echo',             type: 'vocal',        price: 40, level: 13, author: 'Toronto Blizzard' },
  { id: 'song-14', name: 'Coliseum Ascent',               type: 'instrumental', price: 40, level: 14, author: 'Rome Gladiator' },
  { id: 'song-15', name: 'Valkyrie Special Run',          type: 'vocal',        price: 40, level: 15, author: 'Olympic Queen' },
  { id: 'song-16', name: 'Aurora Glade Whisper',          type: 'instrumental', price: 40, level: 16, author: 'Reykjavik Ambient' },
  { id: 'song-17', name: 'Alps Thrill Chase',             type: 'vocal',        price: 40, level: 17, author: 'Swiss Peaks' },
  { id: 'song-18', name: 'Cyberpunk Redline',             type: 'instrumental', price: 40, level: 18, author: 'Hong Kong Neon' },
  { id: 'song-19', name: 'Bazaar Run',                    type: 'vocal',        price: 40, level: 19, author: 'Istanbul Sitar' },
  { id: 'song-20', name: 'Rainforest Sprinter',           type: 'instrumental', price: 40, level: 20, author: 'Amazon Beat' },
  { id: 'song-21', name: 'Taj Mahal Echoes',              type: 'vocal',        price: 40, level: 21, author: 'Delhi Beats' },
  { id: 'song-22', name: 'Volcanic Core',                 type: 'instrumental', price: 40, level: 22, author: 'Magma Core' },
  { id: 'song-23', name: 'Sky High Chase',                type: 'vocal',        price: 40, level: 23, author: 'Chicago Skyscraper' },
  { id: 'song-24', name: 'Frozen Tundra',                 type: 'instrumental', price: 40, level: 24, author: 'Siberian Storm' },
  { id: 'song-25', name: 'Carnival Jump',                 type: 'vocal',        price: 40, level: 25, author: 'Rio Samba' },
  { id: 'song-26', name: 'Sahara Heatwaves',              type: 'instrumental', price: 40, level: 26, author: 'Desert Wind' },
  { id: 'song-27', name: 'Tower Bridge Chase',            type: 'vocal',        price: 40, level: 27, author: 'London Punk' },
  { id: 'song-28', name: 'Tokyo Overdrive',               type: 'instrumental', price: 40, level: 28, author: 'Shibuya Crossing' },
  { id: 'song-29', name: 'Samba Horizon',                 type: 'vocal',        price: 40, level: 29, author: 'Rio Sunset' },
  { id: 'song-30', name: 'Ultimate Apex Champion',        type: 'instrumental', price: 40, level: 30, author: 'Valkyrie Theme' }
];

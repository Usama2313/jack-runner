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
export const INITIAL_SPEED = 24.0;
export const MAX_SPEED = 62.0;
export const SPEED_ACCELERATION = 0.28; // Speed increase per 100 meters

export const NUM_SECTIONS = 1; // Reduced sections per chunk for performance
export const JUMP_HEIGHT = 3.6;
export const JUMP_DURATION = 0.58; // seconds
export const ROLL_DURATION = 0.62; // seconds

export const PLAYER_Y_BASE = 0.75;
export const PLAYER_RADIUS = 0.55;
export const PLAYER_HEIGHT = 1.6;

// Track Generation
export const CHUNK_LENGTH = 70;
export const VISIBLE_CHUNKS = 3; // Reduced visible chunks for smoother performance
export const DESPAWN_Z = 20;

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
    name: 'Coin Magnet',
    duration: 10,
    color: '#3b82f6',
    icon: '🧲',
    description: 'Attracts all coins from all lanes'
  },
  [POWERUP_TYPES.JETPACK]: {
    name: 'Jetpack Flight',
    duration: 7,
    color: '#ec4899',
    icon: '🚀',
    description: 'Fly high above the trains and collect air coin trails'
  },
  [POWERUP_TYPES.MULTIPLIER_2X]: {
    name: '2X Multiplier',
    duration: 12,
    color: '#eab308',
    icon: '⚡',
    description: 'Doubles all score gained during run'
  },
  [POWERUP_TYPES.SUPER_SNEAKERS]: {
    name: 'Super Sneakers',
    duration: 10,
    color: '#10b981',
    icon: '👟',
    description: 'Jump twice as high over tall trains'
  },
  [POWERUP_TYPES.HOVERBOARD]: {
    name: 'Hoverboard',
    duration: 25,
    color: '#8b5cf6',
    icon: '🛹',
    description: 'Protects from 1 crash and glides smoothly'
  }
};

// Obstacle Types
export const OBSTACLE_TYPES = {
  TRAIN: 'TRAIN',
  TRAIN_RAMP: 'TRAIN_RAMP',
  BARRIER_LOW: 'BARRIER_LOW',
  BARRIER_HIGH: 'BARRIER_HIGH',
  TRAFFIC_LIGHT: 'TRAFFIC_LIGHT',
  CONSTRUCTION: 'CONSTRUCTION'
};

// Collectible gift box
export const COLLECTIBLE_TYPES = {
  COIN: 'COIN',
  GIFT: 'GIFT',
  POWERUP: 'POWERUP'
};

// 5 Levels — each has a time limit (seconds) and speed multiplier
export const LEVELS = [
  { id: 1, name: 'Station Zero',  timeLimit: 60,  speedMult: 1.0,  label: '🚉 STATION ZERO'  },
  { id: 2, name: 'Downtown Rush', timeLimit: 55,  speedMult: 1.2,  label: '🏙️ DOWNTOWN RUSH' },
  { id: 3, name: 'Neon Tunnels',  timeLimit: 50,  speedMult: 1.45, label: '🌆 NEON TUNNELS'   },
  { id: 4, name: 'Sky District',  timeLimit: 45,  speedMult: 1.75, label: '🌃 SKY DISTRICT'   },
  { id: 5, name: 'Hyper Loop',    timeLimit: 40,  speedMult: 2.1,  label: '⚡ HYPER LOOP'     }
];

// Characters
export const CHARACTERS = [
  {
    id: 'jake',
    name: 'Jake',
    title: 'The Subway Rebel',
    avatar: '🧢',
    color: '#3b82f6',
    accent: '#60a5fa',
    shirtColor: '#2563eb',
    pantsColor: '#1e293b',
    capColor: '#dc2626',
    price: 0,
    unlocked: true,
    bonus: '+5% Coin Value'
  },
  {
    id: 'tricky',
    name: 'Tricky',
    title: 'The Brainy Skater',
    avatar: '👓',
    color: '#ec4899',
    accent: '#f472b6',
    shirtColor: '#db2777',
    pantsColor: '#475569',
    capColor: '#059669',
    price: 500,
    unlocked: false,
    bonus: '+10% Multiplier Time'
  },
  {
    id: 'fresh',
    name: 'Fresh',
    title: 'The Boombox King',
    avatar: '📻',
    color: '#eab308',
    accent: '#fde047',
    shirtColor: '#ca8a04',
    pantsColor: '#1e1b4b',
    capColor: '#9333ea',
    price: 1200,
    unlocked: false,
    bonus: '+15% Magnet Radius'
  },
  {
    id: 'ninja',
    name: 'Yutani / Ninja',
    title: 'The Shadow Runner',
    avatar: '🥷',
    color: '#10b981',
    accent: '#34d399',
    shirtColor: '#047857',
    pantsColor: '#0f172a',
    capColor: '#10b981',
    price: 2500,
    unlocked: false,
    bonus: 'Start with 1 Free Hoverboard'
  }
];

export const HOVERBOARD_SKINS = [
  { id: 'classic', name: 'Neon Classic', color: '#8b5cf6', price: 0, unlocked: true },
  { id: 'fire', name: 'Inferno Flame', color: '#ef4444', price: 300, unlocked: false },
  { id: 'cyber', name: 'Cyber Wave', color: '#06b6d4', price: 750, unlocked: false },
  { id: 'gold', name: 'Solid Gold', color: '#eab308', price: 1500, unlocked: false }
];

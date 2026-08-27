import { create } from 'zustand';
import { GAME_STATES, INITIAL_SPEED, MAX_SPEED, SPEED_ACCELERATION, CHARACTERS, HOVERBOARD_SKINS, POWERUP_TYPES, LEVELS } from '../utils/constants';
import { soundEngine } from '../utils/soundEffects';

const getInitialStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const useGameStore = create((set, get) => ({
  // Game Flow
  gameState: GAME_STATES.MENU,
  speed: INITIAL_SPEED,
  targetSpeed: INITIAL_SPEED,

  // Player Run State
  lane: 0, // -1: Left, 0: Center, 1: Right
  playerY: 0,
  isJumping: false,
  isRolling: false,
  isDead: false,
  deathReason: null,

  // Level System
  currentLevel: 1,
  levelTimeLeft: LEVELS[0].timeLimit,
  levelComplete: false,
  giftCollectedType: null, // for toast notification

  // Run Stats
  score: 0,
  coinsCollected: 0,
  distanceTraveled: 0,
  baseMultiplier: 1,
  
  // Powerups State
  activePowerups: {
    [POWERUP_TYPES.MAGNET]: 0,
    [POWERUP_TYPES.JETPACK]: 0,
    [POWERUP_TYPES.MULTIPLIER_2X]: 0,
    [POWERUP_TYPES.SUPER_SNEAKERS]: 0,
    [POWERUP_TYPES.HOVERBOARD]: 0
  },

  // Persistent Player Profile & Inventory
  username: getInitialStorage('subway_username', 'Jake Runner'),
  totalCoins: getInitialStorage('subway_total_coins', 450),
  highscore: getInitialStorage('subway_highscore', 0),
  totalDistance: getInitialStorage('subway_total_distance', 0),
  unlockedCharacters: getInitialStorage('subway_unlocked_chars', ['jake']),
  selectedCharacter: getInitialStorage('subway_selected_char', 'jake'),
  unlockedBoards: getInitialStorage('subway_unlocked_boards', ['classic']),
  selectedBoard: getInitialStorage('subway_selected_board', 'classic'),
  upgrades: getInitialStorage('subway_upgrades', {
    [POWERUP_TYPES.MAGNET]: 1,
    [POWERUP_TYPES.JETPACK]: 1,
    [POWERUP_TYPES.MULTIPLIER_2X]: 1,
    [POWERUP_TYPES.SUPER_SNEAKERS]: 1
  }),

  // Audio & Settings
  isMuted: getInitialStorage('subway_muted', false),
  sfxVolume: getInitialStorage('subway_sfx_vol', 0.8),
  musicVolume: getInitialStorage('subway_music_vol', 0.5),

  // Online & Auth
  authToken: getInitialStorage('subway_auth_token', null),
  authUser: getInitialStorage('subway_auth_user', null),
  leaderboard: [],
  onlineCount: 1,

  // Actions
  setGameState: (state) => {
    const current = get().gameState;
    if (state === GAME_STATES.PLAYING && current !== GAME_STATES.PLAYING) {
      soundEngine.startMusic();
    } else if (state === GAME_STATES.GAME_OVER || state === GAME_STATES.MENU) {
      soundEngine.stopMusic();
    }
    set({ gameState: state });
  },

  startGame: () => {
    soundEngine.init();
    const character = CHARACTERS.find(c => c.id === get().selectedCharacter);
    const hasNinjaBonus = character?.id === 'ninja';

    set({
      gameState: GAME_STATES.PLAYING,
      score: 0,
      coinsCollected: 0,
      distanceTraveled: 0,
      speed: INITIAL_SPEED,
      targetSpeed: INITIAL_SPEED,
      lane: 0,
      playerY: 0,
      isJumping: false,
      isRolling: false,
      isDead: false,
      deathReason: null,
      levelTimeLeft: LEVELS[(get().currentLevel - 1)].timeLimit,
      levelComplete: false,
      giftCollectedType: null,
      activePowerups: {
        [POWERUP_TYPES.MAGNET]: 0,
        [POWERUP_TYPES.JETPACK]: 0,
        [POWERUP_TYPES.MULTIPLIER_2X]: 0,
        [POWERUP_TYPES.SUPER_SNEAKERS]: 0,
        [POWERUP_TYPES.HOVERBOARD]: hasNinjaBonus ? 15 : 0
      }
    });

    soundEngine.startMusic();
  },

  pauseGame: () => {
    if (get().gameState === GAME_STATES.PLAYING) {
      soundEngine.stopMusic();
      set({ gameState: GAME_STATES.PAUSED });
    }
  },

  resumeGame: () => {
    if (get().gameState === GAME_STATES.PAUSED) {
      soundEngine.startMusic();
      set({ gameState: GAME_STATES.PLAYING });
    }
  },

  setLane: (targetLane) => {
    if (get().gameState !== GAME_STATES.PLAYING || get().isDead) return;
    const clamped = Math.max(-1, Math.min(1, targetLane));
    if (clamped !== get().lane) {
      soundEngine.playLaneSwitch();
      set({ lane: clamped });
    }
  },

  moveLeft: () => {
    const current = get().lane;
    if (current > -1) get().setLane(current - 1);
  },

  moveRight: () => {
    const current = get().lane;
    if (current < 1) get().setLane(current + 1);
  },

  jump: () => {
    if (get().gameState !== GAME_STATES.PLAYING || get().isDead) return;
    const isSneakers = get().activePowerups[POWERUP_TYPES.SUPER_SNEAKERS] > 0;
    const isJetpack = get().activePowerups[POWERUP_TYPES.JETPACK] > 0;
    if (isJetpack) return;

    if (!get().isJumping) {
      soundEngine.playJump();
      set({ isJumping: true, isRolling: false });
    }
  },

  roll: () => {
    if (get().gameState !== GAME_STATES.PLAYING || get().isDead) return;
    const isJetpack = get().activePowerups[POWERUP_TYPES.JETPACK] > 0;
    if (isJetpack) return;

    soundEngine.playSlide();
    set({ isRolling: true, isJumping: false });
  },

  setJumping: (isJumping) => set({ isJumping }),
  setRolling: (isRolling) => set({ isRolling }),

  collectCoin: (multiplier = 1) => {
    const char = CHARACTERS.find(c => c.id === get().selectedCharacter);
    const coinBonus = char?.id === 'jake' ? 1.05 : 1.0;
    const is2x = get().activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0 ? 2 : 1;
    const pointsGained = Math.round(10 * is2x * coinBonus * multiplier);

    soundEngine.playCoin(1.0 + (get().coinsCollected % 20) * 0.03);

    set((state) => ({
      coinsCollected: state.coinsCollected + 1,
      totalCoins: state.totalCoins + 1,
      score: state.score + pointsGained
    }));

    setStorage('subway_total_coins', get().totalCoins);
  },

  activatePowerup: (type) => {
    soundEngine.playPowerup();
    const upgradeLevel = get().upgrades[type] || 1;
    const baseDuration = type === POWERUP_TYPES.JETPACK ? 7 : (type === POWERUP_TYPES.HOVERBOARD ? 25 : 10);
    const totalDuration = baseDuration + (upgradeLevel - 1) * 3;

    set((state) => ({
      activePowerups: {
        ...state.activePowerups,
        [type]: totalDuration
      }
    }));
  },

  activateHoverboard: () => {
    if (get().gameState !== GAME_STATES.PLAYING || get().isDead) return;
    const current = get().activePowerups[POWERUP_TYPES.HOVERBOARD];
    if (current <= 0) {
      get().activatePowerup(POWERUP_TYPES.HOVERBOARD);
    }
  },

  updatePowerupTimers: (delta) => {
    set((state) => {
      const updated = { ...state.activePowerups };
      let changed = false;

      Object.keys(updated).forEach((key) => {
        if (updated[key] > 0) {
          updated[key] = Math.max(0, updated[key] - delta);
          changed = true;
        }
      });

      return changed ? { activePowerups: updated } : {};
    });
  },

  // Level timer tick — call every frame with delta
  tickLevelTimer: (delta) => {
    const { levelTimeLeft, levelComplete, gameState, isDead } = get();
    if (gameState !== GAME_STATES.PLAYING || isDead || levelComplete) return;
    const newTime = Math.max(0, levelTimeLeft - delta);
    if (newTime <= 0) {
      set({ levelTimeLeft: 0, levelComplete: true, gameState: GAME_STATES.LEVEL_COMPLETE });
    } else {
      set({ levelTimeLeft: newTime });
    }
  },

  // Advance to next level
  advanceLevel: () => {
    const next = Math.min(5, get().currentLevel + 1);
    const levelCfg = LEVELS[next - 1];
    set({
      currentLevel: next,
      levelTimeLeft: levelCfg.timeLimit,
      levelComplete: false,
      gameState: GAME_STATES.PLAYING,
      score: 0,
      coinsCollected: 0,
      distanceTraveled: 0,
      speed: INITIAL_SPEED * levelCfg.speedMult,
      targetSpeed: INITIAL_SPEED * levelCfg.speedMult,
      lane: 0, playerY: 0, isJumping: false, isRolling: false, isDead: false, deathReason: null,
      activePowerups: {
        [POWERUP_TYPES.MAGNET]: 0,
        [POWERUP_TYPES.JETPACK]: 0,
        [POWERUP_TYPES.MULTIPLIER_2X]: 0,
        [POWERUP_TYPES.SUPER_SNEAKERS]: 0,
        [POWERUP_TYPES.HOVERBOARD]: 0
      }
    });
    soundEngine.startMusic();
  },

  // Quick buy powerup mid-run with coins
  quickBuyPowerup: (type, cost) => {
    const { totalCoins, gameState, isDead } = get();
    if (gameState !== GAME_STATES.PLAYING || isDead) return false;
    if (totalCoins < cost) return false;
    const newCoins = totalCoins - cost;
    set({ totalCoins: newCoins });
    setStorage('subway_total_coins', newCoins);
    get().activatePowerup(type);
    return true;
  },

  // Gift box collected — activate random powerup
  collectGift: () => {
    const types = [POWERUP_TYPES.MAGNET, POWERUP_TYPES.MULTIPLIER_2X, POWERUP_TYPES.SUPER_SNEAKERS, POWERUP_TYPES.HOVERBOARD];
    const type = types[Math.floor(Math.random() * types.length)];
    get().activatePowerup(type);
    set({ giftCollectedType: type });
    setTimeout(() => set({ giftCollectedType: null }), 2500);
  },

  clearGiftToast: () => set({ giftCollectedType: null })
  ,

  incrementDistanceAndScore: (deltaDistance) => {
    const is2x = get().activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0 ? 2 : 1;
    const scoreToAdd = Math.round(deltaDistance * is2x);

    set((state) => {
      const newDistance = state.distanceTraveled + deltaDistance;
      const newScore = state.score + scoreToAdd;
      const newSpeed = Math.min(
        MAX_SPEED,
        INITIAL_SPEED + (newDistance / 100) * SPEED_ACCELERATION
      );

      return {
        distanceTraveled: newDistance,
        score: newScore,
        speed: newSpeed
      };
    });
  },

  triggerGameOver: (reason = 'train_collision') => {
    // Check if hoverboard saved player
    if (get().activePowerups[POWERUP_TYPES.HOVERBOARD] > 0) {
      soundEngine.playHoverboardSave();
      set((state) => ({
        activePowerups: {
          ...state.activePowerups,
          [POWERUP_TYPES.HOVERBOARD]: 0
        }
      }));
      return false; // Prevent game over
    }

    soundEngine.playCrash();
    soundEngine.stopMusic();

    const finalScore = get().score;
    const currentHigh = get().highscore;
    const isNewHigh = finalScore > currentHigh;
    const newHighscore = isNewHigh ? finalScore : currentHigh;

    setStorage('subway_highscore', newHighscore);
    setStorage('subway_total_coins', get().totalCoins);
    setStorage('subway_total_distance', get().totalDistance + get().distanceTraveled);

    set({
      isDead: true,
      deathReason: reason,
      highscore: newHighscore,
      gameState: GAME_STATES.GAME_OVER
    });

    return true;
  },

  // Shop & Customization
  selectCharacter: (charId) => {
    if (get().unlockedCharacters.includes(charId)) {
      set({ selectedCharacter: charId });
      setStorage('subway_selected_char', charId);
    }
  },

  buyCharacter: (charId, price) => {
    const coins = get().totalCoins;
    if (coins >= price && !get().unlockedCharacters.includes(charId)) {
      const newUnlocked = [...get().unlockedCharacters, charId];
      const newCoins = coins - price;
      set({
        totalCoins: newCoins,
        unlockedCharacters: newUnlocked,
        selectedCharacter: charId
      });
      setStorage('subway_total_coins', newCoins);
      setStorage('subway_unlocked_chars', newUnlocked);
      setStorage('subway_selected_char', charId);
      soundEngine.playPowerup();
      return true;
    }
    return false;
  },

  selectBoard: (boardId) => {
    if (get().unlockedBoards.includes(boardId)) {
      set({ selectedBoard: boardId });
      setStorage('subway_selected_board', boardId);
    }
  },

  buyBoard: (boardId, price) => {
    const coins = get().totalCoins;
    if (coins >= price && !get().unlockedBoards.includes(boardId)) {
      const newUnlocked = [...get().unlockedBoards, boardId];
      const newCoins = coins - price;
      set({
        totalCoins: newCoins,
        unlockedBoards: newUnlocked,
        selectedBoard: boardId
      });
      setStorage('subway_total_coins', newCoins);
      setStorage('subway_unlocked_boards', newUnlocked);
      setStorage('subway_selected_board', boardId);
      soundEngine.playPowerup();
      return true;
    }
    return false;
  },

  upgradePowerup: (type, cost) => {
    const coins = get().totalCoins;
    const currentLevel = get().upgrades[type] || 1;
    if (coins >= cost && currentLevel < 5) {
      const newCoins = coins - cost;
      const newUpgrades = {
        ...get().upgrades,
        [type]: currentLevel + 1
      };
      set({ totalCoins: newCoins, upgrades: newUpgrades });
      setStorage('subway_total_coins', newCoins);
      setStorage('subway_upgrades', newUpgrades);
      soundEngine.playPowerup();
      return true;
    }
    return false;
  },

  // Settings
  toggleMute: () => {
    const muted = !get().isMuted;
    soundEngine.setMuted(muted);
    set({ isMuted: muted });
    setStorage('subway_muted', muted);
  },

  setVolume: (sfx, music) => {
    soundEngine.setVolume(sfx, music);
    set({ sfxVolume: sfx, musicVolume: music });
    setStorage('subway_sfx_vol', sfx);
    setStorage('subway_music_vol', music);
  },

  setUsername: (name) => {
    const clean = name.trim().slice(0, 16) || 'Jake Runner';
    set({ username: clean });
    setStorage('subway_username', clean);
  },

  setAuth: (user, token) => {
    set({ authUser: user, authToken: token, username: user?.username || get().username });
    if (token) setStorage('subway_auth_token', token);
    if (user) setStorage('subway_auth_user', user);
  },

  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setOnlineCount: (count) => set({ onlineCount: count })
}));

if (typeof window !== 'undefined') {
  window.__store = useGameStore;
}

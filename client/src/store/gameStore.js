import { create } from 'zustand';
import {
  GAME_STATES,
  INITIAL_SPEED,
  MAX_SPEED,
  SPEED_ACCELERATION,
  CHARACTERS,
  HOVERBOARD_SKINS,
  POWERUP_TYPES,
  LEVELS,
  CHASER_CONFIG
} from '../utils/constants';
import { soundEngine } from '../utils/soundEffects';

const parseValidNumber = (val, fallback = 0) => {
  if (val === null || val === undefined) return fallback;
  const num = typeof val === 'number' ? val : Number(val);
  return isNaN(num) ? fallback : num;
};

const parseValidLevel = (val, fallback = 1) => {
  const num = parseValidNumber(val, fallback);
  return Math.max(1, Math.min(LEVELS.length, Math.floor(num)));
};

const getInitialStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null' || item === 'NaN') return fallback;
    const parsed = JSON.parse(item);
    if (typeof fallback === 'number') {
      return parseValidNumber(parsed, fallback);
    }
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// Debounced storage sync for coins to prevent frame drops during runs
let saveCoinsTimeout = null;
const debouncedSaveTotalCoins = (coins) => {
  if (saveCoinsTimeout) clearTimeout(saveCoinsTimeout);
  saveCoinsTimeout = setTimeout(() => {
    setStorage('kinetic_total_coins', coins);
  }, 300);
};

export const useGameStore = create((set, get) => {
  const initialLevel = parseValidLevel(getInitialStorage('kinetic_current_level', 1));
  const initialLevelCfg = LEVELS[initialLevel - 1] || LEVELS[0];

  return {
    // Game Flow
    gameState: GAME_STATES.MENU,
    speed: INITIAL_SPEED * initialLevelCfg.speedMult,
    targetSpeed: INITIAL_SPEED * initialLevelCfg.speedMult,
    isActivated: getInitialStorage('kinetic_is_activated', false),
    showPaymentModal: false,
    paymentItemType: 'vip',
    paymentItemId: null,
    paymentAmount: 1000,

    // Player Run State
    lane: 0, // -1: Left, 0: Center, 1: Right
    playerY: 0,
    isJumping: false,
    isRolling: false,
    isDead: false,
    deathReason: null,

    // Robot Destroyer / Repairer Chaser State
    chaserDistance: CHASER_CONFIG.NORMAL_DISTANCE,
    isStumbling: false,
    stumbleTimer: 0,
    isCaptured: false,

    // Level System (30 progressive levels)
    currentLevel: initialLevel,
    unlockedLevels: getInitialStorage('kinetic_unlocked_levels', [1]),
    levelTimeLeft: initialLevelCfg.timeLimit || 50,
    levelComplete: false,

    // Mystery Box — Track collected during run, reveal at end
    activeMysteryBox: null,
    isMysteryBoxPaused: false,
    mysteryBoxCount: 0,  // boxes collected during current run
    pendingBoxRewards: [], // rewards to reveal at game-over screen

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
      [POWERUP_TYPES.HOVERBOARD]: 0,
      [POWERUP_TYPES.ROBOT_REPAIR]: 0,
      [POWERUP_TYPES.PLASMA_SHIELD]: 0,
      [POWERUP_TYPES.KINETIC_BLASTER]: 0,
      [POWERUP_TYPES.SPEED_BOOST]: 0,
      [POWERUP_TYPES.COIN_RAIN]: 0,
      [POWERUP_TYPES.INVINCIBILITY]: 0
    },

    // Persistent Player Profile & Inventory
    username: getInitialStorage('kinetic_username', 'Kinetic Jack'),
    totalCoins: parseValidNumber(getInitialStorage('kinetic_total_coins', 2500), 2500),
    highscore: parseValidNumber(getInitialStorage('kinetic_highscore', 0), 0),
    totalDistance: parseValidNumber(getInitialStorage('kinetic_total_distance', 0), 0),
    unlockedCharacters: getInitialStorage('kinetic_unlocked_chars', ['jack']),
    selectedCharacter: getInitialStorage('kinetic_selected_char', 'jack'),
    unlockedBoards: getInitialStorage('kinetic_unlocked_boards', ['classic']),
    selectedBoard: getInitialStorage('kinetic_selected_board', 'classic'),
    unlockedSongs: getInitialStorage('kinetic_unlocked_songs', ['song-1']),
    selectedSong: getInitialStorage('kinetic_selected_song', 'song-1'),
    upgrades: getInitialStorage('kinetic_upgrades', {
      [POWERUP_TYPES.MAGNET]: 1,
      [POWERUP_TYPES.JETPACK]: 1,
      [POWERUP_TYPES.MULTIPLIER_2X]: 1,
      [POWERUP_TYPES.SUPER_SNEAKERS]: 1
    }),

    // Audio & Settings
    isMuted: getInitialStorage('kinetic_muted', false),
    sfxVolume: parseValidNumber(getInitialStorage('kinetic_sfx_vol', 0.8), 0.8),
    musicVolume: parseValidNumber(getInitialStorage('kinetic_music_vol', 0.5), 0.5),

    // Online & Auth
    authToken: getInitialStorage('kinetic_auth_token', null),
    authUser: getInitialStorage('kinetic_auth_user', null),
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
    // Reset the game state for a fresh start after Game Over
    resetGame: () => {
      // ALWAYS start from level 1 for a fresh run (unless a specific design choice is made)
      const startLevel = 1;
      // Reset transient state for a new game session
      set({
        isDead: false,
        isCaptured: false,
        deathReason: null,
        levelComplete: false,
        pendingBoxRewards: [],
        activeMysteryBox: null,
        mysteryBoxCount: 0,
        isMysteryBoxPaused: false,
        approachingHurdle: null,
        // Reset level timer and ensure we start at the first level
        currentLevel: startLevel
      });
      // Invoke startGame with the first level to apply payment gating if needed
      get().startGame(startLevel);
    },

    triggerPayment: (itemType, itemId, amount) => {
      set({
        paymentItemType: itemType,
        paymentItemId: itemId,
        paymentAmount: amount,
        showPaymentModal: true
      });
    },

    startGame: (levelOverride = null) => {
      // Login gate — require authentication
      const authUser = get().authUser;
      if (!authUser) {
        return; // Not logged in, MainMenu handles the prompt
      }

      soundEngine.init();
      const isActivated = get().isActivated;
      const unlockedLevels = get().unlockedLevels || [1];
      const targetLvl = levelOverride !== null && levelOverride !== undefined ? levelOverride : get().currentLevel;
      const clampedLevel = parseValidLevel(targetLvl);

      if (clampedLevel > 1 && !isActivated && !unlockedLevels.includes(clampedLevel)) {
        get().triggerPayment('stage', clampedLevel, 40);
        return;
      }

      const levelCfg = LEVELS[clampedLevel - 1] || LEVELS[0];

      const character = CHARACTERS.find((c) => c.id === get().selectedCharacter);
      const hasBoardBonus = character?.id === 'phantom';

      setStorage('kinetic_current_level', clampedLevel);

      set({
        gameState: GAME_STATES.PLAYING,
        currentLevel: clampedLevel,
        score: 0,
        coinsCollected: 0,
        distanceTraveled: 0,
        speed: INITIAL_SPEED * levelCfg.speedMult,
        targetSpeed: INITIAL_SPEED * levelCfg.speedMult,
        lane: 0,
        playerY: 0,
        isJumping: false,
        isRolling: false,
        isDead: false,
        deathReason: null,
        isCaptured: false,
        isStumbling: false,
        stumbleTimer: 0,
        chaserDistance: CHASER_CONFIG.NORMAL_DISTANCE,
        levelTimeLeft: levelCfg.timeLimit,
        levelComplete: false,
        activeMysteryBox: null,
        isMysteryBoxPaused: false,
        mysteryBoxCount: 0,
        pendingBoxRewards: [],
        activePowerups: {
          [POWERUP_TYPES.MAGNET]: 0,
          [POWERUP_TYPES.JETPACK]: 0,
          [POWERUP_TYPES.MULTIPLIER_2X]: 0,
          [POWERUP_TYPES.SUPER_SNEAKERS]: 0,
          [POWERUP_TYPES.HOVERBOARD]: hasBoardBonus ? 25 : 0,
          [POWERUP_TYPES.ROBOT_REPAIR]: 0,
          [POWERUP_TYPES.PLASMA_SHIELD]: 0,
          [POWERUP_TYPES.KINETIC_BLASTER]: 0,
          [POWERUP_TYPES.SPEED_BOOST]: 0,
          [POWERUP_TYPES.COIN_RAIN]: 0,
          [POWERUP_TYPES.INVINCIBILITY]: 0
        }
      });

      soundEngine.startMusic();
    },

    selectLevel: (levelId) => {
      const isActivated = get().isActivated;
      const unlockedLevels = get().unlockedLevels || [1];
      const clamped = parseValidLevel(levelId);
      if (clamped > 1 && !isActivated && !unlockedLevels.includes(clamped)) {
        get().triggerPayment('stage', clamped, 40);
        return;
      }
      const levelCfg = LEVELS[clamped - 1] || LEVELS[0];
      set({
        currentLevel: clamped,
        levelTimeLeft: levelCfg.timeLimit,
        speed: INITIAL_SPEED * levelCfg.speedMult,
        targetSpeed: INITIAL_SPEED * levelCfg.speedMult
      });
      setStorage('kinetic_current_level', clamped);
    },

    setActivated: (val) => {
      set({ isActivated: val });
      setStorage('kinetic_is_activated', val);
    },

    setShowPaymentModal: (val) => set({ showPaymentModal: val }),

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

    // Accurate Ring / Coin Collection
    collectCoin: (multiplier = 1) => {
      const char = CHARACTERS.find((c) => c.id === get().selectedCharacter);
      const coinBonus = char?.id === 'jack' ? 1.10 : 1.0;
      const is2x = get().activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0 ? 2 : 1;
      const pointsGained = Math.round(20 * is2x * coinBonus * multiplier);

      soundEngine.playCoin(1.0 + (get().coinsCollected % 25) * 0.025);

      set((state) => {
        const newCoinsCollected = state.coinsCollected + 1;
        const newTotal = state.totalCoins + 1;
        const newScore = state.score + pointsGained;
        debouncedSaveTotalCoins(newTotal);

        return {
          coinsCollected: newCoinsCollected,
          totalCoins: newTotal,
          score: newScore
        };
      });
    },

    activatePowerup: (type) => {
      soundEngine.playPowerup();
      const upgradeLevel = get().upgrades[type] || 1;
      const char = CHARACTERS.find((c) => c.id === get().selectedCharacter);
      let baseDuration = type === POWERUP_TYPES.JETPACK ? 8 : (type === POWERUP_TYPES.HOVERBOARD ? 25 : 12);
      if (type === POWERUP_TYPES.JETPACK && char?.id === 'aerobot') {
        baseDuration += 4;
      }
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

    // Stumble detection on minor hurdle clip
    stumble: (reason = 'minor_hit') => {
      const { activePowerups, isStumbling, chaserDistance, isDead, gameState } = get();
      if (gameState !== GAME_STATES.PLAYING || isDead) return;

      // Hoverboard shields from stumble
      if (activePowerups[POWERUP_TYPES.HOVERBOARD] > 0) {
        soundEngine.playHoverboardSave();
        set((state) => ({
          activePowerups: { ...state.activePowerups, [POWERUP_TYPES.HOVERBOARD]: 0 }
        }));
        return;
      }

      // If already stumbling and chaser is aggressively close, captured!
      if (isStumbling && chaserDistance <= CHASER_CONFIG.CLOSE_DISTANCE + 1.2) {
        get().triggerGameOver('captured_by_destroyer');
        return;
      }

      // Trigger stumble reaction
      soundEngine.playStumble();
      soundEngine.playSiren();

      set((state) => ({
        isStumbling: true,
        stumbleTimer: CHASER_CONFIG.STUMBLE_DURATION,
        speed: Math.max(INITIAL_SPEED * 0.7, state.speed * 0.75)
      }));
    },

    // Head-on lethal crash
    triggerCrash: (reason = 'obstacle_crash') => {
      get().triggerGameOver(reason);
    },

    updateChaser: (delta) => {
      const { isStumbling, stumbleTimer, chaserDistance, isDead, isCaptured } = get();
      if (isDead || isCaptured) return;

      if (isStumbling) {
        const newTimer = Math.max(0, stumbleTimer - delta);
        // Rapid approach
        const newDist = Math.max(
          CHASER_CONFIG.CLOSE_DISTANCE,
          chaserDistance - CHASER_CONFIG.APPROACH_SPEED * delta
        );
        set({
          stumbleTimer: newTimer,
          isStumbling: newTimer > 0,
          chaserDistance: newDist
        });
      } else {
        // Gentle retreat back to normal trailing distance
        if (chaserDistance < CHASER_CONFIG.NORMAL_DISTANCE) {
          const newDist = Math.min(
            CHASER_CONFIG.NORMAL_DISTANCE,
            chaserDistance + CHASER_CONFIG.RETREAT_SPEED * delta
          );
          set({ chaserDistance: newDist });
        }
      }
    },

    // Approaching Hurdle Proximity Warning & Action Hint
    approachingHurdle: null,
    setApproachingHurdle: (hurdle) => set({ approachingHurdle: hurdle }),

    // Level timer tick with safe bounds
    tickLevelTimer: (delta) => {
      const { levelTimeLeft, levelComplete, gameState, isDead } = get();
      if (gameState !== GAME_STATES.PLAYING || isDead || levelComplete) return;

      const newTime = Math.max(0, levelTimeLeft - delta);
      if (newTime <= 0) {
        // Stage completed! Do NOT auto-unlock stage 2+ for free (must be purchased!)
        soundEngine.stopMusic();
        set({
          levelTimeLeft: 0,
          levelComplete: true,
          gameState: GAME_STATES.LEVEL_COMPLETE
        });
      } else {
        set({ levelTimeLeft: newTime });
      }
    },

    // Advance to next level safely — Strictly enforces Stage 2+ Payment Gate
    advanceLevel: () => {
      const isActivated = get().isActivated;
      const unlockedLevels = get().unlockedLevels || [1];
      const current = parseValidLevel(get().currentLevel);
      const next = Math.min(LEVELS.length, current + 1);

      // Strict Payment Check: Stage 2+ requires VIP or individual Rs. 40 purchase
      if (next > 1 && !isActivated && !unlockedLevels.includes(next)) {
        get().triggerPayment('stage', next, 40);
        return;
      }

      const levelCfg = LEVELS[next - 1] || LEVELS[LEVELS.length - 1];
      setStorage('kinetic_current_level', next);

      // Ensure the newly unlocked level is recorded in unlockedLevels (if not already present)
      const unlocked = get().unlockedLevels || [1];
      if (!unlocked.includes(next)) {
        set({ unlockedLevels: [...unlocked, next] });
      }

      set({
        currentLevel: next,
        levelTimeLeft: levelCfg.timeLimit,
        levelComplete: false,
        gameState: GAME_STATES.PLAYING,
        score: get().score,
        coinsCollected: get().coinsCollected,
        distanceTraveled: 0,
        speed: INITIAL_SPEED * levelCfg.speedMult,
        targetSpeed: INITIAL_SPEED * levelCfg.speedMult,
        lane: 0,
        playerY: 0,
        isJumping: false,
        isRolling: false,
        isDead: false,
        deathReason: null,
        isCaptured: false,
        isStumbling: false,
        stumbleTimer: 0,
        chaserDistance: CHASER_CONFIG.NORMAL_DISTANCE,
        activeMysteryBox: null,
        isMysteryBoxPaused: false,
        approachingHurdle: null,
        activePowerups: {
          [POWERUP_TYPES.MAGNET]: 0,
          [POWERUP_TYPES.JETPACK]: 0,
          [POWERUP_TYPES.MULTIPLIER_2X]: 0,
          [POWERUP_TYPES.SUPER_SNEAKERS]: 0,
          [POWERUP_TYPES.HOVERBOARD]: 0,
          [POWERUP_TYPES.ROBOT_REPAIR]: 0,
          [POWERUP_TYPES.PLASMA_SHIELD]: 0,
          [POWERUP_TYPES.KINETIC_BLASTER]: 0,
          [POWERUP_TYPES.SPEED_BOOST]: 0,
          [POWERUP_TYPES.COIN_RAIN]: 0,
          [POWERUP_TYPES.INVINCIBILITY]: 0
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
      setStorage('kinetic_total_coins', newCoins);
      get().activatePowerup(type);
      return true;
    },

    // Mystery Box collected: Just track count during run — open all at end
    collectMysteryBox: () => {
      soundEngine.playPowerup();
      // Random coin reward in hundreds
      const coinAmounts = [100, 200, 300, 400, 500];
      const coinsWon = coinAmounts[Math.floor(Math.random() * coinAmounts.length)];
      
      const types = [
        POWERUP_TYPES.MAGNET,
        POWERUP_TYPES.JETPACK,
        POWERUP_TYPES.MULTIPLIER_2X,
        POWERUP_TYPES.SUPER_SNEAKERS,
        POWERUP_TYPES.HOVERBOARD
      ];
      
      const isVideoReward = Math.random() > 0.5;
      const rewardPayload = { coins: coinsWon };
      
      if (isVideoReward) {
        rewardPayload.isVideo = true;
      } else {
        rewardPayload.powerup = types[Math.floor(Math.random() * types.length)];
      }

      set((state) => ({
        mysteryBoxCount: state.mysteryBoxCount + 1,
        pendingBoxRewards: [
          ...state.pendingBoxRewards,
          rewardPayload
        ]
      }));
    },

    // Open all mystery boxes at end of run — award all rewards at once
    openAllMysteryBoxes: () => {
      const rewards = get().pendingBoxRewards;
      if (!rewards || rewards.length === 0) return;
      let totalCoinsWon = 0;
      rewards.forEach((r) => { totalCoinsWon += r.coins; });
      const newTotal = (get().totalCoins || 0) + totalCoinsWon;
      setStorage('kinetic_total_coins', newTotal);
      set({ totalCoins: newTotal, activeMysteryBox: { rewards, totalCoins: totalCoinsWon }, pendingBoxRewards: [], mysteryBoxCount: 0 });
    },

    closeMysteryBox: () => {
      set({ activeMysteryBox: null, isMysteryBoxPaused: false });
    },

    addBonusCoins: (amount) => {
      const added = Math.max(0, Number(amount) || 0);
      const newTotal = (get().totalCoins || 0) + added;
      setStorage('kinetic_total_coins', newTotal);
      set((state) => ({
        totalCoins: newTotal,
        coinsCollected: state.coinsCollected + added
      }));
      return newTotal;
    },

    incrementDistanceAndScore: (deltaDistance) => {
      const char = CHARACTERS.find((c) => c.id === get().selectedCharacter);
      const scoreBonus = char?.id === 'valkyrie' ? 1.25 : 1.0;
      const is2x = get().activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0 ? 2 : 1;
      const scoreToAdd = Math.round(deltaDistance * is2x * scoreBonus);

      set((state) => {
        const newDistance = state.distanceTraveled + deltaDistance;
        const newScore = state.score + scoreToAdd;
        const safeLvl = parseValidLevel(state.currentLevel);
        const baseLevelCfg = LEVELS[safeLvl - 1] || LEVELS[0];
        const newSpeed = Math.min(
          MAX_SPEED,
          INITIAL_SPEED * baseLevelCfg.speedMult + (newDistance / 100) * SPEED_ACCELERATION
        );

        return {
          distanceTraveled: newDistance,
          score: newScore,
          speed: newSpeed
        };
      });
    },

    triggerGameOver: (reason = 'obstacle_collision') => {
      // Check if hoverboard saved player
      if (get().activePowerups[POWERUP_TYPES.HOVERBOARD] > 0) {
        soundEngine.playHoverboardSave();
        set((state) => ({
          activePowerups: {
            ...state.activePowerups,
            [POWERUP_TYPES.HOVERBOARD]: 0
          }
        }));
        return false; // Saved by hoverboard
      }

      soundEngine.playCrash();
      soundEngine.stopMusic();

      const finalScore = get().score;
      const currentHigh = get().highscore;
      const isNewHigh = finalScore > currentHigh;
      const newHighscore = isNewHigh ? finalScore : currentHigh;

      setStorage('kinetic_highscore', newHighscore);
      setStorage('kinetic_total_coins', get().totalCoins);
      setStorage('kinetic_total_distance', get().totalDistance + get().distanceTraveled);

      const isCaptured = reason === 'captured_by_destroyer';

      set({
        isDead: true,
        isCaptured,
        deathReason: reason,
        highscore: newHighscore,
        gameState: GAME_STATES.GAME_OVER
      });

      return true;
    },

    // Shop & Customization - Instant Character / Robot Switching with Coins
    selectCharacter: (charId) => {
      const isActivated = get().isActivated;
      const char = CHARACTERS.find((c) => c.id === charId);
      const isPremiumRobot = charId !== 'blitz' && !char?.isHuman;
      if (isPremiumRobot && !isActivated) {
        return false;
      }

      const unlocked = get().unlockedCharacters || ['jack'];
      if (isActivated || unlocked.includes(charId)) {
        set({ selectedCharacter: charId });
        setStorage('kinetic_selected_char', charId);
        soundEngine.playPowerup();
        return true;
      }
      return false;
    },

    buyCharacter: (charId, price) => {
      const isActivated = get().isActivated;
      const char = CHARACTERS.find((c) => c.id === charId);
      const isPremiumRobot = charId !== 'blitz' && !char?.isHuman;
      if (isPremiumRobot && !isActivated) {
        return false;
      }

      const coins = parseValidNumber(get().totalCoins, 0);
      const unlocked = get().unlockedCharacters || ['jack'];
      if (coins >= price && !unlocked.includes(charId)) {
        const newUnlocked = [...unlocked, charId];
        const newCoins = coins - price;
        set({
          totalCoins: newCoins,
          unlockedCharacters: newUnlocked,
          selectedCharacter: charId
        });
        setStorage('kinetic_total_coins', newCoins);
        setStorage('kinetic_unlocked_chars', newUnlocked);
        setStorage('kinetic_selected_char', charId);
        soundEngine.playPowerup();
        return true;
      }
      return false;
    },

    selectSong: (songId) => {
      const unlocked = get().unlockedSongs || ['song-1'];
      if (unlocked.includes(songId)) {
        set({ selectedSong: songId });
        setStorage('kinetic_selected_song', songId);
        return true;
      }
      return false;
    },

    buySong: (songId, price) => {
      const unlocked = get().unlockedSongs || ['song-1'];
      if (!unlocked.includes(songId)) {
        const newUnlocked = [...unlocked, songId];
        set({
          unlockedSongs: newUnlocked,
          selectedSong: songId
        });
        setStorage('kinetic_unlocked_songs', newUnlocked);
        setStorage('kinetic_selected_song', songId);
        return true;
      }
      return false;
    },

    selectBoard: (boardId) => {
      const unlocked = get().unlockedBoards || ['classic'];
      if (unlocked.includes(boardId)) {
        set({ selectedBoard: boardId });
        setStorage('kinetic_selected_board', boardId);
        soundEngine.playPowerup();
        return true;
      }
      return false;
    },

    buyBoard: (boardId, price) => {
      const coins = parseValidNumber(get().totalCoins, 0);
      const unlocked = get().unlockedBoards || ['classic'];
      if (coins >= price && !unlocked.includes(boardId)) {
        const newUnlocked = [...unlocked, boardId];
        const newCoins = coins - price;
        set({
          totalCoins: newCoins,
          unlockedBoards: newUnlocked,
          selectedBoard: boardId
        });
        setStorage('kinetic_total_coins', newCoins);
        setStorage('kinetic_unlocked_boards', newUnlocked);
        setStorage('kinetic_selected_board', boardId);
        soundEngine.playPowerup();
        return true;
      }
      return false;
    },

    upgradePowerup: (type, cost) => {
      const coins = parseValidNumber(get().totalCoins, 0);
      const currentLevel = get().upgrades[type] || 1;
      if (coins >= cost && currentLevel < 5) {
        const newCoins = coins - cost;
        const newUpgrades = {
          ...get().upgrades,
          [type]: currentLevel + 1
        };
        set({ totalCoins: newCoins, upgrades: newUpgrades });
        setStorage('kinetic_total_coins', newCoins);
        setStorage('kinetic_upgrades', newUpgrades);
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
      setStorage('kinetic_muted', muted);
    },

    setVolume: (sfx, music) => {
      soundEngine.setVolume(sfx, music);
      set({ sfxVolume: sfx, musicVolume: music });
      setStorage('kinetic_sfx_vol', sfx);
      setStorage('kinetic_music_vol', music);
    },

    setUsername: (name) => {
      const clean = name.trim().slice(0, 16) || 'Kinetic Jack';
      set({ username: clean });
      setStorage('kinetic_username', clean);
    },

    setAuth: (user, token) => {
      set({ authUser: user, authToken: token, username: user?.username || get().username });
      if (token) setStorage('kinetic_auth_token', token);
      if (user) {
        setStorage('kinetic_auth_user', user);
        set({ isActivated: !!user.is_activated });
        setStorage('kinetic_is_activated', !!user.is_activated);
        if (user.unlocked_levels) {
          set({ unlockedLevels: user.unlocked_levels });
          setStorage('kinetic_unlocked_levels', user.unlocked_levels);
        }
        if (user.unlocked_songs) {
          set({ unlockedSongs: user.unlocked_songs });
          setStorage('kinetic_unlocked_songs', user.unlocked_songs);
        }
      }
    },

    setUnlockedLevels: (unlockedLevels) => {
      set({ unlockedLevels });
      setStorage('kinetic_unlocked_levels', unlockedLevels);
    },
    setIsActivated: (isActivated) => {
      set({ isActivated });
      setStorage('kinetic_is_activated', isActivated);
    },
    setTotalCoins: (totalCoins) => {
      set({ totalCoins });
      setStorage('kinetic_total_coins', totalCoins);
    },
    setUnlockedCharacters: (unlockedCharacters) => {
      set({ unlockedCharacters });
      setStorage('kinetic_unlocked_chars', unlockedCharacters);
    },
    setUnlockedSongs: (unlockedSongs) => {
      set({ unlockedSongs });
      setStorage('kinetic_unlocked_songs', unlockedSongs);
    },

    setLeaderboard: (leaderboard) => set({ leaderboard }),
    setOnlineCount: (count) => set({ onlineCount: count })
  };
});

if (typeof window !== 'undefined') {
  window.__store = useGameStore;
}

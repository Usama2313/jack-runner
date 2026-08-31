import { LANES, LANE_WIDTH, OBSTACLE_TYPES, POWERUP_TYPES, CHUNK_LENGTH, NUM_SECTIONS, LEVELS } from './constants';

let nextEntityId = 1;
const lanePositions = [LANES.LEFT, LANES.CENTER, LANES.RIGHT];

/* Helper: get bounds for each obstacle type for proper collision boxes */
const getObstacleBounds = (type) => {
  switch (type) {
    case OBSTACLE_TYPES.TRAIN:
      return { width: 2.3, height: 3.2, depth: 14.0, yOffset: 0 };
    case OBSTACLE_TYPES.BUS:
      return { width: 2.2, height: 3.6, depth: 8.0, yOffset: 0 };
    case OBSTACLE_TYPES.MOTORBIKE:
      return { width: 0.8, height: 1.2, depth: 2.2, yOffset: 0 };
    case OBSTACLE_TYPES.AMBULANCE:
      return { width: 2.0, height: 2.4, depth: 5.5, yOffset: 0 };
    case OBSTACLE_TYPES.POLICE_CAR:
      return { width: 2.0, height: 1.8, depth: 4.5, yOffset: 0 };
    case OBSTACLE_TYPES.TRUCK:
      return { width: 2.3, height: 3.5, depth: 10.0, yOffset: 0 };
    case OBSTACLE_TYPES.TAXI:
      return { width: 2.0, height: 1.7, depth: 4.5, yOffset: 0 };
    case OBSTACLE_TYPES.SPORTS_CAR:
      return { width: 2.0, height: 1.3, depth: 4.0, yOffset: 0 };
    case OBSTACLE_TYPES.HELICOPTER:
      return { width: 3.0, height: 1.5, depth: 5.0, yOffset: 4.2 };
    case OBSTACLE_TYPES.BARRIER_LOW:
      return { width: 2.2, height: 1.1, depth: 0.6, yOffset: 0 };
    case OBSTACLE_TYPES.BARRIER_HIGH:
      return { width: 2.3, height: 2.4, depth: 0.6, yOffset: 0.75 };
    case OBSTACLE_TYPES.CONCRETE_BARRIER:
      return { width: 2.2, height: 1.1, depth: 0.8, yOffset: 0 };
    case OBSTACLE_TYPES.CONSTRUCTION:
      return { width: 0.9, height: 1.0, depth: 0.9, yOffset: 0 };
    case OBSTACLE_TYPES.TESLA_COIL:
      return { width: 2.1, height: 1.3, depth: 0.6, yOffset: 0 };
    case OBSTACLE_TYPES.MAGMA_PYLON:
      return { width: 2.2, height: 1.25, depth: 0.6, yOffset: 0 };
    case OBSTACLE_TYPES.PLASMA_WALL:
      return { width: 2.4, height: 2.5, depth: 0.5, yOffset: 0.8 };
    case OBSTACLE_TYPES.ICE_SPIKE:
      return { width: 2.1, height: 1.2, depth: 0.6, yOffset: 0 };
    case OBSTACLE_TYPES.TITAN_PISTON:
      return { width: 2.3, height: 2.6, depth: 1.2, yOffset: 0 };
    case OBSTACLE_TYPES.VOID_CRYSTAL:
      return { width: 2.2, height: 2.8, depth: 1.0, yOffset: 0 };
    case OBSTACLE_TYPES.ROBOT_BARRIER:
      return { width: 2.3, height: 2.3, depth: 0.6, yOffset: 0.75 };
    case OBSTACLE_TYPES.FIRE_PILLAR:
      return { width: 1.8, height: 2.5, depth: 0.8, yOffset: 0 };
    case OBSTACLE_TYPES.WATER_SURGE:
      return { width: 2.5, height: 2.2, depth: 1.0, yOffset: 0 };
    case OBSTACLE_TYPES.SAND_STORM:
      return { width: 2.8, height: 3.0, depth: 1.2, yOffset: 0 };
    case OBSTACLE_TYPES.TORNADO:
      return { width: 2.5, height: 3.5, depth: 1.0, yOffset: 0 };
    case OBSTACLE_TYPES.THUNDER_STRIKE:
      return { width: 1.5, height: 4.0, depth: 0.6, yOffset: 0 };
    default:
      return { width: 2.2, height: 1.1, depth: 0.6, yOffset: 0 };
  }
};

/* Does this obstacle type require sliding under? */
const isSlideUnder = (type) => {
  return [
    OBSTACLE_TYPES.BARRIER_HIGH,
    OBSTACLE_TYPES.PLASMA_WALL,
    OBSTACLE_TYPES.ROBOT_BARRIER,
    OBSTACLE_TYPES.SAND_STORM
  ].includes(type);
};

/* Does this obstacle type need jumping over? */
const isJumpOver = (type) => {
  return [
    OBSTACLE_TYPES.BARRIER_LOW,
    OBSTACLE_TYPES.CONCRETE_BARRIER,
    OBSTACLE_TYPES.CONSTRUCTION,
    OBSTACLE_TYPES.TESLA_COIL,
    OBSTACLE_TYPES.MAGMA_PYLON,
    OBSTACLE_TYPES.ICE_SPIKE,
    OBSTACLE_TYPES.MOTORBIKE,
    OBSTACLE_TYPES.WATER_SURGE,
    OBSTACLE_TYPES.TAXI,
    OBSTACLE_TYPES.SPORTS_CAR
  ].includes(type);
};

/* Aerial obstacle — only collides when jetpack is active */
const isAerialOnly = (type) => {
  return type === OBSTACLE_TYPES.HELICOPTER;
};

export const generateTrackChunk = (chunkIndex, currentLevel = 1) => {
  const startZ = -chunkIndex * CHUNK_LENGTH;
  const endZ = startZ - CHUNK_LENGTH;

  const obstacles = [];
  const coins = [];
  const powerups = [];
  const giftBoxes = [];
  const arches = [];

  const levelCfg = LEVELS[Math.min(LEVELS.length - 1, Math.max(0, currentLevel - 1))] || LEVELS[0];
  const hurdleSet = levelCfg.hurdleSet || ['BARRIER_LOW', 'BARRIER_HIGH', 'TRAIN'];

  // Separate ground and aerial hurdles
  const groundHurdles = hurdleSet.filter(h => h !== 'HELICOPTER');
  const hasHelicopter = hurdleSet.includes('HELICOPTER');

  // Spawn subway arches every 35m
  for (let z = startZ; z > endZ; z -= 35) {
    arches.push({
      id: `arch-${nextEntityId++}`,
      z
    });
  }

  // ─── First chunk: Safe intro zone ──────────────────────────────
  if (chunkIndex === 0) {
    // Gentle starter coin trail
    for (let z = -15; z > -60; z -= 3.2) {
      coins.push({
        id: `coin-${nextEntityId++}`,
        x: LANES.CENTER,
        y: 0.85,
        z,
        collected: false
      });
    }

    // Jumping arc over center
    for (let i = 0; i < 5; i++) {
      const cz = -35 - i * 2.5;
      const arcY = 1.0 + Math.sin((i / 4) * Math.PI) * 2.4;
      coins.push({
        id: `coin-${nextEntityId++}`,
        x: LANES.CENTER,
        y: arcY,
        z: cz,
        collected: false
      });
    }

    // Single intro barrier
    obstacles.push({
      id: `obs-${nextEntityId++}`,
      type: OBSTACLE_TYPES.BARRIER_LOW,
      x: LANES.LEFT,
      z: -48,
      bounds: getObstacleBounds(OBSTACLE_TYPES.BARRIER_LOW)
    });

    // Starter Magnet
    powerups.push({
      id: `pw-${nextEntityId++}`,
      type: POWERUP_TYPES.MAGNET,
      x: LANES.CENTER,
      y: 1.2,
      z: -28,
      collected: false
    });

    // Starter Gift Box
    giftBoxes.push({
      id: `gift-${nextEntityId++}`,
      x: LANES.RIGHT,
      y: 1.1,
      z: -22,
      collected: false
    });

    return { chunkIndex, startZ, endZ, obstacles, coins, powerups, giftBoxes, arches };
  }

  // ─── Procedural obstacle sections ─────────────────────────────
  const numSections = NUM_SECTIONS;
  const sectionLength = CHUNK_LENGTH / numSections;

  for (let s = 0; s < numSections; s++) {
    const sectionZ = startZ - s * sectionLength - 12;

    // Guaranteed safe lane
    const safeLaneIdx = Math.floor(Math.random() * 3);

    lanePositions.forEach((laneX, laneIdx) => {
      if (laneIdx === safeLaneIdx) {
        // Safe lane: coin patterns
        const coinPattern = Math.random();

        if (coinPattern < 0.40) {
          // Ground ring line
          for (let i = 0; i < 6; i++) {
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: 0.85,
              z: sectionZ - i * 2.6,
              collected: false
            });
          }
        } else if (coinPattern < 0.75) {
          // High aerial arc
          for (let i = 0; i < 6; i++) {
            const arcY = 0.9 + Math.sin((i / 5) * Math.PI) * 2.8;
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: arcY,
              z: sectionZ - i * 2.6,
              collected: false
            });
          }
        } else {
          // Sky ring cluster (Jetpack level)
          for (let i = 0; i < 5; i++) {
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: 5.2,
              z: sectionZ - i * 3.0,
              collected: false
            });
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: 0.85,
              z: sectionZ - i * 3.0,
              collected: false
            });
          }
        }
        return;
      }

      // ─── Non-safe lane: spawn level-specific hurdle ─────────────
      const availableGroundHurdles = groundHurdles.length > 0 ? groundHurdles : ['BARRIER_LOW'];
      const randomHurdle = availableGroundHurdles[Math.floor(Math.random() * availableGroundHurdles.length)] || 'BARRIER_LOW';
      const obstType = OBSTACLE_TYPES[randomHurdle] || OBSTACLE_TYPES.BARRIER_LOW;
      const bounds = getObstacleBounds(obstType);

      // Vehicles can optionally move towards the player
      const isVehicle = [
        OBSTACLE_TYPES.TRAIN, OBSTACLE_TYPES.BUS, OBSTACLE_TYPES.MOTORBIKE,
        OBSTACLE_TYPES.AMBULANCE, OBSTACLE_TYPES.POLICE_CAR, OBSTACLE_TYPES.TRUCK,
        OBSTACLE_TYPES.TAXI, OBSTACLE_TYPES.SPORTS_CAR
      ].includes(obstType);
      const isMoving = isVehicle && chunkIndex > 1 && Math.random() < 0.4;

      let vehicleSpeed = 0;
      if (isMoving) {
        if (obstType === OBSTACLE_TYPES.MOTORBIKE || obstType === OBSTACLE_TYPES.SPORTS_CAR) vehicleSpeed = 20;
        else if (obstType === OBSTACLE_TYPES.TRAIN) vehicleSpeed = 14;
        else vehicleSpeed = 10;
      }

      obstacles.push({
        id: `obs-${nextEntityId++}`,
        type: obstType,
        x: laneX,
        z: sectionZ,
        speed: vehicleSpeed,
        bounds,
        color: levelCfg.railColor || '#dc2626'
      });

      // Place reward coins near obstacles
      if (isSlideUnder(obstType)) {
        // Low ring under the gate to reward sliding
        coins.push({
          id: `coin-${nextEntityId++}`,
          x: laneX,
          y: 0.45,
          z: sectionZ,
          collected: false
        });
      } else if (isJumpOver(obstType)) {
        // High ring above the obstacle to reward jumping
        coins.push({
          id: `coin-${nextEntityId++}`,
          x: laneX,
          y: 2.6,
          z: sectionZ,
          collected: false
        });
      } else if (isVehicle) {
        // Rings along roof of vehicle
        for (let cz = sectionZ + 3; cz > sectionZ - 3; cz -= 2.6) {
          coins.push({
            id: `coin-${nextEntityId++}`,
            x: laneX,
            y: 3.9,
            z: cz,
            collected: false
          });
        }
      }
    });

    // 32% powerup chance — expanded pool including new powers
    if (Math.random() < 0.32) {
      const types = [
        POWERUP_TYPES.MAGNET,
        POWERUP_TYPES.JETPACK,
        POWERUP_TYPES.MULTIPLIER_2X,
        POWERUP_TYPES.SUPER_SNEAKERS,
        POWERUP_TYPES.HOVERBOARD,
        POWERUP_TYPES.PLASMA_SHIELD,
        POWERUP_TYPES.KINETIC_BLASTER,
        POWERUP_TYPES.SPEED_BOOST,
        POWERUP_TYPES.INVINCIBILITY
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const targetLane = lanePositions[safeLaneIdx];
      powerups.push({
        id: `pw-${nextEntityId++}`,
        type: selectedType,
        x: targetLane,
        y: 1.25,
        z: sectionZ - 14,
        collected: false
      });
    }

    // Coin Rain powerup special — rarer, higher levels
    if (currentLevel >= 5 && Math.random() < 0.08) {
      const targetLane = lanePositions[safeLaneIdx];
      powerups.push({
        id: `pw-${nextEntityId++}`,
        type: POWERUP_TYPES.COIN_RAIN,
        x: targetLane,
        y: 1.25,
        z: sectionZ - 20,
        collected: false
      });
    }

    // 45% Mystery Gift Box chance
    if (Math.random() < 0.45) {
      const targetLane = lanePositions[safeLaneIdx];
      giftBoxes.push({
        id: `gift-${nextEntityId++}`,
        x: targetLane,
        y: 1.1,
        z: sectionZ - 7,
        collected: false
      });
    }
  }

  // Helicopter obstacle at aerial level — only in levels with helicopter in hurdleSet
  if (hasHelicopter && chunkIndex > 2 && Math.random() < 0.45) {
    const heliBounds = getObstacleBounds(OBSTACLE_TYPES.HELICOPTER);
    const heliLane = lanePositions[Math.floor(Math.random() * 3)];
    obstacles.push({
      id: `heli-${nextEntityId++}`,
      type: OBSTACLE_TYPES.HELICOPTER,
      x: heliLane,
      z: startZ - 25,
      speed: 6, // slow forward movement
      bounds: heliBounds,
      color: '#ef4444',
      isAerial: true
    });
    // Sky coins leading to helicopter (reward for navigating)
    for (let i = 0; i < 4; i++) {
      coins.push({
        id: `coin-${nextEntityId++}`,
        x: heliLane,
        y: 5.5,
        z: startZ - 10 - i * 3,
        collected: false
      });
    }
  }

  // Spawn continuous sky coins for Jetpack flight at the top
  for (let z = startZ - 5; z > endZ; z -= 7) {
    if (Math.random() < 0.5) {
      const randomLane = lanePositions[Math.floor(Math.random() * 3)];
      coins.push({
        id: `coin-${nextEntityId++}`,
        x: randomLane,
        y: 5.2,
        z,
        collected: false
      });
    }
  }

  return { chunkIndex, startZ, endZ, obstacles, coins, powerups, giftBoxes, arches };
};

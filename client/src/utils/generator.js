import { LANES, LANE_WIDTH, OBSTACLE_TYPES, POWERUP_TYPES, CHUNK_LENGTH, NUM_SECTIONS } from './constants';

let nextEntityId = 1;
const lanePositions = [LANES.LEFT, LANES.CENTER, LANES.RIGHT];

export const generateTrackChunk = (chunkIndex) => {
  const startZ = -chunkIndex * CHUNK_LENGTH;
  const endZ = startZ - CHUNK_LENGTH;
  const chunkCenterZ = (startZ + endZ) / 2;

  const obstacles = [];
  const coins = [];
  const powerups = [];
  const giftBoxes = [];
  const arches = [];

  // Spawn subway arches every 40m along chunk (reduced from 22 for performance)
  for (let z = startZ; z > endZ; z -= 40) {
    arches.push({
      id: `arch-${nextEntityId++}`,
      z
    });
  }

  // First chunk is introductory (safe start zone with coins)
  if (chunkIndex === 0) {
    // Generate gentle starter coin trails in center lane
    for (let z = -15; z > -60; z -= 3.2) {
      coins.push({
        id: `coin-${nextEntityId++}`,
        x: LANES.CENTER,
        y: 0.8,
        z,
        collected: false
      });
    }

    // Single simple low barrier at z = -45 in left lane
    obstacles.push({
      id: `obs-${nextEntityId++}`,
      type: OBSTACLE_TYPES.BARRIER_LOW,
      x: LANES.LEFT,
      z: -45,
      bounds: { width: 2.2, height: 1.1, depth: 0.5, yOffset: 0 }
    });

    // Magnet powerup at start
    powerups.push({
      id: `pw-${nextEntityId++}`,
      type: POWERUP_TYPES.MAGNET,
      x: LANES.CENTER,
      y: 1.1,
      z: -32,
      collected: false
    });

    // Starter Gift Box
    giftBoxes.push({
      id: `gift-${nextEntityId++}`,
      x: LANES.RIGHT,
      y: 1.0,
      z: -25,
      collected: false
    });

    return { chunkIndex, startZ, endZ, obstacles, coins, powerups, giftBoxes, arches };
  }

  // For subsequent chunks, generate pattern-based sets of obstacles
  const numSections = NUM_SECTIONS;
  const sectionLength = CHUNK_LENGTH / numSections;

  for (let s = 0; s < numSections; s++) {
    const sectionZ = startZ - s * sectionLength - 12;
    const patternType = Math.floor(Math.random() * 6);

    // Guaranteed at least one safe lane
    const safeLaneIdx = Math.floor(Math.random() * 3);

    lanePositions.forEach((laneX, laneIdx) => {
      if (laneIdx === safeLaneIdx) {
        // Safe lane: Place a coin trail or powerup!
        const coinPattern = Math.random();
        if (coinPattern < 0.65) {
          // Arc or line of coins
          for (let i = 0; i < 5; i++) {
            const cz = sectionZ - i * 2.8;
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: 0.8,
              z: cz,
              collected: false
            });
          }
        } else if (coinPattern < 0.85) {
          // Jumping coin arc
          for (let i = 0; i < 5; i++) {
            const cz = sectionZ - i * 2.8;
            const arcY = 0.8 + Math.sin((i / 4) * Math.PI) * 2.2;
            coins.push({
              id: `coin-${nextEntityId++}`,
              x: laneX,
              y: arcY,
              z: cz,
              collected: false
            });
          }
        }
        return;
      }

      // Non-safe lane: Place an obstacle
      const roll = Math.random();

      if (patternType === 0 || roll < 0.3) {
        // Low Barrier: Jump over
        obstacles.push({
          id: `obs-${nextEntityId++}`,
          type: OBSTACLE_TYPES.BARRIER_LOW,
          x: laneX,
          z: sectionZ,
          bounds: { width: 2.2, height: 1.05, depth: 0.6, yOffset: 0 }
        });

        // Place a coin arc above the low barrier to reward jumping!
        coins.push({
          id: `coin-${nextEntityId++}`,
          x: laneX,
          y: 2.4,
          z: sectionZ,
          collected: false
        });
      } else if (patternType === 1 || roll < 0.55) {
        // High Barrier: Slide under
        obstacles.push({
          id: `obs-${nextEntityId++}`,
          type: OBSTACLE_TYPES.BARRIER_HIGH,
          x: laneX,
          z: sectionZ,
          bounds: { width: 2.3, height: 2.4, depth: 0.6, yOffset: 0.75 }
        });

        // Place a low coin under the barrier to reward sliding!
        coins.push({
          id: `coin-${nextEntityId++}`,
          x: laneX,
          y: 0.5,
          z: sectionZ,
          collected: false
        });
      } else if (patternType === 2 || roll < 0.82) {
        // Subway Train!
        const isMoving = chunkIndex > 1 && Math.random() < 0.45;
        obstacles.push({
          id: `obs-${nextEntityId++}`,
          type: OBSTACLE_TYPES.TRAIN,
          x: laneX,
          z: sectionZ,
          speed: isMoving ? 12 : 0,
          bounds: { width: 2.3, height: 3.2, depth: 14.0, yOffset: 0 },
          color: Math.random() > 0.5 ? '#dc2626' : '#2563eb'
        });

        // Place coins along top of the train
        for (let cz = sectionZ + 4; cz > sectionZ - 4; cz -= 2.6) {
          coins.push({
            id: `coin-${nextEntityId++}`,
            x: laneX,
            y: 3.8,
            z: cz,
            collected: false
          });
        }
      } else {
        // Construction barrier / traffic light
        obstacles.push({
          id: `obs-${nextEntityId++}`,
          type: OBSTACLE_TYPES.CONSTRUCTION,
          x: laneX,
          z: sectionZ,
          bounds: { width: 2.2, height: 1.8, depth: 0.8, yOffset: 0 }
        });
      }
    });

    // 28% chance of powerup per section
    if (Math.random() < 0.28) {
      const types = [
        POWERUP_TYPES.MAGNET,
        POWERUP_TYPES.JETPACK,
        POWERUP_TYPES.MULTIPLIER_2X,
        POWERUP_TYPES.SUPER_SNEAKERS,
        POWERUP_TYPES.HOVERBOARD
      ];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const targetLane = lanePositions[safeLaneIdx];
      powerups.push({
        id: `pw-${nextEntityId++}`,
        type: selectedType,
        x: targetLane,
        y: 1.2,
        z: sectionZ - 14,
        collected: false
      });
    }

    // 40% chance of Gift Box per section in safe lane
    if (Math.random() < 0.40) {
      const targetLane = lanePositions[safeLaneIdx];
      giftBoxes.push({
        id: `gift-${nextEntityId++}`,
        x: targetLane,
        y: 1.0,
        z: sectionZ - 8,
        collected: false
      });
    }
  }

  return { chunkIndex, startZ, endZ, obstacles, coins, powerups, giftBoxes, arches };
};

import { LANES, OBSTACLE_TYPES, POWERUP_TYPES } from './constants';

export const checkObstacleCollision = (player, obstacle) => {
  // Player bounding box calculation
  const px = player.x;
  const py = player.y; // 0 is ground, > 0 is jumping/flying
  const pz = player.z;

  const playerRadius = 0.42; // Forgiving horizontal collision radius
  const playerHeight = player.isRolling ? 0.65 : 1.5;
  const pMinY = py;
  const pMaxY = py + playerHeight;
  const pMinZ = pz - 0.35;
  const pMaxZ = pz + 0.35;

  const ox = obstacle.x;
  const oz = obstacle.z;
  const bounds = obstacle.bounds || { width: 2.2, height: 1.2, depth: 0.6, yOffset: 0 };

  const oMinX = ox - bounds.width / 2 + 0.08;
  const oMaxX = ox + bounds.width / 2 - 0.08;
  const oMinY = bounds.yOffset || 0;
  const oMaxY = oMinY + bounds.height;
  const oMinZ = oz - bounds.depth / 2 + 0.08;
  const oMaxZ = oz + bounds.depth / 2 - 0.08;

  // X overlap check
  const xOverlap = (px + playerRadius > oMinX) && (px - playerRadius < oMaxX);
  if (!xOverlap) return { collided: false, isStumble: false };

  // Z overlap check
  const zOverlap = (pMaxZ > oMinZ) && (pMinZ < oMaxZ);
  if (!zOverlap) return { collided: false, isStumble: false };

  // Jetpack completely avoids all standard ground & train obstacles
  if (player.isJetpack || py >= 4.5) {
    return { collided: false, isStumble: false };
  }

  // 1. BARRIER_LOW / ICE_SPIKE / TESLA_COIL: Jumpable obstacles
  if (
    obstacle.type === OBSTACLE_TYPES.BARRIER_LOW ||
    obstacle.type === OBSTACLE_TYPES.ICE_SPIKE ||
    obstacle.type === OBSTACLE_TYPES.TESLA_COIL ||
    obstacle.type === OBSTACLE_TYPES.MAGMA_PYLON
  ) {
    // If player jumped high enough to clear
    if (py >= bounds.height - 0.25 || (player.isJumping && py > 0.95)) {
      return { collided: false, isStumble: false };
    }
    // If player almost cleared (stumble threshold)
    if (py >= bounds.height - 0.55) {
      return { collided: true, isStumble: true };
    }
    // Glancing side clip = stumble
    const distFromCenter = Math.abs(px - ox);
    if (distFromCenter > bounds.width / 2 - 0.25) {
      return { collided: true, isStumble: true };
    }
  }

  // 2. BARRIER_HIGH / PLASMA_WALL / ROBOT_BARRIER: Slideable barriers
  if (
    obstacle.type === OBSTACLE_TYPES.BARRIER_HIGH ||
    obstacle.type === OBSTACLE_TYPES.PLASMA_WALL ||
    obstacle.type === OBSTACLE_TYPES.ROBOT_BARRIER
  ) {
    // Player is rolling/sliding safely underneath
    if (player.isRolling && py <= 0.85) {
      return { collided: false, isStumble: false };
    }
  }

  // 3. TRAIN / TITAN_PISTON / VOID_CRYSTAL: Large solids
  if (obstacle.type === OBSTACLE_TYPES.TRAIN) {
    // If running / landed on train roof
    if (py >= bounds.height - 0.4) {
      return { collided: false, isStumble: false };
    }
  }

  // Standard Y overlap check
  const yOverlap = (pMaxY > oMinY) && (pMinY < oMaxY);
  if (!yOverlap) return { collided: false, isStumble: false };

  // Head on fatal collision
  return { collided: true, isStumble: false };
};

export const checkCoinCollision = (player, coin, magnetActive = false, magnetRadius = 8.5) => {
  const dx = player.x - coin.x;
  const dy = player.y - coin.y;
  const dz = player.z - coin.z;
  const distSq = dx * dx + dy * dy + dz * dz;

  // Direct collection threshold
  const collectRadius = 1.55;
  if (distSq < collectRadius * collectRadius) {
    return { collected: true, shouldMagnetize: false };
  }

  // Magnet attraction zone (also pulls sky rings down)
  if (magnetActive && distSq < magnetRadius * magnetRadius) {
    return { collected: false, shouldMagnetize: true, dist: Math.sqrt(distSq) };
  }

  return { collected: false, shouldMagnetize: false };
};

export const checkPowerupCollision = (player, powerup) => {
  const dx = player.x - powerup.x;
  const dy = player.y - powerup.y;
  const dz = player.z - powerup.z;
  const distSq = dx * dx + dy * dy + dz * dz;
  const collectRadius = 1.6;
  return distSq < collectRadius * collectRadius;
};

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

  // ─── HELICOPTER: aerial only — only collides during Jetpack ────────
  if (obstacle.type === OBSTACLE_TYPES.HELICOPTER) {
    // Only collides when player is in jetpack mode (flying high)
    if (!player.isJetpack || py < 3.5) {
      return { collided: false, isStumble: false };
    }
    // Aerial collision is always a stumble (not instant death)
    const yOverlap = (pMaxY > oMinY) && (pMinY < oMaxY);
    if (!yOverlap) return { collided: false, isStumble: false };
    return { collided: true, isStumble: true };
  }

  // Jetpack completely avoids all standard ground obstacles
  if (player.isJetpack || py >= 4.5) {
    return { collided: false, isStumble: false };
  }

  // ─── 1. BARRIER_LOW / ICE_SPIKE / TESLA_COIL: Jumpable obstacles ───
  if (
    obstacle.type === OBSTACLE_TYPES.BARRIER_LOW ||
    obstacle.type === OBSTACLE_TYPES.ICE_SPIKE ||
    obstacle.type === OBSTACLE_TYPES.TESLA_COIL ||
    obstacle.type === OBSTACLE_TYPES.MAGMA_PYLON ||
    obstacle.type === OBSTACLE_TYPES.TAXI ||
    obstacle.type === OBSTACLE_TYPES.SPORTS_CAR
  ) {
    if (py >= bounds.height - 0.25 || (player.isJumping && py > 0.95)) {
      return { collided: false, isStumble: false };
    }
    if (py >= bounds.height - 0.55) {
      return { collided: true, isStumble: true };
    }
    const distFromCenter = Math.abs(px - ox);
    if (distFromCenter > bounds.width / 2 - 0.25) {
      return { collided: true, isStumble: true };
    }
  }

  // ─── 2. BARRIER_HIGH / PLASMA_WALL / ROBOT_BARRIER / SAND_STORM: Slideable ───
  if (
    obstacle.type === OBSTACLE_TYPES.BARRIER_HIGH ||
    obstacle.type === OBSTACLE_TYPES.PLASMA_WALL ||
    obstacle.type === OBSTACLE_TYPES.ROBOT_BARRIER ||
    obstacle.type === OBSTACLE_TYPES.SAND_STORM
  ) {
    if (player.isRolling && py <= 0.85) {
      return { collided: false, isStumble: false };
    }
  }

  // ─── 3. TRAIN / TRUCK / TITAN_PISTON / VOID_CRYSTAL: Large solids ───
  if (
    obstacle.type === OBSTACLE_TYPES.TRAIN ||
    obstacle.type === OBSTACLE_TYPES.TRUCK
  ) {
    if (py >= bounds.height - 0.4) {
      return { collided: false, isStumble: false };
    }
  }

  // ─── 4. WATER_SURGE: Jump over ──────────────────────────────────────
  if (obstacle.type === OBSTACLE_TYPES.WATER_SURGE) {
    if (player.isJumping && py > 1.2) {
      return { collided: false, isStumble: false };
    }
    if (py >= bounds.height - 0.4) {
      return { collided: true, isStumble: true };
    }
  }

  // ─── 5. TORNADO: Lane switch escape — side hits are stumbles ────────
  if (obstacle.type === OBSTACLE_TYPES.TORNADO) {
    const distFromCenter = Math.abs(px - ox);
    if (distFromCenter > bounds.width / 2 - 0.3) {
      return { collided: true, isStumble: true };
    }
  }

  // ─── 6. THUNDER_STRIKE: Full block — only Plasma Shield/Blaster pass ─
  // (handled by powerup logic — here it's always a crash)
  if (obstacle.type === OBSTACLE_TYPES.THUNDER_STRIKE) {
    const yOverlap = (pMaxY > oMinY) && (pMinY < oMaxY);
    if (!yOverlap) return { collided: false, isStumble: false };
    return { collided: true, isStumble: false };
  }

  // ─── 7. FIRE_PILLAR: Flanking dodge — direct hit is stumble ─────────
  if (obstacle.type === OBSTACLE_TYPES.FIRE_PILLAR) {
    const distFromCenter = Math.abs(px - ox);
    if (distFromCenter > bounds.width / 2 - 0.2) {
      return { collided: true, isStumble: true };
    }
  }

  // ─── 8. AMBULANCE / POLICE_CAR: Standard vehicle collision ──────────
  if (
    obstacle.type === OBSTACLE_TYPES.AMBULANCE ||
    obstacle.type === OBSTACLE_TYPES.POLICE_CAR
  ) {
    if (py >= bounds.height - 0.3) {
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

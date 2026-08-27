import { LANES, OBSTACLE_TYPES, POWERUP_TYPES } from './constants';

export const checkObstacleCollision = (player, obstacle) => {
  // Player bounding box calculation
  const px = player.x;
  const py = player.y; // 0 is ground, > 0 is jumping/flying
  const pz = player.z;

  const playerRadius = 0.45; // Forgiving horizontal collision radius
  const playerHeight = player.isRolling ? 0.65 : 1.5;
  const pMinY = py;
  const pMaxY = py + playerHeight;
  const pMinZ = pz - 0.35;
  const pMaxZ = pz + 0.35;

  const ox = obstacle.x;
  const oz = obstacle.z;
  const bounds = obstacle.bounds; // { width, height, depth, yOffset }

  const oMinX = ox - bounds.width / 2 + 0.1;
  const oMaxX = ox + bounds.width / 2 - 0.1;
  const oMinY = bounds.yOffset || 0;
  const oMaxY = oMinY + bounds.height;
  const oMinZ = oz - bounds.depth / 2 + 0.1;
  const oMaxZ = oz + bounds.depth / 2 - 0.1;

  // X overlap
  const xOverlap = (px + playerRadius > oMinX) && (px - playerRadius < oMaxX);
  if (!xOverlap) return false;

  // Z overlap
  const zOverlap = (pMaxZ > oMinZ) && (pMinZ < oMaxZ);
  if (!zOverlap) return false;

  // Y clearance checks depending on obstacle type:
  if (obstacle.type === OBSTACLE_TYPES.BARRIER_LOW) {
    // Player clears low hurdle whenever jumping or in air
    if (player.isJumping || py > 1.0) {
      return false; // Successfully cleared hurdle
    }
  } else if (obstacle.type === OBSTACLE_TYPES.BARRIER_HIGH) {
    // Player clears high bridge whenever rolling/sliding underneath
    if (player.isRolling) {
      return false; // Successfully slid under bridge
    }
  } else if (obstacle.type === OBSTACLE_TYPES.TRAIN) {
    // If player is flying high with Jetpack
    if (player.isJetpack || py > 4.0) {
      return false;
    }
    // If player is running/jumping on top of train roof
    if (py >= bounds.height - 0.35) {
      return false; // Allowed on train roof
    }
  }

  // Standard Y overlap check
  const yOverlap = (pMaxY > oMinY) && (pMinY < oMaxY);
  return yOverlap;
};

export const checkCoinCollision = (player, coin, magnetActive = false, magnetRadius = 7.5) => {
  const dx = player.x - coin.x;
  const dy = player.y - coin.y;
  const dz = player.z - coin.z;
  const distSq = dx * dx + dy * dy + dz * dz;

  // Direct collection threshold
  const collectRadius = 1.35;
  if (distSq < collectRadius * collectRadius) {
    return { collected: true, shouldMagnetize: false };
  }

  // Magnet attraction zone
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
  const collectRadius = 1.45;
  return distSq < collectRadius * collectRadius;
};

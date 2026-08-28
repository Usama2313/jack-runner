import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from './Player';
import { RobotChaser } from './RobotChaser';
import { Track } from './Track';
import { Obstacle } from './Obstacle';
import { Coin, PowerupItem, GiftBox } from './Collectible';
import { SubwayArch, BackgroundCity } from './Environment';
import { CameraFollow } from './Camera';
import { ParticleSystem } from './ParticleSystem';
import { useGameStore } from '../../store/gameStore';
import {
  GAME_STATES,
  CHUNK_LENGTH,
  VISIBLE_CHUNKS,
  LANE_WIDTH,
  PLAYER_Y_BASE,
  POWERUP_TYPES,
  LEVELS
} from '../../utils/constants';
import { generateTrackChunk } from '../../utils/generator';
import { checkObstacleCollision, checkCoinCollision, checkPowerupCollision } from '../../utils/collision';

const parseValidLevel = (val) => {
  const num = typeof val === 'number' ? val : Number(val);
  return !isNaN(num) && num >= 1 ? Math.max(1, Math.min(LEVELS.length, Math.floor(num))) : 1;
};

/** Dynamic lighting rig that follows the player and uses level theme colors */
const DynamicLighting = ({ playerZRef }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const safeLevel = parseValidLevel(currentLevel);
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];

  const dirLightRef = useRef();
  const dirTargetRef = useRef();
  const rimPinkRef = useRef();
  const rimCyanRef = useRef();

  useFrame(() => {
    const pz = playerZRef && playerZRef.current !== undefined ? playerZRef.current : 0;

    if (dirLightRef.current && dirTargetRef.current) {
      dirLightRef.current.position.set(15, 28, pz + 12);
      dirTargetRef.current.position.set(0, 0, pz - 25);
      dirLightRef.current.target = dirTargetRef.current;
      dirLightRef.current.target.updateMatrixWorld();
    }
    if (rimPinkRef.current) {
      rimPinkRef.current.position.set(-10, 8, pz - 18);
    }
    if (rimCyanRef.current) {
      rimCyanRef.current.position.set(10, 8, pz - 18);
    }
  });

  return (
    <>
      {/* Ambient & Sky fill dynamically themed */}
      <ambientLight intensity={1.3} color={levelInfo.skyColor || '#c7d2fe'} />
      <hemisphereLight
        skyColor={levelInfo.neonColor || '#818cf8'}
        groundColor={levelInfo.fogColor || '#1e1b4b'}
        intensity={1.1}
      />

      {/* Main sun/key light */}
      <object3D ref={dirTargetRef} />
      <directionalLight
        ref={dirLightRef}
        position={[15, 28, 12]}
        intensity={2.2}
        color="#ffffff"
        castShadow={false}
      />

      {/* Dynamic Cyberpunk Rim & Accent lights */}
      <pointLight
        ref={rimPinkRef}
        position={[-10, 8, -18]}
        intensity={3.5}
        color={levelInfo.neonColor || '#ec4899'}
        distance={35}
      />
      <pointLight
        ref={rimCyanRef}
        position={[10, 8, -18]}
        intensity={3.5}
        color={levelInfo.railColor || '#06b6d4'}
        distance={35}
      />
    </>
  );
};

// ─── Main Game Scene ──────────────────────────────────────────────────────────
const GameScene = () => {
  const gameState = useGameStore((s) => s.gameState);
  const currentLevel = useGameStore((s) => s.currentLevel);
  const safeLevel = parseValidLevel(currentLevel);
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];
  const isMysteryBoxPaused = useGameStore((s) => s.isMysteryBoxPaused);

  const playerZRef = useRef(0);
  const currentChunkIndexRef = useRef(0);

  // Active chunks management
  const [chunks, setChunks] = useState(() => {
    return Array.from({ length: VISIBLE_CHUNKS }, (_, i) => generateTrackChunk(i, safeLevel));
  });

  // Reset track on game start or level change
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      playerZRef.current = 0;
      currentChunkIndexRef.current = 0;
      setChunks(Array.from({ length: VISIBLE_CHUNKS }, (_, i) => generateTrackChunk(i, safeLevel)));
    }
  }, [gameState, safeLevel]);

  // Main 60fps Game Loop
  useFrame((state, rawDelta) => {
    // Clamp delta to prevent tunneling during lag
    const delta = Math.min(rawDelta, 0.045);

    const store = useGameStore.getState();
    const {
      speed,
      lane,
      isJumping,
      isRolling,
      isDead,
      isCaptured,
      activePowerups,
      collectCoin,
      activatePowerup,
      collectMysteryBox,
      stumble,
      triggerCrash,
      updateChaser,
      tickLevelTimer,
      incrementDistanceAndScore,
      updatePowerupTimers
    } = store;

    // Halt movement when not playing, dead, captured, or unboxing mystery box
    if (store.gameState !== GAME_STATES.PLAYING || isDead || isCaptured || isMysteryBoxPaused) return;

    // Advance player forward in negative Z
    const distanceStep = speed * delta;
    playerZRef.current -= distanceStep;
    incrementDistanceAndScore(distanceStep);
    updatePowerupTimers(delta);
    tickLevelTimer(delta);
    updateChaser(delta);

    const pz = playerZRef.current;
    const px = lane * LANE_WIDTH;

    const isJetpack = activePowerups[POWERUP_TYPES.JETPACK] > 0;
    const isMagnet = activePowerups[POWERUP_TYPES.MAGNET] > 0;

    // Approximate player Y for collision logic
    let py = PLAYER_Y_BASE;
    if (isJetpack) {
      py = 5.2;
    } else if (isJumping) {
      py = PLAYER_Y_BASE + 2.4;
    }

    const playerCollider = {
      x: px,
      y: py,
      z: pz,
      isRolling,
      isJumping,
      isJetpack
    };

    // Check if new chunks need generation (sliding window)
    const chunkIdx = Math.floor(-pz / CHUNK_LENGTH);
    if (chunkIdx !== currentChunkIndexRef.current) {
      currentChunkIndexRef.current = chunkIdx;
      setChunks((prev) => {
        const minIdx = Math.max(0, chunkIdx - 1);
        const maxIdx = chunkIdx + VISIBLE_CHUNKS;
        const currentSet = new Set(prev.map((c) => c.chunkIndex));
        const needed = [];
        for (let i = minIdx; i <= maxIdx; i++) {
          if (!currentSet.has(i)) {
            needed.push(generateTrackChunk(i, safeLevel));
          }
        }
        const retained = prev.filter((c) => c.chunkIndex >= minIdx && c.chunkIndex <= maxIdx);
        return [...retained, ...needed].sort((a, b) => a.chunkIndex - b.chunkIndex);
      });
    }

    // Process collisions on active chunks
    chunks.forEach((chunk) => {
      // 1. Obstacle collisions
      chunk.obstacles.forEach((obs) => {
        if (obs.speed > 0) {
          obs.z += obs.speed * delta;
        }
        const { collided, isStumble } = checkObstacleCollision(playerCollider, obs);
        if (collided) {
          if (isStumble) {
            stumble(obs.type);
          } else {
            triggerCrash(obs.type);
          }
        }
      });

      // 2. Celestial Rings collections & Magnet pull
      chunk.coins.forEach((coin) => {
        if (coin.collected) return;

        const { collected, shouldMagnetize } = checkCoinCollision(playerCollider, coin, isMagnet);

        if (collected) {
          coin.collected = true;
          collectCoin();
        } else if (shouldMagnetize) {
          coin.x += (px - coin.x) * delta * 14;
          coin.y += (py - coin.y) * delta * 14;
          coin.z += (pz - coin.z) * delta * 14;
          if (Math.abs(coin.z - pz) < 1.0) {
            coin.collected = true;
            collectCoin();
          }
        }
      });

      // 3. Powerup collections
      chunk.powerups.forEach((pw) => {
        if (pw.collected) return;
        if (checkPowerupCollision(playerCollider, pw)) {
          pw.collected = true;
          activatePowerup(pw.type);
        }
      });

      // 4. Mystery Box collections (Auto-Pauses game)
      if (chunk.giftBoxes) {
        chunk.giftBoxes.forEach((gift) => {
          if (gift.collected) return;
          if (checkPowerupCollision(playerCollider, gift)) {
            gift.collected = true;
            collectMysteryBox();
          }
        });
      }
    });
  });

  return (
    <>
      {/* Dynamic Lighting rig that follows player */}
      <DynamicLighting playerZRef={playerZRef} />

      {/* Atmospheric Fog dynamically matched to level theme */}
      <fog key={`fog-stage-${safeLevel}`} attach="fog" args={[levelInfo.fogColor || '#0f172a', 45, 145]} />

      {/* Dynamic Follow Camera */}
      <CameraFollow playerZRef={playerZRef} />

      {/* 3D Animated Player */}
      <Player playerZRef={playerZRef} />

      {/* 3D Robot Destroyer Pursuer */}
      <RobotChaser playerZRef={playerZRef} />

      {/* Speed Dust & Exhaust Particle Systems */}
      <ParticleSystem playerZRef={playerZRef} />

      {/* Procedural Track Chunks & Entities */}
      {chunks.map((chunk) => (
        <group key={`chunk-${chunk.chunkIndex}`}>
          <Track chunkStart={chunk.startZ} />

          {chunk.arches.map((arch) => (
            <SubwayArch key={arch.id} z={arch.z} />
          ))}

          {chunk.obstacles.map((obs) => (
            <Obstacle key={obs.id} data={obs} />
          ))}

          {chunk.coins.map((coin) => (
            <Coin
              key={coin.id}
              x={coin.x}
              y={coin.y}
              z={coin.z}
              collected={coin.collected}
            />
          ))}

          {chunk.powerups.map((pw) => (
            <PowerupItem
              key={pw.id}
              type={pw.type}
              x={pw.x}
              y={pw.y}
              z={pw.z}
              collected={pw.collected}
            />
          ))}

          {chunk.giftBoxes && chunk.giftBoxes.map((gift) => (
            <GiftBox
              key={gift.id}
              x={gift.x}
              y={gift.y}
              z={gift.z}
              collected={gift.collected}
            />
          ))}
        </group>
      ))}

      {/* Background Skyline */}
      <BackgroundCity playerZRef={playerZRef} />
    </>
  );
};

// ─── Canvas Wrapper ───────────────────────────────────────────────────────────
export const GameCanvas = () => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const safeLevel = parseValidLevel(currentLevel);
  const levelInfo = LEVELS[safeLevel - 1] || LEVELS[0];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 3.6, 6.8], fov: 62 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        shadows={false}
      >
        <color key={`bg-stage-${safeLevel}`} attach="background" args={[levelInfo.fogColor || '#0f172a']} />
        <GameScene />
      </Canvas>
    </div>
  );
};

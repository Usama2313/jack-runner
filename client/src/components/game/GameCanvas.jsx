import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Player } from './Player';
import { Track } from './Track';
import { Obstacle } from './Obstacle';
import { Coin, PowerupItem } from './Collectible';
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
  POWERUP_TYPES
} from '../../utils/constants';
import { generateTrackChunk } from '../../utils/generator';
import { checkObstacleCollision, checkCoinCollision, checkPowerupCollision } from '../../utils/collision';

/** Dynamic lighting rig that follows the player forward each frame */
const DynamicLighting = ({ playerZRef }) => {
  const dirLightRef = useRef();
  const dirTargetRef = useRef();
  const rimPinkRef = useRef();
  const rimCyanRef = useRef();

  useFrame(() => {
    const pz = playerZRef && playerZRef.current ? playerZRef.current : 0;

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
      {/* Ambient & Sky fill */}
      <ambientLight intensity={1.1} color="#c7d2fe" />
      <hemisphereLight
        skyColor="#818cf8"
        groundColor="#1e1b4b"
        intensity={0.9}
      />

      {/* Main sun/key light following player */}
      <object3D ref={dirTargetRef} />
      <directionalLight
        ref={dirLightRef}
        position={[15, 28, 12]}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />

      {/* Dynamic Cyberpunk Rim & Accent lights following player */}
      <pointLight
        ref={rimPinkRef}
        position={[-10, 8, -18]}
        intensity={2.8}
        color="#ec4899"
        distance={45}
      />
      <pointLight
        ref={rimCyanRef}
        position={[10, 8, -18]}
        intensity={2.8}
        color="#06b6d4"
        distance={45}
      />
    </>
  );
};


// ─── Main Game Scene ──────────────────────────────────────────────────────────
const GameScene = () => {
  // Only subscribe to gameState so 60fps physics updates don't cause React re-renders!
  const gameState = useGameStore((s) => s.gameState);

  const playerZRef = useRef(0);
  const currentChunkIndexRef = useRef(0);

  // Active chunks management
  const [chunks, setChunks] = useState(() => {
    return Array.from({ length: VISIBLE_CHUNKS }, (_, i) => generateTrackChunk(i));
  });

  // Reset track on game restart
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      playerZRef.current = 0;
      currentChunkIndexRef.current = 0;
      setChunks(Array.from({ length: VISIBLE_CHUNKS }, (_, i) => generateTrackChunk(i)));
    }
  }, [gameState]);

  // Main 60fps Game Loop
  useFrame((state, delta) => {
    const store = useGameStore.getState();
    const {
      speed,
      lane,
      isJumping,
      isRolling,
      isDead,
      activePowerups,
      collectCoin,
      activatePowerup,
      incrementDistanceAndScore,
      updatePowerupTimers,
      triggerGameOver
    } = store;

    if (store.gameState !== GAME_STATES.PLAYING || isDead) return;

    // Advance player forward in negative Z
    const distanceStep = speed * delta;
    playerZRef.current -= distanceStep;
    incrementDistanceAndScore(distanceStep);
    updatePowerupTimers(delta);

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
            needed.push(generateTrackChunk(i));
          }
        }
        const retained = prev.filter((c) => c.chunkIndex >= minIdx && c.chunkIndex <= maxIdx);
        return [...retained, ...needed].sort((a, b) => a.chunkIndex - b.chunkIndex);
      });
    }

    // Process collisions on current and neighboring chunks
    chunks.forEach((chunk) => {
      // 1. Obstacle collisions
      chunk.obstacles.forEach((obs) => {
        if (obs.speed > 0) {
          obs.z += obs.speed * delta;
        }
        if (checkObstacleCollision(playerCollider, obs)) {
          triggerGameOver(obs.type);
        }
      });

      // 2. Coin collections & Magnet pull
      chunk.coins.forEach((coin) => {
        if (coin.collected) return;

        const { collected, shouldMagnetize } = checkCoinCollision(playerCollider, coin, isMagnet);

        if (collected) {
          coin.collected = true;
          collectCoin();
        } else if (shouldMagnetize) {
          coin.x += (px - coin.x) * delta * 12;
          coin.y += (py - coin.y) * delta * 12;
          coin.z += (pz - coin.z) * delta * 12;
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
    });
  });

    return (
    <>
      {/* Dynamic Lighting rig that follows player and illuminates track ahead */}
      <DynamicLighting playerZRef={playerZRef} />

      {/* Atmospheric Cyber Fog with soft distant horizon blend */}
      <fog attach="fog" args={['#0f172a', 65, 220]} />

      {/* Dynamic Follow Camera */}
      <CameraFollow playerZRef={playerZRef} />

      {/* 3D Animated Player */}
      <Player playerZRef={playerZRef} />

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
        </group>
      ))}

      {/* Background Skyline */}
      <BackgroundCity playerZRef={playerZRef} />
    </>
  );
};

// ─── Canvas Wrapper ───────────────────────────────────────────────────────────
export const GameCanvas = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 3.6, 6.8], fov: 62 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#0f172a']} />
        <GameScene />
      </Canvas>
    </div>
  );
};

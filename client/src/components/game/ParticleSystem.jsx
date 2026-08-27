import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { POWERUP_TYPES } from '../../utils/constants';

export const ParticleSystem = ({ playerZRef }) => {
  const count = 120;
  const meshRef = useRef();

  // Initialize random particle positions around track tunnel
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = -Math.random() * 60;
      vel[i] = 20 + Math.random() * 25;
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const store = useGameStore.getState();
    const { speed, activePowerups } = store;
    const isJetpack = activePowerups[POWERUP_TYPES.JETPACK] > 0;

    const pz = playerZRef ? playerZRef.current : 0;
    const posAttr = meshRef.current.geometry.attributes.position;
    const currentPositions = posAttr.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Move particles backwards relative to player forward motion
      currentPositions[idx + 2] += (speed + velocities[i]) * delta;

      // Recycle particles ahead of player when they pass behind
      if (currentPositions[idx + 2] > pz + 10) {
        currentPositions[idx + 0] = (Math.random() - 0.5) * 16;
        currentPositions[idx + 1] = Math.random() * 8;
        currentPositions[idx + 2] = pz - 50 - Math.random() * 20;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#38bdf8"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

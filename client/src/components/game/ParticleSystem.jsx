import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Reduced particle count to 40 (was 120) for performance
export const ParticleSystem = ({ playerZRef }) => {
  const count = 40;
  const meshRef = useRef();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = -Math.random() * 50;
      vel[i] = 18 + Math.random() * 20;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pz = playerZRef ? playerZRef.current : 0;
    const posAttr = meshRef.current.geometry.attributes.position;
    const arr = posAttr.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      arr[idx + 2] += (20 + velocities[i]) * delta;
      if (arr[idx + 2] > pz + 8) {
        arr[idx + 0] = (Math.random() - 0.5) * 12;
        arr[idx + 1] = Math.random() * 6;
        arr[idx + 2] = pz - 45 - Math.random() * 15;
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
        size={0.14}
        color="#38bdf8"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

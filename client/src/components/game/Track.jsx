import React from 'react';
import { CHUNK_LENGTH, LEVELS } from '../../utils/constants';
import { useGameStore } from '../../store/gameStore';

export const Track = ({ chunkStart, chunkLength = CHUNK_LENGTH }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelInfo = LEVELS[Math.min(LEVELS.length - 1, currentLevel - 1)] || LEVELS[0];
  const railColor = levelInfo.railColor || '#38bdf8';
  const neonColor = levelInfo.neonColor || '#ec4899';

  const zCenter = chunkStart - chunkLength / 2;

  return (
    <group>
      {/* Main Road Bed */}
      <mesh position={[0, -0.05, zCenter]}>
        <boxGeometry args={[11.6, 0.1, chunkLength]} />
        <meshStandardMaterial color="#0f172a" roughness={0.65} metalness={0.4} />
      </mesh>

      {/* Center Asphalt Kinetic Highway */}
      <mesh position={[0, -0.01, zCenter]}>
        <boxGeometry args={[9.2, 0.04, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Left Neon Rail */}
      <mesh position={[-5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={1.2} />
      </mesh>

      {/* Right Neon Rail */}
      <mesh position={[5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color={railColor} emissive={railColor} emissiveIntensity={1.2} />
      </mesh>

      {/* Left Lane Kinetic Dash Strip */}
      <mesh position={[-1.3, 0.02, zCenter]}>
        <boxGeometry args={[0.12, 0.015, chunkLength]} />
        <meshStandardMaterial color={railColor} emissive={railColor} emissiveIntensity={0.9} />
      </mesh>

      {/* Right Lane Kinetic Dash Strip */}
      <mesh position={[1.3, 0.02, zCenter]}>
        <boxGeometry args={[0.12, 0.015, chunkLength]} />
        <meshStandardMaterial color={neonColor} emissive={neonColor} emissiveIntensity={0.9} />
      </mesh>

      {/* Left Barrier */}
      <mesh position={[-5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Right Barrier */}
      <mesh position={[5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
};

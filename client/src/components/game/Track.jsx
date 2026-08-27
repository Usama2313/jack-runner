import React from 'react';
import { CHUNK_LENGTH } from '../../utils/constants';

// Performance-optimised Track: flat slabs only, no per-tie mesh loops
export const Track = ({ chunkStart, chunkLength = CHUNK_LENGTH }) => {
  const zCenter = chunkStart - chunkLength / 2;

  return (
    <group>
      {/* Main Road Bed */}
      <mesh position={[0, -0.05, zCenter]}>
        <boxGeometry args={[11.6, 0.1, chunkLength]} />
        <meshStandardMaterial color="#172033" roughness={0.65} metalness={0.4} />
      </mesh>

      {/* Center Asphalt Runner */}
      <mesh position={[0, -0.01, zCenter]}>
        <boxGeometry args={[9.2, 0.04, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Left Neon Edge Rail */}
      <mesh position={[-5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.9} />
      </mesh>

      {/* Right Neon Edge Rail */}
      <mesh position={[5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.9} />
      </mesh>

      {/* Left Lane Dash Strip */}
      <mesh position={[-1.3, 0.02, zCenter]}>
        <boxGeometry args={[0.1, 0.01, chunkLength]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>

      {/* Right Lane Dash Strip */}
      <mesh position={[1.3, 0.02, zCenter]}>
        <boxGeometry args={[0.1, 0.01, chunkLength]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>

      {/* Left Safety Barrier */}
      <mesh position={[-5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Right Safety Barrier */}
      <mesh position={[5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
};

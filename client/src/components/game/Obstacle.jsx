import React from 'react';
import { OBSTACLE_TYPES } from '../../utils/constants';

// Performance-optimised Obstacle: no per-obstacle useFrame, no shadow casting, no point lights
export const Obstacle = ({ data }) => {
  const { type, x, z, bounds, color = '#dc2626' } = data;

  if (type === OBSTACLE_TYPES.TRAIN) {
    const trainLength = bounds.depth || 14.0;
    const trainHeight = bounds.height || 3.2;
    const trainWidth = bounds.width || 2.3;

    return (
      <group position={[x, 0, z]}>
        {/* Main Body */}
        <mesh position={[0, trainHeight / 2, 0]}>
          <boxGeometry args={[trainWidth, trainHeight, trainLength]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Neon Side Stripe Left */}
        <mesh position={[-trainWidth / 2 - 0.02, trainHeight * 0.45, 0]}>
          <boxGeometry args={[0.02, 0.22, trainLength - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} />
        </mesh>
        {/* Neon Side Stripe Right */}
        <mesh position={[trainWidth / 2 + 0.02, trainHeight * 0.45, 0]}>
          <boxGeometry args={[0.02, 0.22, trainLength - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} />
        </mesh>

        {/* Roof Plate */}
        <mesh position={[0, trainHeight + 0.06, 0]}>
          <boxGeometry args={[trainWidth - 0.12, 0.12, trainLength - 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Front LED Headlights (basic material – no shadow) */}
        <mesh position={[-0.72, 1.25, trainLength / 2 + 0.08]}>
          <circleGeometry args={[0.24, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.72, 1.25, trainLength / 2 + 0.08]}>
          <circleGeometry args={[0.24, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>
    );
  }

  if (type === OBSTACLE_TYPES.BARRIER_LOW) {
    return (
      <group position={[x, 0, z]}>
        {/* Posts */}
        <mesh position={[-1.05, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.05, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Crossbar */}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[2.3, 0.42, 0.18]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        {/* Laser line */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.1, 0.04, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    );
  }

  if (type === OBSTACLE_TYPES.BARRIER_HIGH) {
    return (
      <group position={[x, 0, z]}>
        {/* Columns */}
        <mesh position={[-1.15, 1.7, 0]}>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.15, 1.7, 0]}>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Girder */}
        <mesh position={[0, 2.35, 0]}>
          <boxGeometry args={[2.5, 1.25, 0.45]} />
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Warning strip */}
        <mesh position={[0, 2.35, 0.24]}>
          <planeGeometry args={[2.2, 0.9]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Clearance line */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.05]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>
    );
  }

  // Construction fallback
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[2.2, 1.6, 0.5]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0.26]}>
        <planeGeometry args={[2.0, 1.2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

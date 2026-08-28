import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POWERUP_TYPES } from '../../utils/constants';

/**
 * High-Fidelity Spinning Golden Coin
 * - 3D coin disc with raised edge border
 * - Embossed golden star symbol in the center
 * - Realistic metallic gold material settings
 */
export const Coin = ({ x, y = 0.85, z, collected }) => {
  const coinRef = useRef();

  // Spin the coin dynamically
  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta * 2.8;
    }
  });

  if (collected) return null;

  return (
    <group ref={coinRef} position={[x, y, z]} rotation={[0, 0, 0]}>
      {/* Main Gold Disc Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.07, 16]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.15}
          metalness={0.98}
          emissive="#78350f"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Raised Gold Outer Border Edge */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.03, 10, 24]} />
        <meshStandardMaterial
          color="#fbbf24"
          roughness={0.1}
          metalness={0.99}
          emissive="#b45309"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Embossed Star Center Symbol (Front side) */}
      <mesh position={[0, 0, 0.04]}>
        <coneGeometry args={[0.11, 0.05, 5]} rotation={[0, 0, 0]} />
        <meshStandardMaterial
          color="#fef08a"
          roughness={0.12}
          metalness={0.98}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Embossed Star Center Symbol (Back side) */}
      <mesh position={[0, 0, -0.04]} rotation={[0, Math.PI, 0]}>
        <coneGeometry args={[0.11, 0.05, 5]} />
        <meshStandardMaterial
          color="#fef08a"
          roughness={0.12}
          metalness={0.98}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Glowing Star Sparkle Orb */}
      <mesh>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// Powerups: Stylized glowing kinetic crystals
export const PowerupItem = ({ type, x, y = 1.25, z, collected }) => {
  if (collected) return null;

  const colors = {
    [POWERUP_TYPES.MAGNET]: '#38bdf8',
    [POWERUP_TYPES.JETPACK]: '#ec4899',
    [POWERUP_TYPES.MULTIPLIER_2X]: '#eab308',
    [POWERUP_TYPES.SUPER_SNEAKERS]: '#10b981',
    [POWERUP_TYPES.HOVERBOARD]: '#8b5cf6',
  };

  const col = colors[type] || '#ffffff';

  return (
    <group position={[x, y, z]}>
      {/* Outer Rotating Energy Crystal */}
      <mesh>
        <octahedronGeometry args={[0.48]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={1.0}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>
      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Mystery Box: Glowing Futuristic Kinetic Crate with Gold Ribbons
export const GiftBox = ({ x, y = 1.1, z, collected }) => {
  if (collected) return null;

  return (
    <group position={[x, y, z]}>
      {/* Main Crate */}
      <mesh>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7e22ce"
          emissiveIntensity={0.9}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Gold Horizontal Ribbon */}
      <mesh>
        <boxGeometry args={[0.76, 0.18, 0.76]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={1.4}
          metalness={0.9}
        />
      </mesh>

      {/* Gold Vertical Ribbon */}
      <mesh>
        <boxGeometry args={[0.18, 0.76, 0.76]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={1.4}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing Energy Bow on Top */}
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  );
};

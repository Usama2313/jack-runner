import React from 'react';
import { POWERUP_TYPES } from '../../utils/constants';

// Coins: static mesh, no per-coin useFrame
export const Coin = ({ x, y = 0.8, z, collected }) => {
  if (collected) return null;
  return (
    <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.08, 10]} />
      <meshStandardMaterial
        color="#facc15"
        metalness={0.9}
        roughness={0.15}
        emissive="#eab308"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Powerups: simple stylized geometric mesh
export const PowerupItem = ({ type, x, y = 1.2, z, collected }) => {
  if (collected) return null;

  const colors = {
    [POWERUP_TYPES.MAGNET]: '#3b82f6',
    [POWERUP_TYPES.JETPACK]: '#ec4899',
    [POWERUP_TYPES.MULTIPLIER_2X]: '#eab308',
    [POWERUP_TYPES.SUPER_SNEAKERS]: '#10b981',
    [POWERUP_TYPES.HOVERBOARD]: '#8b5cf6',
  };

  const col = colors[type] || '#ffffff';

  return (
    <mesh position={[x, y, z]}>
      <octahedronGeometry args={[0.45]} />
      <meshStandardMaterial
        color={col}
        emissive={col}
        emissiveIntensity={0.6}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
};

// Mystery Gift Box: Glowing futuristic cube with ribbons
export const GiftBox = ({ x, y = 1.0, z, collected }) => {
  if (collected) return null;

  return (
    <group position={[x, y, z]}>
      {/* Box */}
      <mesh>
        <boxGeometry args={[0.65, 0.65, 0.65]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#be185d"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      {/* Gold Ribbon Horizontal */}
      <mesh>
        <boxGeometry args={[0.68, 0.16, 0.68]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Gold Ribbon Vertical */}
      <mesh>
        <boxGeometry args={[0.16, 0.68, 0.68]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#eab308"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

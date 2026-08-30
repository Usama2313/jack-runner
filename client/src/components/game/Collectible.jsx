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
import { useGameStore } from '../../store/gameStore';

/**
 * High-Fidelity 3D Jewelry Ring (Replaces standard flat coin)
 * - Changes model and colors per stage based on level theme
 * - Employs luxury metals (Gold, Platinum, Rose Gold) and gemstones (Diamonds, Emeralds, Snowglobes)
 */
export const Coin = ({ x, y = 0.85, z, collected }) => {
  const coinRef = useRef();
  const currentLevel = useGameStore((state) => state.currentLevel) || 1;

  // Dynamic Ring designs based on level index (0-3 cycling)
  const ringStyle = (currentLevel - 1) % 4;

  // Spin the ring dynamically
  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta * 2.8;
      coinRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.15; // Menacing wiggle
    }
  });

  if (collected) return null;

  return (
    <group ref={coinRef} position={[x, y, z]} rotation={[0, 0, 0]}>
      {/* ─── STYLE 0: Elegant Three-Stone Diamond Ring (Gold band + white diamonds) ─── */}
      {ringStyle === 0 && (
        <group>
          {/* Main Gold Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.055, 12, 32]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.08}
              metalness={0.99}
              emissive="#78350f"
              emissiveIntensity={0.25}
            />
          </mesh>

          {/* Large Center Emerald-Cut Diamond */}
          <mesh position={[0, 0.32, 0]}>
            <boxGeometry args={[0.18, 0.25, 0.18]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#cbd5e1"
              emissiveIntensity={0.8}
              roughness={0.02}
              metalness={0.95}
            />
          </mesh>

          {/* Left Side Small Diamond */}
          <mesh position={[-0.15, 0.28, 0]} rotation={[0, 0, 0.45]}>
            <boxGeometry args={[0.1, 0.14, 0.1]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#93c5fd"
              emissiveIntensity={0.6}
              roughness={0.02}
              metalness={0.95}
            />
          </mesh>

          {/* Right Side Small Diamond */}
          <mesh position={[0.15, 0.28, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.1, 0.14, 0.1]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#93c5fd"
              emissiveIntensity={0.6}
              roughness={0.02}
              metalness={0.95}
            />
          </mesh>
        </group>
      )}

      {/* ─── STYLE 1: Fantasy Castle Snowglobe Ring (Rose Gold + glowing orb + blue gems) ─── */}
      {ringStyle === 1 && (
        <group>
          {/* Rose Gold Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.055, 12, 32]} />
            <meshStandardMaterial
              color="#f43f5e"
              roughness={0.12}
              metalness={0.9}
              emissive="#881337"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Glowing Snowglobe Sphere */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color="#67e8f9"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
              transparent
              opacity={0.7}
              roughness={0.01}
            />
          </mesh>

          {/* Mini Castle Core Inside Globe */}
          <mesh position={[0, 0.34, 0]}>
            <octahedronGeometry args={[0.1]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2.5}
            />
          </mesh>

          {/* Blue Gems Studded Around Band */}
          {[-0.2, 0.2].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.2, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0284c7"
                emissiveIntensity={1.5}
                roughness={0.05}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 2: Brilliant Round Platinum Ring (Platinum band + shiny round cut) ─── */}
      {ringStyle === 2 && (
        <group>
          {/* Platinum / Silver Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.055, 12, 32]} />
            <meshStandardMaterial
              color="#cbd5e1"
              roughness={0.03}
              metalness={0.99}
              emissive="#334155"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Large Round brilliant cut Diamond (upside cone) */}
          <mesh position={[0, 0.34, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.18, 0.22, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#cbd5e1"
              emissiveIntensity={1.2}
              roughness={0.01}
              metalness={0.98}
            />
          </mesh>

          {/* Pave diamonds around top half of the band */}
          {[-0.22, -0.11, 0.11, 0.22].map((bx, idx) => (
            <mesh key={idx} position={[bx, 0.22, 0.08]}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={1.0}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 3: Emerald Green Gemstone Ring (Gold band + green emerald) ─── */}
      {ringStyle === 3 && (
        <group>
          {/* Gold Band */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.055, 12, 32]} />
            <meshStandardMaterial
              color="#eab308"
              roughness={0.08}
              metalness={0.99}
              emissive="#78350f"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Center Octahedral Green Emerald */}
          <mesh position={[0, 0.34, 0]} scale={[1, 1.3, 1]}>
            <octahedronGeometry args={[0.16]} />
            <meshStandardMaterial
              color="#059669"
              emissive="#10b981"
              emissiveIntensity={1.5}
              roughness={0.05}
              metalness={0.8}
            />
          </mesh>

          {/* Tiny side diamonds */}
          <mesh position={[-0.14, 0.3, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.06, 0.1, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.14, 0.3, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.06, 0.1, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Sparkling particle ring glow */}
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
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

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POWERUP_TYPES } from '../../utils/constants';
import { useGameStore } from '../../store/gameStore';

/**
 * High-Fidelity 3D Jewelry Ring — 10 unique designs cycling per level
 * Styles inspired by real luxury jewelry: diamonds, emeralds, rubies, sapphires, snowglobes
 */
export const Coin = ({ x, y = 0.85, z, collected }) => {
  const coinRef = useRef();
  const innerRef = useRef();
  const currentLevel = useGameStore((state) => state.currentLevel) || 1;

  // 10 unique ring styles, cycle through them per level
  const ringStyle = (currentLevel - 1) % 10;

  useFrame((state, delta) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += delta * 2.5;
      coinRef.current.position.y = y + Math.sin(state.clock.elapsedTime * 2.2 + x) * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 4;
    }
  });

  if (collected) return null;

  return (
    <group ref={coinRef} position={[x, y, z]}>
      
      {/* ─── STYLE 0: Solitaire Diamond Ring (Gold band + brilliant white diamond) ─── */}
      {ringStyle === 0 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.052, 16, 48]} />
            <meshStandardMaterial color="#eab308" roughness={0.06} metalness={0.99} emissive="#713f12" emissiveIntensity={0.3} />
          </mesh>
          {/* Tall solitaire prong setting */}
          <mesh position={[0, 0.29, 0]}>
            <cylinderGeometry args={[0.06, 0.1, 0.18, 6]} />
            <meshStandardMaterial color="#eab308" roughness={0.06} metalness={0.99} />
          </mesh>
          {/* Brilliant round diamond */}
          <mesh position={[0, 0.41, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.14, 0.18, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={2.5} roughness={0.0} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.41, 0]}>
            <coneGeometry args={[0.14, 0.08, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#bfdbfe" emissiveIntensity={2.0} roughness={0.0} metalness={0.9} transparent opacity={0.85} />
          </mesh>
        </group>
      )}

      {/* ─── STYLE 1: Three-Stone Emerald Ring (Platinum + three emerald cuts) ─── */}
      {ringStyle === 1 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.052, 16, 48]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.04} metalness={0.99} emissive="#1e3a5f" emissiveIntensity={0.15} />
          </mesh>
          {/* Center large emerald */}
          <mesh position={[0, 0.31, 0]}>
            <boxGeometry args={[0.14, 0.18, 0.1]} />
            <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={2.0} roughness={0.03} transparent opacity={0.9} />
          </mesh>
          {/* Left small emerald */}
          <mesh position={[-0.14, 0.27, 0]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.08, 0.12, 0.08]} />
            <meshStandardMaterial color="#047857" emissive="#34d399" emissiveIntensity={1.5} roughness={0.03} />
          </mesh>
          {/* Right small emerald */}
          <mesh position={[0.14, 0.27, 0]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.08, 0.12, 0.08]} />
            <meshStandardMaterial color="#047857" emissive="#34d399" emissiveIntensity={1.5} roughness={0.03} />
          </mesh>
        </group>
      )}

      {/* ─── STYLE 2: Fantasy Snowglobe Castle Ring (Bronze band + glowing orb) ─── */}
      {ringStyle === 2 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.055, 16, 48]} />
            <meshStandardMaterial color="#92400e" roughness={0.15} metalness={0.88} emissive="#451a03" emissiveIntensity={0.3} />
          </mesh>
          {/* Outer globe shell */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={1.2} transparent opacity={0.55} roughness={0.01} />
          </mesh>
          {/* Castle inside globe */}
          <mesh ref={innerRef} position={[0, 0.34, 0]}>
            <octahedronGeometry args={[0.09]} />
            <meshStandardMaterial color="#ffffff" emissive="#f0f9ff" emissiveIntensity={3.0} />
          </mesh>
          {/* Cyan side gems */}
          {[-0.19, 0.19].map((bx, i) => (
            <mesh key={i} position={[bx, 0.22, 0.06]}>
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={2.0} roughness={0.03} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 3: Ruby Red Rose Gold Ring (Rose gold + marquise ruby) ─── */}
      {ringStyle === 3 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.052, 16, 48]} />
            <meshStandardMaterial color="#f43f5e" roughness={0.1} metalness={0.92} emissive="#9f1239" emissiveIntensity={0.28} />
          </mesh>
          {/* Marquise ruby (elongated teardrop shape) */}
          <mesh position={[0, 0.33, 0]} scale={[0.8, 1, 0.5]}>
            <sphereGeometry args={[0.17, 12, 12]} />
            <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={2.5} roughness={0.02} transparent opacity={0.9} />
          </mesh>
          {/* Pave diamonds along sides */}
          {[-0.22, -0.11, 0.11, 0.22].map((bx, i) => (
            <mesh key={i} position={[bx, 0.22, 0.07]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshStandardMaterial color="#ffffff" emissive="#fecaca" emissiveIntensity={1.2} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 4: Sapphire Blue Halo Ring (White gold + blue sapphire halo) ─── */}
      {ringStyle === 4 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.052, 16, 48]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.03} metalness={0.99} emissive="#0c4a6e" emissiveIntensity={0.15} />
          </mesh>
          {/* Center blue sapphire */}
          <mesh position={[0, 0.32, 0]} scale={[1, 0.7, 1]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={2.2} roughness={0.02} transparent opacity={0.92} />
          </mesh>
          {/* Halo of tiny white diamonds around sapphire */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.18, 0.32, Math.sin(angle) * 0.09]}>
                <sphereGeometry args={[0.032, 6, 6]} />
                <meshStandardMaterial color="#ffffff" emissive="#dbeafe" emissiveIntensity={1.5} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* ─── STYLE 5: Emerald Marquise Vintage Ring (Yellow gold filigree + green marquise) ─── */}
      {ringStyle === 5 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.06, 16, 48]} />
            <meshStandardMaterial color="#d97706" roughness={0.08} metalness={0.98} emissive="#78350f" emissiveIntensity={0.25} />
          </mesh>
          {/* Marquise emerald */}
          <mesh position={[0, 0.35, 0]} scale={[0.65, 1, 0.5]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#065f46" emissive="#10b981" emissiveIntensity={2.8} roughness={0.01} transparent opacity={0.88} />
          </mesh>
          {/* Side scrollwork prongs */}
          {[-0.12, 0.12].map((bx, i) => (
            <mesh key={i} position={[bx, 0.29, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
              <meshStandardMaterial color="#d97706" roughness={0.08} metalness={0.99} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 6: Princess Cut Diamond Ring (Platinum + square princess cut) ─── */}
      {ringStyle === 6 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.052, 16, 48]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.02} metalness={1.0} emissive="#1e293b" emissiveIntensity={0.2} />
          </mesh>
          {/* Princess cut square diamond */}
          <mesh position={[0, 0.33, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.18, 0.2, 0.18]} />
            <meshStandardMaterial color="#ffffff" emissive="#e0f2fe" emissiveIntensity={2.8} roughness={0.0} metalness={0.98} transparent opacity={0.9} />
          </mesh>
          {/* Four corner prong tips */}
          {[[-0.09, 0.44, -0.09], [0.09, 0.44, -0.09], [-0.09, 0.44, 0.09], [0.09, 0.44, 0.09]].map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.02} metalness={1.0} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 7: Amethyst Purple Fantasy Ring (Silver + large purple gemstone) ─── */}
      {ringStyle === 7 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.055, 16, 48]} />
            <meshStandardMaterial color="#c0c7d0" roughness={0.05} metalness={0.97} emissive="#1e1b4b" emissiveIntensity={0.2} />
          </mesh>
          {/* Large cushion-cut amethyst */}
          <mesh position={[0, 0.34, 0]} scale={[1, 0.75, 0.8]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={2.5} roughness={0.01} transparent opacity={0.88} />
          </mesh>
          {/* White diamond halo */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(angle) * 0.2, 0.32, Math.sin(angle) * 0.1]}>
                <sphereGeometry args={[0.028, 6, 6]} />
                <meshStandardMaterial color="#ffffff" emissive="#ede9fe" emissiveIntensity={1.2} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* ─── STYLE 8: Citrine Golden Cocktail Ring (Gold + large orange citrine) ─── */}
      {ringStyle === 8 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.06, 16, 48]} />
            <meshStandardMaterial color="#eab308" roughness={0.06} metalness={0.99} emissive="#713f12" emissiveIntensity={0.3} />
          </mesh>
          {/* Oval citrine */}
          <mesh position={[0, 0.36, 0]} scale={[0.85, 1, 0.65]}>
            <sphereGeometry args={[0.19, 14, 14]} />
            <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={2.8} roughness={0.01} transparent opacity={0.85} />
          </mesh>
          {/* Gold filigree prongs */}
          {[-0.13, 0, 0.13].map((bx, i) => (
            <mesh key={i} position={[bx, 0.29, 0.1]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#eab308" roughness={0.06} metalness={0.99} />
            </mesh>
          ))}
        </group>
      )}

      {/* ─── STYLE 9: Pink Diamond Eternity Ring (Rose gold band + pink diamonds) ─── */}
      {ringStyle === 9 && (
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.055, 16, 48]} />
            <meshStandardMaterial color="#fb7185" roughness={0.08} metalness={0.95} emissive="#9f1239" emissiveIntensity={0.22} />
          </mesh>
          {/* Row of pink diamonds all around band */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const angle = (i / 10) * Math.PI * 2;
            const r = 0.28;
            return (
              <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r * 0.3 + 0.28, Math.sin(angle) * r * 0.6]}>
                <octahedronGeometry args={[0.04]} />
                <meshStandardMaterial color="#fda4af" emissive="#fb7185" emissiveIntensity={1.8} roughness={0.01} />
              </mesh>
            );
          })}
          {/* Center large pink diamond */}
          <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.12, 0.16, 8]} />
            <meshStandardMaterial color="#fecdd3" emissive="#fb7185" emissiveIntensity={2.5} roughness={0.0} transparent opacity={0.9} />
          </mesh>
        </group>
      )}

      {/* Glow core */}
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
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
      <mesh>
        <octahedronGeometry args={[0.48]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.0} metalness={0.6} roughness={0.15} />
      </mesh>
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
      <mesh>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        <meshStandardMaterial color="#a855f7" emissive="#7e22ce" emissiveIntensity={0.9} roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.76, 0.18, 0.76]} />
        <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={1.4} metalness={0.9} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.18, 0.76, 0.76]} />
        <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={1.4} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

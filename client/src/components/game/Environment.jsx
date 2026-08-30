import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { LEVELS } from '../../utils/constants';

/* ─── Animated Cloud Puff ─────────────────────────────────── */
const CloudPuff = ({ position, size = 1 }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
    </mesh>
    <mesh position={[size * 0.8, 0, 0]}>
      <sphereGeometry args={[size * 0.75, 8, 8]} />
      <meshStandardMaterial color="#f5f5f5" roughness={1} metalness={0} />
    </mesh>
    <mesh position={[-size * 0.8, 0, 0]}>
      <sphereGeometry args={[size * 0.65, 8, 8]} />
      <meshStandardMaterial color="#f0f0f0" roughness={1} metalness={0} />
    </mesh>
    <mesh position={[0, size * 0.4, 0]}>
      <sphereGeometry args={[size * 0.7, 8, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
    </mesh>
  </group>
);

/* ─── Sky Dome ──────────────────────────────────────────────── */
const SkyDome = ({ skyColor, fogColor }) => {
  const sunColor = skyColor.startsWith('#FF') || skyColor.startsWith('#F0') || skyColor.startsWith('#C4') || skyColor.startsWith('#87') || skyColor.startsWith('#5B') || skyColor.startsWith('#4A') || skyColor.startsWith('#6E') || skyColor.startsWith('#3A')
    ? '#fff7c0'
    : '#ffe080';

  const isDaytime = skyColor !== '#0b0f19' && !skyColor.startsWith('#0f') && !skyColor.startsWith('#09') && !skyColor.startsWith('#18');

  return (
    <group>
      {/* Sky Hemisphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[400, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
      </mesh>

      {/* Ground Plane under sky */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[800, 800]} />
        <meshBasicMaterial color={fogColor} />
      </mesh>

      {/* Sun */}
      {isDaytime && (
        <group position={[80, 90, -180]}>
          <mesh>
            <sphereGeometry args={[12, 16, 16]} />
            <meshBasicMaterial color={sunColor} />
          </mesh>
          {/* Sun glow corona */}
          <mesh>
            <sphereGeometry args={[18, 16, 16]} />
            <meshBasicMaterial color={sunColor} transparent opacity={0.15} />
          </mesh>
        </group>
      )}

      {/* Static Clouds in sky (only daytime) */}
      {isDaytime && [
        [-60, 55, -160],
        [40, 62, -200],
        [120, 58, -170],
        [-120, 65, -220],
        [0, 70, -250],
        [80, 52, -130],
        [-40, 60, -190],
      ].map((pos, i) => (
        <CloudPuff key={`cloud-${i}`} position={pos} size={6 + (i % 3) * 2.5} />
      ))}
    </group>
  );
};

/* ─── Subway / Road Arch ────────────────────────────────────── */
export const SubwayArch = ({ z }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelInfo = LEVELS[Math.min(LEVELS.length - 1, currentLevel - 1)] || LEVELS[0];
  const neonCol = levelInfo.neonColor || '#38bdf8';
  const railCol = levelInfo.railColor || '#ec4899';

  return (
    <group position={[0, 0, z]}>
      {/* Left Pillar — concrete */}
      <mesh position={[-5.85, 3.4, 0]}>
        <boxGeometry args={[0.65, 6.8, 0.65]} />
        <meshStandardMaterial color="#6b7280" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Left Neon Accent */}
      <mesh position={[-5.55, 3.4, 0.35]}>
        <boxGeometry args={[0.08, 6.4, 0.08]} />
        <meshStandardMaterial color={neonCol} emissive={neonCol} emissiveIntensity={1.8} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[5.85, 3.4, 0]}>
        <boxGeometry args={[0.65, 6.8, 0.65]} />
        <meshStandardMaterial color="#6b7280" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Right Neon Accent */}
      <mesh position={[5.55, 3.4, 0.35]}>
        <boxGeometry args={[0.08, 6.4, 0.08]} />
        <meshStandardMaterial color={railCol} emissive={railCol} emissiveIntensity={1.8} />
      </mesh>

      {/* Top Concrete Cross-Beam */}
      <mesh position={[0, 6.75, 0]}>
        <boxGeometry args={[12.5, 0.85, 0.75]} />
        <meshStandardMaterial color="#4b5563" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* LED Sign Board on Arch */}
      <mesh position={[0, 6.75, 0.42]}>
        <planeGeometry args={[8.0, 0.55]} />
        <meshBasicMaterial color={neonCol} />
      </mesh>

      {/* Overhead Traffic Signal Lights */}
      {[-2.6, 0, 2.6].map((lx, idx) => (
        <group key={`signal-${idx}`} position={[lx, 6.05, 0]}>
          {/* Signal housing box */}
          <mesh>
            <boxGeometry args={[0.3, 0.6, 0.3]} />
            <meshStandardMaterial color="#1f2937" roughness={0.5} />
          </mesh>
          {/* Green signal light */}
          <mesh position={[0, -0.1, 0.18]}>
            <circleGeometry args={[0.09, 10]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.5} />
          </mesh>
        </group>
      ))}

      {/* Road Lane White Dashes painted on road at arch */}
      {[-2.6, 0, 2.6].map((lx, i) => (
        <mesh key={`dash-${i}`} position={[lx, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 2.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Background City Buildings & Biomes ─────────────────────────── */
const getBiomeTheme = (levelId, name = "") => {
  const nm = name.toLowerCase();
  if (nm.includes("frost") || nm.includes("aurora") || nm.includes("ice") || levelId === 13 || levelId === 16) {
    return "snowy";
  }
  if (nm.includes("pyramids") || nm.includes("desert") || nm.includes("dubai") || levelId === 3 || levelId === 12) {
    return "desert";
  }
  if (nm.includes("valley") || nm.includes("nature") || nm.includes("green") || nm.includes("park") || nm.includes("coliseum") || nm.includes("carnival") || levelId === 14 || levelId === 15) {
    return "nature";
  }
  
  // Modulo fallback
  const index = (levelId - 1) % 4;
  if (index === 0) return "city";
  if (index === 1) return "nature";
  if (index === 2) return "desert";
  return "snowy";
};

export const BackgroundCity = ({ playerZRef }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelInfo = LEVELS[Math.min(LEVELS.length - 1, currentLevel - 1)] || LEVELS[0];
  const theme = getBiomeTheme(levelInfo.id, levelInfo.name);

  // Get matching sky & fog color overrides for real world feel
  let skyColor = levelInfo.skyColor || '#87CEEB';
  let fogColor = levelInfo.fogColor || '#b0d9f0';

  if (theme === 'snowy') {
    skyColor = '#bae6fd'; // Freezing icy blue sky
    fogColor = '#f8fafc'; // Snowy white horizon
  } else if (theme === 'desert') {
    skyColor = '#fed7aa'; // Sunset desert sky
    fogColor = '#f59e0b'; // Warm yellow sand dust
  } else if (theme === 'nature') {
    skyColor = '#38bdf8'; // Clear sky blue
    fogColor = '#bbf7d0'; // Grassy green horizon
  }

  const count = 16;
  const spacing = 22;
  const range = count * spacing;

  const assets = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const initialZ = -i * spacing;
      // Left side asset
      arr.push({
        id: `left-${i}`,
        isLeft: true,
        x: -9 - (i % 3) * 3,
        initialZ,
        scale: 0.8 + (i * 0.17) % 0.6,
        type: i % 2 === 0 ? 'tree' : 'house'
      });
      // Right side asset
      arr.push({
        id: `right-${i}`,
        isLeft: false,
        x: 9 + (i % 3) * 3,
        initialZ,
        scale: 0.8 + (i * 0.13) % 0.6,
        type: (i + 1) % 2 === 0 ? 'tree' : 'house'
      });
    }
    return arr;
  }, []);

  const groupRefs = useRef([]);

  useFrame(() => {
    if (!playerZRef || playerZRef.current === undefined) return;
    const pz = playerZRef.current;
    assets.forEach((asset, idx) => {
      const el = groupRefs.current[idx];
      if (el) {
        const minZ = pz - 280;
        const worldZ = minZ + (((asset.initialZ - minZ) % range + range) % range);
        el.position.z = worldZ;
      }
    });
  });

  const isDaytime = theme !== 'city' || skyColor.startsWith('#8') || skyColor.startsWith('#5') || skyColor.startsWith('#4A') || skyColor.startsWith('#6') || skyColor.startsWith('#3A') || skyColor.startsWith('#C4') || skyColor.startsWith('#FF');

  return (
    <group>
      {/* Sky Dome */}
      <SkyDome skyColor={skyColor} fogColor={fogColor} />

      {/* Sidewalks / Nature embankments outside tracks */}
      {theme === 'city' ? (
        <>
          <mesh position={[-5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 5000]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.9} />
          </mesh>
          <mesh position={[5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4, 5000]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.9} />
          </mesh>
        </>
      ) : theme === 'snowy' ? (
        <>
          <mesh position={[-5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
          <mesh position={[5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#ffffff" roughness={0.95} />
          </mesh>
        </>
      ) : theme === 'desert' ? (
        <>
          <mesh position={[-5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#fef08a" roughness={0.95} />
          </mesh>
          <mesh position={[5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#fef08a" roughness={0.95} />
          </mesh>
        </>
      ) : (
        /* Nature Theme */
        <>
          <mesh position={[-5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#16a34a" roughness={0.9} />
          </mesh>
          <mesh position={[5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12, 5000]} />
            <meshStandardMaterial color="#16a34a" roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Render environment assets */}
      {assets.map((asset, idx) => (
        <group
          key={asset.id}
          ref={(el) => (groupRefs.current[idx] = el)}
          position={[asset.x, 0, asset.initialZ]}
          scale={[asset.scale, asset.scale, asset.scale]}
        >
          {theme === 'city' ? (
            /* City Skyscrapers */
            <group position={[0, (asset.scale * 15) / 2 - 1, 0]}>
              <mesh castShadow>
                <boxGeometry args={[4.5, asset.scale * 15, 4.5]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#475569' : '#64748b'} roughness={0.6} metalness={0.2} />
              </mesh>
              {/* Windows */}
              <mesh position={[asset.isLeft ? 2.27 : -2.27, 0, 0]}>
                <planeGeometry args={[3, asset.scale * 13]} />
                <meshStandardMaterial
                  color="#fef08a"
                  emissive={isDaytime ? '#000000' : '#eab308'}
                  emissiveIntensity={1.0}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          ) : theme === 'snowy' ? (
            /* Snowy forest elements */
            asset.type === 'tree' ? (
              <group position={[0, 0, 0]}>
                {/* Trunk */}
                <mesh position={[0, 0.5, 0]}>
                  <cylinderGeometry args={[0.08, 0.12, 1.0, 8]} />
                  <meshStandardMaterial color="#5c3f15" />
                </mesh>
                {/* Snowy pine foliage */}
                <mesh position={[0, 1.2, 0]}>
                  <coneGeometry args={[0.55, 1.2, 8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.9} />
                </mesh>
                <mesh position={[0, 1.8, 0]}>
                  <coneGeometry args={[0.4, 0.9, 8]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
                </mesh>
              </group>
            ) : (
              /* Snow cottage */
              <group position={[0, 0.6, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[1.8, 1.2, 1.8]} />
                  <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
                  <coneGeometry args={[1.5, 0.8, 4]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.8} />
                </mesh>
              </group>
            )
          ) : theme === 'desert' ? (
            /* Egyptian Desert Elements */
            asset.type === 'tree' ? (
              /* A Sand Dune shape */
              <mesh position={[0, 0.2, 0]} scale={[2.5, 0.5, 2.5]}>
                <sphereGeometry args={[1.5, 8, 8]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.9} />
              </mesh>
            ) : (
              /* Pyramids in the background */
              <mesh position={[asset.isLeft ? -10 : 10, 4.0, -8]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[9, 10, 4]} />
                <meshStandardMaterial color="#d97706" roughness={0.95} />
              </mesh>
            )
          ) : (
            /* Nature Valley Elements */
            asset.type === 'tree' ? (
              <group position={[0, 0, 0]}>
                {/* Trunk */}
                <mesh position={[0, 0.5, 0]}>
                  <cylinderGeometry args={[0.08, 0.12, 1.0, 8]} />
                  <meshStandardMaterial color="#78350f" />
                </mesh>
                {/* Green pine foliage */}
                <mesh position={[0, 1.2, 0]}>
                  <coneGeometry args={[0.6, 1.2, 8]} />
                  <meshStandardMaterial color="#166534" roughness={0.9} />
                </mesh>
                <mesh position={[0, 1.8, 0]}>
                  <coneGeometry args={[0.42, 0.9, 8]} />
                  <meshStandardMaterial color="#15803d" roughness={0.9} />
                </mesh>
              </group>
            ) : (
              /* Alpine cottage */
              <group position={[0, 0.6, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[1.8, 1.2, 1.8]} />
                  <meshStandardMaterial color="#78350f" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 4, 0]}>
                  <coneGeometry args={[1.5, 0.8, 4]} />
                  <meshStandardMaterial color="#b91c1c" roughness={0.6} />
                </mesh>
              </group>
            )
          )}
        </group>
      ))}
    </group>
  );
};

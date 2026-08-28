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

/* ─── Background City Buildings ─────────────────────────────── */
export const BackgroundCity = ({ playerZRef }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelInfo = LEVELS[Math.min(LEVELS.length - 1, currentLevel - 1)] || LEVELS[0];
  const skyColor = levelInfo.skyColor || '#87CEEB';

  const count = 14;
  const spacing = 20;
  const range = count * spacing;

  const buildings = useMemo(() => {
    const arr = [];
    // Realistic building palettes
    const buildingColors = [
      '#94a3b8', '#64748b', '#78716c', '#a8a29e',
      '#cbd5e1', '#9ca3af', '#d1d5db', '#6b7280',
      '#c8bfba', '#b0a898', '#e2e8e0', '#8d9fa8',
    ];
    const glassColors = [
      '#bfdbfe', '#dbeafe', '#e0f2fe', '#cffafe',
      '#a7f3d0', '#d1fae5', '#fef9c3', '#fde68a'
    ];
    const neonColors = ['#38bdf8', '#ec4899', '#a855f7', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

    for (let i = 0; i < count; i++) {
      const initialZ = -i * spacing;

      // Left side
      const hLeft = 25 + (i * 3.7) % 22;
      const wLeft = 8 + (i * 1.3) % 6;
      arr.push({
        id: `b-l-${i}`,
        x: -20 - (i % 3) * 2.5,
        y: hLeft / 2 - 1,
        initialZ,
        width: wLeft,
        height: hLeft,
        depth: 14,
        color: buildingColors[i % buildingColors.length],
        glassColor: glassColors[i % glassColors.length],
        neonColor: neonColors[i % neonColors.length],
        hasBillboard: i % 3 === 0,
        hasAntenna: i % 4 === 1,
      });

      // Right side
      const hRight = 22 + (i * 4.1) % 26;
      const wRight = 7 + (i * 1.7) % 7;
      arr.push({
        id: `b-r-${i}`,
        x: 20 + (i % 3) * 2.5,
        y: hRight / 2 - 1,
        initialZ,
        width: wRight,
        height: hRight,
        depth: 14,
        color: buildingColors[(i + 4) % buildingColors.length],
        glassColor: glassColors[(i + 2) % glassColors.length],
        neonColor: neonColors[(i + 3) % neonColors.length],
        hasBillboard: i % 3 === 1,
        hasAntenna: i % 4 === 2,
      });
    }
    return arr;
  }, []);

  const groupRefs = useRef([]);

  useFrame(() => {
    if (!playerZRef || playerZRef.current === undefined) return;
    const pz = playerZRef.current;
    buildings.forEach((b, idx) => {
      const el = groupRefs.current[idx];
      if (el) {
        const minZ = pz - 280;
        const worldZ = minZ + (((b.initialZ - minZ) % range + range) % range);
        el.position.z = worldZ;
      }
    });
  });

  // Determine daytime from skyColor
  const isDaytime = skyColor.startsWith('#8') || skyColor.startsWith('#5') || skyColor.startsWith('#4A') || skyColor.startsWith('#6') || skyColor.startsWith('#3A') || skyColor.startsWith('#C4') || skyColor.startsWith('#FF');

  return (
    <group>
      {/* Sky Dome */}
      <SkyDome skyColor={skyColor} fogColor={levelInfo.fogColor || '#b0d9f0'} />

      {/* Road sidewalks (pavement strips outside the lanes) */}
      <mesh position={[-5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 5000]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>
      <mesh position={[5.2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 5000]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, idx) => (
        <group
          key={b.id}
          ref={(el) => (groupRefs.current[idx] = el)}
          position={[b.x, b.y, b.initialZ]}
        >
          {/* Main Building Body */}
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.55} metalness={0.15} />
          </mesh>

          {/* Glass Window Facade — faces the road */}
          <mesh position={[b.x > 0 ? -b.width / 2 - 0.02 : b.width / 2 + 0.02, 0, 0]}>
            <planeGeometry args={[b.depth * 0.85, b.height * 0.9]} />
            <meshStandardMaterial
              color={b.glassColor}
              emissive={isDaytime ? '#000000' : b.glassColor}
              emissiveIntensity={isDaytime ? 0 : 0.4}
              roughness={0.05}
              metalness={0.7}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Window rows (horizontal bands) */}
          {Array.from({ length: Math.floor(b.height / 4) }).map((_, wi) => (
            <mesh key={`wrow-${wi}`} position={[b.x > 0 ? -b.width / 2 - 0.03 : b.width / 2 + 0.03, -b.height * 0.4 + wi * 4, 0]}>
              <planeGeometry args={[b.depth * 0.75, 0.6]} />
              <meshStandardMaterial
                color={wi % 3 === 0 ? '#fef08a' : b.glassColor}
                emissive={wi % 3 === 0 ? '#fde047' : b.neonColor}
                emissiveIntensity={isDaytime ? 0 : 0.7}
              />
            </mesh>
          ))}

          {/* Rooftop Neon Parapet */}
          <mesh position={[0, b.height / 2 + 0.2, 0]}>
            <boxGeometry args={[b.width, 0.4, b.depth]} />
            <meshStandardMaterial color={b.neonColor} emissive={b.neonColor} emissiveIntensity={1.6} />
          </mesh>

          {/* Billboard or Antenna */}
          {b.hasBillboard ? (
            <group position={[0, b.height / 2 + 2.5, 0]}>
              {/* Billboard Frame */}
              <mesh>
                <boxGeometry args={[b.width * 0.75, 3.2, 0.3]} />
                <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.6} />
              </mesh>
              {/* Billboard Screen */}
              <mesh position={[0, 0, 0.18]}>
                <planeGeometry args={[b.width * 0.7, 2.9]} />
                <meshStandardMaterial
                  color={b.neonColor}
                  emissive={b.neonColor}
                  emissiveIntensity={1.8}
                />
              </mesh>
            </group>
          ) : b.hasAntenna ? (
            <group position={[0, b.height / 2 + 1, 0]}>
              {/* Antenna Tower */}
              <mesh>
                <cylinderGeometry args={[0.06, 0.12, 5, 8]} />
                <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Antenna Beacon Light */}
              <mesh position={[0, 2.8, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.0} />
              </mesh>
            </group>
          ) : null}
        </group>
      ))}
    </group>
  );
};

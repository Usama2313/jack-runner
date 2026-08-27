import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SubwayArch = ({ z }) => {
  return (
    <group position={[0, 0, z]}>
      {/* Left Pillar */}
      <mesh position={[-5.85, 3.4, 0]} castShadow>
        <boxGeometry args={[0.55, 6.8, 0.55]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Left Pillar Neon Accent Strip */}
      <mesh position={[-5.55, 3.4, 0.3]}>
        <boxGeometry args={[0.08, 6.4, 0.08]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.2} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[5.85, 3.4, 0]} castShadow>
        <boxGeometry args={[0.55, 6.8, 0.55]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Right Pillar Neon Accent Strip */}
      <mesh position={[5.55, 3.4, 0.3]}>
        <boxGeometry args={[0.08, 6.4, 0.08]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>

      {/* Top Cross Arch Beam */}
      <mesh position={[0, 6.6, 0]} castShadow>
        <boxGeometry args={[12.3, 0.7, 0.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Glowing Neon Subway Sign on Arch */}
      <mesh position={[0, 6.6, 0.35]}>
        <planeGeometry args={[5.2, 0.45]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Overhead Signal Lights (Green / Cyan GO) */}
      {[-2.6, 0, 2.6].map((lx, idx) => (
        <group key={`signal-${idx}`} position={[lx, 6.0, 0]}>
          <mesh>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const BackgroundCity = ({ playerZRef }) => {
  const count = 18;
  const spacing = 20;
  const range = count * spacing; // 360 meters

  // Generate procedural buildings layout data with windows and rooftop features
  const buildings = useMemo(() => {
    const arr = [];
    const neonColors = ['#38bdf8', '#ec4899', '#a855f7', '#06b6d4', '#f59e0b', '#10b981'];
    const buildingColors = ['#1e1b4b', '#0f172a', '#172554', '#1e293b', '#131b2e'];

    for (let i = 0; i < count; i++) {
      const initialZ = -i * spacing;
      
      // Left side building
      const hLeft = 18 + Math.random() * 26;
      const wLeft = 9 + Math.random() * 7;
      const neonL = neonColors[i % neonColors.length];
      const hasBillboardL = i % 2 === 0;

      arr.push({
        id: `b-l-${i}`,
        x: -18 - Math.random() * 4,
        y: hLeft / 2 - 2,
        initialZ,
        width: wLeft,
        height: hLeft,
        depth: 16,
        color: buildingColors[i % buildingColors.length],
        neonColor: neonL,
        hasBillboard: hasBillboardL,
        windowPattern: i % 3
      });

      // Right side building
      const hRight = 18 + Math.random() * 26;
      const wRight = 9 + Math.random() * 7;
      const neonR = neonColors[(i + 3) % neonColors.length];
      const hasBillboardR = (i + 1) % 2 === 0;

      arr.push({
        id: `b-r-${i}`,
        x: 18 + Math.random() * 4,
        y: hRight / 2 - 2,
        initialZ,
        width: wRight,
        height: hRight,
        depth: 16,
        color: buildingColors[(i + 1) % buildingColors.length],
        neonColor: neonR,
        hasBillboard: hasBillboardR,
        windowPattern: (i + 1) % 3
      });
    }
    return arr;
  }, []);

  const groupRefs = useRef([]);

  useFrame(() => {
    if (!playerZRef || !playerZRef.current) return;
    const pz = playerZRef.current;

    buildings.forEach((b, idx) => {
      const groupEl = groupRefs.current[idx];
      if (groupEl) {
        const minZ = pz - 260;
        let worldZ = minZ + (((b.initialZ - minZ) % range + range) % range);
        groupEl.position.z = worldZ;
      }
    });
  });

  return (
    <group>
      {buildings.map((b, idx) => (
        <group 
          key={b.id} 
          ref={(el) => (groupRefs.current[idx] = el)} 
          position={[b.x, b.y, b.initialZ]}
        >
          {/* Building Main Structure */}
          <mesh receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.6} metalness={0.5} />
          </mesh>

          {/* Illuminated Window Matrix Panels */}
          {[-b.height * 0.3, -b.height * 0.05, b.height * 0.2, b.height * 0.38].map((wy, widx) => (
            <mesh key={`win-grid-${widx}`} position={[b.x > 0 ? -b.width / 2 - 0.04 : b.width / 2 + 0.04, wy, 0]}>
              <planeGeometry args={[b.depth * 0.75, 1.8]} />
              <meshStandardMaterial
                color={widx % 2 === 0 ? '#fef08a' : b.neonColor}
                emissive={widx % 2 === 0 ? '#fde047' : b.neonColor}
                emissiveIntensity={0.7}
              />
            </mesh>
          ))}

          {/* Rooftop Glowing Neon Crown Line */}
          <mesh position={[0, b.height / 2 + 0.15, 0]}>
            <boxGeometry args={[b.width * 0.95, 0.3, b.depth * 0.95]} />
            <meshStandardMaterial color={b.neonColor} emissive={b.neonColor} emissiveIntensity={1.1} />
          </mesh>

          {/* Rooftop Holographic Billboard or Antenna */}
          {b.hasBillboard ? (
            <group position={[0, b.height / 2 + 2.2, 0]}>
              <mesh>
                <planeGeometry args={[b.width * 0.7, 3.2]} />
                <meshStandardMaterial
                  color={b.neonColor}
                  emissive={b.neonColor}
                  emissiveIntensity={1.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ) : (
            <mesh position={[0, b.height / 2 + 2.5, 0]}>
              <cylinderGeometry args={[0.08, 0.16, 5, 8]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};


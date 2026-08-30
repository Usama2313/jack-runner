import React from 'react';
import { CHUNK_LENGTH, LEVELS } from '../../utils/constants';
import { useGameStore } from '../../store/gameStore';

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
  const index = (levelId - 1) % 4;
  if (index === 0) return "city";
  if (index === 1) return "nature";
  if (index === 2) return "desert";
  return "snowy";
};

export const Track = ({ chunkStart, chunkLength = CHUNK_LENGTH }) => {
  const currentLevel = useGameStore((s) => s.currentLevel);
  const levelInfo = LEVELS[Math.min(LEVELS.length - 1, currentLevel - 1)] || LEVELS[0];
  const railColor = levelInfo.railColor || '#38bdf8';
  const neonColor = levelInfo.neonColor || '#ec4899';
  const theme = getBiomeTheme(levelInfo.id, levelInfo.name);

  const zCenter = chunkStart - chunkLength / 2;

  // Customize colors based on theme
  let roadBedColor = "#0f172a"; 
  let asphaltColor = "#1e293b"; 
  let barrierColor = "#1e293b";

  if (theme === 'snowy') {
    roadBedColor = "#e2e8f0"; // Snowy bank
    asphaltColor = "#cbd5e1"; // Icy road
    barrierColor = "#cbd5e1"; // Snow wall
  } else if (theme === 'desert') {
    roadBedColor = "#eab308"; // Sand dunes
    asphaltColor = "#ca8a04"; // Sandy path
    barrierColor = "#854d0e"; // Mudbrick wall
  } else if (theme === 'nature') {
    roadBedColor = "#16a34a"; // Grassy bank
    asphaltColor = "#78350f"; // Wooden path
    barrierColor = "#78350f"; // Log barriers
  }

  return (
    <group>
      {/* Main Road Bed */}
      <mesh position={[0, -0.05, zCenter]}>
        <boxGeometry args={[11.6, 0.1, chunkLength]} />
        <meshStandardMaterial color={roadBedColor} roughness={0.65} metalness={0.4} />
      </mesh>

      {/* Center Asphalt Kinetic Highway */}
      <mesh position={[0, -0.01, zCenter]}>
        <boxGeometry args={[9.2, 0.04, chunkLength]} />
        <meshStandardMaterial color={asphaltColor} roughness={0.4} metalness={0.6} />
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
        <meshStandardMaterial color={barrierColor} roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Right Barrier */}
      <mesh position={[5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color={barrierColor} roughness={0.4} metalness={0.8} />
      </mesh>
    </group>
  );
};

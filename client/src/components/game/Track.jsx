import React, { useMemo } from 'react';
import * as THREE from 'three';
import { LANES, CHUNK_LENGTH } from '../../utils/constants';

export const Track = ({ chunkStart, chunkLength = CHUNK_LENGTH }) => {
  const lanes = [LANES.LEFT, LANES.CENTER, LANES.RIGHT];
  const zCenter = chunkStart - chunkLength / 2;

  // Generate cross-ties along the chunk
  const ties = useMemo(() => {
    const arr = [];
    const step = 2.6;
    for (let z = chunkStart; z > chunkStart - chunkLength; z -= step) {
      arr.push(z);
    }
    return arr;
  }, [chunkStart, chunkLength]);

  // Generate dashed lane division markers
  const laneDashes = useMemo(() => {
    const arr = [];
    const dashStep = 4.8;
    for (let z = chunkStart; z > chunkStart - chunkLength; z -= dashStep) {
      arr.push(z);
    }
    return arr;
  }, [chunkStart, chunkLength]);

  return (
    <group>
      {/* High-Tech Main Road Bed Floor */}
      <mesh position={[0, -0.05, zCenter]} receiveShadow>
        <boxGeometry args={[11.6, 0.1, chunkLength]} />
        <meshStandardMaterial color="#172033" roughness={0.65} metalness={0.4} />
      </mesh>

      {/* Center Track Asphalt Runner Plate */}
      <mesh position={[0, -0.01, zCenter]} receiveShadow>
        <boxGeometry args={[9.2, 0.04, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Subway Rails for each of the 3 lanes */}
      {lanes.map((laneX, idx) => (
        <group key={`track-${idx}`}>
          {/* Rail Bed Glow Strip underneath */}
          <mesh position={[laneX, 0.01, zCenter]}>
            <planeGeometry args={[1.5, chunkLength]} />
            <meshBasicMaterial
              color={idx === 1 ? '#0284c7' : '#6366f1'}
              transparent
              opacity={0.15}
            />
          </mesh>

          {/* Left Polished Steel Rail */}
          <mesh position={[laneX - 0.78, 0.1, zCenter]} castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.18, chunkLength]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Right Polished Steel Rail */}
          <mesh position={[laneX + 0.78, 0.1, zCenter]} castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.18, chunkLength]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Wooden / Carbon-Fiber Ties with Glowing Fasteners */}
      {ties.map((tz, i) => (
        <group key={`tie-${i}`}>
          {lanes.map((laneX, lIdx) => (
            <group key={`tie-${i}-${lIdx}`}>
              <mesh position={[laneX, 0.03, tz]} receiveShadow>
                <boxGeometry args={[1.9, 0.07, 0.4]} />
                <meshStandardMaterial color="#334155" roughness={0.7} metalness={0.3} />
              </mesh>
              {/* Glowing Bolt / Rivet accents */}
              <mesh position={[laneX - 0.78, 0.07, tz]}>
                <boxGeometry args={[0.12, 0.02, 0.14]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
              <mesh position={[laneX + 0.78, 0.07, tz]}>
                <boxGeometry args={[0.12, 0.02, 0.14]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Luminous Dashed Lane Division Markers (between lanes at -1.3 and +1.3) */}
      {laneDashes.map((dz, di) => (
        <group key={`dash-${di}`}>
          <mesh position={[-1.3, 0.02, dz]}>
            <boxGeometry args={[0.12, 0.01, 2.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[1.3, 0.02, dz]}>
            <boxGeometry args={[0.12, 0.01, 2.2]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}

      {/* Glowing Neon Edge Guide Rails */}
      <mesh position={[-5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[5.8, 0.35, zCenter]}>
        <boxGeometry args={[0.12, 0.7, chunkLength]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.9} />
      </mesh>

      {/* Subway Side Safety Barriers */}
      <mesh position={[-5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
      <mesh position={[5.92, 1.4, zCenter]}>
        <boxGeometry args={[0.18, 1.8, chunkLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
};


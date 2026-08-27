import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBSTACLE_TYPES } from '../../utils/constants';

export const Obstacle = ({ data }) => {
  const { type, x, z, bounds, color = '#dc2626', speed = 0 } = data;
  const trainRef = useRef();
  const holoRef = useRef();

  useFrame((state, delta) => {
    // Sync moving train's position.z
    if (speed > 0 && trainRef.current) {
      trainRef.current.position.z = data.z - z;
    }
    // Subtle float & pulse for holographic cues
    if (holoRef.current) {
      holoRef.current.position.y = 1.6 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
    }
  });

  if (type === OBSTACLE_TYPES.TRAIN) {
    const trainLength = bounds.depth || 14.0;
    const trainHeight = bounds.height || 3.2;
    const trainWidth = bounds.width || 2.3;

    return (
      <group ref={trainRef} position={[x, 0, z]}>
        {/* Main Futuristic Bullet Train Body */}
        <mesh position={[0, trainHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[trainWidth, trainHeight, trainLength]} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.25} />
        </mesh>

        {/* Neon Side Accent Racing Stripes */}
        <mesh position={[-trainWidth / 2 - 0.02, trainHeight * 0.45, 0]}>
          <boxGeometry args={[0.02, 0.22, trainLength - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[trainWidth / 2 + 0.02, trainHeight * 0.45, 0]}>
          <boxGeometry args={[0.02, 0.22, trainLength - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} />
        </mesh>

        {/* Train Roof Plate (Walkable surface) */}
        <mesh position={[0, trainHeight + 0.06, 0]} receiveShadow>
          <boxGeometry args={[trainWidth - 0.12, 0.12, trainLength - 0.2]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Front Aerodynamic Windshield */}
        <mesh position={[0, trainHeight - 0.65, trainLength / 2 + 0.05]}>
          <planeGeometry args={[trainWidth - 0.35, 0.95]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0284c7"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Front Cowcatcher / Grille with Hazard Glow */}
        <mesh position={[0, 0.4, trainLength / 2 + 0.22]} castShadow>
          <boxGeometry args={[trainWidth - 0.15, 0.65, 0.35]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.3, trainLength / 2 + 0.41]}>
          <planeGeometry args={[trainWidth - 0.4, 0.2]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>

        {/* High-Powered LED Headlights */}
        <mesh position={[-0.72, 1.25, trainLength / 2 + 0.08]}>
          <circleGeometry args={[0.24, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.72, 1.25, trainLength / 2 + 0.08]}>
          <circleGeometry args={[0.24, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>

        {/* Headlight illumination beam */}
        <pointLight
          position={[0, 1.4, trainLength / 2 + 3]}
          color="#fef08a"
          intensity={3.2}
          distance={24}
        />

        {/* Side Panoramic Passenger Windows */}
        {[-4.2, -1.8, 1.8, 4.2].map((wz, idx) => (
          <group key={`win-${idx}`}>
            <mesh position={[-trainWidth / 2 - 0.02, trainHeight - 0.75, wz]}>
              <planeGeometry args={[1.5, 0.7]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[trainWidth / 2 + 0.02, trainHeight - 0.75, wz]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.5, 0.7]} />
              <meshStandardMaterial color="#fef9c3" emissive="#fef08a" emissiveIntensity={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (type === OBSTACLE_TYPES.BARRIER_LOW) {
    // Low hurdle barrier with high visibility and holographic "▲ JUMP" cue
    return (
      <group position={[x, 0, z]}>
        {/* Left Heavy Support Post */}
        <mesh position={[-1.05, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Heavy Support Post */}
        <mesh position={[1.05, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Crossbar with High-Visibility Hazard Glow */}
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[2.3, 0.42, 0.18]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>

        {/* Hazard Warning Black & Yellow Chevron Strip */}
        <mesh position={[0, 0.82, 0.1]}>
          <planeGeometry args={[2.2, 0.32]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} />
        </mesh>

        {/* Neon Tripwire Laser Beam at bottom */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.1, 0.04, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Floating Holographic "▲ JUMP" Indicator Icon */}
        <group ref={holoRef} position={[0, 1.6, 0]}>
          {/* Holographic Diamond Frame */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.5, 0.5, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.5}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Glowing Up Arrow Inside Diamond */}
          <mesh position={[0, 0, 0.03]}>
            <coneGeometry args={[0.16, 0.28, 3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    );
  }

  if (type === OBSTACLE_TYPES.BARRIER_HIGH) {
    // High overhead bridge with holographic "▼ SLIDE" cue
    return (
      <group position={[x, 0, z]}>
        {/* Left Column */}
        <mesh position={[-1.15, 1.7, 0]} castShadow>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Column */}
        <mesh position={[1.15, 1.7, 0]} castShadow>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Overhead Heavy Girder */}
        <mesh position={[0, 2.35, 0]} castShadow>
          <boxGeometry args={[2.5, 1.25, 0.45]} />
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Overhead Warning Flasher / Neon Strip */}
        <mesh position={[0, 2.35, 0.24]}>
          <planeGeometry args={[2.2, 0.9]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>

        {/* Floating Holographic "▼ SLIDE" Down Arrow */}
        <group position={[0, 2.35, 0.27]}>
          <mesh rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.26, 0.45, 3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Neon Underglow Clearance Line */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.05]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>
    );
  }

  // Fallback: Construction Barricade
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.2, 1.6, 0.5]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Hazard Chevrons */}
      <mesh position={[0, 0.8, 0.26]}>
        <planeGeometry args={[2.0, 1.2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>
      {/* Top Warning Flashing Beacons */}
      <mesh position={[-0.6, 1.75, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0.6, 1.75, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
};


import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { POWERUP_TYPES } from '../../utils/constants';

export const Coin = ({ x, y = 0.8, z, collected }) => {
  const coinRef = useRef();

  useFrame((state, delta) => {
    if (coinRef.current && !collected) {
      // Rapid shiny coin spin
      coinRef.current.rotation.y += delta * 4.5;
    }
  });

  if (collected) return null;

  return (
    <group ref={coinRef} position={[x, y, z]}>
      {/* Outer Coin Ring */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.09, 16]} />
        <meshStandardMaterial
          color="#facc15"
          metalness={0.9}
          roughness={0.15}
          emissive="#eab308"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Inner Embossed Star */}
      <mesh position={[0, 0, 0.055]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.22, 5]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      <mesh position={[0, 0, -0.055]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.22, 5]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
    </group>
  );
};

export const PowerupItem = ({ type, x, y = 1.2, z, collected }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current && !collected) {
      groupRef.current.rotation.y += delta * 2.5;
      groupRef.current.position.y = y + Math.sin(state.clock.elapsedTime * 4) * 0.18;
    }
  });

  if (collected) return null;

  return (
    <group ref={groupRef} position={[x, y, z]}>
      {/* Outer Glowing Bubble Sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Specific Powerup Mesh */}
      {type === POWERUP_TYPES.MAGNET && (
        <group scale={0.7}>
          {/* Horseshoe shape */}
          <mesh>
            <torusGeometry args={[0.35, 0.1, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#ef4444" metalness={0.8} />
          </mesh>
          <mesh position={[-0.35, -0.2, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.35, -0.2, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {type === POWERUP_TYPES.JETPACK && (
        <group scale={0.65}>
          <mesh position={[-0.15, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />
            <meshStandardMaterial color="#ec4899" metalness={0.7} />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />
            <meshStandardMaterial color="#ec4899" metalness={0.7} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <coneGeometry args={[0.2, 0.3, 8]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
        </group>
      )}

      {type === POWERUP_TYPES.MULTIPLIER_2X && (
        <group scale={0.75}>
          <mesh>
            <octahedronGeometry args={[0.45]} />
            <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {type === POWERUP_TYPES.SUPER_SNEAKERS && (
        <group scale={0.7}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.25, 0.6]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
          </mesh>
          {/* Wings */}
          <mesh position={[-0.22, 0.15, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.2, 0.3]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.22, 0.15, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.2, 0.3]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {type === POWERUP_TYPES.HOVERBOARD && (
        <group scale={0.65} rotation={[0.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.4, 0.08, 0.9]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* Point light accent */}
      <pointLight color="#60a5fa" intensity={1.5} distance={5} />
    </group>
  );
};

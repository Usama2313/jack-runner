import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { LANE_WIDTH, PLAYER_Y_BASE, CHASER_CONFIG } from '../../utils/constants';

export const RobotChaser = ({ playerZRef }) => {
  const chaserGroupRef = useRef();
  const leftClawRef = useRef();
  const rightClawRef = useRef();
  const eyeRef = useRef();
  const sirenLightRef = useRef();
  const thrusterRef = useRef();

  const currentXRef = useRef(0);
  const currentYRef = useRef(1.2);

  useFrame((state, delta) => {
    if (!chaserGroupRef.current) return;

    const store = useGameStore.getState();
    const { lane, isDead, isCaptured, isStumbling, chaserDistance, isJumping, playerY } = store;

    // Follow player's lane smoothly
    const targetX = lane * LANE_WIDTH;
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, Math.min(1, delta * 8));

    // Follow player vertical Y with gentle hover
    const hoverOffset = Math.sin(state.clock.elapsedTime * 6.0) * 0.15;
    const targetY = isCaptured ? 1.0 : (isJumping ? 2.0 : 1.25) + hoverOffset;
    currentYRef.current = THREE.MathUtils.lerp(currentYRef.current, targetY, Math.min(1, delta * 6));

    const pz = playerZRef && playerZRef.current !== undefined ? playerZRef.current : 0;
    // Chaser position in Z is behind the player (positive relative to negative Z runner)
    const chaserZ = isCaptured ? pz + 0.8 : pz + chaserDistance;

    chaserGroupRef.current.position.set(currentXRef.current, currentYRef.current, chaserZ);

    // Menacing tilt & banking
    const isAggressive = isStumbling || chaserDistance <= CHASER_CONFIG.CLOSE_DISTANCE + 1.0;
    const targetRotX = isAggressive ? 0.35 : 0.15;
    chaserGroupRef.current.rotation.x = THREE.MathUtils.lerp(chaserGroupRef.current.rotation.x, targetRotX, delta * 5);

    // Red optic eye pulsing intensity
    if (eyeRef.current) {
      const pulseSpeed = isAggressive ? 18 : 6;
      const eyeIntensity = isAggressive ? 3.5 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 1.5 : 2.0;
      eyeRef.current.material.emissiveIntensity = eyeIntensity;
    }

    // Top Siren Emergency Flash
    if (sirenLightRef.current) {
      const sirenFlash = Math.sin(state.clock.elapsedTime * (isAggressive ? 20 : 8)) > 0 ? 3.0 : 0.4;
      sirenLightRef.current.material.emissiveIntensity = sirenFlash;
    }

    // Robotic claw reach animation
    if (leftClawRef.current && rightClawRef.current) {
      const clawAngle = isCaptured ? 0.85 : (isAggressive ? 0.55 + Math.sin(state.clock.elapsedTime * 12) * 0.25 : 0.15);
      leftClawRef.current.rotation.y = clawAngle;
      rightClawRef.current.rotation.y = -clawAngle;
    }

    // Thruster flame jitter
    if (thrusterRef.current) {
      const scaleF = 0.9 + Math.random() * 0.4;
      thrusterRef.current.scale.set(1, 1, scaleF);
    }
  });

  return (
    <group ref={chaserGroupRef} position={[0, 1.2, 7.2]}>
      {/* ─── MAIN CHASSIS / MECH TORSO ────────────────────────────────────── */}
      <mesh castShadow>
        <boxGeometry args={[0.95, 0.75, 0.85]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Armored Heavy Shoulder Guards */}
      <mesh position={[-0.55, 0.22, 0]}>
        <boxGeometry args={[0.26, 0.4, 0.65]} />
        <meshStandardMaterial color="#dc2626" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.55, 0.22, 0]}>
        <boxGeometry args={[0.26, 0.4, 0.65]} />
        <meshStandardMaterial color="#dc2626" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* ─── VISOR / RED SCANNER OPTIC (Menacing Robot Eye) ──────────────── */}
      <mesh ref={eyeRef} position={[0, 0.08, -0.44]}>
        <boxGeometry args={[0.68, 0.14, 0.05]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Warning Chevron Stripes */}
      <mesh position={[0, -0.22, -0.44]}>
        <boxGeometry args={[0.55, 0.08, 0.02]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* ─── TOP SIREN BEACON LIGHT ───────────────────────────────────────── */}
      <group position={[0, 0.48, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.14, 0.18, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh ref={sirenLightRef} position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.11, 12, 12]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={2.8}
          />
        </mesh>
      </group>

      {/* ─── ROBOTIC CAPTURE CLAW ARMS ────────────────────────────────────── */}
      {/* Left Capture Arm */}
      <group position={[-0.58, -0.05, -0.3]}>
        <group ref={leftClawRef}>
          {/* Forearm */}
          <mesh position={[0, 0, -0.35]}>
            <boxGeometry args={[0.14, 0.14, 0.55]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Pincer Claw Hook */}
          <mesh position={[0.08, 0, -0.65]} rotation={[0, -0.45, 0]}>
            <coneGeometry args={[0.09, 0.28, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Electro-Taser Spark on Claw Tip */}
          <mesh position={[0.12, 0, -0.78]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* Right Capture Arm */}
      <group position={[0.58, -0.05, -0.3]}>
        <group ref={rightClawRef}>
          {/* Forearm */}
          <mesh position={[0, 0, -0.35]}>
            <boxGeometry args={[0.14, 0.14, 0.55]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Pincer Claw Hook */}
          <mesh position={[-0.08, 0, -0.65]} rotation={[0, 0.45, 0]}>
            <coneGeometry args={[0.09, 0.28, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Electro-Taser Spark on Claw Tip */}
          <mesh position={[-0.12, 0, -0.78]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      </group>

      {/* ─── DUAL HOVER JET THRUSTERS ON BACK ────────────────────────────── */}
      <group position={[0, -0.1, 0.44]}>
        <mesh position={[-0.32, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.4, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>
        <mesh position={[0.32, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.16, 0.4, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} />
        </mesh>

        {/* Jet Exhaust Flames */}
        <group ref={thrusterRef}>
          <mesh position={[-0.32, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.13, 0.5, 8]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
          <mesh position={[0.32, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.13, 0.5, 8]} />
            <meshBasicMaterial color="#f97316" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

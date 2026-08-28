import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OBSTACLE_TYPES } from '../../utils/constants';

/* ─── Animated Pulsing Glow helper ────────────────────────────── */
const PulsingGlow = ({ color, position, size = 0.3, speed = 2.5 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.25;
      ref.current.scale.setScalar(s);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} transparent opacity={0.85} />
    </mesh>
  );
};

export const Obstacle = ({ data }) => {
  const { type, x, z, bounds = {}, color = '#dc2626' } = data;

  // ════════════════════════════════════════════════════════════════
  // 1. CYBER EXPRESS BULLET TRAIN — Long, metallic, with neon side stripes & headlights
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TRAIN) {
    const tL = bounds.depth || 14.0;
    const tH = bounds.height || 3.2;
    const tW = bounds.width || 2.3;
    return (
      <group position={[x, 0, z]}>
        {/* Main Body — Metallic Alloy */}
        <mesh position={[0, tH / 2, 0]}>
          <boxGeometry args={[tW, tH, tL]} />
          <meshStandardMaterial color={color} metalness={0.82} roughness={0.15} />
        </mesh>
        {/* Side Stripe Left */}
        <mesh position={[-tW / 2 - 0.02, tH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.25, tL - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
        </mesh>
        {/* Side Stripe Right */}
        <mesh position={[tW / 2 + 0.02, tH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.25, tL - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
        </mesh>
        {/* Bottom Stripe */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[tW + 0.1, 0.05, tL]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.2} />
        </mesh>
        {/* Roof Plate */}
        <mesh position={[0, tH + 0.06, 0]}>
          <boxGeometry args={[tW - 0.12, 0.12, tL - 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Front LED Headlights */}
        <mesh position={[-0.72, 1.25, tL / 2 + 0.08]}>
          <circleGeometry args={[0.26, 10]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.72, 1.25, tL / 2 + 0.08]}>
          <circleGeometry args={[0.26, 10]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Rear Red Taillights */}
        <mesh position={[-0.72, 1.25, -tL / 2 - 0.05]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.72, 1.25, -tL / 2 - 0.05]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
        {/* Windows Row */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={`win-${i}`} position={[-tW / 2 - 0.02, tH * 0.7, -tL / 3 + i * (tL / 5)]}>
            <planeGeometry args={[0.01, 0.5]} />
            <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 2. DOUBLE-DECKER CYBER CITY BUS — Tall, wide, boxy with neon ads
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BUS) {
    const bW = bounds.width || 2.2;
    const bH = bounds.height || 3.6;
    const bL = bounds.depth || 8.0;
    return (
      <group position={[x, 0, z]}>
        {/* Lower Deck */}
        <mesh position={[0, bH * 0.28, 0]}>
          <boxGeometry args={[bW, bH * 0.55, bL]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.25} />
        </mesh>
        {/* Upper Deck */}
        <mesh position={[0, bH * 0.72, 0]}>
          <boxGeometry args={[bW - 0.1, bH * 0.42, bL - 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.65} roughness={0.2} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, bH + 0.05, 0]}>
          <boxGeometry args={[bW - 0.2, 0.1, bL - 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Front Windshield */}
        <mesh position={[0, bH * 0.5, bL / 2 + 0.02]}>
          <planeGeometry args={[bW - 0.3, bH * 0.4]} />
          <meshStandardMaterial color="#93c5fd" emissive="#60a5fa" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        {/* Headlights */}
        <PulsingGlow color="#fef08a" position={[-bW / 2 + 0.2, 0.6, bL / 2 + 0.12]} size={0.18} speed={3} />
        <PulsingGlow color="#fef08a" position={[bW / 2 - 0.2, 0.6, bL / 2 + 0.12]} size={0.18} speed={3} />
        {/* Side Neon Ad Stripe */}
        <mesh position={[-bW / 2 - 0.02, bH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.3, bL - 1.0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[bW / 2 + 0.02, bH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.3, bL - 1.0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.6} />
        </mesh>
        {/* Wheels */}
        {[-1, 1].map((side) => (
          [-1, 1].map((end) => (
            <mesh key={`wheel-${side}-${end}`} position={[side * (bW / 2 + 0.08), 0.25, end * (bL / 3)]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.15, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        ))}
        {/* Taillights */}
        <mesh position={[-0.7, 0.7, -bL / 2 - 0.03]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.15, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[0.7, 0.7, -bL / 2 - 0.03]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.15, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 3. CYBER SUPERBIKE / MOTORBIKE — Low, fast, sleek
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.MOTORBIKE) {
    return (
      <group position={[x, 0, z]}>
        {/* Bike Body Frame */}
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.55, 2.2]} />
          <meshStandardMaterial color="#ef4444" metalness={0.85} roughness={0.15} />
        </mesh>
        {/* Fuel Tank / Upper Body */}
        <mesh position={[0, 0.9, 0.2]}>
          <boxGeometry args={[0.5, 0.35, 1.0]} />
          <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.18} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 1.1, 0.9]} rotation={[-0.5, 0, 0]}>
          <planeGeometry args={[0.4, 0.5]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.5} metalness={0.3} />
        </mesh>
        {/* Front Wheel */}
        <mesh position={[0, 0.3, 1.0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.1, 8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Rear Wheel */}
        <mesh position={[0, 0.3, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.12, 8, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Headlight */}
        <PulsingGlow color="#fef08a" position={[0, 0.85, 1.2]} size={0.12} speed={4} />
        {/* Taillight */}
        <mesh position={[0, 0.65, -1.15]}>
          <boxGeometry args={[0.3, 0.08, 0.04]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.0} />
        </mesh>
        {/* Exhaust Pipe Glow */}
        <mesh position={[0.25, 0.35, -1.0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.4, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#a3a3a3" metalness={0.95} roughness={0.1} />
        </mesh>
        <PulsingGlow color="#f97316" position={[0.25, 0.35, -1.22]} size={0.06} speed={6} />
        {/* Neon Underglow */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.7, 0.03, 2.0]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={2.0} transparent opacity={0.7} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 4. CONCRETE HIGHWAY BARRIER — K-Rail / Jersey barrier
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.CONCRETE_BARRIER) {
    return (
      <group position={[x, 0, z]}>
        {/* Main Concrete Block */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.2, 1.0, 0.8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.8} />
        </mesh>
        {/* Top chamfer */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[1.8, 0.12, 0.6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.9} />
        </mesh>
        {/* Warning Stripes */}
        <mesh position={[0, 0.5, 0.42]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#eab308" emissiveIntensity={0.4} />
        </mesh>
        {/* Reflective Delineator Posts on top */}
        <mesh position={[-0.7, 1.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.7, 1.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 5. LOW BARRIER — Jump over (Guardrail)
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BARRIER_LOW) {
    return (
      <group position={[x, 0, z]}>
        {/* Left Post */}
        <mesh position={[-1.05, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Right Post */}
        <mesh position={[1.05, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 8]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Rail Bar */}
        <mesh position={[0, 0.82, 0]}>
          <boxGeometry args={[2.3, 0.42, 0.18]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} roughness={0.2} metalness={0.6} />
        </mesh>
        {/* Danger Wire */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.1, 0.04, 0.04]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 6. HIGH BARRIER / OVERHEAD SIGN — Slide under
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BARRIER_HIGH) {
    return (
      <group position={[x, 0, z]}>
        {/* Left Pillar */}
        <mesh position={[-1.15, 1.7, 0]}>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Right Pillar */}
        <mesh position={[1.15, 1.7, 0]}>
          <boxGeometry args={[0.22, 3.4, 0.25]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Cross Sign Board */}
        <mesh position={[0, 2.35, 0]}>
          <boxGeometry args={[2.5, 1.25, 0.45]} />
          <meshStandardMaterial color="#dc2626" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Front LED Panel */}
        <mesh position={[0, 2.35, 0.24]}>
          <planeGeometry args={[2.2, 0.9]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        {/* Low Clearance Wire */}
        <mesh position={[0, 1.7, 0]}>
          <boxGeometry args={[2.3, 0.05, 0.05]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 7. CONSTRUCTION BARRIER — Flashing caution
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.CONSTRUCTION) {
    return (
      <group position={[x, 0, z]}>
        {/* Base Drum */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.9, 10]} />
          <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* Reflective Stripes */}
        <mesh position={[0, 0.7, 0.38]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0.38]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} />
        </mesh>
        {/* Flashing Beacon */}
        <PulsingGlow color="#facc15" position={[0, 1.0, 0]} size={0.15} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 8. TESLA ELECTRIC COIL
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TESLA_COIL) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[-1.0, 0.65, 0]}>
          <cylinderGeometry args={[0.15, 0.22, 1.3, 10]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        <PulsingGlow color="#38bdf8" position={[-1.0, 1.35, 0]} size={0.22} speed={4} />
        <mesh position={[1.0, 0.65, 0]}>
          <cylinderGeometry args={[0.15, 0.22, 1.3, 10]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
        </mesh>
        <PulsingGlow color="#38bdf8" position={[1.0, 1.35, 0]} size={0.22} speed={4} />
        {/* Electric Arc Beam */}
        <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
          <meshStandardMaterial color="#a855f7" emissive="#c084fc" emissiveIntensity={3.0} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 9. MAGMA PYLON — Volcanic vent with molten glow
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.MAGMA_PYLON) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.65, 0.95, 1.3, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        <PulsingGlow color="#f97316" position={[0, 1.32, 0]} size={0.42} speed={3} />
        {/* Lava drip spots */}
        <mesh position={[-0.3, 0.3, 0.5]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={2.0} />
        </mesh>
        <mesh position={[0.35, 0.25, -0.4]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={2.0} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 10. PLASMA WALL — Laser grid gate (Slide under)
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.PLASMA_WALL) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[-1.15, 1.7, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 3.4, 8]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.9} />
        </mesh>
        <mesh position={[1.15, 1.7, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 3.4, 8]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[2.3, 1.2, 0.1]} />
          <meshStandardMaterial color="#06b6d4" emissive="#38bdf8" emissiveIntensity={2.0} transparent opacity={0.8} />
        </mesh>
        {/* Horizontal laser beams */}
        {[1.9, 2.3, 2.7].map((y) => (
          <mesh key={`laser-${y}`} position={[0, y, 0]}>
            <boxGeometry args={[2.2, 0.03, 0.03]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3.0} />
          </mesh>
        ))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 11. ICE SPIKE — Cryo crystal formation
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.ICE_SPIKE) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[-0.6, 0.6, 0]} rotation={[0.1, 0, 0.1]}>
          <coneGeometry args={[0.35, 1.2, 6]} />
          <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <coneGeometry args={[0.42, 1.5, 6]} />
          <meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={1.2} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 0.6, 0]} rotation={[-0.1, 0, -0.1]}>
          <coneGeometry args={[0.35, 1.2, 6]} />
          <meshStandardMaterial color="#67e8f9" emissive="#06b6d4" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
        {/* Frost ground ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 1.3, 12]} />
          <meshStandardMaterial color="#bae6fd" emissive="#67e8f9" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 12. TITAN PISTON — Industrial crusher
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TITAN_PISTON) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[2.3, 2.8, 1.0]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Warning Plate */}
        <mesh position={[0, 0.8, 0.52]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
        {/* Hydraulic Pistons */}
        <mesh position={[-0.8, 2.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 2.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Danger lights */}
        <PulsingGlow color="#ef4444" position={[-0.9, 2.7, 0.5]} size={0.1} speed={5} />
        <PulsingGlow color="#ef4444" position={[0.9, 2.7, 0.5]} size={0.1} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 13. VOID CRYSTAL — Dark matter anomaly monolith
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.VOID_CRYSTAL) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 1.3, 0]}>
          <octahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#3b0764" emissive="#a855f7" emissiveIntensity={1.8} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Gravitational aura ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.6, 16]} />
          <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={1.0} transparent opacity={0.3} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 14. ROBOT BARRIER / SENTRY GATE — Automated police barricade
  // ════════════════════════════════════════════════════════════════
  return (
    <group position={[x, 0, z]}>
      <mesh position={[-1.1, 1.4, 0]}>
        <boxGeometry args={[0.25, 2.8, 0.25]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      <mesh position={[1.1, 1.4, 0]}>
        <boxGeometry args={[0.25, 2.8, 0.25]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[2.4, 1.0, 0.3]} />
        <meshStandardMaterial color="#dc2626" emissive="#ef4444" emissiveIntensity={0.8} />
      </mesh>
      {/* Siren beacons */}
      <PulsingGlow color="#ef4444" position={[-1.1, 2.85, 0]} size={0.12} speed={6} />
      <PulsingGlow color="#3b82f6" position={[1.1, 2.85, 0]} size={0.12} speed={6} />
    </group>
  );
};

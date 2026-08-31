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

/* ─── Animated Flame helper ─────────────────────────────────────── */
const AnimFlame = ({ position, color1 = '#ff4500', color2 = '#ff8c00', size = 0.5, speed = 4.0 }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.scale.x = 0.8 + Math.sin(t * speed + 0.3) * 0.3;
      ref.current.scale.y = 0.85 + Math.sin(t * speed * 1.3) * 0.2;
      ref.current.position.y = position[1] + Math.sin(t * speed * 0.7) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <coneGeometry args={[size, size * 2.5, 8]} />
      <meshStandardMaterial color={color1} emissive={color2} emissiveIntensity={3.0} transparent opacity={0.9} />
    </mesh>
  );
};

/* ─── Spinning Ring helper ─────────────────────────────────────── */
const SpinningRing = ({ position, color, innerR, outerR, speed = 1.5, axis = 'y' }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      if (axis === 'y') ref.current.rotation.y = state.clock.elapsedTime * speed;
      if (axis === 'x') ref.current.rotation.x = state.clock.elapsedTime * speed;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerR, outerR, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
};

export const Obstacle = ({ data }) => {
  const { type, x, z, bounds = {}, color = '#dc2626' } = data;

  // ════════════════════════════════════════════════════════════════
  // 1. CYBER EXPRESS BULLET TRAIN
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TRAIN) {
    const tL = bounds.depth || 14.0;
    const tH = bounds.height || 3.2;
    const tW = bounds.width || 2.3;
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, tH / 2, 0]}>
          <boxGeometry args={[tW, tH, tL]} />
          <meshStandardMaterial color={color} metalness={0.82} roughness={0.15} />
        </mesh>
        <mesh position={[-tW / 2 - 0.02, tH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.25, tL - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[tW / 2 + 0.02, tH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.25, tL - 0.5]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[tW + 0.1, 0.05, tL]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, tH + 0.06, 0]}>
          <boxGeometry args={[tW - 0.12, 0.12, tL - 0.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-0.72, 1.25, tL / 2 + 0.08]}>
          <circleGeometry args={[0.26, 10]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[0.72, 1.25, tL / 2 + 0.08]}>
          <circleGeometry args={[0.26, 10]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <mesh position={[-0.72, 1.25, -tL / 2 - 0.05]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0.72, 1.25, -tL / 2 - 0.05]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.2, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>
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
  // 2. DOUBLE-DECKER CYBER CITY BUS
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BUS) {
    const bW = bounds.width || 2.2;
    const bH = bounds.height || 3.6;
    const bL = bounds.depth || 8.0;
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, bH * 0.28, 0]}>
          <boxGeometry args={[bW, bH * 0.55, bL]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.25} />
        </mesh>
        <mesh position={[0, bH * 0.72, 0]}>
          <boxGeometry args={[bW - 0.1, bH * 0.42, bL - 0.3]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.65} roughness={0.2} />
        </mesh>
        <mesh position={[0, bH + 0.05, 0]}>
          <boxGeometry args={[bW - 0.2, 0.1, bL - 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, bH * 0.5, bL / 2 + 0.02]}>
          <planeGeometry args={[bW - 0.3, bH * 0.4]} />
          <meshStandardMaterial color="#93c5fd" emissive="#60a5fa" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        <PulsingGlow color="#fef08a" position={[-bW / 2 + 0.2, 0.6, bL / 2 + 0.12]} size={0.18} speed={3} />
        <PulsingGlow color="#fef08a" position={[bW / 2 - 0.2, 0.6, bL / 2 + 0.12]} size={0.18} speed={3} />
        <mesh position={[-bW / 2 - 0.02, bH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.3, bL - 1.0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.6} />
        </mesh>
        <mesh position={[bW / 2 + 0.02, bH * 0.45, 0]}>
          <boxGeometry args={[0.04, 0.3, bL - 1.0]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.6} />
        </mesh>
        {[-1, 1].map((side) => (
          [-1, 1].map((end) => (
            <mesh key={`wheel-${side}-${end}`} position={[side * (bW / 2 + 0.08), 0.25, end * (bL / 3)]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.15, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
          ))
        ))}
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
  // 3. CYBER SUPERBIKE / MOTORBIKE
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.MOTORBIKE) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.55, 0.7, 2.0]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.12} />
        </mesh>
        <mesh position={[0, 0.28, -0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 14]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.28, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 14]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.9, -0.15]}>
          <boxGeometry args={[0.3, 0.45, 0.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <PulsingGlow color="#fef08a" position={[0, 0.55, 1.06]} size={0.1} speed={4} />
        <PulsingGlow color="#ef4444" position={[0, 0.55, -1.05]} size={0.09} speed={4} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 4. AMBULANCE — Emergency vehicle with flashing lights
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.AMBULANCE) {
    const aW = bounds.width || 2.0;
    const aH = bounds.height || 2.4;
    const aL = bounds.depth || 5.5;
    return (
      <group position={[x, 0, z]}>
        {/* Main body — white */}
        <mesh position={[0, aH * 0.45, 0]}>
          <boxGeometry args={[aW, aH * 0.9, aL]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Red cross stripe */}
        <mesh position={[-aW / 2 - 0.01, aH * 0.55, 0]}>
          <boxGeometry args={[0.04, 0.4, aL - 1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[aW / 2 + 0.01, aH * 0.55, 0]}>
          <boxGeometry args={[0.04, 0.4, aL - 1]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
        </mesh>
        {/* Roof rack */}
        <mesh position={[0, aH + 0.1, 0]}>
          <boxGeometry args={[aW - 0.2, 0.15, aL - 0.6]} />
          <meshStandardMaterial color="#374151" metalness={0.8} />
        </mesh>
        {/* Alternating red/blue siren lights */}
        <PulsingGlow color="#ef4444" position={[-0.4, aH + 0.25, 0.5]} size={0.16} speed={8} />
        <PulsingGlow color="#3b82f6" position={[0.4, aH + 0.25, 0.5]} size={0.16} speed={8} />
        {/* Windshield */}
        <mesh position={[0, aH * 0.6, aL / 2 + 0.02]}>
          <planeGeometry args={[aW - 0.3, aH * 0.35]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} emissive="#60a5fa" emissiveIntensity={0.3} />
        </mesh>
        {/* Wheels */}
        {[-1, 1].map((side) => [-1, 1].map((end) => (
          <mesh key={`aw-${side}-${end}`} position={[side * (aW / 2 + 0.06), 0.22, end * (aL / 3)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        )))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 5. POLICE CAR — Patrol car with siren
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.POLICE_CAR) {
    const pW = bounds.width || 2.0;
    const pH = bounds.height || 1.8;
    const pL = bounds.depth || 4.5;
    return (
      <group position={[x, 0, z]}>
        {/* Body — dark navy/black */}
        <mesh position={[0, pH * 0.4, 0]}>
          <boxGeometry args={[pW, pH * 0.7, pL]} />
          <meshStandardMaterial color="#1e3a5f" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cabin roof */}
        <mesh position={[0, pH * 0.85, -0.3]}>
          <boxGeometry args={[pW - 0.3, pH * 0.35, pL * 0.6]} />
          <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Police stripe */}
        <mesh position={[0, pH * 0.35, pL / 2 + 0.01]}>
          <planeGeometry args={[pW, 0.15]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Siren lights */}
        <PulsingGlow color="#ef4444" position={[-0.35, pH + 0.12, 0]} size={0.14} speed={10} />
        <PulsingGlow color="#3b82f6" position={[0.35, pH + 0.12, 0]} size={0.14} speed={10} />
        {/* Headlights */}
        <PulsingGlow color="#fef08a" position={[-0.55, 0.4, pL / 2 + 0.1]} size={0.12} speed={2} />
        <PulsingGlow color="#fef08a" position={[0.55, 0.4, pL / 2 + 0.1]} size={0.12} speed={2} />
        {/* Wheels */}
        {[-1, 1].map((side) => [-1, 1].map((end) => (
          <mesh key={`pw-${side}-${end}`} position={[side * (pW / 2 + 0.06), 0.2, end * (pL / 3)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 10]} />
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
          </mesh>
        )))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 6. HEAVY FREIGHT TRUCK
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TRUCK) {
    const trkW = bounds.width || 2.3;
    const trkH = bounds.height || 3.5;
    const trkL = bounds.depth || 10.0;
    return (
      <group position={[x, 0, z]}>
        {/* Trailer body */}
        <mesh position={[0, trkH * 0.42, -trkL * 0.22]}>
          <boxGeometry args={[trkW, trkH * 0.82, trkL * 0.65]} />
          <meshStandardMaterial color="#374151" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Cab */}
        <mesh position={[0, trkH * 0.45, trkL * 0.32]}>
          <boxGeometry args={[trkW - 0.1, trkH * 0.75, trkL * 0.3]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Cab windshield */}
        <mesh position={[0, trkH * 0.6, trkL / 2 + 0.05]}>
          <planeGeometry args={[trkW - 0.4, trkH * 0.3]} />
          <meshStandardMaterial color="#bfdbfe" transparent opacity={0.7} emissive="#60a5fa" emissiveIntensity={0.3} />
        </mesh>
        {/* Side stripes */}
        <mesh position={[-trkW / 2 - 0.03, trkH * 0.3, -trkL * 0.22]}>
          <boxGeometry args={[0.05, 0.2, trkL * 0.65]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[trkW / 2 + 0.03, trkH * 0.3, -trkL * 0.22]}>
          <boxGeometry args={[0.05, 0.2, trkL * 0.65]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.4} />
        </mesh>
        {/* Wheels — dual axle */}
        {[-1, 1].map((side) => [-0.3, 0.4].map((end, ei) => (
          <mesh key={`tw-${side}-${ei}`} position={[side * (trkW / 2 + 0.1), 0.3, end * trkL]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.14, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        )))}
        <PulsingGlow color="#fef08a" position={[-trkW / 2 + 0.2, 0.7, trkL / 2 + 0.1]} size={0.2} speed={2} />
        <PulsingGlow color="#fef08a" position={[trkW / 2 - 0.2, 0.7, trkL / 2 + 0.1]} size={0.2} speed={2} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 7. YELLOW TAXI
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TAXI) {
    const txW = bounds.width || 2.0;
    const txH = bounds.height || 1.7;
    const txL = bounds.depth || 4.5;
    return (
      <group position={[x, 0, z]}>
        {/* Body — bright yellow */}
        <mesh position={[0, txH * 0.38, 0]}>
          <boxGeometry args={[txW, txH * 0.7, txL]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Cabin */}
        <mesh position={[0, txH * 0.8, -0.2]}>
          <boxGeometry args={[txW - 0.25, txH * 0.38, txL * 0.6]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Checkered stripe */}
        {[-2, -1, 0, 1, 2].map((i) => (
          <mesh key={`check-${i}`} position={[0, txH * 0.4, i * 0.55]}>
            <boxGeometry args={[txW + 0.02, 0.15, 0.25]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#000000' : '#fbbf24'} />
          </mesh>
        ))}
        {/* Taxi sign on roof */}
        <mesh position={[0, txH + 0.08, 0]}>
          <boxGeometry args={[0.5, 0.18, 0.9]} />
          <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
        {/* Wheels */}
        {[-1, 1].map((side) => [-1, 1].map((end) => (
          <mesh key={`txw-${side}-${end}`} position={[side * (txW / 2 + 0.06), 0.2, end * (txL / 3)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        )))}
        <PulsingGlow color="#fef08a" position={[-0.55, 0.38, txL / 2 + 0.1]} size={0.11} speed={2} />
        <PulsingGlow color="#fef08a" position={[0.55, 0.38, txL / 2 + 0.1]} size={0.11} speed={2} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 8. SPORTS CAR — Low sleek fast car
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.SPORTS_CAR) {
    const scW = bounds.width || 2.0;
    const scH = bounds.height || 1.3;
    const scL = bounds.depth || 4.0;
    return (
      <group position={[x, 0, z]}>
        {/* Lower body */}
        <mesh position={[0, scH * 0.3, 0]}>
          <boxGeometry args={[scW, scH * 0.55, scL]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Sloped cabin */}
        <mesh position={[0, scH * 0.78, -0.1]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[scW - 0.35, scH * 0.45, scL * 0.55]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.12} />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, scH * 0.7, scL * 0.22]} rotation={[-0.35, 0, 0]}>
          <planeGeometry args={[scW - 0.4, scH * 0.4]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.8} emissive="#60a5fa" emissiveIntensity={0.4} />
        </mesh>
        {/* Neon undercarriage */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[scW - 0.1, 0.04, scL - 0.2]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.0} />
        </mesh>
        {/* Wheels */}
        {[-1, 1].map((side) => [-1, 1].map((end) => (
          <mesh key={`scw-${side}-${end}`} position={[side * (scW / 2 + 0.06), 0.18, end * (scL / 3)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </mesh>
        )))}
        <PulsingGlow color="#fef08a" position={[-0.65, 0.35, scL / 2 + 0.1]} size={0.1} speed={2} />
        <PulsingGlow color="#fef08a" position={[0.65, 0.35, scL / 2 + 0.1]} size={0.1} speed={2} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 9. HELICOPTER — Aerial hazard (appears when Jetpack active)
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.HELICOPTER) {
    const hY = 4.8; // Fly height above ground
    return (
      <group position={[x, 0, z]}>
        {/* Fuselage */}
        <mesh position={[0, hY, 0]}>
          <boxGeometry args={[1.0, 0.7, 3.5]} />
          <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Cockpit bubble */}
        <mesh position={[0, hY + 0.12, 1.5]}>
          <sphereGeometry args={[0.65, 10, 8]} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.75} emissive="#60a5fa" emissiveIntensity={0.5} />
        </mesh>
        {/* Tail boom */}
        <mesh position={[0, hY - 0.05, -2.0]}>
          <boxGeometry args={[0.25, 0.3, 1.5]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Tail rotor */}
        <mesh position={[0.18, hY + 0.05, -2.8]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.04, 4]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
        {/* Main rotor disk */}
        <mesh position={[0, hY + 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 0.04, 4]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.1} transparent opacity={0.55} />
        </mesh>
        {/* Landing skids */}
        <mesh position={[-0.55, hY - 0.38, 0]}>
          <boxGeometry args={[0.08, 0.08, 2.8]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.55, hY - 0.38, 0]}>
          <boxGeometry args={[0.08, 0.08, 2.8]} />
          <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Navigation lights */}
        <PulsingGlow color="#ef4444" position={[-1.1, hY, 0]} size={0.12} speed={6} />
        <PulsingGlow color="#10b981" position={[1.1, hY, 0]} size={0.12} speed={6} />
        <PulsingGlow color="#fbbf24" position={[0, hY + 0.45, 0]} size={0.1} speed={9} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 10. LOW BARRIER / GUARDRAIL
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BARRIER_LOW) {
    const bH = bounds.height || 1.1;
    const bW = bounds.width || 2.2;
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, bH * 0.5, 0]}>
          <boxGeometry args={[bW, bH, 0.5]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, bH * 0.7, 0.28]}>
          <boxGeometry args={[bW - 0.2, 0.08, 0.04]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} />
        </mesh>
        <PulsingGlow color="#facc15" position={[-bW / 2 + 0.15, bH, 0]} size={0.1} speed={4} />
        <PulsingGlow color="#facc15" position={[bW / 2 - 0.15, bH, 0]} size={0.1} speed={4} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 11. HIGH OVERHEAD BARRIER (slide under)
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.BARRIER_HIGH) {
    const bhW = bounds.width || 2.3;
    const bhH = bounds.height || 2.4;
    return (
      <group position={[x, 0, z]}>
        <mesh position={[-bhW / 2 - 0.05, bhH * 0.42, 0]}>
          <boxGeometry args={[0.22, bhH * 0.82, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[bhW / 2 + 0.05, bhH * 0.42, 0]}>
          <boxGeometry args={[0.22, bhH * 0.82, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, bhH, 0]}>
          <boxGeometry args={[bhW + 0.4, 0.3, 0.5]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.6} />
        </mesh>
        <PulsingGlow color="#facc15" position={[-bhW / 2, bhH + 0.12, 0]} size={0.12} speed={5} />
        <PulsingGlow color="#facc15" position={[bhW / 2, bhH + 0.12, 0]} size={0.12} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 12. CONCRETE K-RAIL BARRIER
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.CONCRETE_BARRIER) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[2.2, 0.7, 0.75]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.9} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[2.0, 0.55, 0.55]} />
          <meshStandardMaterial color="#6b7280" roughness={0.85} metalness={0.15} />
        </mesh>
        {[-0.8, 0, 0.8].map((xo) => (
          <mesh key={`stripe-${xo}`} position={[xo, 0.38, 0.38]}>
            <boxGeometry args={[0.08, 0.35, 0.01]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 13. CONSTRUCTION BARRIER
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.CONSTRUCTION) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 0.9, 10]} />
          <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.7, 0.38]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 0.45, 0.38]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.6} />
        </mesh>
        <PulsingGlow color="#facc15" position={[0, 1.0, 0]} size={0.15} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 14. TESLA ELECTRIC COIL
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
        <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
          <meshStandardMaterial color="#a855f7" emissive="#c084fc" emissiveIntensity={3.0} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 15. MAGMA PYLON
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.MAGMA_PYLON) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.65, 0.95, 1.3, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.8} />
        </mesh>
        <PulsingGlow color="#f97316" position={[0, 1.32, 0]} size={0.42} speed={3} />
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
  // 16. PLASMA WALL (slide under)
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
  // 17. ICE SPIKE
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
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 1.3, 12]} />
          <meshStandardMaterial color="#bae6fd" emissive="#67e8f9" emissiveIntensity={0.5} transparent opacity={0.4} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 18. TITAN PISTON
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TITAN_PISTON) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[2.3, 2.8, 1.0]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.8, 0.52]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
        <mesh position={[-0.8, 2.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh position={[0.8, 2.6, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
        <PulsingGlow color="#ef4444" position={[-0.9, 2.7, 0.5]} size={0.1} speed={5} />
        <PulsingGlow color="#ef4444" position={[0.9, 2.7, 0.5]} size={0.1} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 19. VOID CRYSTAL
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.VOID_CRYSTAL) {
    return (
      <group position={[x, 0, z]}>
        <mesh position={[0, 1.3, 0]}>
          <octahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#3b0764" emissive="#a855f7" emissiveIntensity={1.8} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.6, 16]} />
          <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={1.0} transparent opacity={0.3} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 20. 🔥 FIRE PILLAR — Candle-fire column with animated flames
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.FIRE_PILLAR) {
    return (
      <group position={[x, 0, z]}>
        {/* Stone base column */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.4, 0.55, 1.2, 10]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>
        {/* Middle column */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.28, 0.4, 1.0, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.85} />
        </mesh>
        {/* Top bowl */}
        <mesh position={[0, 2.0, 0]}>
          <cylinderGeometry args={[0.45, 0.25, 0.4, 10]} />
          <meshStandardMaterial color="#292524" roughness={0.8} />
        </mesh>
        {/* Main fire flames (animated) */}
        <AnimFlame position={[0, 2.5, 0]} color1="#ff4500" color2="#fbbf24" size={0.45} speed={3.5} />
        <AnimFlame position={[-0.18, 2.3, 0.1]} color1="#ff6600" color2="#f97316" size={0.28} speed={4.2} />
        <AnimFlame position={[0.2, 2.35, -0.1]} color1="#dc2626" color2="#ef4444" size={0.3} speed={5.0} />
        {/* Fire glow at base */}
        <PulsingGlow color="#f97316" position={[0, 2.1, 0]} size={0.55} speed={2.5} />
        {/* Ground scorch ring */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 1.1, 14]} />
          <meshStandardMaterial color="#7c2d12" emissive="#ea580c" emissiveIntensity={0.4} transparent opacity={0.5} />
        </mesh>
        {/* Embers particles */}
        {[0, 1.2, 2.4, 3.6].map((angle) => (
          <PulsingGlow key={`ember-${angle}`} color="#fbbf24" position={[Math.cos(angle) * 0.6, 2.2 + Math.sin(angle * 2) * 0.2, Math.sin(angle) * 0.6]} size={0.06} speed={6 + angle} />
        ))}
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 21. 💧 WATER SURGE — Tsunami / hydro wave
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.WATER_SURGE) {
    return (
      <group position={[x, 0, z]}>
        {/* Main wave body */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[1.3, 12, 8]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.8} transparent opacity={0.85} roughness={0.1} />
        </mesh>
        {/* Wave crest top */}
        <mesh position={[0, 1.8, -0.3]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[0.9, 10, 7]} />
          <meshStandardMaterial color="#38bdf8" emissive="#7dd3fc" emissiveIntensity={1.0} transparent opacity={0.75} roughness={0.05} />
        </mesh>
        {/* Foam white caps */}
        <mesh position={[0, 2.0, -0.5]}>
          <sphereGeometry args={[0.5, 8, 6]} />
          <meshStandardMaterial color="#f0f9ff" emissive="#e0f2fe" emissiveIntensity={0.5} transparent opacity={0.9} />
        </mesh>
        {/* Water base spreading */}
        <mesh position={[0, 0.12, 0.4]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[2.5, 0.25, 2.0]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        {/* Ripple rings */}
        <SpinningRing position={[0, 0.1, 0]} color="#7dd3fc" innerR={0.8} outerR={1.6} speed={1.2} />
        <SpinningRing position={[0, 0.12, 0]} color="#38bdf8" innerR={1.4} outerR={2.0} speed={0.8} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 22. 🏜️ SAND STORM — Whirling desert cyclone (slide under)
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.SAND_STORM) {
    return (
      <group position={[x, 0, z]}>
        {/* Sand funnel bottom */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[1.2, 1.0, 12]} />
          <meshStandardMaterial color="#92400e" emissive="#b45309" emissiveIntensity={0.6} transparent opacity={0.8} />
        </mesh>
        {/* Sand funnel middle */}
        <mesh position={[0, 1.6, 0]}>
          <coneGeometry args={[1.5, 1.4, 12]} rotation={[Math.PI, 0, 0]} />
          <meshStandardMaterial color="#a16207" emissive="#ca8a04" emissiveIntensity={0.5} transparent opacity={0.75} />
        </mesh>
        {/* Top wide vortex */}
        <mesh position={[0, 2.8, 0]}>
          <cylinderGeometry args={[1.8, 1.0, 0.8, 14]} />
          <meshStandardMaterial color="#d97706" emissive="#f59e0b" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
        {/* Spinning sand particles */}
        <SpinningRing position={[0, 1.0, 0]} color="#fbbf24" innerR={0.6} outerR={1.4} speed={3.0} axis="y" />
        <SpinningRing position={[0, 1.8, 0]} color="#f59e0b" innerR={0.8} outerR={1.6} speed={-2.5} axis="y" />
        <SpinningRing position={[0, 2.5, 0]} color="#fcd34d" innerR={1.0} outerR={1.9} speed={2.0} axis="y" />
        {/* Ground dust ring */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 2.2, 14]} />
          <meshStandardMaterial color="#d97706" emissive="#f59e0b" emissiveIntensity={0.4} transparent opacity={0.4} />
        </mesh>
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 23. 🌪️ TORNADO — Spinning twister
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.TORNADO) {
    return (
      <group position={[x, 0, z]}>
        {/* Main twister cone */}
        <mesh position={[0, 1.0, 0]}>
          <coneGeometry args={[0.35, 2.0, 12]} />
          <meshStandardMaterial color="#6b7280" emissive="#9ca3af" emissiveIntensity={0.7} transparent opacity={0.8} />
        </mesh>
        {/* Wide top */}
        <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[1.3, 1.5, 12]} />
          <meshStandardMaterial color="#4b5563" emissive="#9ca3af" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
        {/* Spinning debris bands */}
        <SpinningRing position={[0, 0.5, 0]} color="#374151" innerR={0.2} outerR={0.9} speed={5.0} />
        <SpinningRing position={[0, 1.2, 0]} color="#6b7280" innerR={0.4} outerR={1.2} speed={-4.0} />
        <SpinningRing position={[0, 2.0, 0]} color="#9ca3af" innerR={0.6} outerR={1.5} speed={3.5} />
        {/* Ground vortex */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 1.8, 14]} />
          <meshStandardMaterial color="#374151" emissive="#6b7280" emissiveIntensity={0.5} transparent opacity={0.5} />
        </mesh>
        {/* Cloud particles */}
        <PulsingGlow color="#e5e7eb" position={[-0.8, 3.0, 0.2]} size={0.25} speed={3} />
        <PulsingGlow color="#d1d5db" position={[0.7, 3.2, -0.3]} size={0.2} speed={4} />
        <PulsingGlow color="#9ca3af" position={[0, 3.4, 0]} size={0.18} speed={5} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 24. ⚡ THUNDER STRIKE — Lightning arc pillar
  // ════════════════════════════════════════════════════════════════
  if (type === OBSTACLE_TYPES.THUNDER_STRIKE) {
    return (
      <group position={[x, 0, z]}>
        {/* Ground electrode base */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.45, 0.6, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Lightning column — center bolt */}
        <mesh position={[0, 2.0, 0]}>
          <boxGeometry args={[0.15, 4.0, 0.15]} />
          <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={4.0} />
        </mesh>
        {/* Side zap bolts */}
        <mesh position={[0.25, 1.5, 0]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={3.0} />
        </mesh>
        <mesh position={[-0.2, 2.3, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.06, 1.2, 0.06]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={3.0} />
        </mesh>
        <mesh position={[0.15, 3.0, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.05, 1.0, 0.05]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#38bdf8" emissiveIntensity={3.0} />
        </mesh>
        {/* Outer glow rings */}
        <PulsingGlow color="#fde047" position={[0, 0.6, 0]} size={0.35} speed={8} />
        <PulsingGlow color="#fbbf24" position={[0, 1.8, 0]} size={0.28} speed={10} />
        <PulsingGlow color="#fef08a" position={[0, 3.2, 0]} size={0.22} speed={12} />
        {/* Ground discharge ring */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 1.2, 14]} />
          <meshStandardMaterial color="#fde047" emissive="#fef08a" emissiveIntensity={1.5} transparent opacity={0.55} />
        </mesh>
        {/* Sky discharge point */}
        <PulsingGlow color="#ffffff" position={[0, 4.2, 0]} size={0.18} speed={15} />
      </group>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // 25. ROBOT BARRIER / SENTRY GATE (default fallback)
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
      <PulsingGlow color="#ef4444" position={[-1.1, 2.85, 0]} size={0.12} speed={6} />
      <PulsingGlow color="#3b82f6" position={[1.1, 2.85, 0]} size={0.12} speed={6} />
    </group>
  );
};

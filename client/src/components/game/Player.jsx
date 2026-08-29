import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import {
  LANE_WIDTH,
  PLAYER_Y_BASE,
  JUMP_HEIGHT,
  CHARACTERS,
  HOVERBOARD_SKINS,
  POWERUP_TYPES
} from '../../utils/constants';

export const Player = ({ playerZRef }) => {
  const groupRef = useRef();
  const innerModelRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();
  const scarf1Ref = useRef();
  const scarf2Ref = useRef();
  const jetpackRef = useRef();
  const hoverboardMeshRef = useRef();
  const jetpackMeshRef = useRef();
  const magnetMeshRef = useRef();
  const sneakersMeshRef = useRef();
  const multiplierMeshRef = useRef();
  const chestCoreRef = useRef();
  const opticsRef = useRef();

  // Character & Board skins
  const selectedCharacter = useGameStore((s) => s.selectedCharacter);
  const selectedBoard = useGameStore((s) => s.selectedBoard);

  const character = useMemo(() => {
    return CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];
  }, [selectedCharacter]);

  const boardSkin = useMemo(() => {
    return HOVERBOARD_SKINS.find((b) => b.id === selectedBoard) || HOVERBOARD_SKINS[0];
  }, [selectedBoard]);

  const charType = character.type || character.id || 'jack';

  // Smooth state refs
  const currentXRef = useRef(0);
  const currentScaleYRef = useRef(1);
  const currentScaleZRef = useRef(1);
  const currentRotZRef = useRef(0);
  const currentRotXRef = useRef(0);
  const currentBankZRef = useRef(0);

  // Jump and cycle refs
  const jumpProgressRef = useRef(0);
  const rollProgressRef = useRef(0);
  const runCycleRef = useRef(0);

  const gameState = useGameStore((s) => s.gameState);

  React.useEffect(() => {
    if (gameState === 'PLAYING') {
      currentRotZRef.current = 0;
      currentRotXRef.current = 0;
      currentScaleYRef.current = 1;
      currentScaleZRef.current = 1;
      currentXRef.current = 0;
      currentBankZRef.current = 0;
      jumpProgressRef.current = 0;
      rollProgressRef.current = 0;
    }
  }, [gameState]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Read transient store state
    const store = useGameStore.getState();
    const { lane, isJumping, isRolling, isDead, isCaptured, isStumbling, activePowerups, setJumping, setRolling } = store;

    const isJetpackActive = activePowerups[POWERUP_TYPES.JETPACK] > 0;
    const isSneakersActive = activePowerups[POWERUP_TYPES.SUPER_SNEAKERS] > 0;
    const isHoverboardActive = activePowerups[POWERUP_TYPES.HOVERBOARD] > 0;
    const isMagnetActive = activePowerups[POWERUP_TYPES.MAGNET] > 0;
    const isMultiplierActive = activePowerups[POWERUP_TYPES.MULTIPLIER_2X] > 0;

    // Visibility toggles via refs
    if (hoverboardMeshRef.current) hoverboardMeshRef.current.visible = isHoverboardActive;
    if (jetpackMeshRef.current) jetpackMeshRef.current.visible = isJetpackActive;
    if (magnetMeshRef.current) magnetMeshRef.current.visible = isMagnetActive;
    if (sneakersMeshRef.current) sneakersMeshRef.current.visible = isSneakersActive;
    if (multiplierMeshRef.current) multiplierMeshRef.current.visible = isMultiplierActive;

    const targetX = lane * LANE_WIDTH;

    // Smooth lane position & banking tilt into turns
    const laneSpeed = isDead || isCaptured ? 4 : 18;
    const prevX = currentXRef.current;
    currentXRef.current = THREE.MathUtils.lerp(currentXRef.current, targetX, Math.min(1, delta * laneSpeed));
    groupRef.current.position.x = currentXRef.current;

    // Dynamic banking tilt when changing lanes + stumble wobble
    const lateralVelocity = (currentXRef.current - prevX) / Math.max(delta, 0.001);
    let targetBank = isDead || isCaptured ? 0 : -lateralVelocity * 0.035;
    if (isStumbling) {
      targetBank += Math.sin(state.clock.elapsedTime * 22) * 0.25;
    }
    currentBankZRef.current = THREE.MathUtils.lerp(currentBankZRef.current, targetBank, Math.min(1, delta * 14));
    if (innerModelRef.current) {
      innerModelRef.current.rotation.z = currentBankZRef.current;
      innerModelRef.current.rotation.y = -currentBankZRef.current * 0.6;
    }

    // Scale animation for rolling / sliding
    const targetScaleY = isRolling ? 0.45 : 1;
    const targetScaleZ = isRolling ? 1.35 : 1;
    currentScaleYRef.current = THREE.MathUtils.lerp(currentScaleYRef.current, targetScaleY, Math.min(1, delta * 20));
    currentScaleZRef.current = THREE.MathUtils.lerp(currentScaleZRef.current, targetScaleZ, Math.min(1, delta * 20));
    groupRef.current.scale.y = currentScaleYRef.current;
    groupRef.current.scale.z = currentScaleZRef.current;

    // Death / Capture animation
    const targetRotZ = isCaptured ? 0.4 : (isDead ? 1.5 : (isStumbling ? 0.2 : 0));
    const targetRotX = isCaptured ? 0.8 : (isDead ? -1.3 : (isStumbling ? 0.35 : 0));
    const rotSpeed = isDead || isCaptured ? 5 : (isStumbling ? 14 : 10);
    currentRotZRef.current = THREE.MathUtils.lerp(currentRotZRef.current, targetRotZ, Math.min(1, delta * rotSpeed));
    currentRotXRef.current = THREE.MathUtils.lerp(currentRotXRef.current, targetRotX, Math.min(1, delta * rotSpeed));
    groupRef.current.rotation.z = currentRotZRef.current;
    groupRef.current.rotation.x = currentRotXRef.current;

    // Vertical Y calculations
    let currentY = PLAYER_Y_BASE;

    if (isJetpackActive) {
      currentY = 5.2 + Math.sin(state.clock.elapsedTime * 4.5) * 0.28;
    } else if (isJumping) {
      const jumpMultiplier = isSneakersActive ? 1.5 : 1.0;
      const jumpSpeed = (delta / 0.58) * Math.PI;
      jumpProgressRef.current += jumpSpeed;

      if (jumpProgressRef.current >= Math.PI) {
        jumpProgressRef.current = 0;
        setJumping(false);
      } else {
        const heightBoost = Math.sin(jumpProgressRef.current) * JUMP_HEIGHT * jumpMultiplier;
        currentY = PLAYER_Y_BASE + heightBoost;
      }
    } else {
      jumpProgressRef.current = 0;
    }

    // Rolling timer
    if (isRolling) {
      rollProgressRef.current += delta / 0.62;
      if (rollProgressRef.current >= 1) {
        rollProgressRef.current = 0;
        setRolling(false);
      }
    } else {
      rollProgressRef.current = 0;
    }

    // Hoverboard floating hover motion
    if (isHoverboardActive && !isJumping && !isJetpackActive) {
      currentY = PLAYER_Y_BASE + 0.38 + Math.sin(state.clock.elapsedTime * 6.5) * 0.09;
    }

    if (isDead) {
      currentY += THREE.MathUtils.lerp(0, -0.3, Math.min(1, currentRotZRef.current / 1.5));
    }

    groupRef.current.position.y = currentY;

    // Sync forward negative Z position
    if (playerZRef && playerZRef.current !== undefined) {
      groupRef.current.position.z = playerZRef.current;
    }

    // Character limb running animation
    if (!isDead && !isJetpackActive) {
      const runFreq = isHoverboardActive ? 1.8 : 17.0;
      runCycleRef.current += delta * runFreq;
      const legAngle = Math.sin(runCycleRef.current) * 0.72;
      const armAngle = -Math.sin(runCycleRef.current) * 0.65;

      if (leftLegRef.current && rightLegRef.current) {
        if (isHoverboardActive) {
          leftLegRef.current.rotation.x = 0.25;
          rightLegRef.current.rotation.x = -0.25;
        } else {
          leftLegRef.current.rotation.x = legAngle;
          rightLegRef.current.rotation.x = -legAngle;
        }
      }

      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = armAngle;
        rightArmRef.current.rotation.x = -armAngle;
      }

      if (headRef.current) {
        headRef.current.position.y = 1.44 + Math.abs(Math.sin(runCycleRef.current * 2)) * 0.05;
      }

      // Dynamic scarf for Jack
      const time = state.clock.elapsedTime * 14;
      if (scarf1Ref.current) {
        scarf1Ref.current.rotation.x = 0.6 + Math.sin(time) * 0.25;
        scarf1Ref.current.rotation.y = Math.cos(time * 0.8) * 0.15;
      }
      if (scarf2Ref.current) {
        scarf2Ref.current.rotation.x = 0.8 + Math.sin(time - 0.5) * 0.35;
        scarf2Ref.current.rotation.y = Math.cos(time * 0.8 - 0.5) * 0.2;
      }
    }

    // Chest Arc Reactor pulsing intensity
    if (chestCoreRef.current) {
      const pulse = 1.4 + Math.sin(state.clock.elapsedTime * 8) * 0.6;
      chestCoreRef.current.material.emissiveIntensity = pulse;
    }

    // Optics glowing pulse
    if (opticsRef.current) {
      const pulse = 1.6 + Math.sin(state.clock.elapsedTime * 6) * 0.4;
      opticsRef.current.material.emissiveIntensity = pulse;
    }

    // Jetpack animated thrusters
    if (jetpackRef.current && isJetpackActive) {
      const flameScale = 1 + Math.random() * 0.45;
      jetpackRef.current.scale.set(1, flameScale, 1);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner Rotatable Model for Dynamic Banking */}
      <group ref={innerModelRef}>
        {/* ─── HEAD RENDERING BASED ON CHARACTER TYPE ──────────────────────── */}
        <group ref={headRef} position={[0, 1.44, 0]}>
          {/* Aero Bot (Picture 2): Sleek Aerodynamic Helmet with Black Visor & Glowing White Line */}
          {charType === 'aerobot' ? (
            <group>
              {/* Aerodynamic White Dome Helmet */}
              <mesh castShadow>
                <sphereGeometry args={[0.32, 24, 24]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.8} />
              </mesh>
              {/* Rear Aerodynamic Fin */}
              <mesh position={[0, 0.05, -0.2]}>
                <boxGeometry args={[0.08, 0.3, 0.22]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Glossy Black Full-Face Curved Visor (Picture 2) */}
              <mesh position={[0, 0.02, 0.16]} rotation={[0.05, 0, 0]}>
                <sphereGeometry args={[0.26, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
                <meshStandardMaterial
                  color="#020617"
                  roughness={0.02}
                  metalness={0.95}
                  envMapIntensity={2.0}
                />
              </mesh>
              {/* Illuminated Visor LED Light Strip (Picture 2) */}
              <mesh ref={opticsRef} position={[0, 0.08, 0.29]}>
                <boxGeometry args={[0.26, 0.04, 0.02]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#ffffff"
                  emissiveIntensity={2.5}
                />
              </mesh>
              {/* Dark Carbon Neck Collar */}
              <mesh position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.16, 0.22, 0.14, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
              </mesh>
            </group>
          ) : charType === 'cybertitan' ? (
            /* Cyber Titan (Picture 3): Robotic Exoskeleton Head with Glowing Blue Optics */
            <group>
              {/* Titanium Robotic Cranium */}
              <mesh castShadow>
                <boxGeometry args={[0.42, 0.46, 0.4]} />
                <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.2} />
              </mesh>
              {/* Sculpted Jaw & Chin Plating */}
              <mesh position={[0, -0.16, 0.08]}>
                <boxGeometry args={[0.3, 0.18, 0.25]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
              </mesh>
              {/* Electric Blue Glowing Eyes / Optics (Picture 3) */}
              <mesh ref={opticsRef} position={[-0.1, 0.04, 0.21]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3.0} />
              </mesh>
              <mesh position={[0.1, 0.04, 0.21]}>
                <sphereGeometry args={[0.045, 10, 10]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3.0} />
              </mesh>
              {/* Forehead Cyber Matrix Line */}
              <mesh position={[0, 0.16, 0.2]}>
                <boxGeometry args={[0.22, 0.03, 0.02]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.8} />
              </mesh>
              {/* Side Audio/Data Node Cylinders */}
              <mesh position={[-0.23, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
              </mesh>
              <mesh position={[0.23, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} />
                <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
              </mesh>
            </group>
          ) : (
            /* Kinetic Jack & Champions: Dynamic Athletic Face & Cyber Visor */
            <group>
              {/* Stylized Face */}
              <mesh castShadow>
                <sphereGeometry args={[0.26, 20, 20]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.3} metalness={0.05} />
              </mesh>
              {/* Cyber Hair / Headset */}
              <mesh position={[0, 0.12, -0.05]} castShadow>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshStandardMaterial color={character.shirtColor || '#1e1b4b'} roughness={0.2} metalness={0.4} />
              </mesh>
              {/* Curved Holographic Cyber Visor */}
              <mesh position={[0, 0.04, 0.18]} rotation={[0.05, 0, 0]}>
                <boxGeometry args={[0.36, 0.15, 0.14]} />
                <meshStandardMaterial
                  color={character.capColor || '#06b6d4'}
                  emissive={character.capColor || '#06b6d4'}
                  emissiveIntensity={1.8}
                  roughness={0.05}
                  metalness={0.9}
                  transparent
                  opacity={0.92}
                />
              </mesh>
              {/* Glowing Eyes HUD */}
              <mesh position={[-0.08, 0.04, 0.26]}>
                <planeGeometry args={[0.08, 0.03]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0.08, 0.04, 0.26]}>
                <planeGeometry args={[0.08, 0.03]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              {/* Collar */}
              <mesh position={[0, -0.16, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 0.12, 16]} />
                <meshStandardMaterial color={character.capColor || '#06b6d4'} roughness={0.3} metalness={0.2} />
              </mesh>
            </group>
          )}
        </group>

        {/* ─── DYNAMIC WIND SCARF (Jack only) ─────────────────────────────── */}
        {charType === 'jack' && (
          <group position={[0, 1.26, -0.18]}>
            <group ref={scarf1Ref}>
              <mesh position={[0, -0.18, -0.15]}>
                <boxGeometry args={[0.24, 0.35, 0.03]} />
                <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
              </mesh>
              <group ref={scarf2Ref} position={[0, -0.32, -0.15]}>
                <mesh position={[0, -0.18, -0.12]}>
                  <boxGeometry args={[0.2, 0.38, 0.02]} />
                  <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.0} />
                </mesh>
              </group>
            </group>
          </group>
        )}

        {/* ─── ATHLETIC CYBER SUIT & TORSO ─────────────────────────────────── */}
        <group position={[0, 0.92, 0]}>
          {/* Main Chest Armor Plate */}
          <mesh castShadow>
            <boxGeometry args={[0.56, 0.64, 0.36]} />
            <meshStandardMaterial
              color={character.shirtColor || '#2563eb'}
              roughness={0.25}
              metalness={charType === 'cybertitan' || charType === 'aerobot' ? 0.9 : 0.6}
            />
          </mesh>

          {/* Pauldrons / Shoulder Plates */}
          <mesh position={[-0.34, 0.24, 0]} castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial
              color={charType === 'aerobot' ? '#f8fafc' : '#0f172a'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
          <mesh position={[0.34, 0.24, 0]} castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial
              color={charType === 'aerobot' ? '#f8fafc' : '#0f172a'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>

          {/* Central Chest Arc Reactor Core (Picture 3 glowing blue orb) */}
          <mesh position={[0, 0.08, 0.18]}>
            <cylinderGeometry args={[0.12, 0.12, 0.05, 18]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
          <mesh ref={chestCoreRef} position={[0, 0.08, 0.2]}>
            <sphereGeometry args={[0.085, 14, 14]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2.4}
            />
          </mesh>

          {/* Cybernetic Spine Line on Back */}
          <mesh position={[0, 0, -0.19]}>
            <boxGeometry args={[0.06, 0.54, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.6} />
          </mesh>

          {/* Belt */}
          <mesh position={[0, -0.28, 0]}>
            <boxGeometry args={[0.58, 0.09, 0.38]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.28, 0.2]}>
            <boxGeometry args={[0.12, 0.07, 0.02]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>

        {/* ─── ARMS & CYBER GAUNTLETS ─────────────────────────────────────── */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.35, 1.12, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.075, 0.48, 10]} />
            <meshStandardMaterial
              color={character.shirtColor || '#2563eb'}
              roughness={0.3}
              metalness={charType === 'aerobot' ? 0.8 : 0.5}
            />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.18, 10]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color={charType === 'cybertitan' || charType === 'aerobot' ? '#334155' : '#fed7aa'} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.35, 1.12, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.075, 0.48, 10]} />
            <meshStandardMaterial
              color={character.shirtColor || '#2563eb'}
              roughness={0.3}
              metalness={charType === 'aerobot' ? 0.8 : 0.5}
            />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.18, 10]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color={charType === 'cybertitan' || charType === 'aerobot' ? '#334155' : '#fed7aa'} />
          </mesh>
        </group>

        {/* ─── ARTICULATED LEGS & KINETIC SNEAKERS ─────────────────────────── */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.16, 0.58, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.085, 0.54, 10]} />
            <meshStandardMaterial
              color={character.pantsColor || '#0f172a'}
              roughness={0.35}
              metalness={charType === 'aerobot' ? 0.7 : 0.4}
            />
          </mesh>
          {/* Cyber Sneaker */}
          <mesh position={[0, -0.56, 0.07]} castShadow>
            <boxGeometry args={[0.16, 0.13, 0.32]} />
            <meshStandardMaterial color={charType === 'aerobot' ? '#ffffff' : '#f8fafc'} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Neon Kinetic Sole */}
          <mesh position={[0, -0.62, 0.07]}>
            <boxGeometry args={[0.17, 0.03, 0.33]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.16, 0.58, 0]}>
          <mesh position={[0, -0.26, 0]} castShadow>
            <cylinderGeometry args={[0.095, 0.085, 0.54, 10]} />
            <meshStandardMaterial
              color={character.pantsColor || '#0f172a'}
              roughness={0.35}
              metalness={charType === 'aerobot' ? 0.7 : 0.4}
            />
          </mesh>
          {/* Cyber Sneaker */}
          <mesh position={[0, -0.56, 0.07]} castShadow>
            <boxGeometry args={[0.16, 0.13, 0.32]} />
            <meshStandardMaterial color={charType === 'aerobot' ? '#ffffff' : '#f8fafc'} roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Neon Kinetic Sole */}
          <mesh position={[0, -0.62, 0.07]}>
            <boxGeometry args={[0.17, 0.03, 0.33]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.8} />
          </mesh>
        </group>

        {/* ─── HOVERBOARD DECK ────────────────────────────────────────────── */}
        <group ref={hoverboardMeshRef} visible={false} position={[0, -0.16, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.74, 0.08, 1.5]} />
            <meshStandardMaterial
              color={boardSkin.color}
              roughness={0.15}
              metalness={0.85}
              emissive={boardSkin.color}
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.32, 24]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={2.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[-0.38, 0.01, 0]}>
            <boxGeometry args={[0.04, 0.1, 1.52]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.38, 0.01, 0]}>
            <boxGeometry args={[0.04, 0.1, 1.52]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* ─── JETPACK ATTACHMENT ──────────────────────────────────────────── */}
        <group ref={jetpackMeshRef} visible={false} position={[0, 0.95, -0.26]}>
          <mesh position={[-0.15, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.54, 16]} />
            <meshStandardMaterial color="#ec4899" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.54, 16]} />
            <meshStandardMaterial color="#ec4899" metalness={0.85} roughness={0.2} />
          </mesh>
          <group ref={jetpackRef}>
            <mesh position={[-0.15, -0.42, 0]}>
              <coneGeometry args={[0.12, 0.5, 10]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
            <mesh position={[0.15, -0.42, 0]}>
              <coneGeometry args={[0.12, 0.5, 10]} />
              <meshBasicMaterial color="#f97316" />
            </mesh>
          </group>
        </group>

        {/* ─── MAGNET AURA ─────────────────────────────────────────────────── */}
        <group ref={magnetMeshRef} visible={false} position={[0, 0.95, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.9, 0.04, 12, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#38bdf8"
              emissiveIntensity={1.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.9, 0.04, 12, 32]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={1.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        </group>

        {/* ─── SUPER SNEAKERS BOOT WINGS ───────────────────────────────────── */}
        <group ref={sneakersMeshRef} visible={false} position={[0, 0.1, 0]}>
          <mesh position={[-0.28, 0, 0]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.8} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.28, 0, 0]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[0.3, 0.4]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.8} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* ─── 2X MULTIPLIER SHIELD ────────────────────────────────────────── */}
        <group ref={multiplierMeshRef} visible={false} position={[0, 0.9, 0]}>
          <mesh>
            <sphereGeometry args={[1.05, 16, 16]} />
            <meshStandardMaterial
              color="#eab308"
              emissive="#eab308"
              emissiveIntensity={1.4}
              transparent
              opacity={0.3}
              wireframe
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};

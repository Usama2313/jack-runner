import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { LANE_WIDTH, POWERUP_TYPES } from '../../utils/constants';

export const CameraFollow = ({ playerZRef }) => {
  const { camera } = useThree();
  const lastPzRef = useRef(0);
  const currentCamXRef = useRef(0);
  const currentCamYRef = useRef(3.6);

  useFrame((state, delta) => {
    // Read transient state directly from Zustand store
    const store = useGameStore.getState();
    const { lane, isDead, isStumbling, isCaptured, speed, activePowerups } = store;

    const isJetpack = activePowerups[POWERUP_TYPES.JETPACK] > 0;
    const pz = playerZRef && playerZRef.current !== undefined ? playerZRef.current : 0;
    const targetCamX = lane * LANE_WIDTH * 0.4; // Subtle lateral camera centering

    let targetY = 3.6;
    let offsetZ = 6.8;

    if (isJetpack) {
      targetY = 7.2;
      offsetZ = 8.5;
    } else if (isDead || isCaptured) {
      targetY = 2.6;
      offsetZ = 5.6;
    }

    // Instantly snap camera on restart
    if (pz === 0 && lastPzRef.current < -5) {
      currentCamXRef.current = targetCamX;
      currentCamYRef.current = targetY;
      camera.position.set(targetCamX, targetY, offsetZ);
    }
    lastPzRef.current = pz;

    // Smooth lateral X and Y interpolation
    currentCamXRef.current = THREE.MathUtils.lerp(currentCamXRef.current, targetCamX, Math.min(1, delta * 9));
    currentCamYRef.current = THREE.MathUtils.lerp(currentCamYRef.current, targetY, Math.min(1, delta * 7));

    // Stumble screen shake
    let shakeX = 0;
    let shakeY = 0;
    if (isStumbling) {
      shakeX = (Math.random() - 0.5) * 0.12;
      shakeY = (Math.random() - 0.5) * 0.12;
    }

    // Lock Z tightly to player position with fixed offset to prevent lag oscillation
    camera.position.set(
      currentCamXRef.current + shakeX,
      currentCamYRef.current + shakeY,
      pz + offsetZ
    );

    // Dynamic FOV based on speed
    const baseFov = 62;
    const targetFov = baseFov + Math.min(14, Math.max(0, (speed - 24) * 0.35));
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, delta * 4));
    camera.updateProjectionMatrix();

    // Smooth look target ahead of player
    const lookAtZ = pz - 14;
    const lookAtY = isJetpack ? 5.2 : 1.35;
    camera.lookAt(currentCamXRef.current * 0.5, lookAtY, lookAtZ);
  });

  return null;
};

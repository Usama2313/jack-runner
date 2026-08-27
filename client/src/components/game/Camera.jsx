import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { LANE_WIDTH, POWERUP_TYPES } from '../../utils/constants';

export const CameraFollow = ({ playerZRef }) => {
  const { camera } = useThree();
  const shakeRef = useRef(0);
  const lastPzRef = useRef(0);

  useFrame((state, delta) => {
    // Read transient state directly from Zustand store
    const store = useGameStore.getState();
    const { lane, isDead, speed, activePowerups } = store;

    const isJetpack = activePowerups[POWERUP_TYPES.JETPACK] > 0;
    const pz = playerZRef ? playerZRef.current : 0;
    const px = lane * LANE_WIDTH * 0.45; // Camera subtly tracks lane

    let targetY = 3.6;
    let targetZ = pz + 6.8;

    if (isJetpack) {
      targetY = 7.5;
      targetZ = pz + 8.5;
    } else if (isDead) {
      targetY = 2.4;
      targetZ = pz + 5.2;
    }

    // Snap camera instantly to start position on game restart
    if (pz === 0 && lastPzRef.current < -5) {
      camera.position.set(px, targetY, targetZ);
    }
    lastPzRef.current = pz;

    // Dynamic FOV based on speed
    const baseFov = 62;
    const targetFov = baseFov + Math.min(18, (speed - 24) * 0.4);
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, delta * 3));
    camera.updateProjectionMatrix();

    // Smooth camera interpolation
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, px, Math.min(1, delta * 7));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, Math.min(1, delta * 6));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, Math.min(1, delta * 12));

    // Look target ahead of player
    const lookAtZ = pz - 12;
    const lookAtY = isJetpack ? 5.2 : 1.4;
    camera.lookAt(px * 0.5, lookAtY, lookAtZ);
  });

  return null;
};

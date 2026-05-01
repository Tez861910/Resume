import { useRef } from "react";
import * as THREE from "three";

export interface PlayerState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  velocity: THREE.Vector3;
  hull: number;          // 0..1
  shield: number;        // 0..1 (regenerating buffer)
  speed: number;         // current scalar speed
  boost: number;         // 0..1 boost amount applied
  missileCooldown: number; // 0..1 — 0 = ready, 1 = max cooldown
  lockTargetIndex: number; // -1 = no lock, >=0 = index into enemies array
  lockTargetPos: THREE.Vector3; // last known position of locked target
}

export function createPlayerState(): PlayerState {
  return {
    position: new THREE.Vector3(0, 0, 0),
    quaternion: new THREE.Quaternion(),
    velocity: new THREE.Vector3(),
    hull: 1,
    shield: 1,
    speed: 0,
    boost: 0,
    missileCooldown: 0,
    lockTargetIndex: -1,
    lockTargetPos: new THREE.Vector3(),
  };
}

export function usePlayerState() {
  const ref = useRef<PlayerState>(createPlayerState());
  return ref;
}

import { useRef } from "react";
import * as THREE from "three";

export interface PlayerState {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  velocity: THREE.Vector3;
  hull: number;       // 0..1
  shield: number;     // 0..1 (regenerating buffer)
  speed: number;      // current scalar speed
  boost: number;      // 0..1 boost amount applied
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
  };
}

export function usePlayerState() {
  const ref = useRef<PlayerState>(createPlayerState());
  return ref;
}

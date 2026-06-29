import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { PlayerState } from "./usePlayerState";

interface Props {
  player: MutableRefObject<PlayerState>;
}

/** Visible targeting laser beam from ship to locked enemy. */
export default function TargetLockBeam({ player }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = player.current;
    const hasLock = p.lockTargetIndex >= 0;

    if (!hasLock || !meshRef.current || !glowRef.current) {
      if (meshRef.current) meshRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      return;
    }

    const start = p.position.clone();
    const end = p.lockTargetPos.clone();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(end, start);
    const len = dir.length();

    if (len < 0.01) {
      meshRef.current.visible = false;
      glowRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    glowRef.current.visible = true;

    meshRef.current.position.copy(mid);
    meshRef.current.scale.set(1, len, 1);
    meshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());

    glowRef.current.position.copy(mid);
    glowRef.current.scale.set(1, len, 1);
    glowRef.current.quaternion.copy(meshRef.current.quaternion);
  });

  return (
    <group>
      {/* Core beam */}
      <mesh ref={meshRef} visible={false}>
        <cylinderGeometry args={[0.015, 0.015, 1, 4]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.9} />
      </mesh>
      {/* Glow halo */}
      <mesh ref={glowRef} visible={false}>
        <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

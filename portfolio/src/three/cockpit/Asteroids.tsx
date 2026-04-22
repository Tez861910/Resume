import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { PlayerState } from "./usePlayerState";
import type { LasersHandle } from "./Lasers";
import { useGameAsset } from "./AssetPipeline";

interface AsteroidsProps {
  /** World-space centers to spawn asteroid clusters around */
  centers: THREE.Vector3[];
  /** Asteroids per center */
  perCenter: number;
  player: MutableRefObject<PlayerState>;
  lasers: MutableRefObject<LasersHandle | null>;
  /** Whether gameplay is active (pauses collisions if not) */
  enabled: boolean;
}

interface AsteroidData {
  alive: boolean;
  pos: THREE.Vector3;
  spin: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
}

const DAMAGE_PER_HIT = 0.12;

export default function Asteroids({
  centers,
  perCenter,
  player,
  lasers,
  enabled,
}: AsteroidsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dataRef = useRef<AsteroidData[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const asset = useGameAsset("asteroid");

  // Build asteroid list whenever centers change
  useEffect(() => {
    const arr: AsteroidData[] = [];
    for (const c of centers) {
      for (let i = 0; i < perCenter; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 22 + Math.random() * 38;
        arr.push({
          alive: true,
          pos: new THREE.Vector3(
            c.x + r * Math.sin(phi) * Math.cos(theta),
            c.y + r * Math.sin(phi) * Math.sin(theta),
            c.z + r * Math.cos(phi),
          ),
          spin: new THREE.Vector3(
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.6,
          ),
          rotation: new THREE.Euler(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ),
          scale: 1.6 + Math.random() * 3.4,
        });
      }
    }
    dataRef.current = arr;
  }, [centers, perCenter]);

  // Player collision damage cooldown
  const damageCdRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = meshRef.current;
    const data = dataRef.current;
    if (!mesh) return;

    damageCdRef.current = Math.max(0, damageCdRef.current - dt);
    const playerPos = player.current.position;

    let idx = 0;
    for (const a of data) {
      if (!a.alive) continue;
      a.rotation.x += a.spin.x * dt;
      a.rotation.y += a.spin.y * dt;
      a.rotation.z += a.spin.z * dt;

      const radius = a.scale;

      // Laser hit?
      if (enabled && lasers.current?.consumeHit(a.pos, radius + 0.6)) {
        a.alive = false;
        continue;
      }
      // Player collision?
      if (enabled && damageCdRef.current <= 0) {
        const dx = playerPos.x - a.pos.x;
        const dy = playerPos.y - a.pos.y;
        const dz = playerPos.z - a.pos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const hitR = radius + 1.4;
        if (distSq < hitR * hitR) {
          // Push player back gently + damage
          const p = player.current;
          p.shield = Math.max(0, p.shield - DAMAGE_PER_HIT);
          if (p.shield <= 0) {
            p.hull = Math.max(0, p.hull - DAMAGE_PER_HIT * 0.6);
          }
          damageCdRef.current = 0.6;
          const push = new THREE.Vector3(dx, dy, dz).normalize();
          p.velocity.addScaledVector(push, 18);
        }
      }

      dummy.position.copy(a.pos);
      dummy.rotation.copy(a.rotation);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
  });

  const capacity = useMemo(
    () => centers.length * perCenter,
    [centers.length, perCenter],
  );

  return (
    <instancedMesh
      ref={meshRef}
      // @ts-expect-error - React-Three-Fiber args type is too strict
      args={[null, null, Math.max(1, capacity)]}
      geometry={asset.geometry}
      material={asset.material}
      count={0}
      castShadow={false}
      receiveShadow={false}
    />
  );
}

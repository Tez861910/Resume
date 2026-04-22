import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { MissionId } from "./missions";
import type { LasersHandle } from "./Lasers";

interface EnemyBot {
  alive: boolean;
  missionId: MissionId;
  basePos: THREE.Vector3;
  orbitPhase: number;
  orbitRadius: number;
  orbitAxis: THREE.Vector3;
  pos: THREE.Vector3;
  hp: number;
}

export interface EnemyBotsHandle {
  /** Count of alive bots for a given mission */
  countAliveFor: (id: MissionId) => number;
}

interface Props {
  stations: {
    id: MissionId;
    position: THREE.Vector3;
    enemyCount: number;
  }[];
  lasers: MutableRefObject<LasersHandle | null>;
  /** output: counts map is updated in-place for external consumers */
  counterRef: MutableRefObject<Record<MissionId, number>>;
  enabled: boolean;
}

export default function EnemyBots({
  stations,
  lasers,
  counterRef,
  enabled,
}: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const botsRef = useRef<EnemyBot[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.OctahedronGeometry(1.2, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ef4444",
        emissive: "#7f1d1d",
        emissiveIntensity: 0.6,
        roughness: 0.3,
        metalness: 0.6,
        flatShading: true,
      }),
    [],
  );

  useEffect(() => {
    const arr: EnemyBot[] = [];
    for (const s of stations) {
      for (let i = 0; i < s.enemyCount; i++) {
        arr.push({
          alive: true,
          missionId: s.id,
          basePos: s.position.clone(),
          orbitPhase: (i / Math.max(1, s.enemyCount)) * Math.PI * 2,
          orbitRadius: 8 + Math.random() * 5,
          orbitAxis: new THREE.Vector3(
            Math.random() - 0.5,
            1,
            Math.random() - 0.5,
          ).normalize(),
          pos: s.position.clone(),
          hp: 1,
        });
      }
    }
    botsRef.current = arr;
    // seed counter
    const counts: Partial<Record<MissionId, number>> = {};
    for (const s of stations) {
      counts[s.id] = s.enemyCount;
    }
    counterRef.current = counts as Record<MissionId, number>;
  }, [stations, counterRef]);

  const tClockRef = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    tClockRef.current += dt;
    const t = tClockRef.current;
    const mesh = meshRef.current;
    const bots = botsRef.current;
    if (!mesh) return;

    const counts: Partial<Record<MissionId, number>> = {};

    let idx = 0;
    for (const b of bots) {
      if (!b.alive) continue;
      // Orbit around the station on a tilted plane
      const angle = b.orbitPhase + t * 0.8;
      // orbit plane: perpendicular to orbitAxis
      const right = new THREE.Vector3(1, 0, 0)
        .cross(b.orbitAxis)
        .normalize();
      if (right.lengthSq() < 0.01) right.set(0, 0, 1);
      const up = new THREE.Vector3().crossVectors(b.orbitAxis, right).normalize();
      b.pos
        .copy(b.basePos)
        .addScaledVector(right, Math.cos(angle) * b.orbitRadius)
        .addScaledVector(up, Math.sin(angle) * b.orbitRadius);

      if (enabled && lasers.current?.consumeHit(b.pos, 1.8)) {
        b.alive = false;
        continue;
      }

      counts[b.missionId] = (counts[b.missionId] ?? 0) + 1;
      dummy.position.copy(b.pos);
      dummy.rotation.set(t * 0.4, t * 0.6 + b.orbitPhase, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
    counterRef.current = counts as Record<MissionId, number>;
  });

  const capacity = useMemo(
    () => stations.reduce((a, s) => a + s.enemyCount, 0),
    [stations],
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, mat, Math.max(1, capacity)]}
      count={0}
    />
  );
}

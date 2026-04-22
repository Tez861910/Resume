import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { Mission, MissionId } from "./missions";
import type { PlayerState } from "./usePlayerState";
import { useGameAsset } from "./AssetPipeline";

interface Props {
  missions: Mission[];
  collected: Set<MissionId>;
  /** Map mission id → count of alive enemies (0 means cleared) */
  enemyCounts: MutableRefObject<Record<MissionId, number>>;
  player: MutableRefObject<PlayerState>;
  onCollect: (id: MissionId) => void;
  enabled: boolean;
}

/** Hard-drive collectible hovering at each station once cleared. */
export default function HardDrives({
  missions,
  collected,
  enemyCounts,
  player,
  onCollect,
  enabled,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const asset = useGameAsset("harddrive");

  const entries = useMemo(
    () =>
      missions.map((m) => ({
        mission: m,
        color: new THREE.Color(m.accent),
        position: new THREE.Vector3(...m.position),
      })),
    [missions],
  );

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = performance.now() * 0.0015;
    for (const child of g.children) {
      const id = child.userData.missionId as MissionId;
      const alreadyCollected = collected.has(id);
      const remaining = enemyCounts.current[id] ?? 0;
      const ready = !alreadyCollected && remaining <= 0;
      child.visible = ready;
      if (!ready) continue;

      // Hover animation
      const basePos = child.userData.basePos as THREE.Vector3;
      child.position.set(
        basePos.x,
        basePos.y + Math.sin(t + child.userData.phase) * 1.2,
        basePos.z,
      );
      child.rotation.y += delta * 1.2;

      if (enabled) {
        const dx = player.current.position.x - basePos.x;
        const dy = player.current.position.y - basePos.y;
        const dz = player.current.position.z - basePos.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 5 * 5) {
          onCollect(id);
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {entries.map((e) => (
        <group
          key={e.mission.id}
          position={e.position}
          userData={{
            missionId: e.mission.id,
            basePos: e.position.clone(),
            phase: Math.random() * Math.PI * 2,
          }}
        >
          <mesh geometry={asset.geometry} material={asset.material} />
          {/* LED strip */}
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[2.0, 0.08, 0.3]} />
            <meshBasicMaterial color={"#ffffff"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

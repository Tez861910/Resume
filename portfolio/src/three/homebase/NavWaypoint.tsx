import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { HB, MISSION_ACCENT } from "./hbTheme";
import type { MissionId } from "../cockpit/missions";

/** Floor markers in front of each sealed terminal (and the bridge for launch). */
const TARGETS: Record<MissionId, [number, number]> = {
  launch: [0, 14],
  profile: [-6.4, 4],
  constellation: [-6.4, -1],
  career: [6.4, 4],
  "mission-ops": [6.4, -1],
  transmission: [6.4, -6],
};

interface Props {
  nextMissionId: MissionId | null;
  vaultUnlocked: boolean;
}

export default function NavWaypoint({ nextMissionId, vaultUnlocked }: Props) {
  const chevron = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const beam = useRef<THREE.Mesh>(null);

  const target: [number, number] | null = vaultUnlocked
    ? [0, -12]
    : nextMissionId
      ? TARGETS[nextMissionId]
      : null;
  const accent = vaultUnlocked
    ? HB.emerald
    : nextMissionId
      ? (MISSION_ACCENT[nextMissionId] ?? HB.amber)
      : HB.amber;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (chevron.current) chevron.current.position.y = 2.7 + Math.sin(t * 2) * 0.18;
    if (ring.current) {
      ring.current.rotation.z = t * 0.6;
      (ring.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(t * 2.5) * 0.2;
    }
    if (beam.current) {
      (beam.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t * 1.6) * 0.05;
    }
  });

  if (!target) return null;
  const [x, z] = target;

  return (
    <group position={[x, 0, z]}>
      <mesh ref={ring} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.78, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={beam} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.32, 3, 16, 1, true]} />
        <meshBasicMaterial color={accent} transparent opacity={0.14} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <group ref={chevron}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.26, 0.45, 4]} />
          <meshBasicMaterial color={accent} />
        </mesh>
        <Text position={[0, 0.55, 0]} fontSize={0.16} color={accent} anchorX="center" anchorY="middle" letterSpacing={0.2}>
          {vaultUnlocked ? "VAULT" : "GO"}
        </Text>
      </group>
    </group>
  );
}

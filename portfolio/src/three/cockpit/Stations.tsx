import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Mission } from "./missions";
import { useGameAsset } from "./AssetPipeline";

/** One station marker per mission: a glowing ring + beacon pillar. */
export default function Stations({
  missions,
  currentMissionId,
}: {
  missions: Mission[];
  currentMissionId: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const asset = useGameAsset("station");

  const entries = useMemo(() => {
    return missions.map((m) => ({
      mission: m,
      position: new THREE.Vector3(...m.position),
      color: new THREE.Color(m.accent),
    }));
  }, [missions]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    // pulse scale of current mission station
    for (const child of g.children) {
      const isCurrent = child.userData.missionId === currentMissionId;
      const target = isCurrent
        ? 1.0 + 0.1 * Math.sin(performance.now() * 0.004)
        : 0.9;
      child.scale.lerp(new THREE.Vector3(target, target, target), delta * 4);
    }
  });

  return (
    <group ref={groupRef}>
      {entries.map((e) => (
        <group
          key={e.mission.id}
          position={e.position}
          userData={{ missionId: e.mission.id }}
        >
          {/* Torus ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[6, 0.35, 12, 48]} />
            <meshStandardMaterial
              color={e.color}
              emissive={e.color}
              emissiveIntensity={1.6}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
          {/* Inner beacon */}
          <mesh geometry={asset.geometry} material={asset.material} />
          {/* Vertical light pillar */}
          <mesh position={[0, 30, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 60, 6]} />
            <meshBasicMaterial
              color={e.color}
              transparent
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

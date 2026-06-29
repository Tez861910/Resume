import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { HB } from "./hbTheme";

const INTERACT_LAYER = 5;

interface Props {
  /** True while the launch/intro mission is the next objective. */
  active: boolean;
  /** World position of the console (defaults to the bridge launch waypoint). */
  position?: [number, number, number];
}

/**
 * DepartureConsole — the launch terminal on the bridge.
 *
 * The 3D refactor removed the old 2D HUD "Launch" button, which left the
 * intro `launch` mission with no trigger (so the E key appeared broken on a
 * fresh save). This podium restores that entry point: walk up to it and press
 * E to depart. The interact hitbox only joins the raycast layer while the
 * launch mission is still pending, so once flown it becomes inert set dressing.
 */
export default function DepartureConsole({ active, position = [0, 0, 14] }: Props) {
  const hitRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.MeshStandardMaterial>(null);

  const accent = active ? HB.amber : HB.emerald;

  useEffect(() => {
    const mesh = hitRef.current;
    if (!mesh) return;
    if (active) mesh.layers.enable(INTERACT_LAYER);
    else mesh.layers.disable(INTERACT_LAYER);
  }, [active]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.5;
    if (beaconRef.current) beaconRef.current.position.y = 2.55 + Math.sin(t * 2) * 0.06;
    if (panelRef.current) {
      panelRef.current.emissiveIntensity = active
        ? 0.5 + Math.sin(t * 3) * 0.25
        : 0.2;
    }
  });

  return (
    <group position={position} userData={{ kind: "launch-console" }}>
      {/* Interaction volume (invisible, raycast only while active) */}
      <mesh ref={hitRef} position={[0, 1.3, 0]} visible={false}>
        <boxGeometry args={[1.5, 2.4, 1.1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Pedestal base */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.78, 0.92, 0.14, 32]} />
        <meshStandardMaterial color="#0f1729" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.42, 0.62, 0.86, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.22} />
      </mesh>

      {/* Spinning hologram ring above the deck */}
      <mesh ref={ringRef} position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.012, 8, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.6} />
      </mesh>

      {/* Slanted control deck facing the approaching player (+z) */}
      <mesh position={[0, 1.02, 0.22]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[1.0, 0.62, 0.05]} />
        <meshStandardMaterial
          ref={panelRef}
          color="#040b16"
          emissive={accent}
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, 1.04, 0.26]}
        rotation={[-0.42, 0, 0]}
        fontSize={0.085}
        color={active ? "#fde68a" : "#a7f3d0"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        maxWidth={0.9}
      >
        {active ? "[ E ]  DEPART" : "DEPARTED"}
      </Text>

      {/* Upright holo banner (primary readable label) */}
      <mesh position={[0, 1.95, -0.16]}>
        <planeGeometry args={[1.5, 0.66]} />
        <meshBasicMaterial color={accent} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[0, 2.06, -0.14]}
        fontSize={0.15}
        color={accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.22}
      >
        DEPARTURE
      </Text>
      <Text
        position={[0, 1.85, -0.14]}
        fontSize={0.07}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {active ? "INTRO FLIGHT // READY" : "FLIGHT LOGGED"}
      </Text>

      {/* Beacon */}
      <mesh ref={beaconRef} position={[0, 2.55, -0.16]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color={accent} />
      </mesh>

      {/* Floor footprint ring */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.12, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

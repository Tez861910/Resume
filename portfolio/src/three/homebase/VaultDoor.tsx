import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useCockpit } from "../cockpit/CockpitModeProvider";

const INTERACT_LAYER = 5;

interface Props {
  unlocked: boolean;
  total: number;
  collected: number;
  /** World z position where the door sits (north wall of CC) */
  z?: number;
}

const FRAME_W = 3.6;
const FRAME_H = 4.2;
const OPENING_W = 3.0;
const OPENING_H = 3.6;
const DOOR_THICKNESS = 0.18;

export default function VaultDoor({ unlocked, total, collected, z = -12 }: Props) {
  const leafL = useRef<THREE.Mesh>(null);
  const leafR = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const lockGlow = useRef<THREE.Mesh>(null);
  const hitbox = useRef<THREE.Mesh>(null);
  const prevUnlocked = useRef(unlocked);
  const { audio } = useCockpit();

  useEffect(() => {
    if (hitbox.current) hitbox.current.layers.enable(INTERACT_LAYER);
  }, []);

  useEffect(() => {
    if (!prevUnlocked.current && unlocked) {
      audio.initContext();
      audio.playImpact();
    }
    prevUnlocked.current = unlocked;
  }, [unlocked, audio]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = unlocked ? OPENING_W / 2 + DOOR_THICKNESS : 0;
    if (leafL.current) {
      leafL.current.position.x = THREE.MathUtils.lerp(leafL.current.position.x, -target, 0.06);
    }
    if (leafR.current) {
      leafR.current.position.x = THREE.MathUtils.lerp(leafR.current.position.x, target, 0.06);
    }
    if (ring.current) {
      ring.current.rotation.z = t * (unlocked ? 0.8 : 0.2);
    }
    if (lockGlow.current) {
      const m = lockGlow.current.material as THREE.MeshBasicMaterial;
      m.opacity = unlocked
        ? 0.5 + Math.sin(t * 2) * 0.15
        : 0.4 + Math.sin(t * 4) * 0.25;
    }
  });

  const accent = unlocked ? "#34d399" : "#ef4444";

  return (
    <group position={[0, 0, z]} userData={{ kind: "vault-door", unlocked }}>
      {/* Heavy frame surround */}
      <mesh position={[-FRAME_W / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[0.5, FRAME_H, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[FRAME_W / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[0.5, FRAME_H, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, FRAME_H + 0.05, 0]}>
        <boxGeometry args={[FRAME_W + 0.5, 0.45, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Frame accent strip */}
      <mesh position={[0, FRAME_H - 0.05, 0.31]}>
        <boxGeometry args={[FRAME_W, 0.04, 0.02]} />
        <meshBasicMaterial color={accent} transparent opacity={0.7} />
      </mesh>

      {/* Door leaves (slide apart when unlocked) */}
      <mesh ref={leafL} position={[0, OPENING_H / 2, 0]} castShadow>
        <boxGeometry args={[OPENING_W / 2, OPENING_H, DOOR_THICKNESS]} />
        <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh ref={leafR} position={[0, OPENING_H / 2, 0]} castShadow>
        <boxGeometry args={[OPENING_W / 2, OPENING_H, DOOR_THICKNESS]} />
        <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Hitbox for interact raycast (layer 5) */}
      <mesh ref={hitbox} position={[0, OPENING_H / 2, 0]} visible={false}>
        <boxGeometry args={[OPENING_W, OPENING_H, 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {!unlocked && (
        <>
          {[0.3, 0.9, 1.5, 2.1, 2.7].map((y, i) => (
            <mesh key={i} position={[0, y, DOOR_THICKNESS / 2 + 0.001]} rotation={[0, 0, Math.PI / 6]}>
              <planeGeometry args={[OPENING_W * 1.3, 0.12]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </>
      )}

      {/* Center lock seam ring */}
      <mesh ref={ring} position={[0, OPENING_H / 2, DOOR_THICKNESS / 2 + 0.05]}>
        <torusGeometry args={[0.45, 0.04, 8, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, OPENING_H / 2, DOOR_THICKNESS / 2 + 0.05]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Status panel above door */}
      <mesh position={[0, FRAME_H - 0.05, 0.31]}>
        <planeGeometry args={[2.4, 0.32]} />
        <meshBasicMaterial color="#020617" />
      </mesh>
      <mesh ref={lockGlow} position={[0, FRAME_H - 0.05, 0.32]}>
        <planeGeometry args={[2.4, 0.32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} />
      </mesh>
      <Text
        position={[0, FRAME_H - 0.05, 0.34]}
        fontSize={0.13}
        color={unlocked ? "#022c22" : "#1a0606"}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
        fontWeight="bold"
      >
        {unlocked ? "VAULT // UNLOCKED" : `VAULT // ${collected}/${total}`}
      </Text>

      {/* Door label */}
      <Text
        position={[0, OPENING_H + 0.35, DOOR_THICKNESS / 2 + 0.06]}
        fontSize={0.07}
        color={accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        ARCHIVE ACCESS
      </Text>

      {/* Floor warning markers */}
      <mesh position={[0, 0.02, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[OPENING_W, 0.08]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} />
      </mesh>

      {/* Accent point light */}
      <pointLight position={[0, OPENING_H / 2, 0.8]} intensity={1.5} distance={5} color={accent} />
    </group>
  );
}
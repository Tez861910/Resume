import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { DRIVE_READOUTS, type MissionId } from "../cockpit/missions";

const INTERACT_LAYER = 5;

interface Props {
  missionId: MissionId;
  position: [number, number, number];
  rotation?: [number, number, number];
  accentColor: string;
  label: string;
  width?: number;
  height?: number;
  unlocked: boolean;
}

export default function ResumeScreen({
  missionId,
  position,
  rotation = [0, 0, 0],
  accentColor,
  label,
  width = 3.5,
  height = 2.2,
  unlocked,
}: Props) {
  const glowRef = useRef<THREE.Mesh>(null);
  const lockGlowRef = useRef<THREE.Mesh>(null);
  const faceRef = useRef<THREE.Mesh>(null);
  const data = DRIVE_READOUTS[missionId];
  const w = width;
  const h = height;

  const screenColor = unlocked ? accentColor : "#ef4444";

  useEffect(() => {
    if (faceRef.current) faceRef.current.layers.enable(INTERACT_LAYER);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(t * 1.5 + position[2]) * 0.04;
    }
    if (!unlocked && lockGlowRef.current) {
      (lockGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.35 + Math.sin(t * 3.5) * 0.25;
    }
  });

  return (
    <group
      position={position}
      rotation={rotation}
      // Tag for interact raycast
      userData={{ missionId, unlocked, kind: "resume-screen" }}
    >
      {/* Bezel */}
      <mesh position={[0, h / 2 + 0.1, -0.04]}>
        <boxGeometry args={[w + 0.25, 0.05, 0.12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-(w / 2 + 0.05), h / 4, 0]}>
        <boxGeometry args={[0.08, h / 2 + 0.25, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[w / 2 + 0.05, h / 4, 0]}>
        <boxGeometry args={[0.08, h / 2 + 0.25, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.04, -0.04]}>
        <boxGeometry args={[w + 0.25, 0.05, 0.12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen face — IMPORTANT: this is the click/raycast target.
          Raycast checks userData on parent group via .object.parent. */}
      <mesh
        ref={faceRef}
        position={[0, h / 2, 0.005]}
        userData={{ missionId, unlocked, kind: "resume-screen-face" }}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          color="#020617"
          emissive={screenColor}
          emissiveIntensity={unlocked ? 0.1 : 0.18}
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} position={[0, h / 2, -0.005]}>
        <planeGeometry args={[w + 0.1, h + 0.1]} />
        <meshBasicMaterial color={screenColor} transparent opacity={0.1} />
      </mesh>

      {/* Corner brackets */}
      {[
        [-w / 2 + 0.1, h - 0.1],
        [w / 2 - 0.1, h - 0.1],
        [-w / 2 + 0.1, 0.1],
        [w / 2 - 0.1, 0.1],
      ].map(([cx, cy], i) => (
        <mesh key={i} position={[cx, cy, 0.015]}>
          <boxGeometry args={[0.2, 0.2, 0.01]} />
          <meshBasicMaterial color={screenColor} transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Status LED */}
      <mesh position={[w / 2 - 0.15, h + 0.02, 0.06]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial color={unlocked ? "#34d399" : "#ef4444"} />
      </mesh>

      {/* Local accent light (unlocked only) */}
      {unlocked && (
        <pointLight position={[0, h / 2, 0.3]} intensity={0.8} distance={2.5} color={accentColor} />
      )}

      {/* CONTENT */}
      <group position={[0, h / 2, 0.02]}>
        {/* Header label always shown */}
        <Text
          position={[0, h * 0.35, 0]}
          fontSize={0.07}
          color={screenColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          maxWidth={w - 0.3}
        >
          {label}
        </Text>

        {unlocked && data ? (
          <>
            <Text
              position={[0, h * 0.18, 0]}
              fontSize={0.1}
              color="#f1f5f9"
              anchorX="center"
              anchorY="middle"
              maxWidth={w - 0.4}
            >
              {data.headline}
            </Text>
            <Text
              position={[0, h * 0.04, 0]}
              fontSize={0.055}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              maxWidth={w - 0.4}
            >
              {data.subheadline}
            </Text>
            {data.lines.slice(0, 3).map((line, i) => (
              <Text
                key={i}
                position={[0, h * -0.08 - i * 0.11, 0]}
                fontSize={0.045}
                color="#cbd5e1"
                anchorX="center"
                anchorY="middle"
                maxWidth={w - 0.5}
              >
                {line}
              </Text>
            ))}
            <Text
              position={[0, h * -0.42, 0]}
              fontSize={0.04}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
            >
              DRIVE RECOVERED // AEGIS
            </Text>
          </>
        ) : (
          <>
            {/* Pulsing prompt panel */}
            <mesh ref={lockGlowRef} position={[0, h * -0.1, 0]}>
              <planeGeometry args={[w * 0.75, 0.8]} />
              <meshBasicMaterial color={accentColor} transparent opacity={0.25} />
            </mesh>
            <Text
              position={[0, h * 0.2, 0]}
              fontSize={0.12}
              color="#fecaca"
              anchorX="center"
              anchorY="middle"
              maxWidth={w - 0.3}
            >
              DRIVE OFFLINE
            </Text>
            <Text
              position={[0, h * -0.1, 0.005]}
              fontSize={0.065}
              color="#0b1220"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.15}
              fontWeight="bold"
            >
              {"[ E ]  LAUNCH MISSION"}
            </Text>
            <Text
              position={[0, h * -0.28, 0]}
              fontSize={0.042}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              {missionId.toUpperCase()} // SEALED
            </Text>
          </>
        )}
      </group>
    </group>
  );
}
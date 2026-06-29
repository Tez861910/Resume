import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { DRIVE_READOUTS, MISSIONS, type MissionId } from "../cockpit/missions";

const W = 16;
const D = 14;
const H = 5.5;
// Centered at world (0, 0, -19) → spans z=-26..-12, x=-8..8
const CENTER_Z = -19;

function DrivePillar({
  missionId,
  angle,
  radius,
  collected,
}: {
  missionId: MissionId;
  angle: number;
  radius: number;
  collected: boolean;
}) {
  const drive = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const m = MISSIONS.find((x) => x.id === missionId);
  const accent = m?.accent ?? "#22d3ee";
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (drive.current) {
      drive.current.position.y = 1.4 + Math.sin(t * 1.5 + angle) * 0.05;
      drive.current.rotation.y = t * 0.4;
    }
    if (halo.current) {
      const mat = halo.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 2 + angle) * 0.12;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 1, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.04, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Hovering drive */}
      {collected ? (
        <mesh ref={drive} position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.4]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={accent}
            emissiveIntensity={1.5}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ) : (
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[0.28, 0.16, 0.4]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.6} transparent opacity={0.3} />
        </mesh>
      )}
      {/* Halo ring */}
      <mesh ref={halo} position={[0, 1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.42, 24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Removed per-pillar pointLight — drives are emissive enough */}
      {/* Tag */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.06}
        color={accent}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {missionId.toUpperCase()}
      </Text>
    </group>
  );
}

interface Props {
  collected: Set<MissionId>;
  stats?: { deaths: number; kills: number };
}

export default function VaultRoom({ collected, stats }: Props) {
  // Build assembled resume sections
  const sections: { title: string; lines: string[]; accent: string }[] = MISSIONS.map((m) => {
    const r = DRIVE_READOUTS[m.id];
    return {
      title: r.headline,
      lines: r.lines,
      accent: m.accent,
    };
  });

  return (
    <group position={[0, 0, CENTER_Z]}>
      {/* Floor — glossy standard material (no reflector readback) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0a1424" metalness={0.9} roughness={0.3} envMapIntensity={0.5} />
      </mesh>
      {/* Glowing center floor disc */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.85, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.6, 48]} />
        <meshStandardMaterial
          color="#020617"
          emissive="#22d3ee"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Walls */}
      <mesh position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[0.22, H, D]} />
        <meshStandardMaterial color="#0c1325" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[0.22, H, D]} />
        <meshStandardMaterial color="#0c1325" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, H / 2, -D / 2]}>
        <boxGeometry args={[W, H, 0.22]} />
        <meshStandardMaterial color="#0c1325" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, H, 0]}>
        <boxGeometry args={[W + 0.22, 0.1, D + 0.22]} />
        <meshStandardMaterial color="#080d1c" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Lights — reduced from 2 to 1 main source for performance */}
      <pointLight position={[0, H - 0.3, 0]} intensity={5} distance={22} color="#e0f2fe" decay={2} />

      {/* Back wall display — assembled resume */}
      <mesh position={[0, H / 2, -D / 2 + 0.13]}>
        <planeGeometry args={[W - 1.5, H - 0.8]} />
        <meshStandardMaterial
          color="#020617"
          emissive="#22d3ee"
          emissiveIntensity={0.06}
          metalness={0.05}
          roughness={0.85}
        />
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + 0.12]}>
        <planeGeometry args={[W - 1.3, H - 0.6]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} />
      </mesh>

      {/* Resume header */}
      <group position={[0, H - 0.6, -D / 2 + 0.14]}>
        <Text
          fontSize={0.32}
          color="#f1f5f9"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          fontWeight="bold"
        >
          TEJAS SURESH
        </Text>
        <Text
          position={[0, -0.32, 0]}
          fontSize={0.1}
          color="#22d3ee"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.3}
        >
          FULL-STACK PRODUCT DEVELOPER // BENGALURU, INDIA
        </Text>
      </group>

      {/* Two-column resume layout: 3 sections per column */}
      {sections.map((s, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const colX = col === 0 ? -3.4 : 3.4;
        const rowY = H - 1.5 - row * 1.35;
        const bodyText = s.lines.slice(0, 3).join("\n");
        return (
          <group key={s.title} position={[colX, rowY, -D / 2 + 0.14]}>
            <Text
              fontSize={0.11}
              color={s.accent}
              anchorX="center"
              anchorY="top"
              letterSpacing={0.18}
              maxWidth={6}
            >
              {s.title.toUpperCase()}
            </Text>
            <Text
              position={[0, -0.22, 0]}
              fontSize={0.062}
              color="#cbd5e1"
              anchorX="center"
              anchorY="top"
              maxWidth={6.2}
              lineHeight={1.35}
            >
              {bodyText}
            </Text>
          </group>
        );
      })}

      {/* Footer line */}
      <Text
        position={[0, 0.5, -D / 2 + 0.14]}
        fontSize={0.07}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        ARCHIVE COMPLETE // ALL SYSTEMS NOMINAL
      </Text>

      {/* Stats line */}
      {stats && (
        <Text
          position={[0, 0.25, -D / 2 + 0.14]}
          fontSize={0.05}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          {`MISSIONS: ${collected.size}/${MISSIONS.length} // ENEMIES NEUTRALIZED: ${stats.kills} // LOSSES: ${stats.deaths}`}
        </Text>
      )}

      {/* Drive pedestals in a circle around center */}
      {MISSIONS.map((m, i) => {
        const angle = (i / MISSIONS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <DrivePillar
            key={m.id}
            missionId={m.id}
            angle={angle}
            radius={2.0}
            collected={collected.has(m.id)}
          />
        );
      })}

      {/* Central drive monolith */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* Replaced pointLight with emissive glow mesh for performance */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </mesh>

      {/* Finale beam */}
      <FinaleBeam allCollected={collected.size === MISSIONS.length} />
    </group>
  );
}

function FinaleBeam({ allCollected }: { allCollected: boolean }) {
  const beamRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (beamRef.current) {
      const s = allCollected ? 1 + Math.sin(t * 3) * 0.15 : 0.2;
      beamRef.current.scale.set(s, allCollected ? 8 : 2, s);
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = allCollected ? 0.25 + Math.sin(t * 2) * 0.1 : 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = -Math.PI / 2;
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.scale.setScalar(allCollected ? 1 + Math.sin(t * 2) * 0.2 : 0.5);
    }
  });
  return (
    <group position={[0, 1, 0]}>
      <mesh ref={beamRef} position={[0, 3, 0]}>
        <cylinderGeometry args={[0.08, 0.25, 1, 8]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ringRef} position={[0, 4.5, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 24]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
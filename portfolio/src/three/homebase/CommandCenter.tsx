import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import ResumeScreen from "./ResumeScreens";
import { MISSIONS, type MissionId } from "../cockpit/missions";

function Holotable() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const markersRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) r1.current.rotation.z = t * 0.3;
    if (r2.current) r2.current.rotation.z = -t * 0.45;
    if (markersRef.current) {
      for (let i = 0; i < markersRef.current.children.length; i++) {
        const child = markersRef.current.children[i];
        const s = 1 + Math.sin(t * 1.5 + i * 1.2) * 0.15;
        child.scale.setScalar(s);
      }
    }
  });
  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.6, 1.9, 0.06, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.3, 0.45, 0.45, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh ref={r1} position={[0, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.015, 8, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.45} />
      </mesh>
      <mesh ref={r2} position={[0, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.01, 8, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
      <group ref={markersRef} position={[0, 0.74, 0]}>
        {MISSIONS.map((m, i) => {
          const angle = (i / MISSIONS.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 1.1;
          return (
            <mesh key={m.id} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              <sphereGeometry args={[0.04, 6, 6]} />
              <meshBasicMaterial color={m.accent} />
            </mesh>
          );
        })}
      </group>
      {/* Holotable light — low intensity, tight range */}
      <pointLight position={[0, 1.2, 0]} intensity={1.5} distance={5} color="#22d3ee" />
    </group>
  );
}

function ServerRack({ position, rotation = [0, 0, 0] as [number, number, number] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main housing */}
      <mesh>
        <boxGeometry args={[0.45, 1.4, 0.35]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Server slots with blinking LEDs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, -0.45 + i * 0.18, 0.18]}>
          <boxGeometry args={[0.38, 0.08, 0.005]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      {/* LED strip */}
      <mesh position={[0.12, 0, 0.19]}>
        <boxGeometry args={[0.015, 1.1, 0.005]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function WallPanel({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#0c1425" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface ScreenSpec {
  id: MissionId;
  label: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

const SCREENS: ScreenSpec[] = [
  { id: "profile", label: "Builder Archive", position: [-7.68, 1.5, 6], rotation: [0, Math.PI / 2, 0], width: 3.2, height: 2.4 },
  { id: "constellation", label: "Skill Constellation", position: [-7.68, 1.5, 1], rotation: [0, Math.PI / 2, 0], width: 3.2, height: 2.4 },
  { id: "career", label: "Career Trajectory", position: [7.68, 1.5, 6], rotation: [0, -Math.PI / 2, 0], width: 3.2, height: 2.4 },
  { id: "mission-ops", label: "Mission Ops", position: [7.68, 1.5, 1], rotation: [0, -Math.PI / 2, 0], width: 3.2, height: 2.4 },
  { id: "transmission", label: "Transmission Array", position: [7.68, 1.5, -4], rotation: [0, -Math.PI / 2, 0], width: 3.2, height: 2.4 },
];

const W = 16;
const D = 20;
const H = 5.5;
const OPENING = 1.5;

interface Props {
  collected: Set<MissionId>;
}

function FloorGrid() {
  const lineGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // X lines
    for (let i = 0; i <= 8; i++) {
      const x = -W / 2 + i * (W / 8);
      points.push(new THREE.Vector3(x, 0.02, -D / 2 + 0.15));
      points.push(new THREE.Vector3(x, 0.02, D / 2 - 0.15));
    }
    // Z lines
    for (let i = 0; i <= 10; i++) {
      const z = -D / 2 + i * (D / 10);
      points.push(new THREE.Vector3(-W / 2 + 0.15, 0.02, z));
      points.push(new THREE.Vector3(W / 2 - 0.15, 0.02, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  return (
    <lineSegments geometry={lineGeo}>
      <lineBasicMaterial color="#1e3a5f" transparent opacity={0.12} />
    </lineSegments>
  );
}

export default function CommandCenter({ collected }: Props) {
  return (
    <group position={[0, 0, -2]}>
      {/* === FLOOR === */}
      {/* Glossy deck — cheap MeshStandardMaterial (no framebuffer readback) */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#0a1322" metalness={0.92} roughness={0.26} envMapIntensity={0.5} />
      </mesh>
      {/* Subtle sheen plate so the floor reads as polished without a reflector */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 1.5, D - 1.5]} />
        <meshStandardMaterial color="#0d1830" metalness={0.85} roughness={0.34} transparent opacity={0.5} />
      </mesh>
      {/* Panel grid lines — single LineSegments instead of 20 plane meshes */}
      <FloorGrid />
      {/* Floor edge glow strips */}
      <mesh position={[-W / 2 + 0.02, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, D]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>
      <mesh position={[W / 2 - 0.02, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, D]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>

      {/* === WALLS === */}
      {/* Side walls with vertical ribs */}
      <WallPanel position={[-W / 2, H / 2, 0]} size={[0.22, H, D]} />
      <WallPanel position={[W / 2, H / 2, 0]} size={[0.22, H, D]} />

      {/* Viewport windows — symmetric pairs set within the wall span (z∈[-10,10]) */}
      {[-8, -3.5, 3.5, 8].map((z) => (
        <mesh key={`winL${z}`} position={[-W / 2 + 0.12, H * 0.55, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 1.9]} />
          <meshStandardMaterial color="#061020" emissive="#1d4ed8" emissiveIntensity={0.14} side={THREE.DoubleSide} metalness={0.05} roughness={0.04} />
        </mesh>
      ))}
      {[-8, -3.5, 3.5, 8].map((z) => (
        <mesh key={`winR${z}`} position={[W / 2 - 0.12, H * 0.55, z]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 1.9]} />
          <meshStandardMaterial color="#061020" emissive="#1d4ed8" emissiveIntensity={0.14} side={THREE.DoubleSide} metalness={0.05} roughness={0.04} />
        </mesh>
      ))}

      {/* Wall ribs (vertical) */}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`ribl${i}`}>
          <mesh position={[-W / 2 + 0.12, H / 2, -D / 2 + 2 + i * 4]}>
            <boxGeometry args={[0.06, H, 0.08]} />
            <meshStandardMaterial color="#0a101e" metalness={0.9} roughness={0.12} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <group key={`ribr${i}`}>
          <mesh position={[W / 2 - 0.12, H / 2, -D / 2 + 2 + i * 4]}>
            <boxGeometry args={[0.06, H, 0.08]} />
            <meshStandardMaterial color="#0a101e" metalness={0.9} roughness={0.12} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Wall-mounted conduits */}
      <mesh position={[-W / 2 + 0.13, 1.2, 0]}>
        <boxGeometry args={[0.04, 0.04, D - 1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[W / 2 - 0.13, 1.2, 0]}>
        <boxGeometry args={[0.04, 0.04, D - 1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* North wall (vault side) */}
      <WallPanel position={[-(W / 2 + OPENING) / 2, H / 2, -D / 2]} size={[W / 2 - OPENING, H, 0.22]} />
      <WallPanel position={[(W / 2 + OPENING) / 2, H / 2, -D / 2]} size={[W / 2 - OPENING, H, 0.22]} />
      {/* Lintel */}
      <mesh position={[0, H - 0.5, -D / 2]}>
        <boxGeometry args={[OPENING * 2, 1, 0.22]} />
        <meshStandardMaterial color="#0f1729" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* South wall (bridge side) */}
      <WallPanel position={[-(W / 2 + OPENING) / 2, H / 2, D / 2]} size={[W / 2 - OPENING, H, 0.22]} />
      <WallPanel position={[(W / 2 + OPENING) / 2, H / 2, D / 2]} size={[W / 2 - OPENING, H, 0.22]} />
      <mesh position={[0, H - 0.5, D / 2]}>
        <boxGeometry args={[OPENING * 2, 1, 0.22]} />
        <meshStandardMaterial color="#0f1729" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* === CEILING === */}
      <mesh position={[0, H, 0]}>
        <boxGeometry args={[W + 0.22, 0.1, D + 0.22]} />
        <meshStandardMaterial color="#0a1220" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Ceiling light strips — emissive instead of point lights */}
      {[-5, 0, 5].map((z) => (
        <mesh key={`ceil${z}`} position={[0, H - 0.02, z]}>
          <boxGeometry args={[W - 0.5, 0.015, 0.06]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Cross beams */}
      {[-8, 0, 8].map((x) => (
        <mesh key={`beam${x}`} position={[x, H - 0.04, 0]}>
          <boxGeometry args={[0.18, 0.08, D]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* === CORNER PILLARS === */}
      {[
        [-W / 2 + 0.15, H / 2, -D / 2 + 0.15],
        [W / 2 - 0.15, H / 2, -D / 2 + 0.15],
        [-W / 2 + 0.15, H / 2, D / 2 - 0.15],
        [W / 2 - 0.15, H / 2, D / 2 - 0.15],
      ].map((p, i) => (
        <group key={i} position={p as [number, number, number]}>
          <mesh>
            <boxGeometry args={[0.35, H, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.08} />
          </mesh>
          {/* Pillar accent strip */}
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.36, H - 0.2, 0.01]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.2} />
          </mesh>
        </group>
      ))}

      {/* === LIGHTING === */}
      {/* Reduced from 7 to 3 strategic point lights */}
      <ambientLight intensity={0.35} />
      <pointLight position={[0, H - 0.8, 0]} intensity={4} distance={24} color="#d0e8ff" decay={2} />
      <pointLight position={[0, 0.5, D / 2 - 2]} intensity={1.5} distance={10} color="#22d3ee" decay={2} />

      {/* === ROOF — antenna + beacon only === */}
      <mesh position={[0, H + 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 2.8, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, H + 3.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <pointLight position={[0, H + 3.2, 0]} intensity={3} distance={10} color="#ffffff" decay={2} />
      <mesh position={[0, H + 3.0, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* === SCREENS === */}
      {SCREENS.map((s) => {
        const m = MISSIONS.find((x) => x.id === s.id);
        return (
          <ResumeScreen
            key={s.id}
            missionId={s.id}
            position={s.position}
            rotation={s.rotation}
            accentColor={m?.accent ?? "#22d3ee"}
            label={s.label}
            width={s.width}
            height={s.height}
            unlocked={collected.has(s.id)}
          />
        );
      })}

      <Holotable />

      {/* === PROPS === */}
      {/* Server racks instead of crates */}
      <ServerRack position={[-6.2, 0.7, 7]} />
      <ServerRack position={[-5.6, 0.7, 7]} />
      <ServerRack position={[6.2, 0.7, 7]} />
      <ServerRack position={[5.6, 0.7, 7]} />
      <ServerRack position={[-6.2, 0.7, -7]} />
      <ServerRack position={[6.2, 0.7, -7]} />

      {/* Wall-mounted equipment between screens */}
      <mesh position={[-7.78, 2.8, 3.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[7.78, 2.8, 3.5]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.06]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Floor accent strips at openings */}
      <mesh position={[0, 0.025, D / 2 - 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[OPENING * 2, 0.04]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.025, -D / 2 + 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[OPENING * 2, 0.04]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

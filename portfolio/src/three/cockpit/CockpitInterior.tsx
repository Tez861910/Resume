import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FRAME = "#080d18";
const FRAME_LIT = "#111d33";
const PANEL = "#0c1422";
const PANEL_LIT = "#142238";
const ACCENT = "#22d3ee";
const METAL = "#1e293b";
const DARK = "#060a12";
const GLOW_ORANGE = "#f59e0b";
const GLOW_GREEN = "#34d399";
const GLOW_RED = "#ef4444";

function Screen({ pos, size, color, rot = [0, 0, 0] as [number, number, number], holo = false }: {
  pos: [number, number, number];
  size: [number, number];
  color: string;
  rot?: [number, number, number];
  holo?: boolean;
}) {
  return (
    <group position={pos} rotation={rot}>
      {/* Bezel */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[size[0] + 0.018, size[1] + 0.018]} />
        <meshStandardMaterial color={METAL} metalness={0.92} roughness={0.14} />
      </mesh>
      {/* Screen surface */}
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#00040a" emissive={color} emissiveIntensity={holo ? 0.55 : 0.4} metalness={0.05} roughness={0.92} />
      </mesh>
      {/* Scanline */}
      {holo && (
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[size[0] * 0.9, size[1] * 0.12]} />
          <meshBasicMaterial color={color} transparent opacity={0.06} />
        </mesh>
      )}
      {/* Bright core */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[size[0] * 0.75, size[1] * 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function GlowEdge({ from, to, color, thickness = 0.002 }: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  thickness?: number;
}) {
  const dir = new THREE.Vector3(...to).sub(new THREE.Vector3(...from));
  const len = dir.length();
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  const euler = new THREE.Euler().setFromQuaternion(quat);
  return (
    <mesh position={mid} rotation={[euler.x, euler.y, euler.z]}>
      <boxGeometry args={[thickness, len, thickness]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

function RivetRow({ pos, count, spacing, axis = "x" as "x" | "z", rot = [0, 0, 0] as [number, number, number] }: {
  pos: [number, number, number];
  count: number;
  spacing: number;
  axis?: "x" | "z";
  rot?: [number, number, number];
}) {
  const rivets = [];
  for (let i = 0; i < count; i++) {
    const offset = (i - (count - 1) / 2) * spacing;
    const p: [number, number, number] = axis === "x" ? [offset, 0, 0] : [0, 0, offset];
    rivets.push(
      <mesh key={i} position={p}>
        <sphereGeometry args={[0.003, 4, 4]} />
        <meshStandardMaterial color="#2d3a52" metalness={0.9} roughness={0.2} />
      </mesh>
    );
  }
  return <group position={pos} rotation={rot}>{rivets}</group>;
}

/** Rich sci-fi fighter cockpit interior with glowing edges and volumetric detail. */
export default function CockpitInterior() {
  const dashGlowRef = useRef<THREE.Mesh>(null);
  const yokeRef = useRef<THREE.Group>(null);
  const throttleRef = useRef<THREE.Mesh>(null);
  const holoRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;
    if (dashGlowRef.current) {
      (dashGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.45 + Math.sin(t * 2.2) * 0.1;
    }
    if (yokeRef.current) {
      yokeRef.current.rotation.x = mouse.y * 0.1;
      yokeRef.current.rotation.z = -mouse.x * 0.08;
    }
    if (throttleRef.current) {
      throttleRef.current.position.z = -0.02 + mouse.y * 0.04;
    }
    if (holoRef.current) {
      holoRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group>
      {/* ============= INTERIOR LIGHTING ============= */}
      <pointLight position={[0, 0.22, -0.08]} intensity={0.7} distance={2.2} color="#93c5fd" decay={2} />
      <pointLight position={[-0.35, -0.02, -0.12]} intensity={0.25} distance={1.0} color="#fbbf24" decay={2} />
      <pointLight position={[0.35, -0.02, -0.12]} intensity={0.25} distance={1.0} color="#34d399" decay={2} />
      <pointLight position={[0, -0.18, -0.32]} intensity={0.3} distance={0.9} color={ACCENT} decay={2} />
      <pointLight position={[0, 0.05, -0.65]} intensity={0.08} distance={1.5} color="#ffffff" decay={2} />

      {/* ============= SEAT (bucket with side wings) ============= */}
      {/* Main shell */}
      <mesh position={[0, -0.06, 0.3]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.48, 0.035]} />
        <meshStandardMaterial color={DARK} metalness={0.55} roughness={0.5} />
      </mesh>
      {/* Shell edge glow */}
      <GlowEdge from={[-0.2, 0.18, 0.315]} to={[0.2, 0.18, 0.315]} color={ACCENT} thickness={0.002} />
      {/* Left wing */}
      <mesh position={[-0.2, -0.02, 0.27]} rotation={[0, 0.12, 0.18]}>
        <boxGeometry args={[0.035, 0.44, 0.1]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.2, -0.02, 0.27]} rotation={[0, -0.12, -0.18]}>
        <boxGeometry args={[0.035, 0.44, 0.1]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.55} />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, -0.32, 0.2]} rotation={[0.04, 0, 0]}>
        <boxGeometry args={[0.36, 0.045, 0.28]} />
        <meshStandardMaterial color="#121d30" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Headrest */}
      <mesh position={[0, 0.14, 0.33]}>
        <boxGeometry args={[0.24, 0.16, 0.055]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[-0.1, 0.16, 0.3]}>
        <boxGeometry args={[0.025, 0.1, 0.08]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh position={[0.1, 0.16, 0.3]}>
        <boxGeometry args={[0.025, 0.1, 0.08]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.45} />
      </mesh>

      {/* ============= FLOOR ============= */}
      <mesh position={[0, -0.38, -0.02]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.88, 0.02, 1.0]} />
        <meshStandardMaterial color={PANEL} metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Floor panel seams */}
      {[-0.25, 0, 0.25].map((x) => (
        <mesh key={`fs${x}`} position={[x, -0.369, -0.02]}>
          <boxGeometry args={[0.003, 0.002, 0.9]} />
          <meshStandardMaterial color="#1a2842" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      {[-0.3, -0.1, 0.1, 0.32].map((z) => (
        <mesh key={`fg${z}`} position={[0, -0.369, z]}>
          <boxGeometry args={[0.72, 0.002, 0.01]} />
          <meshStandardMaterial color="#3d4f6a" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      {/* Floor edge glow */}
      <GlowEdge from={[-0.44, -0.37, -0.52]} to={[0.44, -0.37, -0.52]} color={ACCENT} thickness={0.0015} />

      {/* ============= CANOPY FRAME (structural cage with glowing edges) ============= */}
      {/* Overhead longitudinal beam */}
      <mesh position={[0, 0.36, -0.3]}>
        <boxGeometry args={[0.02, 0.022, 0.72]} />
        <meshStandardMaterial color={FRAME} metalness={0.94} roughness={0.1} />
      </mesh>
      <GlowEdge from={[0, 0.37, -0.66]} to={[0, 0.37, 0.06]} color={ACCENT} thickness={0.0015} />

      {/* Fore arch */}
      <mesh position={[0, 0.25, -0.72]}>
        <boxGeometry args={[1.2, 0.014, 0.014]} />
        <meshStandardMaterial color={FRAME_LIT} metalness={0.94} roughness={0.1} />
      </mesh>
      <GlowEdge from={[-0.6, 0.25, -0.72]} to={[0.6, 0.25, -0.72]} color={ACCENT} thickness={0.002} />

      {/* Mid arch */}
      <mesh position={[0, 0.34, -0.45]}>
        <boxGeometry args={[1.04, 0.011, 0.011]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Aft arch */}
      <mesh position={[0, 0.27, -0.05]}>
        <boxGeometry args={[0.82, 0.011, 0.011]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Left fore upright */}
      <mesh position={[-0.54, 0.08, -0.72]}>
        <boxGeometry args={[0.012, 0.48, 0.012]} />
        <meshStandardMaterial color={FRAME_LIT} metalness={0.94} roughness={0.1} />
      </mesh>
      <GlowEdge from={[-0.54, 0.32, -0.72]} to={[-0.54, -0.16, -0.72]} color={ACCENT} thickness={0.0015} />

      {/* Right fore upright */}
      <mesh position={[0.54, 0.08, -0.72]}>
        <boxGeometry args={[0.012, 0.48, 0.012]} />
        <meshStandardMaterial color={FRAME_LIT} metalness={0.94} roughness={0.1} />
      </mesh>
      <GlowEdge from={[0.54, 0.32, -0.72]} to={[0.54, -0.16, -0.72]} color={ACCENT} thickness={0.0015} />

      {/* Center sight post */}
      <mesh position={[0, 0.05, -0.73]}>
        <boxGeometry args={[0.004, 0.48, 0.004]} />
        <meshStandardMaterial color={FRAME} metalness={0.94} roughness={0.1} />
      </mesh>
      <GlowEdge from={[0, 0.29, -0.73]} to={[0, -0.19, -0.73]} color="#64748b" thickness={0.001} />

      {/* Canopy glass panes */}
      <mesh position={[-0.27, 0.05, -0.7]}>
        <planeGeometry args={[0.52, 0.46]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.005} side={THREE.DoubleSide} metalness={0.15} roughness={0.06} />
      </mesh>
      <mesh position={[0.27, 0.05, -0.7]}>
        <planeGeometry args={[0.52, 0.46]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.005} side={THREE.DoubleSide} metalness={0.15} roughness={0.06} />
      </mesh>

      {/* ============= SIDE WALLS (with inner paneling and depth) ============= */}
      {/* Left outer wall */}
      <mesh position={[-0.56, 0.0, -0.12]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.025, 0.58, 0.78]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Left inner panel */}
      <mesh position={[-0.53, 0.0, -0.12]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.008, 0.5, 0.65]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Left panel seam */}
      <mesh position={[-0.525, 0.0, -0.12]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.01, 0.003, 0.55]} />
        <meshStandardMaterial color="#1e2d45" metalness={0.9} roughness={0.15} />
      </mesh>
      <RivetRow pos={[-0.54, 0.12, -0.35]} count={6} spacing={0.08} axis="z" rot={[0, 0.18, 0]} />
      <RivetRow pos={[-0.54, -0.12, -0.35]} count={6} spacing={0.08} axis="z" rot={[0, 0.18, 0]} />

      {/* Right outer wall */}
      <mesh position={[0.56, 0.0, -0.12]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.025, 0.58, 0.78]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Right inner panel */}
      <mesh position={[0.53, 0.0, -0.12]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.008, 0.5, 0.65]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Right panel seam */}
      <mesh position={[0.525, 0.0, -0.12]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.01, 0.003, 0.55]} />
        <meshStandardMaterial color="#1e2d45" metalness={0.9} roughness={0.15} />
      </mesh>
      <RivetRow pos={[0.54, 0.12, -0.35]} count={6} spacing={0.08} axis="z" rot={[0, -0.18, 0]} />
      <RivetRow pos={[0.54, -0.12, -0.35]} count={6} spacing={0.08} axis="z" rot={[0, -0.18, 0]} />

      {/* Side window glass (small peripheral) */}
      <mesh position={[-0.57, 0.1, -0.28]} rotation={[0, 0.45, 0]}>
        <planeGeometry args={[0.18, 0.22]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.008} side={THREE.DoubleSide} metalness={0.15} roughness={0.06} />
      </mesh>
      <mesh position={[0.57, 0.1, -0.28]} rotation={[0, -0.45, 0]}>
        <planeGeometry args={[0.18, 0.22]} />
        <meshStandardMaterial color="#06b6d4" transparent opacity={0.008} side={THREE.DoubleSide} metalness={0.15} roughness={0.06} />
      </mesh>

      {/* ============= OVERHEAD CONSOLE ============= */}
      <mesh position={[0, 0.33, -0.05]} rotation={[-0.03, 0, 0]}>
        <boxGeometry args={[0.68, 0.014, 0.32]} />
        <meshStandardMaterial color={PANEL} metalness={0.88} roughness={0.16} />
      </mesh>
      <GlowEdge from={[-0.34, 0.338, -0.05]} to={[0.34, 0.338, -0.05]} color={ACCENT} thickness={0.002} />
      {/* Overhead indicator lights */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
        <mesh key={`oh${x}`} position={[x, 0.335, -0.02]}>
          <sphereGeometry args={[0.005, 4, 4]} />
          <meshBasicMaterial color={["#fbbf24", "#22d3ee", "#34d399", "#a78bfa"][i]} />
        </mesh>
      ))}
      {/* Overhead text strip area */}
      <mesh position={[0, 0.328, -0.12]}>
        <planeGeometry args={[0.5, 0.02]} />
        <meshStandardMaterial color="#00040a" emissive={ACCENT} emissiveIntensity={0.15} metalness={0.1} roughness={0.9} />
      </mesh>

      {/* ============= DASHBOARD ============= */}
      {/* Main body */}
      <mesh position={[0, -0.24, -0.38]}>
        <boxGeometry args={[0.94, 0.09, 0.28]} />
        <meshStandardMaterial color={PANEL} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Dash top edge glow */}
      <GlowEdge from={[-0.47, -0.195, -0.25]} to={[0.47, -0.195, -0.25]} color={ACCENT} thickness={0.0015} />

      {/* Coaming (hood) */}
      <mesh position={[0, -0.17, -0.5]} rotation={[0.55, 0, 0]}>
        <boxGeometry args={[0.86, 0.008, 0.15]} />
        <meshStandardMaterial color={FRAME_LIT} metalness={0.9} roughness={0.14} />
      </mesh>
      <GlowEdge from={[-0.43, -0.17, -0.42]} to={[0.43, -0.17, -0.42]} color={ACCENT} thickness={0.001} />
      {/* Coaming side wraps */}
      <mesh position={[-0.46, -0.18, -0.4]} rotation={[0.55, 0.28, 0.08]}>
        <boxGeometry args={[0.05, 0.007, 0.12]} />
        <meshStandardMaterial color={FRAME} metalness={0.9} roughness={0.14} />
      </mesh>
      <mesh position={[0.46, -0.18, -0.4]} rotation={[0.55, -0.28, -0.08]}>
        <boxGeometry args={[0.05, 0.007, 0.12]} />
        <meshStandardMaterial color={FRAME} metalness={0.9} roughness={0.14} />
      </mesh>

      {/* Dash flat top */}
      <mesh position={[0, -0.135, -0.33]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[0.9, 0.008, 0.22]} />
        <meshStandardMaterial color={PANEL_LIT} metalness={0.88} roughness={0.16} />
      </mesh>

      {/* Primary MFD center */}
      <Screen pos={[0, -0.195, -0.52]} size={[0.32, 0.07]} color={ACCENT} rot={[0.55, 0, 0]} holo />
      {/* Left MFD */}
      <Screen pos={[-0.24, -0.185, -0.49]} size={[0.13, 0.055]} color={GLOW_ORANGE} rot={[0.55, 0, 0]} />
      {/* Right MFD */}
      <Screen pos={[0.24, -0.185, -0.49]} size={[0.13, 0.055]} color={GLOW_GREEN} rot={[0.55, 0, 0]} />

      {/* Holographic ring above dash */}
      <mesh ref={holoRef} position={[0, -0.1, -0.58]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.08, 0.002, 4, 24]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -0.1, -0.58]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.05, 0.0015, 4, 16]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.2} />
      </mesh>

      {/* Dash accent strip */}
      <mesh ref={dashGlowRef} position={[0, -0.285, -0.24]}>
        <boxGeometry args={[0.78, 0.002, 0.004]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>

      {/* Ventilation slits */}
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={`v${x}`} position={[x, -0.215, -0.44]}>
          <boxGeometry args={[0.08, 0.002, 0.004]} />
          <meshStandardMaterial color="#0a1220" metalness={0.7} roughness={0.5} />
        </mesh>
      ))}

      {/* ============= LEFT CONSOLE (throttle + systems) ============= */}
      <mesh position={[-0.46, -0.14, -0.06]} rotation={[0.03, 0.28, -0.03]}>
        <boxGeometry args={[0.15, 0.016, 0.4]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Left console edge glow */}
      <GlowEdge from={[-0.54, -0.132, -0.26]} to={[-0.38, -0.132, 0.14]} color={GLOW_ORANGE} thickness={0.001} />

      {/* Throttle quadrant */}
      <mesh position={[-0.43, -0.09, 0.0]} rotation={[0.06, 0.28, -0.06]}>
        <boxGeometry args={[0.09, 0.08, 0.1]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh ref={throttleRef} position={[-0.43, -0.04, -0.02]}>
        <boxGeometry args={[0.007, 0.045, 0.007]} />
        <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.15} />
      </mesh>
      <mesh position={[-0.43, -0.015, -0.02]}>
        <sphereGeometry args={[0.009, 6, 6]} />
        <meshStandardMaterial color={GLOW_ORANGE} emissive={GLOW_ORANGE} emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Throttle detents */}
      {[-0.03, 0.01, 0.05].map((z) => (
        <mesh key={`td${z}`} position={[-0.4, -0.08, z]} rotation={[0.06, 0.28, -0.06]}>
          <boxGeometry args={[0.06, 0.002, 0.002]} />
          <meshStandardMaterial color="#2d3a52" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      <Screen pos={[-0.4, -0.08, -0.12]} size={[0.07, 0.055]} color={GLOW_ORANGE} rot={[0, 0.28, 0]} />
      <GlowEdge from={[-0.42, -0.02, -0.1]} to={[-0.38, -0.02, -0.02]} color={GLOW_ORANGE} thickness={0.001} />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`ls${i}`} position={[-0.41, -0.18, -0.12 + i * 0.032]} rotation={[0.03, 0.28, -0.03]}>
          <boxGeometry args={[0.004, 0.002, 0.007]} />
          <meshStandardMaterial color={i % 2 === 0 ? GLOW_RED : "#f97316"} emissive={i % 2 === 0 ? GLOW_RED : "#f97316"} emissiveIntensity={0.35} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ============= RIGHT CONSOLE (weapons / targeting) ============= */}
      <mesh position={[0.46, -0.14, -0.06]} rotation={[0.03, -0.28, 0.03]}>
        <boxGeometry args={[0.15, 0.016, 0.4]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Right console edge glow */}
      <GlowEdge from={[0.54, -0.132, -0.26]} to={[0.38, -0.132, 0.14]} color={GLOW_GREEN} thickness={0.001} />

      <Screen pos={[0.4, -0.08, -0.12]} size={[0.07, 0.055]} color={GLOW_GREEN} rot={[0, -0.28, 0]} />
      <GlowEdge from={[0.42, -0.02, -0.1]} to={[0.38, -0.02, -0.02]} color={GLOW_GREEN} thickness={0.001} />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`rs${i}`} position={[0.41, -0.18, -0.12 + i * 0.032]} rotation={[0.03, -0.28, 0.03]}>
          <boxGeometry args={[0.004, 0.002, 0.007]} />
          <meshStandardMaterial color={i % 2 === 0 ? ACCENT : "#3b82f6"} emissive={i % 2 === 0 ? ACCENT : "#3b82f6"} emissiveIntensity={0.35} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ============= CONTROL YOKE ============= */}
      <group ref={yokeRef} position={[0, -0.14, -0.28]}>
        <mesh position={[0, -0.04, 0.06]} rotation={[0.35, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.013, 0.18, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.11, 0.02]}>
          <coneGeometry args={[0.028, 0.045, 8]} />
          <meshStandardMaterial color="#0c1424" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
          <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[-0.08, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.03, 8]} />
          <meshStandardMaterial color="#121d30" metalness={0.65} roughness={0.45} />
        </mesh>
        <mesh position={[0.08, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.03, 8]} />
          <meshStandardMaterial color="#121d30" metalness={0.65} roughness={0.45} />
        </mesh>
        {/* Fire trigger guard */}
        <mesh position={[-0.08, 0.006, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.012, 0.002, 4, 8, Math.PI]} />
          <meshStandardMaterial color={GLOW_RED} emissive={GLOW_RED} emissiveIntensity={0.25} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* ============= FOOTWELL PANELS ============= */}
      <mesh position={[-0.18, -0.27, -0.24]}>
        <boxGeometry args={[0.035, 0.12, 0.18]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.18, -0.27, -0.24]}>
        <boxGeometry args={[0.035, 0.12, 0.18]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* ============= FOOT PEDALS ============= */}
      {/* Left rudder pedal */}
      <mesh position={[-0.12, -0.3, -0.38]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.06, 0.015, 0.04]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.2} />
      </mesh>
      <GlowEdge from={[-0.15, -0.29, -0.36]} to={[-0.09, -0.29, -0.36]} color={ACCENT} thickness={0.001} />
      {/* Right rudder pedal */}
      <mesh position={[0.12, -0.3, -0.38]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.06, 0.015, 0.04]} />
        <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.2} />
      </mesh>
      <GlowEdge from={[0.09, -0.29, -0.36]} to={[0.15, -0.29, -0.36]} color={ACCENT} thickness={0.001} />
    </group>
  );
}

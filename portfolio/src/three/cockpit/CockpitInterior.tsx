import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FRAME = "#0b1220";
const PANEL = "#111827";
const ACCENT = "#22d3ee";
const GLASS = "#0ea5e9";

function Screen({ pos, size, color }: { pos: [number, number, number]; size: [number, number]; color: string }) {
  return (
    <group position={pos}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#02040a" emissive={color} emissiveIntensity={0.35} metalness={0.1} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <planeGeometry args={[size[0] + 0.012, size[1] + 0.012]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/** A proper enclosed cockpit volume. Local origin = pilot eye position. Forward = -Z. */
export default function CockpitInterior() {
  const dashGlowRef = useRef<THREE.Mesh>(null);
  const sideGlowL = useRef<THREE.Mesh>(null);
  const sideGlowR = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (dashGlowRef.current) {
      (dashGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 2.5) * 0.15;
    }
    if (sideGlowL.current) {
      (sideGlowL.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 1.8 + 1) * 0.1;
    }
    if (sideGlowR.current) {
      (sideGlowR.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + Math.sin(t * 1.8 + 2) * 0.1;
    }
  });

  return (
    <group>
      {/* === Floor plate === */}
      <mesh position={[0, -0.38, 0.05]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[1.1, 0.04, 1.0]} />
        <meshStandardMaterial color={PANEL} metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Floor grip strips */}
      {[-0.25, 0, 0.25].map((z) => (
        <mesh key={z} position={[0, -0.36, z]}>
          <boxGeometry args={[1.0, 0.005, 0.02]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* === Side walls / consoles === */}
      {/* Left wall */}
      <mesh position={[-0.62, -0.05, -0.1]}>
        <boxGeometry args={[0.06, 0.7, 0.9]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Left console top */}
      <mesh position={[-0.58, -0.15, -0.05]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.55]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Left glow strip */}
      <mesh ref={sideGlowL} position={[-0.55, -0.08, -0.05]}>
        <boxGeometry args={[0.008, 0.008, 0.5]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {/* Right wall */}
      <mesh position={[0.62, -0.05, -0.1]}>
        <boxGeometry args={[0.06, 0.7, 0.9]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Right console top */}
      <mesh position={[0.58, -0.15, -0.05]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.55]} />
        <meshStandardMaterial color={PANEL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Right glow strip */}
      <mesh ref={sideGlowR} position={[0.55, -0.08, -0.05]}>
        <boxGeometry args={[0.008, 0.008, 0.5]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>

      {/* === Ceiling / overhead === */}
      <mesh position={[0, 0.42, -0.15]}>
        <boxGeometry args={[1.2, 0.04, 0.75]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Overhead light strip */}
      <mesh position={[0, 0.395, -0.15]}>
        <boxGeometry args={[0.9, 0.006, 0.015]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.7} />
      </mesh>

      {/* === Forward window frame === */}
      {/* Top bar */}
      <mesh position={[0, 0.22, -0.65]}>
        <boxGeometry args={[1.4, 0.05, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Bottom bar (dash edge) */}
      <mesh position={[0, -0.18, -0.62]}>
        <boxGeometry args={[1.25, 0.04, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-0.62, 0.02, -0.65]}>
        <boxGeometry args={[0.04, 0.48, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[0.62, 0.02, -0.65]}>
        <boxGeometry args={[0.04, 0.48, 0.04]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Center vertical bar */}
      <mesh position={[0, 0.02, -0.66]}>
        <boxGeometry args={[0.02, 0.46, 0.02]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Horizontal crossbar */}
      <mesh position={[0, 0.1, -0.66]}>
        <boxGeometry args={[1.24, 0.02, 0.02]} />
        <meshStandardMaterial color={FRAME} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Glass panes — very subtle, almost invisible */}
      <mesh position={[-0.31, 0.02, -0.63]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color={GLASS} transparent opacity={0.018} side={THREE.DoubleSide} metalness={0.2} roughness={0.05} />
      </mesh>
      <mesh position={[0.31, 0.02, -0.63]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color={GLASS} transparent opacity={0.018} side={THREE.DoubleSide} metalness={0.2} roughness={0.05} />
      </mesh>

      {/* === Dashboard === */}
      <mesh position={[0, -0.24, -0.38]}>
        <boxGeometry args={[1.15, 0.18, 0.28]} />
        <meshStandardMaterial color={PANEL} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Dash slope */}
      <mesh position={[0, -0.16, -0.5]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[1.05, 0.015, 0.22]} />
        <meshStandardMaterial color={PANEL} metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Dash screens */}
      <Screen pos={[0, -0.18, -0.51]} size={[0.48, 0.1]} color={ACCENT} />
      <Screen pos={[-0.3, -0.17, -0.48]} size={[0.18, 0.08]} color="#f59e0b" />
      <Screen pos={[0.3, -0.17, -0.48]} size={[0.18, 0.08]} color="#34d399" />

      {/* Dash accent strip */}
      <mesh ref={dashGlowRef} position={[0, -0.28, -0.25]}>
        <boxGeometry args={[1.0, 0.006, 0.008]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.6} />
      </mesh>

      {/* Side window frames (small glimpses of space on sides) */}
      <mesh position={[-0.68, 0.05, -0.2]} rotation={[0, 0.55, 0]}>
        <boxGeometry args={[0.025, 0.35, 0.025]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>
      <mesh position={[0.68, 0.05, -0.2]} rotation={[0, -0.55, 0]}>
        <boxGeometry args={[0.025, 0.35, 0.025]} />
        <meshStandardMaterial color={FRAME} metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Subtle ambient dash light */}
      <pointLight position={[0, -0.2, -0.3]} intensity={0.3} distance={1.0} color={ACCENT} />
    </group>
  );
}

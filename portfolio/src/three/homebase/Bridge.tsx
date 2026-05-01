import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BRIDGE_W = 3;
const BRIDGE_LEN = 10;
const BRIDGE_Z_START = 18;
const BRIDGE_Z_END = 8;
const BRIDGE_Z_MID = (BRIDGE_Z_START + BRIDGE_Z_END) / 2;

function BridgeParticles() {
  const ref = useRef<THREE.Group>(null);
  const particles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      x: (Math.random() - 0.5) * (BRIDGE_W - 0.6),
      z: BRIDGE_Z_END + (i / 11) * BRIDGE_LEN + (Math.random() - 0.5) * 0.5,
      y: 0.2 + Math.random() * 0.6,
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    })),
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!ref.current) return;
    const children = ref.current.children;
    for (let i = 0; i < children.length; i++) {
      const p = particles.current[i];
      const mesh = children[i] as THREE.Mesh;
      mesh.position.x = p.x + Math.sin(t * p.speed + p.phase) * 0.15;
      mesh.position.y = p.y + Math.sin(t * p.speed * 0.7 + p.phase) * 0.08;
      mesh.position.z = p.z + Math.cos(t * p.speed * 0.5 + p.phase) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {particles.current.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.015 + Math.random() * 0.01, 4, 4]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35 + Math.random() * 0.25} />
        </mesh>
      ))}
    </group>
  );
}

function RailingLight({ x, z }: { x: number; z: number }) {
  return (
    <mesh position={[x, 1.05, z]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#22d3ee" />
    </mesh>
  );
}

function Railing({ side }: { side: 1 | -1 }) {
  const x = side * (BRIDGE_W / 2);
  return (
    <group>
      {/* Top rail */}
      <mesh position={[x, 1, BRIDGE_Z_MID]}>
        <boxGeometry args={[0.06, 0.06, BRIDGE_LEN]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Bottom rail (kickplate) */}
      <mesh position={[x, 0.15, BRIDGE_Z_MID]}>
        <boxGeometry args={[0.08, 0.18, BRIDGE_LEN]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Posts */}
      {Array.from({ length: 6 }).map((_, i) => {
        const z = BRIDGE_Z_END + (i / 5) * BRIDGE_LEN;
        return (
          <mesh key={i} position={[x, 0.55, z]}>
            <boxGeometry args={[0.05, 1, 0.05]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
      {/* Glow strip along top */}
      <mesh position={[x, 1.04, BRIDGE_Z_MID]}>
        <boxGeometry args={[0.02, 0.015, BRIDGE_LEN - 0.2]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>
      {/* Marker beacons at endpoints */}
      <RailingLight x={x} z={BRIDGE_Z_START - 0.2} />
      <RailingLight x={x} z={BRIDGE_Z_END + 0.2} />
    </group>
  );
}

export default function Bridge() {
  return (
    <group>
      {/* Walkway grate floor */}
      <mesh position={[0, 0, BRIDGE_Z_MID]} receiveShadow>
        <boxGeometry args={[BRIDGE_W, 0.08, BRIDGE_LEN]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Floor lane stripes */}
      <mesh position={[0, 0.045, BRIDGE_Z_MID]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BRIDGE_W - 0.4, BRIDGE_LEN - 0.6]} />
        <meshStandardMaterial color="#1e3a5f" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Edge accent lines */}
      <mesh position={[-BRIDGE_W / 2 + 0.04, 0.045, BRIDGE_Z_MID]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, BRIDGE_LEN - 0.4]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[BRIDGE_W / 2 - 0.04, 0.045, BRIDGE_Z_MID]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.04, BRIDGE_LEN - 0.4]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Underside structural truss */}
      <mesh position={[0, -0.15, BRIDGE_Z_MID]}>
        <boxGeometry args={[BRIDGE_W - 0.4, 0.15, BRIDGE_LEN - 0.2]} />
        <meshStandardMaterial color="#0a101e" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Truss support pylons going down into the void */}
      {[BRIDGE_Z_END + 1.5, BRIDGE_Z_START - 1.5].map((z, i) => (
        <group key={i}>
          <mesh position={[-BRIDGE_W / 2 - 0.05, -1.5, z]}>
            <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[BRIDGE_W / 2 + 0.05, -1.5, z]}>
            <cylinderGeometry args={[0.08, 0.12, 3, 6]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      <Railing side={1} />
      <Railing side={-1} />

      <BridgeParticles />

      {/* Soft ambient bridge lights */}
      <pointLight position={[0, 1.5, BRIDGE_Z_MID]} intensity={1.2} distance={8} color="#22d3ee" />
    </group>
  );
}
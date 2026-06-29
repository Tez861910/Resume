import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameAsset } from "../cockpit/AssetPipeline";

function ShipModel() {
  const ship = useGameAsset("player");
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = 0.6 + Math.sin(t * 0.8) * 0.06;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[-4.5, 0.6, 1.5]}>
      <mesh geometry={ship.geometry} material={ship.material} scale={1.5} />
      {/* Replaced expensive pointLight with emissive glow mesh */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.15} />
      </mesh>
      {/* Thruster cones */}
      <mesh position={[0, -0.4, 1.8]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <coneGeometry args={[0.25, 0.8, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </mesh>
      <mesh position={[0, -0.4, 1.6]} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <coneGeometry args={[0.18, 0.6, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function LandingPad() {
  return (
    <group position={[0, 0, 22]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.5, 9, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 3, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 5.5, 0.04, Math.sin(a) * 5.5]} rotation={[-Math.PI / 2, 0, a]}>
          <planeGeometry args={[3.5, 0.06]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.2} />
        </mesh>
      ))}
      {[-1, 1].map((x) => (
        <group key={x} position={[x * 6, 0, 0]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 5, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Reduced from pointLight to emissive sphere for performance */}
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color={x > 0 ? "#22d3ee" : "#f59e0b"} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
      <ShipModel />
    </group>
  );
}

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameAsset } from "./AssetPipeline";

/**
 * Stage 0: Home Base Scene
 * A high-tech launch hangar environment.
 */
export default function BaseScene() {
  const shipAsset = useGameAsset("player");
  const tunnelRef = useRef<THREE.Group>(null);

  // Animate the launch tunnel rings slightly for a "living" base feel
  useFrame(({ clock }) => {
    if (tunnelRef.current) {
      const t = clock.getElapsedTime();
      tunnelRef.current.rotation.z = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <>
      <color attach="background" args={["#010206"]} />
      <fog attach="fog" args={["#010206", 10, 80]} />

      {/* Main Launch Tunnel */}
      <group ref={tunnelRef} position={[0, 0, -20]}>
        {/* Outer Hull */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[25, 25, 100, 32, 1, true]} />
          <meshStandardMaterial
            color="#080c16"
            side={THREE.BackSide}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Glowing Accelerator Rings */}
        {Array.from({ length: 8 }).map((_, i) => {
          const zOffset = 30 - i * 15;
          return (
            <group key={i} position={[0, 0, zOffset]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[24, 0.4, 16, 64]} />
                <meshStandardMaterial
                  color="#22d3ee"
                  emissive="#06b6d4"
                  emissiveIntensity={2}
                  toneMapped={false}
                />
              </mesh>
              <pointLight distance={40} intensity={20} color="#22d3ee" />
            </group>
          );
        })}
      </group>

      {/* Landing Pad */}
      <group position={[0, -6, 0]}>
        {/* Main Platform */}
        <mesh receiveShadow>
          <cylinderGeometry args={[12, 14, 2, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>

        {/* Hex Grid Decal (using wireframe on a slightly raised plane) */}
        <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[11, 32]} />
          <meshBasicMaterial
            color="#334155"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Safety Edge Ring */}
        <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[11.5, 0.1, 16, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* The Player Ship on the pad */}
      <group position={[0, -3.5, 0]} rotation={[0, Math.PI, 0]}>
        <mesh
          geometry={shipAsset.geometry}
          material={shipAsset.material}
          scale={1.5}
        />
        <pointLight
          position={[0, 4, 0]}
          distance={15}
          intensity={15}
          color="#fbbf24"
        />

        {/* Thruster exhaust glow (idle) */}
        <mesh position={[0, 0, -2.5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Atmospheric / Tech Lights */}
      <ambientLight intensity={0.1} />
      <spotLight
        position={[20, 50, 20]}
        angle={0.3}
        penumbra={1}
        intensity={1.5}
        color="#cbd5e1"
        castShadow
      />

      {/* Scanner laser effect crossing the pad */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[30, 0.05, 0.05]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
      </mesh>
    </>
  );
}

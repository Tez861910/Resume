import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE } from "../utils/colorPalette";
import { useSharedWorldState } from "../world/useSharedWorldState";

interface SkillEntry {
  name: string;
}

interface ClusterDef {
  id: string;
  label: string;
  color: string;
  center: [number, number, number];
  shape: "sphere" | "ring" | "diamond";
  skills: SkillEntry[];
}

const SKILL_CLUSTERS: ClusterDef[] = [
  {
    id: "frontend",
    label: "Frontend",
    color: PALETTE.CYAN,
    center: [-2.8, 1.2, 0.2],
    shape: "ring",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Vite" },
      { name: "Material UI" },
      { name: "Tailwind CSS" },
      { name: "Framer Motion" },
      { name: "Flutter" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: PALETTE.EMERALD,
    center: [2.8, 1.0, -0.2],
    shape: "sphere",
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "REST APIs" },
      { name: "Prisma" },
      { name: "Sequelize" },
    ],
  },
  {
    id: "languages",
    label: "Languages",
    color: PALETTE.AMBER,
    center: [0, 2.8, 0],
    shape: "diamond",
    skills: [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "C#" },
      { name: "Java" },
      { name: "Rust" },
    ],
  },
  {
    id: "desktop",
    label: "Desktop & Mobile",
    color: PALETTE.AMBER_BRIGHT,
    center: [1.4, -1.9, -0.4],
    shape: "diamond",
    skills: [
      { name: ".NET 8" },
      { name: "WinUI / Win2D" },
      { name: "Flutter" },
      { name: "FFI" },
      { name: "MVVM" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    color: PALETTE.CYAN_DIM,
    center: [-2.4, -1.8, 0.3],
    shape: "sphere",
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "SQLite" },
      { name: "Encrypted Storage" },
    ],
  },
  {
    id: "tools",
    label: "Dev Tools",
    color: PALETTE.AMBER_DIM,
    center: [0, -3.0, 0.1],
    shape: "ring",
    skills: [
      { name: "Git" },
      { name: "GitHub Actions" },
      { name: "VS Code" },
      { name: "Release Automation" },
      { name: "Vite" },
    ],
  },
];

const BRIDGES: Array<[string, string]> = [
  ["languages", "frontend"],
  ["languages", "backend"],
  ["frontend", "backend"],
  ["backend", "databases"],
  ["frontend", "tools"],
  ["desktop", "tools"],
  ["languages", "desktop"],
];

function getSkillPositions(
  center: [number, number, number],
  count: number,
  radius = 0.82,
): [number, number, number][] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const yOffset = (index % 2 === 0 ? 0.18 : -0.18) + Math.sin(angle) * 0.18;
    return [
      center[0] + Math.cos(angle) * radius,
      center[1] + yOffset,
      center[2] + Math.sin(angle) * radius * 0.42,
    ];
  });
}

function BackgroundField({
  count,
  opacity,
}: {
  count: number;
  opacity: number;
}) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 18;
      arr[i3 + 1] = (Math.random() - 0.5) * 12;
      arr[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.WHITE}
        size={0.03}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}

function BridgeLines({ opacity }: { opacity: number }) {
  const positions = useMemo(() => {
    const centerMap = new Map<string, [number, number, number]>();
    SKILL_CLUSTERS.forEach((cluster) =>
      centerMap.set(cluster.id, cluster.center),
    );

    const pts: number[] = [];
    BRIDGES.forEach(([from, to]) => {
      const a = centerMap.get(from);
      const b = centerMap.get(to);
      if (!a || !b) return;
      pts.push(...a, ...b);
    });

    return new Float32Array(pts);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={PALETTE.WHITE} transparent opacity={opacity} />
    </lineSegments>
  );
}

function ClusterCore({
  cluster,
  active,
  motionScale,
  onOver,
  onOut,
}: {
  cluster: ClusterDef;
  active: boolean;
  motionScale: number;
  onOver: () => void;
  onOut: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const pulse =
      1 +
      Math.sin(clock.elapsedTime * 1.2 + cluster.center[0]) *
        0.04 *
        motionScale;
    const target = active ? pulse * 1.12 : pulse;
    groupRef.current.scale.x = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      target,
      delta * 5,
    );
    groupRef.current.scale.y = groupRef.current.scale.x;
    groupRef.current.scale.z = groupRef.current.scale.x;
  });

  return (
    <group
      ref={groupRef}
      position={cluster.center}
      onPointerOver={(event) => {
        event.stopPropagation();
        onOver();
      }}
      onPointerOut={onOut}
    >
      {cluster.shape === "sphere" && (
        <>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial
              color={cluster.color}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshBasicMaterial
              color={cluster.color}
              transparent
              opacity={0.08}
            />
          </mesh>
        </>
      )}

      {cluster.shape === "ring" && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.028, 8, 28]} />
            <meshBasicMaterial
              color={cluster.color}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial
              color={cluster.color}
              transparent
              opacity={0.95}
            />
          </mesh>
        </>
      )}

      {cluster.shape === "diamond" && (
        <>
          <mesh rotation={[0.4, 0.2, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial
              color={cluster.color}
              wireframe
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial
              color={cluster.color}
              transparent
              opacity={0.95}
            />
          </mesh>
        </>
      )}

      <Html
        center
        position={[0, 0.42, 0]}
        distanceFactor={8}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            background: "rgba(2,6,23,0.82)",
            border: `1px solid ${cluster.color}44`,
            borderRadius: "999px",
            padding: "4px 10px",
            fontSize: "10px",
            fontWeight: 700,
            color: cluster.color,
            whiteSpace: "nowrap",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {cluster.label}
        </div>
      </Html>
    </group>
  );
}

function SkillNode({
  name,
  position,
  color,
  active,
  onOver,
  onOut,
}: {
  name: string;
  position: [number, number, number];
  color: string;
  active: boolean;
  onOver: () => void;
  onOut: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = active ? 1.35 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(
      meshRef.current.scale.x,
      target,
      delta * 6,
    );
    meshRef.current.scale.y = meshRef.current.scale.x;
    meshRef.current.scale.z = meshRef.current.scale.x;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          onOver();
        }}
        onPointerOut={onOut}
      >
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 1 : 0.72}
        />
      </mesh>

      {active && (
        <Html
          center
          position={[0, 0.24, 0]}
          distanceFactor={8}
          zIndexRange={[200, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              background: "rgba(2,6,23,0.94)",
              border: `1px solid ${color}55`,
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 600,
              color,
              whiteSpace: "nowrap",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

function Cluster({
  cluster,
  hoveredSkill,
  setHoveredSkill,
  motionScale,
}: {
  cluster: ClusterDef;
  hoveredSkill: string | null;
  setHoveredSkill: (value: string | null) => void;
  motionScale: number;
}) {
  const [coreHovered, setCoreHovered] = useState(false);

  const skillPositions = useMemo(
    () => getSkillPositions(cluster.center, cluster.skills.length),
    [cluster],
  );

  const linePositions = useMemo(() => {
    const pts: number[] = [];
    skillPositions.forEach((position) => {
      pts.push(...cluster.center, ...position);
    });
    return new Float32Array(pts);
  }, [cluster.center, skillPositions]);

  return (
    <>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={cluster.color} transparent opacity={0.16} />
      </lineSegments>

      <ClusterCore
        cluster={cluster}
        active={coreHovered}
        motionScale={motionScale}
        onOver={() => setCoreHovered(true)}
        onOut={() => setCoreHovered(false)}
      />

      {cluster.skills.map((skill, index) => {
        const id = `${cluster.id}:${skill.name}`;
        return (
          <SkillNode
            key={id}
            name={skill.name}
            position={skillPositions[index]}
            color={cluster.color}
            active={hoveredSkill === id}
            onOver={() => setHoveredSkill(id)}
            onOut={() => setHoveredSkill(null)}
          />
        );
      })}
    </>
  );
}

function ConstellationScene({
  motionScale,
  starCount,
  starOpacity,
  bridgeOpacity,
  autoRotate,
  autoRotateSpeed,
}: {
  motionScale: number;
  starCount: number;
  starOpacity: number;
  bridgeOpacity: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <BackgroundField count={starCount} opacity={starOpacity} />
      <BridgeLines opacity={bridgeOpacity} />

      {SKILL_CLUSTERS.map((cluster) => (
        <Cluster
          key={cluster.id}
          cluster={cluster}
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
          motionScale={motionScale}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        minPolarAngle={Math.PI / 3.8}
        maxPolarAngle={Math.PI / 1.8}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  );
}

export default function SkillConstellation() {
  const world = useSharedWorldState();

  const isLow = world.capabilityTier === "low";
  const isMedium = world.capabilityTier === "medium";
  const reducedMotion = world.isReducedMotion;

  const starCount = isLow ? 60 : isMedium ? 90 : 140;
  const starOpacity = isLow ? 0.08 : isMedium ? 0.1 : 0.12;
  const bridgeOpacity = isLow ? 0.03 : isMedium ? 0.04 : 0.055;
  const motionScale = reducedMotion ? 0 : isLow ? 0.18 : isMedium ? 0.35 : 0.55;
  const autoRotate = !reducedMotion && !isLow;
  const autoRotateSpeed = isMedium ? 0.12 : 0.18;

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 8.2], fov: 50 }}
      frameloop="demand"
      dpr={isLow ? [1, 1] : isMedium ? [1, 1.1] : [1, 1.25]}
      performance={{ min: 0.8 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "default",
      }}
    >
      <ConstellationScene
        motionScale={motionScale}
        starCount={starCount}
        starOpacity={starOpacity}
        bridgeOpacity={bridgeOpacity}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />
    </Canvas>
  );
}

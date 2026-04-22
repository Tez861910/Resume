import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildGalaxyPositions,
  buildTwoToneColors,
} from "../utils/geometryHelpers";
import { PALETTE } from "../utils/colorPalette";
import type { WorldState } from "../world/useWorldState";

// ─────────────────────────────────────────────────────────────────────────────
// Constants — intentionally small
// ─────────────────────────────────────────────────────────────────────────────

const TRAIL_LENGTH = 18;
const SHIP_ORIGIN: [number, number, number] = [0, 0, 0.5];

type SectionId = "skills" | "experience" | "projects" | "contact" | "about";
type LandmarkShape = "icosahedron" | "octahedron" | "tetrahedron" | "torus";

interface LandmarkDef {
  id: string;
  section: SectionId;
  position: [number, number, number];
  shape: LandmarkShape;
  color: string;
  scale: number;
}

// 5 semantic landmarks — one per section, placed at sane positions
const LANDMARK_DEFS: LandmarkDef[] = [
  {
    id: "skills",
    section: "skills",
    position: [-4.5, 1.8, -3.6],
    shape: "icosahedron",
    color: PALETTE.AMBER,
    scale: 0.44,
  },
  {
    id: "experience",
    section: "experience",
    position: [-2.0, -2.0, -3.0],
    shape: "octahedron",
    color: PALETTE.EMERALD,
    scale: 0.38,
  },
  {
    id: "projects",
    section: "projects",
    position: [4.6, 1.3, -3.7],
    shape: "torus",
    color: PALETTE.CYAN,
    scale: 0.52,
  },
  {
    id: "contact",
    section: "contact",
    position: [3.5, -2.0, -3.2],
    shape: "tetrahedron",
    color: PALETTE.AMBER_BRIGHT,
    scale: 0.4,
  },
  {
    id: "about",
    section: "about",
    position: [0.6, 2.8, -4.4],
    shape: "octahedron",
    color: PALETTE.CYAN_DIM,
    scale: 0.34,
  },
];

// Precomputed static route geometry — never recalculated
const STATIC_ROUTE_PTS = (() => {
  const pts: number[] = [];
  // ship → each landmark
  LANDMARK_DEFS.forEach((def) => {
    pts.push(...SHIP_ORIGIN, ...def.position);
  });
  // landmark–landmark connections (index pairs)
  const pairs: [number, number][] = [
    [0, 2],
    [0, 1],
    [1, 3],
    [2, 3],
    [0, 4],
  ];
  pairs.forEach(([a, b]) => {
    pts.push(...LANDMARK_DEFS[a].position, ...LANDMARK_DEFS[b].position);
  });
  return new Float32Array(pts);
})();

// ─────────────────────────────────────────────────────────────────────────────
// useVisibility — pause canvas when hero is off-screen
// ─────────────────────────────────────────────────────────────────────────────

function useVisibility(sectionId: string) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "0px 0px 200px 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [sectionId]);

  return visible;
}

// ─────────────────────────────────────────────────────────────────────────────
// StarField — static instanced points, no per-frame rotation
// ─────────────────────────────────────────────────────────────────────────────

function StarField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] = (Math.random() - 0.5) * 24;
      arr[i3 + 1] = (Math.random() - 0.5) * 14;
      arr[i3 + 2] = (Math.random() - 0.5) * 10 - 4;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.WHITE}
        size={0.025}
        transparent
        opacity={0.28}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ParticleField — slowly rotating galaxy, stopped when invisible
// ─────────────────────────────────────────────────────────────────────────────

function ParticleField({
  count,
  opacity,
  speed,
  visible,
}: {
  count: number;
  opacity: number;
  speed: number;
  visible: boolean;
}) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(
    () => [
      buildGalaxyPositions(count, 5.8),
      buildTwoToneColors(count, PALETTE.AMBER, PALETTE.CYAN, 0.58),
    ],
    [count],
  );

  useFrame((_, dt) => {
    if (!ref.current || !visible) return;
    ref.current.rotation.y += dt * speed;
    invalidate();
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        vertexColors
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StaticRouteLines — one draw call, never updates
// ─────────────────────────────────────────────────────────────────────────────

function StaticRouteLines({ opacity }: { opacity: number }) {
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_ROUTE_PTS, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={PALETTE.WHITE} transparent opacity={opacity} />
    </lineSegments>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LandmarkMesh — static geometry, no Float/animation, minimal draw
// ─────────────────────────────────────────────────────────────────────────────

function LandmarkMesh({ def }: { def: LandmarkDef }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const t = useRef(Math.random() * 100);

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    t.current += dt;
    // Gentle Y float only — no rotation, minimal CPU cost
    meshRef.current.position.y =
      def.position[1] + Math.sin(t.current * 0.45) * 0.08;
  });

  return (
    <group position={def.position}>
      <mesh ref={meshRef}>
        {def.shape === "icosahedron" && (
          <icosahedronGeometry args={[def.scale, 1]} />
        )}
        {def.shape === "torus" && (
          <torusGeometry args={[def.scale, def.scale * 0.22, 6, 14]} />
        )}
        {def.shape === "octahedron" && (
          <octahedronGeometry args={[def.scale, 0]} />
        )}
        {def.shape === "tetrahedron" && (
          <tetrahedronGeometry args={[def.scale, 0]} />
        )}
        <meshBasicMaterial
          color={def.color}
          wireframe
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* Core beacon dot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[def.scale * 0.11, 8, 8]} />
        <meshBasicMaterial color={def.color} transparent opacity={0.88} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BeaconNodes — pulsing instanced spheres at landmark positions
// ─────────────────────────────────────────────────────────────────────────────

function BeaconNodes({
  pulseScale,
  shipPos,
}: {
  pulseScale: number;
  shipPos: React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((node, i) => {
      const def = LANDMARK_DEFS[i];
      const pulse = 1 + Math.sin(t * 1.1 + i * 0.85) * 0.08 * pulseScale;
      const dx = shipPos.current.x - def.position[0];
      const dy = shipPos.current.y - def.position[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const boost = dist < 2.2 ? (1 - dist / 2.2) * 0.3 * pulseScale : 0;
      node.scale.setScalar(pulse + boost);
    });
  });

  return (
    <group ref={groupRef}>
      {LANDMARK_DEFS.map((def) => (
        <mesh key={def.id} position={def.position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={def.color} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ShipTrail — short trail, minimal buffer updates
// ─────────────────────────────────────────────────────────────────────────────

function ShipTrail({
  shipPos,
  opacity,
}: {
  shipPos: React.MutableRefObject<THREE.Vector3>;
  opacity: number;
}) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const buf = useRef(new Float32Array(TRAIL_LENGTH * 3));

  useFrame(() => {
    const arr = buf.current;
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      arr[i * 3] = arr[(i - 1) * 3];
      arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
      arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
    }
    arr[0] = shipPos.current.x;
    arr[1] = shipPos.current.y - 0.18;
    arr[2] = shipPos.current.z;
    if (attrRef.current) attrRef.current.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          args={[buf.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={PALETTE.CYAN}
        size={0.012}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MiniShip — simplified geometry, same controls
// ─────────────────────────────────────────────────────────────────────────────

function MiniShip({
  shipPos,
}: {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const mouse = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const keys = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") keys.current.up = true;
      if (k === "arrowdown" || k === "s") keys.current.down = true;
      if (k === "arrowleft" || k === "a") keys.current.left = true;
      if (k === "arrowright" || k === "d") keys.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") keys.current.up = false;
      if (k === "arrowdown" || k === "s") keys.current.down = false;
      if (k === "arrowleft" || k === "a") keys.current.left = false;
      if (k === "arrowright" || k === "d") keys.current.right = false;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, dt) => {
    const ship = groupRef.current;
    if (!ship) return;

    const accel = 4.2 * dt;
    if (keys.current.right) vel.current.x += accel;
    if (keys.current.left) vel.current.x -= accel;
    if (keys.current.up) vel.current.y += accel;
    if (keys.current.down) vel.current.y -= accel;
    vel.current.x *= 0.88;
    vel.current.y *= 0.88;

    const tx = mouse.current.x * 4.0;
    const ty = mouse.current.y * 2.1;
    const prevX = ship.position.x;
    ship.position.x += (tx - ship.position.x) * 0.05 + vel.current.x;
    ship.position.y += (ty - ship.position.y) * 0.05 + vel.current.y;
    ship.position.z = 0.5;
    ship.position.x = Math.max(-4.8, Math.min(4.8, ship.position.x));
    ship.position.y = Math.max(-2.5, Math.min(2.5, ship.position.y));

    const vx = ship.position.x - prevX;
    ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, -vx * 9, 0.1);
    ship.rotation.x = THREE.MathUtils.lerp(
      ship.rotation.x,
      vel.current.y * 1.8,
      0.08,
    );

    shipPos.current.copy(ship.position);
    invalidate();
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/* Fuselage */}
      <mesh>
        <cylinderGeometry args={[0.022, 0.052, 0.28, 5]} />
        <meshBasicMaterial color={PALETTE.AMBER} wireframe />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.19, 0]}>
        <coneGeometry args={[0.022, 0.1, 5]} />
        <meshBasicMaterial color={PALETTE.AMBER_BRIGHT} wireframe />
      </mesh>
      {/* Left wing */}
      <mesh position={[-0.12, -0.04, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.14, 0.03, 0.01]} />
        <meshBasicMaterial color={PALETTE.AMBER_DIM} wireframe />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.12, -0.04, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.14, 0.03, 0.01]} />
        <meshBasicMaterial color={PALETTE.AMBER_DIM} wireframe />
      </mesh>
      {/* Engine */}
      <mesh position={[0, -0.17, 0]}>
        <sphereGeometry args={[0.022, 7, 7]} />
        <meshBasicMaterial color={PALETTE.CYAN} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CameraMouseParallax — only runs on mouse move via invalidate, not every frame
// ─────────────────────────────────────────────────────────────────────────────

function CameraMouseParallax({
  strength,
  visible,
}: {
  strength: number;
  visible: boolean;
}) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!visible) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * strength;
      target.current.y =
        -(e.clientY / window.innerHeight - 0.5) * strength * 0.5;
      invalidate();
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength, visible]);

  useFrame((_, dt) => {
    const lf = 0.03;
    current.current.x +=
      (target.current.x - current.current.x) * Math.min(1, (lf / dt) * dt);
    current.current.y +=
      (target.current.y - current.current.y) * Math.min(1, (lf / dt) * dt);
    camera.position.x = current.current.x;
    camera.position.y = current.current.y;
  });

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// VisibilityGate — stops R3F frame loop when hero is off-screen
// ─────────────────────────────────────────────────────────────────────────────

function VisibilityGate({ visible }: { visible: boolean }) {
  const { gl, scene, camera } = useThree();
  const prevVisible = useRef(visible);

  useEffect(() => {
    if (!visible && prevVisible.current) {
      // Force one last render to clear then stop
      gl.render(scene, camera);
    }
    prevVisible.current = visible;
  }, [visible, gl, scene, camera]);

  // When becoming visible, request new frame
  useEffect(() => {
    if (visible) invalidate();
  }, [visible]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene — root composite
// ─────────────────────────────────────────────────────────────────────────────

interface SceneProps {
  particleCount: number;
  starCount: number;
  world: WorldState;
  visible: boolean;
}

function Scene({ particleCount, starCount, world, visible }: SceneProps) {
  const shipPos = useRef(new THREE.Vector3(...SHIP_ORIGIN));

  const isLow = world.capabilityTier === "low";
  const isMedium = world.capabilityTier === "medium";
  const reducedMotion = world.isReducedMotion;

  const particleOpacity = reducedMotion
    ? 0.18
    : isLow
      ? 0.22
      : isMedium
        ? 0.32
        : 0.45;
  const particleSpeed = reducedMotion
    ? 0
    : isLow
      ? 0.006
      : isMedium
        ? 0.012
        : 0.018;
  const routeOpacity = isLow ? 0.032 : isMedium ? 0.05 : 0.068;
  const pulseScale = reducedMotion ? 0 : isLow ? 0.3 : isMedium ? 0.6 : 1;
  const trailOpacity = reducedMotion
    ? 0
    : isLow
      ? 0.14
      : isMedium
        ? 0.28
        : 0.42;
  const parallaxStrength = reducedMotion
    ? 0
    : isLow
      ? 0.1
      : isMedium
        ? 0.16
        : 0.22;
  const showTrail = !isLow && !reducedMotion;

  return (
    <>
      <VisibilityGate visible={visible} />
      <color attach="background" args={["#020617"]} />

      <StarField count={starCount} />

      <ParticleField
        count={particleCount}
        opacity={particleOpacity}
        speed={particleSpeed}
        visible={visible}
      />

      <StaticRouteLines opacity={routeOpacity} />

      {LANDMARK_DEFS.map((def) => (
        <LandmarkMesh key={def.id} def={def} />
      ))}

      <BeaconNodes pulseScale={pulseScale} shipPos={shipPos} />

      {showTrail && <ShipTrail shipPos={shipPos} opacity={trailOpacity} />}

      <MiniShip shipPos={shipPos} />

      <CameraMouseParallax strength={parallaxStrength} visible={visible} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroScene — public export with visibility-aware canvas
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroScene({ world }: { world: WorldState }) {
  const heroVisible = useVisibility("home");

  const isLow = world.capabilityTier === "low";
  const isMedium = world.capabilityTier === "medium";
  const reducedMotion = world.isReducedMotion;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const particleCount = reducedMotion
    ? 80
    : isLow
      ? 120
      : isMobile || isMedium
        ? 280
        : 620;

  const starCount = reducedMotion ? 0 : isLow ? 40 : isMedium ? 80 : 140;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      // demand = only renders when invalidate() is called
      frameloop="demand"
      dpr={isLow ? [1, 1] : isMedium ? [1, 1.1] : [1, 1.4]}
      performance={{ min: 0.8 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "default",
        stencil: false,
        depth: true,
      }}
    >
      <Scene
        particleCount={particleCount}
        starCount={starCount}
        world={world}
        visible={heroVisible}
      />
    </Canvas>
  );
}

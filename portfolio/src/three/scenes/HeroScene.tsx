import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  buildGalaxyPositions,
  buildTwoToneColors,
} from "../utils/geometryHelpers";
import { PALETTE } from "../utils/colorPalette";
import CameraParallax from "../hooks/CameraParallax";
import type { WorldState } from "../world/useWorldState";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TRAIL_LENGTH = 28;

type LandmarkShape = "icosahedron" | "torus" | "octahedron" | "tetrahedron";

type SectionId = "skills" | "experience" | "projects" | "contact" | "about";

interface LandmarkDef {
  id: string;
  label: string;
  section: SectionId;
  position: [number, number, number];
  shape: LandmarkShape;
  color: string;
  scale: number;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  nodeRadius?: number;
}

const LANDMARK_DEFS: LandmarkDef[] = [
  {
    id: "skills-core",
    label: "Skills",
    section: "skills",
    position: [-4.8, 1.9, -3.8],
    shape: "icosahedron",
    color: PALETTE.AMBER,
    scale: 0.52,
    speed: 0.7,
    rotationIntensity: 0.7,
    floatIntensity: 0.35,
    nodeRadius: 0.11,
  },
  {
    id: "experience-route",
    label: "Experience",
    section: "experience",
    position: [-2.2, -2.1, -3.2],
    shape: "octahedron",
    color: PALETTE.EMERALD,
    scale: 0.48,
    speed: 0.6,
    rotationIntensity: 0.55,
    floatIntensity: 0.28,
    nodeRadius: 0.1,
  },
  {
    id: "projects-sector",
    label: "Projects",
    section: "projects",
    position: [4.9, 1.4, -3.9],
    shape: "torus",
    color: PALETTE.CYAN,
    scale: 0.62,
    speed: 0.75,
    rotationIntensity: 0.8,
    floatIntensity: 0.34,
    nodeRadius: 0.11,
  },
  {
    id: "contact-beacon",
    label: "Contact",
    section: "contact",
    position: [3.8, -2.2, -3.4],
    shape: "tetrahedron",
    color: PALETTE.AMBER_BRIGHT,
    scale: 0.5,
    speed: 0.55,
    rotationIntensity: 0.5,
    floatIntensity: 0.24,
    nodeRadius: 0.1,
  },
  {
    id: "about-signal",
    label: "About",
    section: "about",
    position: [0.8, 3.0, -4.6],
    shape: "octahedron",
    color: PALETTE.CYAN_DIM,
    scale: 0.42,
    speed: 0.45,
    rotationIntensity: 0.45,
    floatIntensity: 0.2,
    nodeRadius: 0.09,
  },
];

const SHIP_ORIGIN: [number, number, number] = [0, 0, 0.5];

const ROUTE_CONNECTIONS: Array<[number, number]> = [
  [-1, 0],
  [0, 4],
  [4, 2],
  [0, 1],
  [1, 3],
  [2, 3],
];

// ─────────────────────────────────────────────────────────────────────────────
// Particle Field — galaxy-shaped, slowly rotates
// ─────────────────────────────────────────────────────────────────────────────

function ParticleField({
  count,
  opacity,
  rotationSpeed,
}: {
  count: number;
  opacity: number;
  rotationSpeed: number;
}) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(
    () => [
      buildGalaxyPositions(count, 6.2),
      buildTwoToneColors(count, PALETTE.AMBER, PALETTE.CYAN, 0.58),
    ],
    [count],
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * rotationSpeed;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
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
// Semantic landmarks — section destinations in the launch map
// ─────────────────────────────────────────────────────────────────────────────

function LandmarkMesh({
  def,
  motionScale,
}: {
  def: LandmarkDef;
  motionScale: number;
}) {
  const {
    position,
    shape,
    color,
    scale,
    speed = 0.6,
    rotationIntensity = 0.7,
    floatIntensity = 0.3,
  } = def;

  return (
    <Float
      speed={speed * motionScale}
      rotationIntensity={rotationIntensity * motionScale}
      floatIntensity={floatIntensity * motionScale}
    >
      <group position={position}>
        <mesh>
          {shape === "icosahedron" && <icosahedronGeometry args={[scale, 1]} />}
          {shape === "torus" && (
            <torusGeometry args={[scale, scale * 0.22, 8, 18]} />
          )}
          {shape === "octahedron" && <octahedronGeometry args={[scale, 0]} />}
          {shape === "tetrahedron" && <tetrahedronGeometry args={[scale, 0]} />}
          <meshBasicMaterial
            color={color}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[scale * 0.12, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

interface RouteLinesProps {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}

function RouteLines({
  shipPos,
  staticOpacity,
  dynamicOpacity,
}: RouteLinesProps & {
  staticOpacity: number;
  dynamicOpacity: number;
}) {
  const routeRef = useRef<THREE.BufferAttribute>(null!);
  const launchRef = useRef<THREE.BufferAttribute>(null!);

  const staticRoutes = useMemo(() => {
    const pts: number[] = [];
    ROUTE_CONNECTIONS.forEach(([from, to]) => {
      const a = from === -1 ? SHIP_ORIGIN : LANDMARK_DEFS[from].position;
      const b = LANDMARK_DEFS[to].position;
      pts.push(...a, ...b);
    });
    return new Float32Array(pts);
  }, []);

  const dynamicLaunch = useRef(new Float32Array(LANDMARK_DEFS.length * 6));

  useFrame(() => {
    const arr = dynamicLaunch.current;
    LANDMARK_DEFS.forEach((landmark, i) => {
      const base = i * 6;
      arr[base] = shipPos.current.x;
      arr[base + 1] = shipPos.current.y;
      arr[base + 2] = shipPos.current.z;
      arr[base + 3] = landmark.position[0];
      arr[base + 4] = landmark.position[1];
      arr[base + 5] = landmark.position[2];
    });

    if (launchRef.current) launchRef.current.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={routeRef}
            attach="attributes-position"
            args={[staticRoutes, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALETTE.WHITE}
          transparent
          opacity={staticOpacity}
        />
      </lineSegments>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            ref={launchRef}
            attach="attributes-position"
            args={[dynamicLaunch.current, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALETTE.CYAN}
          transparent
          opacity={dynamicOpacity}
        />
      </lineSegments>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Story Nodes — semantic beacons for each destination
// They pulse continuously and flare when the ship gets within 2.5 units (XY).
// ─────────────────────────────────────────────────────────────────────────────

interface StoryNodesProps {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}

function StoryNodes({
  shipPos,
  pulseScale,
}: StoryNodesProps & { pulseScale: number }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    groupRef.current.children.forEach((node, i) => {
      const def = LANDMARK_DEFS[i];
      const basePulse = 1 + Math.sin(t * 1.2 + i * 0.9) * (0.1 * pulseScale);

      const dx = shipPos.current.x - def.position[0];
      const dy = shipPos.current.y - def.position[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximityBoost =
        dist < 2.4 ? (1 - dist / 2.4) * (0.45 * pulseScale) : 0;

      node.scale.setScalar(basePulse + proximityBoost);
    });
  });

  return (
    <group ref={groupRef}>
      {LANDMARK_DEFS.map((def) => (
        <mesh key={def.id} position={def.position}>
          <sphereGeometry args={[def.nodeRadius ?? 0.1, 10, 10]} />
          <meshBasicMaterial color={def.color} />
        </mesh>
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ship Trail — cyan comet tail behind the engine
// ─────────────────────────────────────────────────────────────────────────────

interface ShipTrailProps {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}

function ShipTrail({
  shipPos,
  opacity,
  size,
}: ShipTrailProps & {
  opacity: number;
  size: number;
}) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const trailArr = useRef(new Float32Array(TRAIL_LENGTH * 3));

  useFrame(() => {
    const arr = trailArr.current;

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
          args={[trailArr.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={PALETTE.CYAN}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini Ship — wireframe rocket that follows the mouse
//             W / A / S / D  (or arrow keys) add velocity boosts on top
// ─────────────────────────────────────────────────────────────────────────────

interface MiniShipProps {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}

function MiniShip({ shipPos }: MiniShipProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const mousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const keys = useRef({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs
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

    // ── Keyboard additive velocity (decays each frame) ──────────────────
    const accel = 4.5 * dt;
    if (keys.current.right) velocity.current.x += accel;
    if (keys.current.left) velocity.current.x -= accel;
    if (keys.current.up) velocity.current.y += accel;
    if (keys.current.down) velocity.current.y -= accel;

    velocity.current.x *= 0.86;
    velocity.current.y *= 0.86;

    // ── Mouse target position (world-space) ─────────────────────────────
    const tx = mousePos.current.x * 4.2;
    const ty = mousePos.current.y * 2.2;

    // ── Move ship: lerp toward mouse + add keyboard velocity ─────────────
    const prevX = ship.position.x;
    ship.position.x += (tx - ship.position.x) * 0.055 + velocity.current.x;
    ship.position.y += (ty - ship.position.y) * 0.055 + velocity.current.y;
    ship.position.z = 0.5;

    // ── Clamp to frustum bounds ──────────────────────────────────────────
    ship.position.x = Math.max(-5.0, Math.min(5.0, ship.position.x));
    ship.position.y = Math.max(-2.6, Math.min(2.6, ship.position.y));

    // ── Banking & pitch based on velocity ────────────────────────────────
    const vx = ship.position.x - prevX;
    ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, -vx * 10, 0.12);
    ship.rotation.x = THREE.MathUtils.lerp(
      ship.rotation.x,
      velocity.current.y * 2,
      0.1,
    );

    // ── Expose position to trail & story nodes ───────────────────────────
    shipPos.current.copy(ship.position);
  });

  // ── Mesh: classic rocket silhouette, all wireframe ──────────────────────
  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/* Fuselage */}
      <mesh>
        <cylinderGeometry args={[0.022, 0.055, 0.3, 6]} />
        <meshBasicMaterial color={PALETTE.AMBER} wireframe />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.022, 0.11, 6]} />
        <meshBasicMaterial color={PALETTE.AMBER_BRIGHT} wireframe />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.14, -0.04, 0]} rotation={[0, 0, -0.28]}>
        <boxGeometry args={[0.16, 0.035, 0.012]} />
        <meshBasicMaterial color={PALETTE.AMBER_DIM} wireframe />
      </mesh>

      {/* Right wing */}
      <mesh position={[0.14, -0.04, 0]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[0.16, 0.035, 0.012]} />
        <meshBasicMaterial color={PALETTE.AMBER_DIM} wireframe />
      </mesh>

      {/* Engine core — bright cyan so it triggers Bloom */}
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={PALETTE.CYAN} />
      </mesh>

      {/* Engine outer glow halo */}
      <mesh position={[0, -0.18, 0]}>
        <sphereGeometry args={[0.042, 6, 6]} />
        <meshBasicMaterial color={PALETTE.CYAN} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene root — composes every element with a shared ship-position ref
// ─────────────────────────────────────────────────────────────────────────────

function Scene({
  particleCount,
  world,
}: {
  particleCount: number;
  world: WorldState;
}) {
  const shipPos = useRef(new THREE.Vector3(...SHIP_ORIGIN));

  const isLow = world.capabilityTier === "low";
  const isMedium = world.capabilityTier === "medium";
  const reducedMotion = world.isReducedMotion;

  const starCount = isLow ? 220 : isMedium ? 420 : 700;
  const starFactor = isLow ? 1.8 : isMedium ? 2.2 : 2.6;
  const starSpeed = reducedMotion ? 0 : isLow ? 0.08 : isMedium ? 0.18 : 0.3;
  const particleOpacity = reducedMotion
    ? 0.22
    : isLow
      ? 0.28
      : isMedium
        ? 0.38
        : 0.52;
  const particleRotationSpeed = reducedMotion
    ? 0
    : isLow
      ? 0.008
      : isMedium
        ? 0.016
        : 0.025;
  const landmarkMotionScale = reducedMotion
    ? 0
    : isLow
      ? 0.35
      : isMedium
        ? 0.65
        : 1;
  const routeStaticOpacity = isLow ? 0.04 : isMedium ? 0.06 : 0.08;
  const routeDynamicOpacity = reducedMotion
    ? 0
    : isLow
      ? 0.025
      : isMedium
        ? 0.04
        : 0.06;
  const pulseScale = reducedMotion ? 0.2 : isLow ? 0.45 : isMedium ? 0.7 : 1;
  const trailOpacity = reducedMotion ? 0 : isLow ? 0.18 : isMedium ? 0.32 : 0.5;
  const trailSize = isLow ? 0.01 : isMedium ? 0.012 : 0.014;
  const bloomEnabled = !reducedMotion && !isLow;
  const bloomIntensity = isMedium ? 0.45 : 0.72;
  const bloomThreshold = isMedium ? 0.32 : 0.28;
  const parallaxStrength = reducedMotion
    ? 0.08
    : isLow
      ? 0.12
      : isMedium
        ? 0.18
        : 0.24;
  const parallaxVerticalStrength = reducedMotion
    ? 0.04
    : isLow
      ? 0.06
      : isMedium
        ? 0.09
        : 0.12;

  return (
    <>
      <color attach="background" args={["#020617"]} />

      <Stars
        radius={80}
        depth={50}
        count={starCount}
        factor={starFactor}
        fade
        speed={starSpeed}
      />

      <ParticleField
        count={particleCount}
        opacity={particleOpacity}
        rotationSpeed={particleRotationSpeed}
      />

      <RouteLines
        shipPos={shipPos}
        staticOpacity={routeStaticOpacity}
        dynamicOpacity={routeDynamicOpacity}
      />

      {LANDMARK_DEFS.map((def) => (
        <LandmarkMesh
          key={def.id}
          def={def}
          motionScale={landmarkMotionScale}
        />
      ))}

      <StoryNodes shipPos={shipPos} pulseScale={pulseScale} />

      <ShipTrail shipPos={shipPos} opacity={trailOpacity} size={trailSize} />

      <MiniShip shipPos={shipPos} />

      <CameraParallax
        strength={parallaxStrength}
        verticalStrength={parallaxVerticalStrength}
        lerpFactor={0.028}
      />

      <AdaptiveDpr pixelated />

      <EffectComposer enabled={bloomEnabled}>
        <Bloom
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.92}
          intensity={bloomIntensity}
          mipmapBlur={!isMedium}
        />
      </EffectComposer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroScene({ world }: { world: WorldState }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isLow = world.capabilityTier === "low";
  const isMedium = world.capabilityTier === "medium";
  const reducedMotion = world.isReducedMotion;

  const particleCount = reducedMotion
    ? 120
    : isLow
      ? 180
      : isMobile || isMedium
        ? 420
        : 1100;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      frameloop="always"
      dpr={isLow ? [1, 1] : isMedium ? [1, 1.25] : [1, 1.6]}
      performance={{ min: isLow ? 0.75 : 0.6 }}
      gl={{
        antialias: !isLow,
        alpha: false,
        powerPreference: isLow ? "default" : "high-performance",
      }}
    >
      <Scene particleCount={particleCount} world={world} />
    </Canvas>
  );
}

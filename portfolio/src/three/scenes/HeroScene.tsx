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

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TRAIL_LENGTH = 32;

type GlyphShape = "icosahedron" | "torus" | "octahedron" | "tetrahedron";

interface GlyphDef {
  position: [number, number, number];
  shape: GlyphShape;
  color: string;
  scale: number;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
}

/** 8 wireframe glyphs spread across the view frustum */
const GLYPH_DEFS: GlyphDef[] = [
  {
    position: [-5.0, 1.5, -2.0],
    shape: "icosahedron",
    color: PALETTE.AMBER,
    scale: 0.7,
    speed: 1.0,
  },
  {
    position: [5.2, -1.0, -3.0],
    shape: "torus",
    color: PALETTE.CYAN,
    scale: 0.75,
    speed: 1.2,
  },
  {
    position: [-4.0, -2.0, -1.5],
    shape: "octahedron",
    color: PALETTE.AMBER_BRIGHT,
    scale: 0.5,
    speed: 0.9,
  },
  {
    position: [4.0, 2.2, -2.5],
    shape: "tetrahedron",
    color: PALETTE.CYAN,
    scale: 0.6,
    speed: 0.8,
    rotationIntensity: 2.0,
  },
  {
    position: [1.5, 3.0, -4.0],
    shape: "icosahedron",
    color: PALETTE.AMBER_DIM,
    scale: 0.4,
    speed: 1.5,
  },
  {
    position: [-2.0, -3.0, -2.0],
    shape: "octahedron",
    color: PALETTE.CYAN_DIM,
    scale: 0.65,
    speed: 1.1,
  },
  {
    position: [6.5, 0.2, -4.0],
    shape: "torus",
    color: PALETTE.AMBER,
    scale: 0.5,
    speed: 0.7,
  },
  {
    position: [-6.0, 0.8, -5.0],
    shape: "tetrahedron",
    color: PALETTE.CYAN,
    scale: 0.55,
    speed: 1.3,
  },
];

interface StoryNodeDef {
  pos: [number, number, number];
  color: string;
}

/**
 * Six glowing nodes placed at the far edges of the scene — one per skill domain.
 * They pulse and brighten when the player's ship drifts near them, turning the
 * hero background into a living map of Tejas's tech universe.
 */
const STORY_NODE_DEFS: StoryNodeDef[] = [
  { pos: [-5.5, 2.0, -4.5], color: PALETTE.AMBER }, // Languages
  { pos: [5.5, 1.5, -4.0], color: PALETTE.CYAN }, // Frontend
  { pos: [-4.5, -1.5, -3.5], color: PALETTE.EMERALD }, // Backend
  { pos: [4.5, -2.0, -4.0], color: PALETTE.AMBER_BRIGHT }, // Desktop / 3D
  { pos: [0.5, 3.5, -5.0], color: PALETTE.CYAN_DIM }, // Databases
  { pos: [1.5, -3.5, -3.5], color: PALETTE.AMBER_DIM }, // Tools
];

// ─────────────────────────────────────────────────────────────────────────────
// Particle Field — galaxy-shaped, slowly rotates
// ─────────────────────────────────────────────────────────────────────────────

function ParticleField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(
    () => [
      buildGalaxyPositions(count),
      buildTwoToneColors(count, PALETTE.AMBER, PALETTE.CYAN, 0.65),
    ],
    [count],
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Floating wireframe glyphs — "building blocks of technology"
// ─────────────────────────────────────────────────────────────────────────────

function GlyphMesh({ def }: { def: GlyphDef }) {
  const {
    position,
    shape,
    color,
    scale,
    speed = 1.0,
    rotationIntensity = 1.2,
    floatIntensity = 0.8,
  } = def;
  return (
    <Float
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
    >
      <mesh position={position}>
        {shape === "icosahedron" && <icosahedronGeometry args={[scale, 1]} />}
        {shape === "torus" && (
          <torusGeometry args={[scale, scale * 0.28, 8, 20]} />
        )}
        {shape === "octahedron" && <octahedronGeometry args={[scale, 0]} />}
        {shape === "tetrahedron" && <tetrahedronGeometry args={[scale, 0]} />}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.68} />
      </mesh>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Story Nodes — six skill-domain beacons
// They pulse continuously and flare when the ship gets within 2.5 units (XY).
// ─────────────────────────────────────────────────────────────────────────────

interface StoryNodesProps {
  shipPos: React.MutableRefObject<THREE.Vector3>;
}

function StoryNodes({ shipPos }: StoryNodesProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    groupRef.current.children.forEach((node, i) => {
      const def = STORY_NODE_DEFS[i];
      const basePulse = 1 + Math.sin(t * 1.5 + i * 1.1) * 0.12;

      // 2-D (XY) proximity — the ship lives on the z ≈ 0.5 plane
      const dx = shipPos.current.x - def.pos[0];
      const dy = shipPos.current.y - def.pos[1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximityBoost = dist < 2.5 ? (1 - dist / 2.5) * 0.6 : 0;

      node.scale.setScalar(basePulse + proximityBoost);
    });
  });

  return (
    <group ref={groupRef}>
      {STORY_NODE_DEFS.map((def, i) => (
        <mesh key={i} position={def.pos}>
          <sphereGeometry args={[0.09, 12, 12]} />
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

function ShipTrail({ shipPos }: ShipTrailProps) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const trailArr = useRef(new Float32Array(TRAIL_LENGTH * 3)); // all zeros initially

  useFrame(() => {
    const arr = trailArr.current;

    // Shift every stored position one slot back
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      arr[i * 3] = arr[(i - 1) * 3];
      arr[i * 3 + 1] = arr[(i - 1) * 3 + 1];
      arr[i * 3 + 2] = arr[(i - 1) * 3 + 2];
    }

    // Insert the current engine position at the front
    arr[0] = shipPos.current.x;
    arr[1] = shipPos.current.y - 0.18; // engine sits below the fuselage centre
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
        size={0.018}
        color={PALETTE.CYAN}
        transparent
        opacity={0.7}
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

function Scene({ particleCount }: { particleCount: number }) {
  // Shared mutable ref — MiniShip writes, ShipTrail + StoryNodes read
  const shipPos = useRef(new THREE.Vector3());

  return (
    <>
      {/* Opaque dark background — avoids alpha/bloom compositing issues */}
      <color attach="background" args={["#020617"]} />

      {/* Deep star field behind everything else */}
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.4} />

      {/* Galaxy particle cloud */}
      <ParticleField count={particleCount} />

      {/* Floating wireframe geometry */}
      {GLYPH_DEFS.map((def, i) => (
        <GlyphMesh key={i} def={def} />
      ))}

      {/* Career-domain beacons */}
      <StoryNodes shipPos={shipPos} />

      {/* Comet trail — renders BEFORE ship so it appears behind */}
      <ShipTrail shipPos={shipPos} />

      {/* Interactive wireframe rocket */}
      <MiniShip shipPos={shipPos} />

      {/* Gentle mouse-driven parallax on the camera */}
      <CameraParallax
        strength={0.3}
        verticalStrength={0.15}
        lerpFactor={0.03}
      />

      {/* Auto-reduce pixel ratio when GPU is under load */}
      <AdaptiveDpr pixelated />

      {/* Bloom — glows particles, glyphs, engine, and story nodes */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 500 : 2000;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      frameloop="always"
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <Scene particleCount={particleCount} />
    </Canvas>
  );
}

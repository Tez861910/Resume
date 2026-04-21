import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { PALETTE } from "../utils/colorPalette";

// ─────────────────────────────────────────────────────────────────────────────
// Career path — control points that form the camera's journey
// ─────────────────────────────────────────────────────────────────────────────

const RAW_PATH_POINTS = [
  [-12, -1.5, 3],
  [-7, 2.0, -2],
  [-2, 0.5, -6], // ← BCA education milestone
  [2, -1.0, -4],
  [6, 1.5, -1], // ← ODU volunteer milestone
  [10, 0.2, 2], // ← Printalytix milestone
  [14, 1.0, 4],
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Milestone definitions
// ─────────────────────────────────────────────────────────────────────────────

const MILESTONES = [
  {
    label: "BCA — Computer Science",
    company: "Bengaluru North University",
    period: "2018 – 2024",
    t: 0.25,
    pos: new THREE.Vector3(-2, 0.5, -6),
    color: PALETTE.EMERALD,
  },
  {
    label: "Volunteer · Full-Stack Dev",
    company: "Old Dominion University",
    period: "Oct 2023 – Jan 2024",
    t: 0.52,
    pos: new THREE.Vector3(6, 1.5, -1),
    color: PALETTE.CYAN,
  },
  {
    label: "Software Engineer",
    company: "Printalytix",
    period: "Dec 2024 – Dec 2025",
    t: 0.78,
    pos: new THREE.Vector3(10, 0.2, 2),
    color: PALETTE.AMBER,
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Milestone marker
// ─────────────────────────────────────────────────────────────────────────────

interface MilestoneMarkerProps {
  pos: THREE.Vector3;
  color: string;
  active: boolean;
  phase: number; // unique phase offset for pulse
}

function MilestoneMarker({ pos, color, active, phase }: MilestoneMarkerProps) {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const beamRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.2 + phase) * 0.1;

    const targetOuter = active ? pulse * 1.6 : pulse;
    const targetInner = active ? 1.4 : 1.0;

    outerRef.current.scale.setScalar(
      THREE.MathUtils.lerp(outerRef.current.scale.x, targetOuter, 0.06),
    );
    innerRef.current.scale.setScalar(
      THREE.MathUtils.lerp(innerRef.current.scale.x, targetInner, 0.06),
    );

    if (beamRef.current) {
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity =
        THREE.MathUtils.lerp(
          (beamRef.current.material as THREE.MeshBasicMaterial).opacity,
          active ? 0.35 : 0,
          0.05,
        );
    }
  });

  return (
    <group position={pos}>
      {/* Outer torus ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[0.38, 0.035, 8, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.9 : 0.45}
        />
      </mesh>

      {/* Core sphere */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Vertical beacon beam */}
      <mesh ref={beamRef} position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 4.8, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0} />
      </mesh>

      {/* Secondary inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 6, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active ? 0.55 : 0.2}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Drifting ambient particles along the path
// ─────────────────────────────────────────────────────────────────────────────

function AmbientDrift() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 320;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={PALETTE.AMBER}
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Path tube — the visible career-journey line
// ─────────────────────────────────────────────────────────────────────────────

function CareerPath({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const positions = useMemo(() => {
    const pts = curve.getPoints(180);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [curve]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={PALETTE.AMBER} transparent opacity={0.38} />
    </line>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene content — camera driver + scene objects
// ─────────────────────────────────────────────────────────────────────────────

interface SceneContentProps {
  progressRef: React.MutableRefObject<number>;
}

function SceneContent({ progressRef }: SceneContentProps) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        RAW_PATH_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      ),
    [],
  );

  // Reusable vectors — created once, never recreated
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const lookPos = useMemo(() => new THREE.Vector3(), []);

  // Track which milestone is nearest to current scroll position
  const activeMilestone = useRef<number>(-1);

  useFrame(({ camera }) => {
    const raw = progressRef.current;
    // Drive camera along 0→88 % of the curve (leave end as reveal)
    const t = Math.max(0, Math.min(raw * 0.88, 0.88));

    curve.getPoint(t, camPos);
    curve.getPoint(Math.min(t + 0.055, 1), lookPos);

    camera.position.lerp(camPos, 0.045);
    camera.lookAt(lookPos);

    // Determine active milestone
    let best = -1;
    let bestDist = Infinity;
    MILESTONES.forEach((ms, i) => {
      const d = Math.abs(raw - ms.t);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    activeMilestone.current = bestDist < 0.14 ? best : -1;
  });

  return (
    <>
      <color attach="background" args={["#020617"]} />

      <Stars
        radius={90}
        depth={60}
        count={900}
        factor={2.8}
        fade
        speed={0.25}
      />

      <AmbientDrift />
      <CareerPath curve={curve} />

      {MILESTONES.map((ms, i) => (
        <MilestoneMarker
          key={ms.label}
          pos={ms.pos}
          color={ms.color}
          active={activeMilestone.current === i}
          phase={i * 2.1}
        />
      ))}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.12}
          luminanceSmoothing={0.88}
          intensity={1.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineSceneProps {
  progressRef: React.MutableRefObject<number>;
}

export default function TimelineScene({ progressRef }: TimelineSceneProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      /*
        Initial camera position = first point on the career path.
        useFrame continuously lerps it along the curve as scroll progresses.
      */
      camera={{ position: [-12, -1.5, 3], fov: 72 }}
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{
        antialias: false, // small perf win; path/bloom aesthetics don't need it
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <SceneContent progressRef={progressRef} />
    </Canvas>
  );
}

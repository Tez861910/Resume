import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { PALETTE } from '../utils/colorPalette'

// ─────────────────────────────────────────────────────────────────────────────
// Data — skill categories with 3D cluster positions
// ─────────────────────────────────────────────────────────────────────────────

interface SkillEntry {
  name: string
}

interface ClusterDef {
  id: string
  label: string
  color: string
  center: [number, number, number]
  skills: SkillEntry[]
}

const SKILL_CLUSTERS: ClusterDef[] = [
  {
    id: 'languages',
    label: 'Languages',
    color: PALETTE.AMBER,
    center: [0, 2.8, 0],
    skills: [
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'C#' },
      { name: 'Java' },
      { name: 'PHP' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    color: PALETTE.CYAN,
    center: [-3.6, 0.4, 0.6],
    skills: [
      { name: 'React' },
      { name: 'Vite' },
      { name: 'Material UI' },
      { name: 'Tailwind CSS' },
      { name: 'Framer Motion' },
      { name: 'PWA' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    color: PALETTE.EMERALD,
    center: [3.6, 0.4, -0.6],
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'REST APIs' },
      { name: 'Sequelize ORM' },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop & 3D',
    color: PALETTE.AMBER_BRIGHT,
    center: [1.8, 3.2, -2.0],
    skills: [
      { name: 'WPF / .NET 8' },
      { name: 'DirectX' },
      { name: 'HelixToolkit' },
      { name: 'MVVM' },
      { name: 'DI' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    color: PALETTE.CYAN_DIM,
    center: [-2.2, -2.6, 0.4],
    skills: [
      { name: 'MySQL' },
      { name: 'SQLite' },
      { name: 'Query Optimization' },
    ],
  },
  {
    id: 'tools',
    label: 'Dev Tools',
    color: PALETTE.AMBER_DIM,
    center: [2.6, -2.2, -1.2],
    skills: [
      { name: 'Git' },
      { name: 'VS Code' },
      { name: 'GoDaddy' },
      { name: 'App Insights' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Distribute N skill nodes in an elliptical ring around a cluster centre. */
function getSkillPositions(
  center: [number, number, number],
  count: number,
): [number, number, number][] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const tilt = (i % 2 === 0 ? 0.28 : -0.28)   // alternate above / below ring plane
    const r = 0.9
    return [
      center[0] + r * Math.cos(angle),
      center[1] + r * Math.sin(angle) * 0.55 + tilt,
      center[2] + r * Math.sin(angle) * 0.38,
    ] as [number, number, number]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Cluster connecting lines
// ─────────────────────────────────────────────────────────────────────────────

interface ClusterLinesProps {
  center: [number, number, number]
  skillPositions: [number, number, number][]
  color: string
}

function ClusterLines({ center, skillPositions, color }: ClusterLinesProps) {
  const positions = useMemo(() => {
    const pts: number[] = []
    skillPositions.forEach(pos => {
      pts.push(...center, ...pos)
    })
    return new Float32Array(pts)
  }, [center, skillPositions])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.22} />
    </lineSegments>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual skill node
// ─────────────────────────────────────────────────────────────────────────────

interface SkillNodeProps {
  name: string
  position: [number, number, number]
  color: string
  isHovered: boolean
  onOver: () => void
  onOut: () => void
}

function SkillNode({ name, position, color, isHovered, onOver, onOut }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const target = isHovered ? 1.7 : 1.0
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, target, delta * 6)
    meshRef.current.scale.y = meshRef.current.scale.x
    meshRef.current.scale.z = meshRef.current.scale.x
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={e => { e.stopPropagation(); onOver() }}
        onPointerOut={onOut}
      >
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshBasicMaterial color={color} transparent opacity={isHovered ? 1 : 0.75} />
      </mesh>

      {isHovered && (
        <Html
          center
          position={[0, 0.28, 0]}
          distanceFactor={7}
          zIndexRange={[200, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(2,6,23,0.92)',
              border: `1px solid ${color}55`,
              borderRadius: '6px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 600,
              color,
              whiteSpace: 'nowrap',
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              letterSpacing: '0.03em',
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Cluster centre sphere + label
// ─────────────────────────────────────────────────────────────────────────────

interface ClusterCenterProps {
  cluster: ClusterDef
  isActive: boolean
  onOver: () => void
  onOut: () => void
}

function ClusterCenter({ cluster, isActive, onOver, onOut }: ClusterCenterProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { color, center, label } = cluster

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    // Gentle pulse
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.4 + center[0]) * 0.08
    const target = isActive ? pulse * 1.4 : pulse
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, target, delta * 5)
    meshRef.current.scale.y = meshRef.current.scale.x
    meshRef.current.scale.z = meshRef.current.scale.x
  })

  return (
    <group position={center}>
      {/* Outer glow ring */}
      <mesh>
        <torusGeometry args={[0.24, 0.018, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.6 : 0.28} />
      </mesh>

      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={e => { e.stopPropagation(); onOver() }}
        onPointerOut={onOut}
      >
        <sphereGeometry args={[0.17, 18, 18]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 1 : 0.9} />
      </mesh>

      {/* Always-visible label */}
      <Html
        center
        position={[0, 0.42, 0]}
        distanceFactor={8}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(2,6,23,0.82)',
            border: `1px solid ${color}44`,
            borderRadius: '8px',
            padding: '3px 9px',
            fontSize: '11px',
            fontWeight: 700,
            color,
            whiteSpace: 'nowrap',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Full cluster (centre + lines + skill nodes)
// ─────────────────────────────────────────────────────────────────────────────

interface ClusterProps {
  cluster: ClusterDef
  hoveredSkill: string | null
  setHoveredSkill: (id: string | null) => void
}

function Cluster({ cluster, hoveredSkill, setHoveredSkill }: ClusterProps) {
  const [centerHovered, setCenterHovered] = useState(false)
  const skillPositions = useMemo(
    () => getSkillPositions(cluster.center, cluster.skills.length),
    [cluster],
  )

  return (
    <>
      <ClusterLines
        center={cluster.center}
        skillPositions={skillPositions}
        color={cluster.color}
      />
      <ClusterCenter
        cluster={cluster}
        isActive={centerHovered}
        onOver={() => setCenterHovered(true)}
        onOut={() => setCenterHovered(false)}
      />
      {cluster.skills.map((skill, i) => {
        const uid = `${cluster.id}:${skill.name}`
        return (
          <SkillNode
            key={uid}
            name={skill.name}
            position={skillPositions[i]}
            color={cluster.color}
            isHovered={hoveredSkill === uid}
            onOver={() => setHoveredSkill(uid)}
            onOut={() => setHoveredSkill(null)}
          />
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Inter-cluster bridge lines (connect related domain centres)
// ─────────────────────────────────────────────────────────────────────────────

const BRIDGES: [string, string][] = [
  ['languages', 'frontend'],
  ['languages', 'backend'],
  ['languages', 'desktop'],
  ['frontend',  'backend'],
  ['backend',   'databases'],
  ['desktop',   'tools'],
]

function BridgeLines() {
  const centerMap = useMemo(() => {
    const m = new Map<string, [number, number, number]>()
    SKILL_CLUSTERS.forEach(c => m.set(c.id, c.center))
    return m
  }, [])

  const positions = useMemo(() => {
    const pts: number[] = []
    BRIDGES.forEach(([a, b]) => {
      const ca = centerMap.get(a)!
      const cb = centerMap.get(b)!
      pts.push(...ca, ...cb)
    })
    return new Float32Array(pts)
  }, [centerMap])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={PALETTE.WHITE} transparent opacity={0.055} />
    </lineSegments>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Full constellation scene
// ─────────────────────────────────────────────────────────────────────────────

function ConstellationScene() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <>
      <color attach="background" args={['#030712']} />
      <Stars radius={60} depth={40} count={600} factor={2.5} fade speed={0.3} />

      <BridgeLines />

      {SKILL_CLUSTERS.map(cluster => (
        <Cluster
          key={cluster.id}
          cluster={cluster}
          hoveredSkill={hoveredSkill}
          setHoveredSkill={setHoveredSkill}
        />
      ))}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 3.6}
        maxPolarAngle={Math.PI / 1.75}
        dampingFactor={0.07}
        enableDamping
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.12}
          luminanceSmoothing={0.85}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function SkillConstellation() {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 8.5], fov: 52 }}
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
    >
      <ConstellationScene />
    </Canvas>
  )
}

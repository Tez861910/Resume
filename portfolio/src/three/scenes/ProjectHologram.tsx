/**
 * ProjectHologram — pure CSS 3D + SVG wireframe hologram.
 *
 * WHY NO THREE.JS:
 *   The old version created one WebGL context per project card.
 *   With 5-6 cards visible simultaneously that meant 5-6 GPU contexts,
 *   5-6 render loops, and 5-6 shader pipelines — the root cause of
 *   stuttering on the Projects section.
 *
 * HOW THIS WORKS:
 *   CSS `perspective` + `rotateY` @keyframes run entirely on the browser
 *   compositor thread.  No main-thread JS, no WebGL, no requestAnimationFrame.
 *   SVG paths draw the wireframe shapes.  `filter: drop-shadow()` fakes bloom.
 *   All 6 cards share the same two @keyframes defined in index.css
 *   (hlgm-spin, hlgm-pulse).
 */

import type { CSSProperties } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & variant resolution
// ─────────────────────────────────────────────────────────────────────────────

type HologramVariant =
  | "mesh3d"
  | "globe"
  | "solar"
  | "corporate"
  | "network"
  | "default";

function resolveVariant(projectId: string): HologramVariant {
  const id = projectId.toLowerCase();
  if (id.includes("mind") || id.includes("3d") || id.includes("manufacturing"))
    return "mesh3d";
  if (
    id.includes("printalytix") ||
    id.includes("platform") ||
    id.includes("web")
  )
    return "globe";
  if (id.includes("solar")) return "solar";
  if (id.includes("resolute") || id.includes("marketing")) return "corporate";
  if (
    id.includes("thread") ||
    id.includes("forum") ||
    id.includes("university")
  )
    return "network";
  return "default";
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-variant config
// ─────────────────────────────────────────────────────────────────────────────

interface VariantCfg {
  primary: string;
  secondary: string;
  duration: number; // spin period in seconds
  tilt: number; // static rotateX degrees for depth illusion
}

const CFG: Record<HologramVariant, VariantCfg> = {
  mesh3d: { primary: "#fbbf24", secondary: "#22d3ee", duration: 6.0, tilt: 20 },
  globe: { primary: "#22d3ee", secondary: "#0891b2", duration: 9.0, tilt: 25 },
  solar: { primary: "#fbbf24", secondary: "#d97706", duration: 7.0, tilt: 14 },
  corporate: {
    primary: "#fbbf24",
    secondary: "#fde68a",
    duration: 5.5,
    tilt: 22,
  },
  network: {
    primary: "#22d3ee",
    secondary: "#fbbf24",
    duration: 8.0,
    tilt: 18,
  },
  default: {
    primary: "#fbbf24",
    secondary: "#d97706",
    duration: 6.5,
    tilt: 20,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG wireframe shapes
// All share viewBox="-50 -50 100 100" (100-unit coordinate space centred at 0,0)
// ─────────────────────────────────────────────────────────────────────────────

interface SVGProps {
  p: string; // primary colour
  s: string; // secondary colour
}

/** MIND 3D Suite — overlapping triangles (icosahedron silhouette) */
function Mesh3DSVG({ p, s }: SVGProps) {
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      <polygon
        points="0,-44 38,22 -38,22"
        stroke={p}
        strokeWidth="1.6"
        fill={`${p}0a`}
      />
      <polygon
        points="0,44 38,-22 -38,-22"
        stroke={p}
        strokeWidth="1.3"
        fill={`${p}06`}
      />
      <line
        x1="0"
        y1="-44"
        x2="38"
        y2="-22"
        stroke={s}
        strokeWidth="0.85"
        opacity="0.65"
      />
      <line
        x1="0"
        y1="-44"
        x2="-38"
        y2="-22"
        stroke={s}
        strokeWidth="0.85"
        opacity="0.65"
      />
      <line
        x1="38"
        y1="22"
        x2="-38"
        y2="-22"
        stroke={s}
        strokeWidth="0.7"
        opacity="0.5"
      />
      <line
        x1="-38"
        y1="22"
        x2="38"
        y2="-22"
        stroke={s}
        strokeWidth="0.7"
        opacity="0.5"
      />
      <circle
        cx="0"
        cy="0"
        r="20"
        stroke={s}
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.8"
      />
      <circle cx="0" cy="0" r="3.5" fill={s} opacity="0.95" />
    </svg>
  );
}

/** Printalytix Web — globe with meridians and parallels */
function GlobeSVG({ p, s }: SVGProps) {
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      <circle cx="0" cy="0" r="43" stroke={p} strokeWidth="1.6" />
      <ellipse
        cx="0"
        cy="0"
        rx="22"
        ry="43"
        stroke={p}
        strokeWidth="1.1"
        opacity="0.78"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="38"
        ry="43"
        stroke={s}
        strokeWidth="0.75"
        opacity="0.48"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="43"
        ry="18"
        stroke={p}
        strokeWidth="1.1"
        opacity="0.78"
      />
      <ellipse
        cx="0"
        cy="0"
        rx="43"
        ry="34"
        stroke={s}
        strokeWidth="0.75"
        opacity="0.48"
      />
      <circle cx="0" cy="-43" r="2.5" fill={p} opacity="0.8" />
      <circle cx="0" cy="43" r="2.5" fill={p} opacity="0.8" />
    </svg>
  );
}

/** Open Solar Toolkit — 3 × 3 panel grid */
function SolarSVG({ p, s }: SVGProps) {
  const offsets = [-28, 0, 28] as const;
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      {offsets.flatMap((x) =>
        offsets.map((y) => {
          const centre = x === 0 && y === 0;
          return (
            <rect
              key={`${x}-${y}`}
              x={x - 11}
              y={y - 11}
              width={22}
              height={22}
              rx={2}
              stroke={centre ? p : s}
              strokeWidth={centre ? 1.6 : 1.1}
              fill={`${p}${centre ? "18" : "07"}`}
            />
          );
        }),
      )}
      <line
        x1="0"
        y1="-46"
        x2="0"
        y2="46"
        stroke={p}
        strokeWidth="0.75"
        opacity="0.32"
      />
      <line
        x1="-46"
        y1="0"
        x2="46"
        y2="0"
        stroke={p}
        strokeWidth="0.75"
        opacity="0.32"
      />
    </svg>
  );
}

/** Resolute Solutions — interlocked bezier curves (corporate complexity) */
function CorporateSVG({ p, s }: SVGProps) {
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      <path
        d="M0,-44 C44,-22 44,22 0,44 C-44,22 -44,-22 0,-44 Z"
        stroke={p}
        strokeWidth="1.6"
      />
      <path
        d="M-44,0 C-22,-44 22,-44 44,0 C22,44 -22,44 -44,0 Z"
        stroke={p}
        strokeWidth="1.6"
      />
      <path
        d="M0,-30 C28,-14 28,14 0,30 C-28,14 -28,-14 0,-30 Z"
        stroke={s}
        strokeWidth="0.9"
        opacity="0.6"
      />
      <circle cx="0" cy="0" r="9" stroke={s} strokeWidth="1.4" />
      <circle cx="0" cy="0" r="3.5" fill={p} opacity="0.95" />
    </svg>
  );
}

/** University Threads — force-graph network of nodes */
function NetworkSVG({ p, s }: SVGProps) {
  // [cx, cy, fill, r]
  const nodes: [number, number, string, number][] = [
    [0, 0, p, 9],
    [-32, -24, p, 6],
    [34, -20, p, 6],
    [-30, 28, p, 6],
    [30, 26, p, 6],
    [2, -44, s, 5],
  ];
  const edges: [number, number, number, number, number][] = [
    [0, 0, -32, -24, 0.55],
    [0, 0, 34, -20, 0.55],
    [0, 0, -30, 28, 0.55],
    [0, 0, 30, 26, 0.55],
    [-32, -24, 2, -44, 0.4],
    [34, -20, 2, -44, 0.4],
    [-32, -24, 34, -20, 0.3],
    [-30, 28, 30, 26, 0.3],
  ];
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      {edges.map(([x1, y1, x2, y2, op], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={p}
          strokeWidth="1"
          opacity={op}
        />
      ))}
      {nodes.map(([cx, cy, fill, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity="0.92" />
      ))}
    </svg>
  );
}

/** Examination / default — diamond with orbit ring */
function DefaultSVG({ p, s }: SVGProps) {
  return (
    <svg viewBox="-50 -50 100 100" width="92" height="92" fill="none">
      <polygon
        points="0,-45 45,0 0,45 -45,0"
        stroke={p}
        strokeWidth="1.6"
        fill={`${p}07`}
      />
      <polygon
        points="0,-30 30,0 0,30 -30,0"
        stroke={s}
        strokeWidth="1.0"
        opacity="0.7"
      />
      <circle
        cx="0"
        cy="0"
        r="44"
        stroke={p}
        strokeWidth="0.8"
        strokeDasharray="4 4"
        opacity="0.48"
      />
      <line
        x1="0"
        y1="-45"
        x2="0"
        y2="45"
        stroke={s}
        strokeWidth="0.7"
        opacity="0.38"
      />
      <line
        x1="-45"
        y1="0"
        x2="45"
        y2="0"
        stroke={s}
        strokeWidth="0.7"
        opacity="0.38"
      />
      <circle cx="0" cy="0" r="4" fill={p} opacity="0.95" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Corner brackets — HUD / hologram frame aesthetic
// ─────────────────────────────────────────────────────────────────────────────

function CornerBrackets({ color }: { color: string }) {
  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 3,
  };
  return (
    <svg
      style={style}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="M0,14 L0,0 L14,0"
        stroke={color}
        strokeWidth="0.85"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.45"
      />
      <path
        d="M86,0 L100,0 L100,14"
        stroke={color}
        strokeWidth="0.85"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.45"
      />
      <path
        d="M0,86 L0,100 L14,100"
        stroke={color}
        strokeWidth="0.85"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.45"
      />
      <path
        d="M86,100 L100,100 L100,86"
        stroke={color}
        strokeWidth="0.85"
        fill="none"
        vectorEffect="non-scaling-stroke"
        opacity="0.45"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectHologramProps {
  projectId: string;
}

export default function ProjectHologram({ projectId }: ProjectHologramProps) {
  const variant = resolveVariant(projectId);
  const { primary, secondary, duration, tilt } = CFG[variant];

  const WireFrame = {
    mesh3d: Mesh3DSVG,
    globe: GlobeSVG,
    solar: SolarSVG,
    corporate: CorporateSVG,
    network: NetworkSVG,
    default: DefaultSVG,
  }[variant];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#07090f",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ── Ambient pulse glow — compositor-only, shares hlgm-pulse keyframe ── */}
      <div
        style={{
          position: "absolute",
          width: "170px",
          height: "170px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primary}22 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          animation: `hlgm-pulse ${(duration * 1.6).toFixed(1)}s ease-in-out infinite`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── 3-D perspective wrapper ───────────────────────────────────────── */}
      <div
        style={{
          perspective: "260px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/*
          Static rotateX provides the constant upward tilt — makes the flat
          SVG look like a 3-D object resting on a tilted plane.
        */}
        <div
          style={{
            transform: `rotateX(${tilt}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/*
            This div spins around the Y axis via hlgm-spin (defined in index.css).
            Perspective distortion from the parent div makes it look genuinely 3-D.
            will-change: transform keeps it on the compositor thread.
          */}
          <div
            style={{
              animation: `hlgm-spin ${duration}s linear infinite`,
              transformStyle: "preserve-3d",
              willChange: "transform",
              filter: `drop-shadow(0 0 8px ${primary}aa)`,
            }}
          >
            <WireFrame p={primary} s={secondary} />
          </div>
        </div>
      </div>

      {/* ── Scanline CRT overlay ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.10) 3px, rgba(0,0,0,0.10) 4px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── HUD corner brackets ──────────────────────────────────────────── */}
      <CornerBrackets color={primary} />

      {/* ── "preview" watermark ──────────────────────────────────────────── */}
      <span
        style={{
          position: "absolute",
          bottom: "6px",
          right: "10px",
          fontSize: "9px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: `${primary}44`,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 4,
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}
      >
        preview
      </span>
    </div>
  );
}

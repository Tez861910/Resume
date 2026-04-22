import { useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "../three/game/GameContext";
import { useSharedWorldState } from "../three/world/WorldStateProvider";
import { useRecruiterMode } from "./world/RecruiterModeProvider";

// ─────────────────────────────────────────────────────────────────────────────
// PersistentShip
//
// A fixed-position SVG rocket that follows the cursor across every section of
// the portfolio, giving the spaceship narrative continuity beyond the hero.
//
// Behaviour
//   • Invisible while the hero Three.js canvas is in view (scrollY < 60 vh)
//     — the high-quality 3-D ship handles that zone.
//   • Cross-fades in as you scroll past the hero.
//   • Rotates to face the direction of travel (banks into turns).
//   • Hidden on touch-only devices (no cursor to follow).
//   • Hidden while the Dev Sprint game overlay is active.
// ─────────────────────────────────────────────────────────────────────────────

interface ShipState {
  x: number;
  y: number;
  angle: number;
  opacity: number;
}

const LERP = 0.1; // position follow speed (0 = frozen, 1 = instant)
const ANGLE_LERP = 0.12; // rotation smoothing
const FADE_START = 0.45; // scroll fraction where fade-in begins
const FADE_END = 0.72; // scroll fraction where ship is fully visible

const SECTION_SHIP_STYLE = {
  home: {
    scale: 0.92,
    glow: "#fbbf24",
    opacityBoost: 0,
  },
  about: {
    scale: 0.88,
    glow: "#22d3ee",
    opacityBoost: -0.08,
  },
  skills: {
    scale: 1,
    glow: "#fbbf24",
    opacityBoost: 0.06,
  },
  experience: {
    scale: 0.94,
    glow: "#34d399",
    opacityBoost: 0.02,
  },
  projects: {
    scale: 1.06,
    glow: "#22d3ee",
    opacityBoost: 0.08,
  },
  contact: {
    scale: 0.9,
    glow: "#fde68a",
    opacityBoost: -0.02,
  },
} as const;

function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current;
  // Wrap to [-π, π]
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * t;
}

export default function PersistentShip() {
  const { isActive } = useGame();
  const world = useSharedWorldState();
  const { enabled: recruiterModeEnabled } = useRecruiterMode();

  // Detect pointer device — ship only makes sense with a real cursor
  const [hasMouse] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );

  const sectionStyle = useMemo(
    () => SECTION_SHIP_STYLE[world.activeSection],
    [world.activeSection],
  );

  const stateRef = useRef<ShipState>({
    x: -200,
    y: -200,
    angle: 0,
    opacity: 0,
  });
  const targetRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  const [render, setRender] = useState<ShipState>({
    x: -200,
    y: -200,
    angle: 0,
    opacity: 0,
  });

  useEffect(() => {
    if (!hasMouse) return;

    // ── Cursor tracking ──────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Animation loop ───────────────────────────────────────────────────
    const animate = () => {
      const s = stateRef.current;
      const t = targetRef.current;

      const prevX = s.x;
      const prevY = s.y;

      // Lerp position
      s.x += (t.x - s.x) * LERP;
      s.y += (t.y - s.y) * LERP;

      // Compute direction of travel
      const vx = s.x - prevX;
      const vy = s.y - prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > 0.4) {
        // atan2(vx, -vy): 0 = up, π/2 = right, π = down, -π/2 = left
        const targetAngle = Math.atan2(vx, -vy);
        s.angle = lerpAngle(s.angle, targetAngle, ANGLE_LERP);
      }

      // Opacity: based on how far user has scrolled past the hero
      const scrollFrac =
        window.scrollY /
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollVH = window.scrollY / Math.max(1, window.innerHeight);

      let targetOpacity = 0;
      if (scrollVH >= FADE_START) {
        targetOpacity = Math.min(
          1,
          (scrollVH - FADE_START) / (FADE_END - FADE_START),
        );
      }

      targetOpacity += sectionStyle.opacityBoost;
      targetOpacity = Math.max(0, Math.min(1, targetOpacity));

      // Also hide once cursor has been to -200 (off-screen default)
      if (t.x === -200) targetOpacity = 0;
      // Hide when game is active, recruiter mode is enabled, or scroll fraction is at very top
      if (isActive || recruiterModeEnabled || scrollFrac < 0.005)
        targetOpacity = 0;

      s.opacity += (targetOpacity - s.opacity) * 0.08;

      setRender({ x: s.x, y: s.y, angle: s.angle, opacity: s.opacity });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [hasMouse, isActive, recruiterModeEnabled, sectionStyle.opacityBoost]);

  if (!hasMouse || recruiterModeEnabled) return null;

  const { x, y, angle, opacity } = render;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 9998,
        opacity,
        // Translate to cursor position, then rotate ship to face direction
        transform: `translate(${x - 16}px, ${y - 20}px) rotate(${angle}rad) scale(${sectionStyle.scale})`,
        // Hardware-accelerate
        willChange: "transform, opacity",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        filter: `drop-shadow(0 0 10px ${sectionStyle.glow}55)`,
      }}
    >
      {/*
        SVG rocket — mirrors the wireframe aesthetic of the Three.js MiniShip:
        • Amber fuselage + nose cone
        • Darker amber swept-back wings
        • Cyan engine glow at the base
        32 × 40 viewport, ship centred on the nose tip
      */}
      <svg
        width="32"
        height="40"
        viewBox="0 0 32 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        {/* Engine outer glow ring */}
        <circle
          cx="16"
          cy="34"
          r="5.5"
          stroke={sectionStyle.glow}
          strokeWidth="0.7"
          opacity="0.35"
          filter="url(#engineBlur)"
        />

        {/* Engine core */}
        <circle cx="16" cy="34" r="3" fill={sectionStyle.glow} opacity="0.9">
          <animate
            attributeName="r"
            values="2.5;3.5;2.5"
            dur="1.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Left wing */}
        <path
          d="M10 24 L2 35 L11 28 Z"
          stroke="#d97706"
          strokeWidth="1.1"
          strokeLinejoin="round"
          opacity="0.82"
        />

        {/* Right wing */}
        <path
          d="M22 24 L30 35 L21 28 Z"
          stroke="#d97706"
          strokeWidth="1.1"
          strokeLinejoin="round"
          opacity="0.82"
        />

        {/* Fuselage body */}
        <path
          d="M16 3 L23 28 L16 23 L9 28 Z"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.92"
        />

        {/* Nose tip accent */}
        <circle cx="16" cy="3" r="1.2" fill="#fde68a" opacity="0.9" />

        {/* Glow filter for engine */}
        <defs>
          <filter id="engineBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

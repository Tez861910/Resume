/**
 * Home Base art direction tokens.
 *
 * Single source of truth for materials, palette and dimensions used across the
 * walkable station so every room shares the same "Aegis" look: dark anodised
 * navy hull, cyan rim glow, warm amber wayfinding.
 *
 * Geometry contract (world space, must stay in sync with WalkerController):
 *   Landing pad   centred (0, 0, 22), radius 9.5
 *   Bridge        z = 20 → 8, x = ±1.5
 *   Command room  z = 8 → -12, x = ±8, y = 0 → 5.5
 *   Vault room    z = -12 → -26, x = ±8 (only when unlocked)
 */

export const HB = {
  hull: "#101a2e",
  hullDeep: "#0a1120",
  hullEdge: "#1c2a44",
  panel: "#0c1322",
  trim: "#2a3a57",
  floor: "#070b16",
  cyan: "#22d3ee",
  cyanDeep: "#0e7490",
  amber: "#f59e0b",
  amberSoft: "#fbbf24",
  emerald: "#34d399",
  rose: "#ef4444",
  ink: "#020617",
  text: "#e2e8f0",
} as const;

/** Mission accents in canonical order (mirrors missions.ts). */
export const MISSION_ACCENT: Record<string, string> = {
  launch: "#fbbf24",
  profile: "#22d3ee",
  constellation: "#34d399",
  career: "#f97316",
  "mission-ops": "#a855f7",
  transmission: "#f472b6",
};

export const ROOM = {
  width: 16,
  depth: 20,
  height: 5.5,
  opening: 1.5,
  centerZ: -2,
} as const;

export const SPAWN = { x: 0, z: 25.5, height: 1.75 } as const;

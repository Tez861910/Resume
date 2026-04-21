/**
 * Three.js colour tokens that mirror the Tailwind design tokens used
 * throughout the portfolio (amber-400, cyan-400, slate-900, etc.).
 *
 * Keeping colours in one place means a single edit propagates to every
 * scene, particle system, and glyph.
 */

export const PALETTE = {
  // ── Amber family (primary accent) ──────────────────────────────────
  AMBER:        '#fbbf24', // amber-400  – main warm accent
  AMBER_BRIGHT: '#fde68a', // amber-200  – lighter highlight
  AMBER_DIM:    '#d97706', // amber-600  – muted/depth amber

  // ── Cyan family (secondary accent) ─────────────────────────────────
  CYAN:         '#22d3ee', // cyan-400   – cool contrast
  CYAN_DIM:     '#0891b2', // cyan-600   – muted/depth cyan

  // ── Emerald (status / live indicator) ──────────────────────────────
  EMERALD:      '#34d399', // emerald-400

  // ── Slate backgrounds ───────────────────────────────────────────────
  SLATE_900:    '#0f172a', // slate-900  – page background top
  SLATE_950:    '#020617', // slate-950  – deepest background / canvas bg

  // ── Utility ─────────────────────────────────────────────────────────
  WHITE:        '#ffffff',
  RED:          '#f87171', // red-400    – bug/error (used in game phase)
} as const

export type PaletteKey = keyof typeof PALETTE

/**
 * geometryHelpers.ts
 *
 * Pure math helpers for building Three.js geometry data arrays.
 * No Three.js imports — just typed arrays and arithmetic so these
 * functions stay tree-shakeable and testable in isolation.
 */

// ─────────────────────────────────────────────────────────────
// Galaxy / spiral particle layout
// ─────────────────────────────────────────────────────────────

/**
 * Build a Float32Array of particle positions shaped like a 3-arm
 * spiral galaxy viewed from slightly above.
 *
 * Distribution strategy
 *   ~88 % of particles → spiral arms (polar coords + offset angle)
 *   ~12 % of particles → spherical halo scatter (depth / atmosphere)
 *
 * @param count   Total number of particles
 * @param radius  Outer radius of the galaxy disc (world units)
 */
export function buildGalaxyPositions(count: number, radius = 7): Float32Array {
  const positions = new Float32Array(count * 3)
  const ARM_COUNT = 3
  const ARM_ANGLE = (Math.PI * 2) / ARM_COUNT
  const SPIRAL_TIGHTNESS = 0.42   // higher = more tightly wound arms
  const DISC_HEIGHT = 0.8         // vertical scatter of disc particles
  const HALO_FLATTEN = 0.38       // vertical compression of halo

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    // Radial distance: square-root bias concentrates points near centre
    const r = Math.pow(Math.random(), 0.5) * radius
    const theta = Math.random() * Math.PI * 2

    if (Math.random() > 0.12) {
      // ── Spiral arm particle ──────────────────────────────────
      const arm = Math.floor(Math.random() * ARM_COUNT) * ARM_ANGLE
      const spiral = theta + arm + r * SPIRAL_TIGHTNESS

      // Small random scatter perpendicular to the arm
      const scatter = (Math.random() - 0.5) * 0.6 * (1 - r / radius)

      positions[i3]     = Math.cos(spiral) * r + scatter
      positions[i3 + 1] = (Math.random() - 0.5) * DISC_HEIGHT
      positions[i3 + 2] = Math.sin(spiral) * r + scatter
    } else {
      // ── Spherical halo particle ──────────────────────────────
      const phi  = Math.acos(2 * Math.random() - 1)
      const rHalo = Math.random() * (radius * 1.3)

      positions[i3]     = rHalo * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = rHalo * Math.cos(phi) * HALO_FLATTEN
      positions[i3 + 2] = rHalo * Math.sin(phi) * Math.sin(theta)
    }
  }

  return positions
}

// ─────────────────────────────────────────────────────────────
// Vertex colour helpers
// ─────────────────────────────────────────────────────────────

/**
 * Parse a CSS hex colour string ("#rrggbb") into a normalised
 * [r, g, b] triple in the range [0, 1].
 */
function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255]
}

/**
 * Build a vertex-colour Float32Array that randomly assigns one of
 * two colours to each particle.
 *
 * @param count    Number of particles (array length = count * 3)
 * @param hexA     Primary colour   (CSS hex, e.g. "#fbbf24")
 * @param hexB     Secondary colour (CSS hex, e.g. "#22d3ee")
 * @param ratioA   Probability [0–1] that a particle gets colour A
 *                 (default 0.65 → 65 % amber, 35 % cyan)
 */
export function buildTwoToneColors(
  count: number,
  hexA: string,
  hexB: string,
  ratioA = 0.65,
): Float32Array {
  const colors = new Float32Array(count * 3)
  const [ar, ag, ab] = parseHex(hexA)
  const [br, bg, bb] = parseHex(hexB)

  for (let i = 0; i < count; i++) {
    const use = Math.random() < ratioA
    colors[i * 3]     = use ? ar : br
    colors[i * 3 + 1] = use ? ag : bg
    colors[i * 3 + 2] = use ? ab : bb
  }

  return colors
}

// ─────────────────────────────────────────────────────────────
// Misc spatial helpers
// ─────────────────────────────────────────────────────────────

/**
 * Return a random position uniformly distributed inside an
 * axis-aligned box defined by per-axis [min, max] ranges.
 */
export function randomInBox(
  xRange: [number, number],
  yRange: [number, number],
  zRange: [number, number],
): [number, number, number] {
  const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo)
  return [rand(...xRange), rand(...yRange), rand(...zRange)]
}

/**
 * Linear interpolation — convenience used across scene files.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

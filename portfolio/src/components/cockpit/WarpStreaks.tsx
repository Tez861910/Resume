import { useEffect, useRef } from "react";
import useScrollVelocity from "./useScrollVelocity";
import { useSharedWorldState } from "../../three/world/useSharedWorldState";

/**
 * WarpStreaks — Advanced space tunnel effect
 *
 * Multi-layer canvas rendering:
 *   • Star field (distant, parallax)
 *   • Warp streaks (velocity-dependent, stretching into tunnel)
 *   • Debris particles (dust motes, asteroids)
 *   • Dynamic lines and grid (optional, subtle)
 * 
 * Degrades gracefully on low-tier devices.
 */
export default function WarpStreaks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { warp } = useScrollVelocity();
  const warpRef = useRef(0);
  const world = useSharedWorldState();
  const lowTier = world.capabilityTier === "low";

  useEffect(() => {
    warpRef.current = warp;
  }, [warp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ─────────────────────────────────────────────────────────────────────────
    // Entity types for layered rendering
    // ─────────────────────────────────────────────────────────────────────────

    interface Star {
      x: number;
      y: number;
      z: number;
      pz: number;
      brightness: number;
      size: number;
    }

    interface DebrisParticle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
    }

    const STAR_COUNT = lowTier ? 80 : 220;
    const DEBRIS_COUNT = lowTier ? 20 : 60;
    let stars: Star[] = [];
    let debris: DebrisParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const w = canvas.width;
      const h = canvas.height;

      stars = new Array(STAR_COUNT).fill(0).map(() => ({
        x: (Math.random() - 0.5) * w * 1.4,
        y: (Math.random() - 0.5) * h * 1.4,
        z: Math.random() * w,
        pz: 0,
        brightness: Math.random() * 0.8 + 0.2,
        size: Math.random() * 2 + 0.5,
      }));

      debris = new Array(DEBRIS_COUNT).fill(0).map(() => ({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        size: Math.random() * 8 + 2,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() * 60 + 180,
      }));
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let raf = 0;
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      const warpAmt = Math.min(1, warpRef.current);
      
      // Background with gradient
      ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
      ctx.fillRect(0, 0, w, h);

      // Add a subtle warp glow
      const grd = ctx.createRadialGradient(cx, cy, w * 0.3, cx, cy, w * 0.8);
      grd.addColorStop(0, `rgba(34, 211, 238, ${warpAmt * 0.08})`);
      grd.addColorStop(1, `rgba(2, 6, 23, 0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const baseSpeed = lowTier ? 0.25 : 0.5;
      const speed = baseSpeed + warpAmt * 22;

      // ─ Render stars with streaks ─────────────────────────────────────────
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * 10;
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * w * 1.4;
          s.y = (Math.random() - 0.5) * h * 1.4;
          s.z = w;
          s.pz = s.z;
        }

        const k = 128 / s.z;
        const pk = 128 / s.pz;
        const x = s.x * k + cx;
        const y = s.y * k + cy;
        const px = s.x * pk + cx;
        const py = s.y * pk + cy;

        const distToCenter = Math.hypot(x - cx, y - cy);
        const clip = Math.max(0, Math.min(1, 1 - distToCenter / (Math.hypot(w, h) * 0.6)));
        const brightness = Math.min(1, (1 - s.z / w) * s.brightness * clip * (0.6 + warpAmt * 0.4));

        // Star trail line
        if (warpAmt > 0.1) {
          const trailBrightness = brightness * warpAmt * 0.8;
          ctx.strokeStyle = `rgba(180, 210, 255, ${trailBrightness})`;
          ctx.lineWidth = Math.max(0.5, s.size * (0.5 + warpAmt));
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        // Star glow
        ctx.fillStyle = `rgba(${210 + Math.floor(warpAmt * 40)}, ${230 + Math.floor(warpAmt * 20)}, 255, ${brightness})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, s.size * (0.7 + warpAmt * 0.5)), 0, Math.PI * 2);
        ctx.fill();

        // Optional halo on high speed
        if (warpAmt > 0.4 && !lowTier) {
          ctx.strokeStyle = `rgba(100, 200, 255, ${brightness * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, s.size * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ─ Render debris particles ───────────────────────────────────────────
      for (const d of debris) {
        d.z -= speed * 8;
        d.x += d.vx * speed;
        d.y += d.vy * speed;

        if (d.z < 1) {
          d.x = (Math.random() - 0.5) * w * 2;
          d.y = (Math.random() - 0.5) * h * 2;
          d.z = w;
        }

        const k = 128 / d.z;
        const x = d.x * k + cx;
        const y = d.y * k + cy;

        const distToCenter = Math.hypot(x - cx, y - cy);
        const clip = Math.max(0, Math.min(1, 1 - distToCenter / (Math.hypot(w, h) * 0.65)));
        const depth = Math.min(1, 1 - d.z / w);
        const opacity = d.opacity * depth * clip * (0.4 + warpAmt * 0.6);

        ctx.fillStyle = `hsla(${d.hue}, 80%, ${50 + depth * 20}%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, d.size * depth * (0.6 + warpAmt * 0.4)), 0, Math.PI * 2);
        ctx.fill();
      }

      // ─ Optional grid/tunnel effect on high warp ─────────────────────────
      if (warpAmt > 0.3 && !lowTier) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${warpAmt * 0.08})`;
        ctx.lineWidth = 1;

        // Concentric circles
        for (let i = 1; i <= 4; i++) {
          const r = (w * 0.15 * i * (1 + warpAmt * 0.3)) % (w * 0.5);
          if (r > 20) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Cross hairs
        ctx.globalAlpha = warpAmt * 0.05;
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.15, cy);
        ctx.lineTo(cx + w * 0.15, cy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - h * 0.15);
        ctx.lineTo(cx, cy + h * 0.15);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [lowTier]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[0]"
      style={{ opacity: 0.62 }}
    />
  );
}

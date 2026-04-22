import { useEffect, useRef } from "react";
import useScrollVelocity from "./useScrollVelocity";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";

/**
 * WarpStreaks
 *
 * Canvas streak layer behind all content. Streak density & length react to
 * scroll velocity — the shuttle "accelerates" when the user scrolls fast.
 * Degrades to a static star field on low capability tier.
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

    type Star = { x: number; y: number; z: number; pz: number };
    const STAR_COUNT = lowTier ? 60 : 180;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const w = canvas.width;
      const h = canvas.height;
      stars = new Array(STAR_COUNT).fill(0).map(() => ({
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        pz: 0,
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

      // fade previous frame — longer trails when warping
      const warpAmt = warpRef.current;
      ctx.fillStyle = `rgba(2, 6, 23, ${lowTier ? 1 : 0.22 + (1 - warpAmt) * 0.3})`;
      ctx.fillRect(0, 0, w, h);

      const baseSpeed = lowTier ? 0.2 : 0.45;
      const speed = baseSpeed + warpAmt * 18;

      ctx.lineCap = "round";

      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed * 10;
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * w;
          s.y = (Math.random() - 0.5) * h;
          s.z = w;
          s.pz = s.z;
        }
        const k = 128 / s.z;
        const pk = 128 / s.pz;
        const x = s.x * k + cx;
        const y = s.y * k + cy;
        const px = s.x * pk + cx;
        const py = s.y * pk + cy;
        const brightness = Math.min(1, (1 - s.z / w) * (0.5 + warpAmt));
        ctx.strokeStyle = `rgba(${180 + Math.floor(warpAmt * 60)}, ${210 + Math.floor(warpAmt * 30)}, 255, ${brightness})`;
        ctx.lineWidth = lowTier ? 1 : 1 + warpAmt * 1.6;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
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
      style={{ opacity: 0.55 }}
    />
  );
}

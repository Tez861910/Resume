import { useEffect, useRef, useState } from "react";

/**
 * Returns a smoothed scroll velocity in px/s and a normalised 0-1 "warp"
 * value that ramps up during fast scrolling and decays to 0 when still.
 */
export default function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  const [warp, setWarp] = useState(0);
  const lastY = useRef<number>(
    typeof window !== "undefined" ? window.scrollY : 0,
  );
  const lastT = useRef<number>(
    typeof performance !== "undefined" ? performance.now() : 0,
  );
  const smoothed = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tick = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastT.current);
      const y = window.scrollY;
      const instantaneous = ((y - lastY.current) / dt) * 1000;
      lastY.current = y;
      lastT.current = now;

      smoothed.current = smoothed.current * 0.82 + instantaneous * 0.18;
      const v = Math.abs(smoothed.current);
      setVelocity(v);

      const normalised = Math.min(1, v / 4500);
      setWarp((prev) => prev * 0.78 + normalised * 0.22);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { velocity, warp };
}

import { useEffect, useRef } from "react";
import type { CockpitInputApi } from "../../three/cockpit/useCockpitInput";

interface Props {
  input: CockpitInputApi;
}

/**
 * Dual virtual joysticks + fire/boost buttons for touch devices.
 *  - Left stick: throttle (y) + yaw (x)
 *  - Right stick: pitch (y) + roll (x)
 */
export default function MobileControls({ input }: Props) {
  return (
    <>
      <Joystick
        side="left"
        onChange={(dx, dy) => {
          input.setAnalog({
            throttle: -dy, // up = forward
            yaw: dx,
            mobileThrottle: dy !== 0,
            mobileYaw: dx !== 0,
          });
        }}
      />
      <Joystick
        side="right"
        onChange={(dx, dy) => {
          input.setAnalog({
            pitch: dy, // down drag = look down
            roll: dx,
            mobilePitch: dy !== 0,
            mobileRoll: dx !== 0,
          });
        }}
      />
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          input.triggerFire();
        }}
        onClick={() => input.triggerFire()}
        className="absolute right-6 bottom-[110px] w-14 h-14 rounded-full border-2 border-amber-300/70 bg-amber-500/20 backdrop-blur-sm text-amber-100 font-bold text-xs pointer-events-auto active:scale-90"
        aria-label="Fire"
      >
        FIRE
      </button>
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          input.setAnalog({ boost: true });
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          input.setAnalog({ boost: false });
        }}
        className="absolute right-24 bottom-[110px] w-12 h-12 rounded-full border-2 border-cyan-300/60 bg-cyan-500/15 backdrop-blur-sm text-cyan-100 font-bold text-[10px] pointer-events-auto active:scale-90"
        aria-label="Boost"
      >
        BOOST
      </button>
    </>
  );
}

function Joystick({
  side,
  onChange,
}: {
  side: "left" | "right";
  onChange: (dx: number, dy: number) => void;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const RADIUS = 52;

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const onStart = (e: TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const t = e.changedTouches[0];
      const rect = base.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      touchIdRef.current = t.identifier;
      e.preventDefault();
    };
    const findTouch = (tl: TouchList) => {
      for (let i = 0; i < tl.length; i++) {
        if (tl[i].identifier === touchIdRef.current) return tl[i];
      }
      return null;
    };
    const onMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      const t = findTouch(e.touches);
      if (!t) return;
      const dxRaw = t.clientX - centerRef.current.x;
      const dyRaw = t.clientY - centerRef.current.y;
      const mag = Math.min(RADIUS, Math.hypot(dxRaw, dyRaw));
      const angle = Math.atan2(dyRaw, dxRaw);
      const dx = Math.cos(angle) * mag;
      const dy = Math.sin(angle) * mag;
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      onChange(dx / RADIUS, dy / RADIUS);
      e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      const t = findTouch(e.changedTouches);
      if (!t) return;
      touchIdRef.current = null;
      knob.style.transform = "translate(0,0)";
      onChange(0, 0);
      e.preventDefault();
    };

    base.addEventListener("touchstart", onStart, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: false });
    window.addEventListener("touchcancel", onEnd, { passive: false });
    return () => {
      base.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [onChange]);

  const positionClass =
    side === "left" ? "left-4 bottom-6" : "right-4 bottom-6";

  return (
    <div
      ref={baseRef}
      className={`absolute ${positionClass} w-[120px] h-[120px] rounded-full border-2 border-cyan-400/30 bg-slate-900/40 backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center`}
      style={{ touchAction: "none" }}
    >
      <div
        ref={knobRef}
        className="w-12 h-12 rounded-full border-2 border-cyan-300/60 bg-cyan-500/20"
        style={{ transition: "transform 0.05s linear" }}
      />
    </div>
  );
}

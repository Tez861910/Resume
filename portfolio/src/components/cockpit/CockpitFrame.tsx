/**
 * CockpitFrame
 *
 * Fixed pointer-events-none overlay that frames the viewport like a shuttle
 * canopy — thin corner brackets + subtle vignette + scanline. Purely cosmetic.
 */
export default function CockpitFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] select-none"
    >
      {/* corner brackets */}
      <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-cyan-300/35" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-cyan-300/35" />
      <span className="absolute left-3 bottom-3 h-4 w-4 border-l border-b border-cyan-300/35" />
      <span className="absolute right-3 bottom-3 h-4 w-4 border-r border-b border-cyan-300/35" />

      {/* edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(2,6,23,0.55) 100%)",
        }}
      />

      {/* subtle scanline */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 3px)",
        }}
      />
    </div>
  );
}

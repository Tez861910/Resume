import { useEffect, useState } from "react";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";
import {
  SECTION_WORLD_MAP,
  WORLD_SECTION_ORDER,
} from "../../three/world/sectionWorldMap";
import useScrollVelocity from "./useScrollVelocity";

/**
 * CockpitHUD
 *
 * Compact fixed strip docked just beneath the navbar. Replaces the oversized
 * WorldHUD + SectionProgress panels. Shows:
 *   • sector label (current section)
 *   • sector dots for quick navigation
 *   • thin scroll-progress rail
 *   • velocity readout (km/s)
 *
 * Mobile collapses to a single compact row — tap the sector label to expand.
 */
export default function CockpitHUD() {
  const world = useSharedWorldState();
  const { velocity } = useScrollVelocity();
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const active = SECTION_WORLD_MAP[world.activeSection];
  const kms = (velocity / 1000).toFixed(2);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setExpanded(false);
  };

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 z-[55] flex justify-center px-2 sm:px-3"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 64px)" }}
    >
      <div
        className="pointer-events-auto w-full max-w-5xl rounded-full border border-white/10 bg-slate-950/65 px-2 sm:px-3 py-1 sm:py-1.5 shadow-lg shadow-black/25 backdrop-blur-md"
        style={{
          boxShadow: `0 0 22px -10px ${active.accents.secondary}55`,
        }}
      >
        {/* Desktop row */}
        <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          {/* Status Indicator — Hiring/Open */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/12 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-100 whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            Open to Opportunities
          </span>

          <span
            className="inline-flex items-center gap-1.5 font-semibold"
            style={{ color: active.accents.emphasis }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: active.accents.primary,
                boxShadow: `0 0 10px ${active.accents.primary}`,
              }}
            />
            {active.label}
          </span>

          <div className="flex items-center gap-1.5">
            {WORLD_SECTION_ORDER.map((id) => {
              const isActive = id === world.activeSection;
              const c = SECTION_WORLD_MAP[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => goTo(id)}
                  title={c.label}
                  className="group flex items-center"
                  aria-label={`Jump to ${c.label}`}
                >
                  <span
                    className="block h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? 22 : 8,
                      background: isActive
                        ? c.accents.primary
                        : "rgba(255,255,255,0.22)",
                      boxShadow: isActive
                        ? `0 0 10px ${c.accents.primary}`
                        : undefined,
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div className="relative flex-1 h-[3px] rounded-full bg-white/8 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-150"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${active.accents.primary}, ${active.accents.secondary})`,
              }}
            />
          </div>

          <span className="tabular-nums text-cyan-200/90 font-semibold">
            {kms} km/s
          </span>
        </div>

        {/* Mobile row */}
        <div className="md:hidden space-y-1.5">
          {/* Status on mobile */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/12 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-100 whitespace-nowrap shrink-0">
              <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="hidden xs:inline">Open</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center gap-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-slate-200"
            aria-expanded={expanded}
          >
            <span
              className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full shrink-0"
              style={{
                background: active.accents.primary,
                boxShadow: `0 0 6px sm:0 0 8px ${active.accents.primary}`,
              }}
            />
            <span
              className="font-semibold truncate"
              style={{ color: active.accents.emphasis }}
            >
              {active.label}
            </span>
            <div className="ml-auto relative flex-1 min-w-[40px] h-[2px] rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${active.accents.primary}, ${active.accents.secondary})`,
                }}
              />
            </div>
            <span className="tabular-nums text-cyan-200/80 text-[9px] sm:text-[10px] shrink-0">
              {kms}
            </span>
          </button>

          {expanded && (
            <div className="mt-2 flex flex-wrap gap-1.5 border-t border-white/10 pt-2">
              {WORLD_SECTION_ORDER.map((id) => {
                const c = SECTION_WORLD_MAP[id];
                const isActive = id === world.activeSection;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTo(id)}
                    className="rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition-colors"
                    style={{
                      borderColor: isActive
                        ? c.accents.primary
                        : "rgba(255,255,255,0.14)",
                      color: isActive ? c.accents.emphasis : "#cbd5e1",
                      background: isActive
                        ? `${c.accents.primary}22`
                        : "transparent",
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

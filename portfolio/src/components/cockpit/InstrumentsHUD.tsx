import type { MutableRefObject } from "react";
import type { PlayerState } from "../../three/cockpit/usePlayerState";

interface Props {
  player: MutableRefObject<PlayerState>;
}

export default function InstrumentsHUD({ player }: Props) {
  const p = player.current;
  const hull = Math.max(0, Math.round(p.hull * 100));
  const shield = Math.max(0, Math.round(p.shield * 100));
  const speed = Math.abs(p.speed).toFixed(1);
  const boost = Math.max(0, Math.round(p.boost * 100));

  const isCritical = hull < 30;

  // Segmented Bar Component
  const SegmentedBar = ({
    value,
    color,
    segments = 20,
    glow = false,
  }: {
    value: number;
    color: string;
    segments?: number;
    glow?: boolean;
  }) => {
    const activeSegments = Math.ceil((value / 100) * segments);
    return (
      <div className="flex gap-[2px] h-3 w-full skew-x-[-15deg]">
        {Array.from({ length: segments }).map((_, i) => {
          const isActive = i < activeSegments;
          return (
            <div
              key={i}
              className="flex-1 transition-all duration-150"
              style={{
                backgroundColor: isActive ? color : "rgba(30, 41, 59, 0.5)",
                boxShadow: isActive && glow ? `0 0 8px ${color}` : "none",
                opacity: isActive ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative flex justify-center items-end pointer-events-none select-none">
      {/* Central HUD Wrapper */}
      <div className="relative flex flex-col md:flex-row items-end gap-6 pb-4">
        {/* Left Wing - Shields */}
        <div className="w-[180px] bg-slate-950/80 backdrop-blur-md border-t-2 border-r-2 border-cyan-500/50 p-3 rounded-tr-xl relative overflow-hidden shadow-[10px_0_20px_rgba(6,182,212,0.1)]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Deflector
              </span>
              <span className="text-xs text-cyan-200 font-mono tracking-wider">
                {shield}%
              </span>
            </div>
            <SegmentedBar value={shield} color="#06b6d4" glow />
          </div>
        </div>

        {/* Center Console - Velocity / Warnings */}
        <div className="w-[240px] flex flex-col items-center gap-2">
          {/* Critical Warning Banner */}
          <div
            className={`w-full py-1 text-center bg-rose-600/20 border border-rose-500/50 text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em] transition-opacity ${isCritical ? "opacity-100 animate-pulse" : "opacity-0"}`}
          >
            Critical Hull Integrity
          </div>

          <div className="bg-slate-950/80 backdrop-blur-md border-t-2 border-cyan-500/50 px-6 py-4 rounded-t-2xl w-full flex flex-col items-center relative overflow-hidden shadow-[0_-10px_20px_rgba(6,182,212,0.1)]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />

            <div className="text-[10px] text-cyan-500/80 uppercase tracking-[0.4em] mb-1">
              Velocity
            </div>
            <div className="text-3xl font-bold text-cyan-50 tracking-widest font-mono drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              {speed}
            </div>

            <div className="w-full mt-3 flex items-center gap-2">
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">
                ENG
              </span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-100"
                  style={{ width: `${boost}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Wing - Hull */}
        <div
          className={`w-[180px] bg-slate-950/80 backdrop-blur-md border-t-2 border-l-2 p-3 rounded-tl-xl relative overflow-hidden transition-colors duration-300 ${isCritical ? "border-rose-500/80 shadow-[-10px_0_20px_rgba(225,29,72,0.2)]" : "border-emerald-500/50 shadow-[-10px_0_20px_rgba(16,185,129,0.1)]"}`}
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]" />
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex justify-between items-end mb-1">
              <span
                className="text-xs text-emerald-200 font-mono tracking-wider"
                style={{ color: isCritical ? "#fda4af" : "#a7f3d0" }}
              >
                {hull}%
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: isCritical ? "#f43f5e" : "#10b981" }}
              >
                Integrity
              </span>
            </div>
            <SegmentedBar
              value={hull}
              color={isCritical ? "#f43f5e" : "#10b981"}
              glow={!isCritical}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

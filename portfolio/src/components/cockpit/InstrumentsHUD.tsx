import type { MutableRefObject } from "react";
import type { PlayerState } from "../../three/cockpit/usePlayerState";

interface Props {
  player: MutableRefObject<PlayerState>;
}

export default function InstrumentsHUD({ player }: Props) {
  const p = player.current;
  const hull = Math.round(p.hull * 100);
  const shield = Math.round(p.shield * 100);
  const speed = Math.abs(p.speed).toFixed(1);
  const boost = Math.round(p.boost * 100);

  const bar = (value: number, color: string) => (
    <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-150"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  );

  return (
    <div className="rounded-2xl border border-cyan-400/25 bg-slate-950/75 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-3 shadow-2xl shadow-cyan-900/40">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-emerald-300/80 mb-1">Hull</div>
          {bar(hull, "linear-gradient(90deg,#34d399,#10b981)")}
          <div className="text-[10px] text-emerald-200/80 mt-0.5 font-mono">{hull}%</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-cyan-300/80 mb-1">Shield</div>
          {bar(shield, "linear-gradient(90deg,#22d3ee,#0891b2)")}
          <div className="text-[10px] text-cyan-200/80 mt-0.5 font-mono">{shield}%</div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.22em] text-amber-300/80 mb-1">Velocity</div>
          {bar(boost, "linear-gradient(90deg,#fbbf24,#f97316)")}
          <div className="text-[10px] text-amber-200/80 mt-0.5 font-mono">{speed} u/s</div>
        </div>
      </div>
    </div>
  );
}

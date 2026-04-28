import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS } from "../../three/cockpit/missions";

export default function InventoryRail() {
  const { collected, openDrive, readoutsUnlocked } = useCockpit();

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 items-end">
      <div className="text-[9px] uppercase tracking-[0.24em] text-cyan-300/70 rounded bg-slate-950/75 border border-cyan-400/20 px-2 py-1 backdrop-blur-md">
        Drive Bay {collected.size}/{MISSIONS.length}
      </div>
      <div className="grid grid-cols-3 gap-1.5 max-w-[170px]">
        {MISSIONS.map((m) => {
          const owned = collected.has(m.id);
          const canOpen = owned && readoutsUnlocked;
          return (
            <button
              key={m.id}
              onClick={() => canOpen && openDrive(m.id)}
              className={`group relative w-12 h-8 sm:w-14 sm:h-9 rounded-md border transition flex items-center justify-center ${
                canOpen
                  ? "border-white/20 bg-slate-900/75 hover:scale-105 cursor-pointer"
                  : owned
                    ? "border-amber-500/20 bg-slate-950/70 cursor-not-allowed"
                    : "border-white/10 bg-slate-950/50 cursor-not-allowed"
              }`}
              style={
                canOpen
                  ? {
                      boxShadow: `0 0 14px ${m.accent}55, inset 0 0 10px ${m.accent}22`,
                      borderColor: `${m.accent}99`,
                    }
                  : undefined
              }
              title={
                canOpen
                  ? `${m.driveTitle} — ${m.driveTagline}`
                  : owned
                    ? "Encrypted until all drives are recovered and returned to base"
                    : "Locked"
              }
              aria-label={canOpen ? `Open ${m.driveTitle}` : "Locked drive slot"}
              disabled={!canOpen}
            >
              <span
                className="text-[8px] font-bold uppercase tracking-wider"
                style={{ color: canOpen ? m.accent : owned ? "#fbbf24" : "#475569" }}
              >
                {m.codename.split("-")[0].slice(0, 4)}
              </span>
              {owned && (
                <span
                  className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full"
                  style={{
                    background: m.accent,
                    boxShadow: `0 0 6px ${m.accent}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

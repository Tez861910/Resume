import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS } from "../../three/cockpit/missions";

export default function CommandCenter() {
  const { close, setGamePhase, collected, openDrive } = useCockpit();

  return (
    <div className="absolute inset-0 bg-slate-950 text-slate-300 font-mono overflow-hidden flex flex-col pointer-events-auto">
      {/* Background styling */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-slate-950 to-slate-950"></div>
        {/* Some grid lines */}
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          <h1 className="text-xl font-bold text-amber-100 uppercase tracking-[0.2em]">
            Command Center
          </h1>
        </div>
        <button
          onClick={close}
          className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-100 hover:bg-rose-500/30 active:scale-95 transition"
        >
          Abort Mission
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full flex-col md:flex-row">
        {/* Left Col: Briefing & Launch */}
        <div className="flex-1 flex flex-col gap-6 max-w-lg">
          <div className="rounded-xl border border-cyan-400/25 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl flex-1 flex flex-col">
            <h2 className="text-sm uppercase tracking-[0.25em] text-cyan-400 mb-4 border-b border-cyan-900/50 pb-2">
              Mission Briefing
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 text-sm text-cyan-100/80">
              <p>
                <span className="text-amber-400">[INTERCOM]</span> Pilot, the
                candidate's ship was destroyed in sector 4.
              </p>
              <p>
                <span className="text-amber-400">[INTERCOM]</span> Their career
                data was fragmented into {MISSIONS.length} encrypted hard drives
                and scattered across hostile territories.
              </p>
              <p>
                <span className="text-amber-400">[INTERCOM]</span> We need you
                to launch into the sandbox, retrieve all {MISSIONS.length}{" "}
                drives, and bring them back here for decryption.
              </p>
              <p>
                <span className="text-amber-400">[INTERCOM]</span> Hostile
                factions have already claimed the areas. You are authorized to
                engage. Watch your shields.
              </p>
            </div>
          </div>

          <button
            onClick={() => setGamePhase("space")}
            className="group relative rounded-xl border border-amber-500/50 bg-amber-500/10 p-6 overflow-hidden transition-all hover:bg-amber-500/20 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-bold text-amber-400 uppercase tracking-[0.3em]">
                Launch
              </span>
              <span className="text-[10px] text-amber-200/60 uppercase tracking-[0.2em]">
                Enter Space Sandbox
              </span>
            </div>
          </button>
        </div>

        {/* Right Col: Drives Collection */}
        <div className="flex-[1.5] rounded-xl border border-emerald-400/25 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-900/50 pb-2">
            <h2 className="text-sm uppercase tracking-[0.25em] text-emerald-400">
              Decrypted Drives
            </h2>
            <span className="text-xs text-emerald-200/60">
              {collected.size} / {MISSIONS.length} Recovered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
            {MISSIONS.map((m) => {
              const isCollected = collected.has(m.id);
              return (
                <button
                  key={m.id}
                  disabled={!isCollected}
                  onClick={() => isCollected && openDrive(m.id)}
                  className={`text-left rounded-lg border p-4 transition-all ${
                    isCollected
                      ? "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer"
                      : "border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.2em] mb-1"
                    style={{ color: isCollected ? m.accent : "#64748b" }}
                  >
                    {m.codename}
                  </div>
                  <div
                    className={`font-bold text-lg mb-1 ${isCollected ? "text-white" : "text-slate-500"}`}
                  >
                    {isCollected ? m.driveTitle : "ENCRYPTED"}
                  </div>
                  <div
                    className={`text-xs ${isCollected ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {isCollected
                      ? m.driveTagline
                      : "Data fragment missing. Retrieve from space."}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

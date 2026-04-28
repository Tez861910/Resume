import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { DRIVE_READOUTS, MISSIONS } from "../../three/cockpit/missions";

export default function CommandCenter() {
  const {
    close,
    setGamePhase,
    collected,
    openDrive,
    audio,
    resetProgress,
    setActiveStage,
    setActiveMissionId,
    collectDrive,
    readoutsUnlocked,
    setCurrentDialogue,
    clearMissionProgress,
  } = useCockpit();

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950 text-slate-300 font-mono overflow-hidden flex flex-col pointer-events-auto select-none">
      {/* Background styling - Deep Cyberpunk Vibe */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#083344_0%,_#020617_100%)]"></div>
        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            backgroundPosition: "center center",
          }}
        />
        {/* Scanlines */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            backgroundSize: "100% 2px, 3px 100%",
            pointerEvents: "none",
          }}
        />
      </div>

      <AnimatePresence>
        {booting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-cyan-500 uppercase tracking-[0.5em] text-sm animate-pulse">
                Initializing Command Center...
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex-1 flex flex-col h-full"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-5 border-b border-cyan-900/50 bg-slate-950/80 backdrop-blur-md shadow-[0_4px_20px_rgba(8,145,178,0.1)]">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <div className="absolute inset-0 border-2 border-amber-500/30 rounded-full animate-[spin_4s_linear_infinite]" />
                  <div className="absolute inset-1 border border-amber-400/50 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,1)] animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-50 uppercase tracking-[0.2em] leading-none">
                    Aegis Command
                  </h1>
                  <div className="text-[10px] text-cyan-500/80 uppercase tracking-[0.3em] mt-1">
                    System Terminal // Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={resetProgress}
                  className="group relative overflow-hidden rounded border border-amber-500/40 bg-slate-900 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 transition-all hover:bg-amber-500/10 active:scale-95"
                >
                  <span className="relative z-10">Wipe Data</span>
                  <div className="absolute inset-0 bg-amber-500/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
                <button
                  onClick={close}
                  className="group relative overflow-hidden rounded border border-rose-500/40 bg-slate-900 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200 transition-all hover:bg-rose-500/10 active:scale-95"
                >
                  <span className="relative z-10">Close Uplink</span>
                  <div className="absolute inset-0 bg-rose-500/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex gap-8 p-8 overflow-hidden max-w-[1400px] mx-auto w-full flex-col lg:flex-row items-stretch">
              {/* Left Col: Briefing & Launch */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="flex-1 flex flex-col gap-6 max-w-lg h-full"
              >
                <div className="relative rounded-xl border border-cyan-500/30 bg-slate-900/60 p-6 backdrop-blur-md flex-1 flex flex-col overflow-hidden group">
                  {/* Decorative corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />

                  <div className="flex items-center gap-3 mb-6 border-b border-cyan-900/60 pb-3">
                    <div className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] uppercase tracking-widest border border-cyan-500/30">
                      Log
                    </div>
                    <h2 className="text-sm uppercase tracking-[0.2em] text-cyan-100">
                      Mission Briefing
                    </h2>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-5 text-sm text-cyan-50/80 pr-2 custom-scrollbar">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="text-cyan-400 font-bold tracking-widest mr-2">
                        [SYS_ADMIN]
                      </span>
                      Pilot, the target candidate's ship was destroyed in sector
                      4.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <span className="text-cyan-400 font-bold tracking-widest mr-2">
                        [SYS_ADMIN]
                      </span>
                      Their career data was fragmented into {MISSIONS.length}{" "}
                      encrypted hard drives. They are currently scattered across
                      hostile territories.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <span className="text-amber-400 font-bold tracking-widest mr-2">
                        [WARNING]
                      </span>
                      Hostile factions have established blockades around the
                      data signatures. You are authorized to engage.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.0 }}
                      className="p-3 bg-cyan-950/40 border border-cyan-900/50 rounded"
                    >
                      <div className="text-[10px] text-cyan-500 mb-1 uppercase tracking-widest">
                        Objective
                      </div>
                      Launch into the sandbox, retrieve all {MISSIONS.length}{" "}
                      drives, and return to base for decryption.
                    </motion.div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audio.initContext();
                    audio.startEngine();
                    collectDrive("launch");
                    clearMissionProgress("profile");
                    setActiveMissionId("profile");
                    setActiveStage(1);
                    setCurrentDialogue("profile");
                    setGamePhase("dialogue");
                  }}
                  className="group relative rounded-xl border border-amber-500/50 bg-amber-500/10 p-8 overflow-hidden transition-all hover:bg-amber-500/20 hover:border-amber-400 active:scale-[0.98] shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-400/40 group-hover:scale-110 transition-transform duration-500">
                      <svg
                        className="w-6 h-6 text-amber-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-amber-300 uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(253,230,138,0.5)]">
                      Launch
                    </span>
                    <span className="text-[11px] text-amber-200/60 uppercase tracking-[0.3em]">
                      Initiate Sandbox Sequence
                    </span>
                  </div>
                </button>
              </motion.div>

              {/* Right Col: Review Room */}
              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="flex-[1.5] relative rounded-xl border border-emerald-500/30 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl flex flex-col overflow-hidden h-full"
              >
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400/50" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400/50" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400/50" />

                <div className="flex items-center justify-between mb-6 border-b border-emerald-900/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase tracking-widest border border-emerald-500/30">
                      Review Room
                    </div>
                    <h2 className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                      Hard-drive decrypt monitors
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1 rounded border border-emerald-900/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-300 font-bold tracking-widest">
                      {collected.size} / {MISSIONS.length}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {[0, 1, 2].map((screen) => {
                    const start = screen * 2;
                    const monitorDrives = MISSIONS.slice(start, start + 2);
                    return (
                      <div
                        key={screen}
                        className="relative min-h-[220px] rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 shadow-[0_0_20px_rgba(8,145,178,0.12)]"
                      >
                        <div className="absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                        <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                          <span className="text-cyan-300/80">
                            Monitor {screen + 1}
                          </span>
                          <span className="text-emerald-300/70">
                            {readoutsUnlocked ? "Decrypted" : "Locked"}
                          </span>
                        </div>

                        {readoutsUnlocked ? (
                          <div className="space-y-4">
                            {monitorDrives.map((mission) => {
                              const readout = DRIVE_READOUTS[mission.id];
                              return (
                                <div
                                  key={mission.id}
                                  className="rounded-xl border border-white/10 bg-slate-950/70 p-3"
                                >
                                  <div
                                    className="text-[10px] font-bold uppercase tracking-[0.24em]"
                                    style={{ color: mission.accent }}
                                  >
                                    {mission.codename}
                                  </div>
                                  <div className="mt-2 text-sm font-semibold text-amber-100">
                                    {readout.headline}
                                  </div>
                                  <div className="mt-1 text-[11px] leading-relaxed text-slate-300">
                                    {readout.lines.slice(0, 2).join(" · ")}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex h-[170px] flex-col justify-between rounded-xl border border-white/8 bg-slate-950/60 p-4 text-[11px] text-slate-400">
                            <div>
                              <div className="text-xs uppercase tracking-[0.22em] text-amber-300/80">
                                Access Protocol
                              </div>
                              <p className="mt-3 leading-relaxed">
                                The hard drives stay unreadable in the field.
                                Recover the full set, return to base, and the
                                review wall will decrypt them here.
                              </p>
                            </div>
                            <div className="rounded border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-amber-200/80">
                              Awaiting all {MISSIONS.length} drives
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4 custom-scrollbar content-start">
                  {MISSIONS.map((m, i) => {
                    const isCollected = collected.has(m.id);
                    const canOpen = isCollected && readoutsUnlocked;
                    return (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        key={m.id}
                        disabled={!canOpen}
                        onClick={() => canOpen && openDrive(m.id)}
                        className={`group relative text-left rounded-lg border p-5 transition-all overflow-hidden ${
                          canOpen
                            ? "border-emerald-500/40 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 hover:border-emerald-400 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                            : isCollected
                              ? "border-amber-500/20 bg-slate-900/70 cursor-not-allowed"
                              : "border-slate-800 bg-slate-900/40 opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {canOpen && (
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border bg-slate-950/50"
                              style={{
                                color: isCollected ? m.accent : "#64748b",
                                borderColor: isCollected
                                  ? `${m.accent}40`
                                  : "#334155",
                              }}
                            >
                              {m.codename}
                            </div>
                            {canOpen && (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,1)]" />
                            )}
                          </div>

                          <div
                            className={`font-bold text-lg mb-2 tracking-wide ${
                              canOpen
                                ? "text-emerald-50 drop-shadow-md"
                                : isCollected
                                  ? "text-amber-100"
                                : "text-slate-600"
                            }`}
                          >
                            {isCollected ? m.driveTitle : "ENCRYPTED_"}
                          </div>

                          <div
                            className={`text-[11px] leading-relaxed ${
                              canOpen
                                ? "text-emerald-100/70"
                                : isCollected
                                  ? "text-amber-200/70"
                                : "text-slate-700"
                            }`}
                          >
                            {canOpen
                              ? m.driveTagline
                              : isCollected
                                ? "Recovered in the field. Return only after the full set is secured."
                                : "Data fragment missing. Launch to retrieve."}
                          </div>
                        </div>

                        {canOpen && (
                          <div className="absolute bottom-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                            <svg
                              className="w-5 h-5 text-emerald-400/50"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                              />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

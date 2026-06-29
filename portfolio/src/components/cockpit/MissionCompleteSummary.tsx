import { motion } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS } from "../../three/cockpit/missions";

export default function MissionCompleteSummary() {
  const { stats, peacefulResolutions, resetProgress, close } = useCockpit();

  const totalMissions = MISSIONS.length;
  const peacefulCount = peacefulResolutions.size;

  const handleViewPortfolio = () => {
    close();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReplay = () => {
    resetProgress();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[255] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="w-[min(480px,90vw)] rounded-2xl border-2 border-amber-500/40 bg-slate-900/95 p-8 shadow-2xl shadow-amber-900/20 font-mono"
      >
        <div className="text-center mb-6">
          <div className="text-[10px] uppercase tracking-[0.5em] text-cyan-400/80 mb-2">
            Mission Complete
          </div>
          <div className="text-2xl font-bold text-amber-50 tracking-[0.15em]">
            DOSSIER ASSEMBLED
          </div>
          <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em]">
            All 6 drives recovered and decrypted
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-cyan-500/20">
            <div className="text-2xl font-bold text-cyan-300">{totalMissions}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">Missions</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-emerald-500/20">
            <div className="text-2xl font-bold text-emerald-300">{peacefulCount}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">Peaceful</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-rose-500/20">
            <div className="text-2xl font-bold text-rose-300">{stats.kills}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">Hostiles Neutralized</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-amber-500/20">
            <div className="text-2xl font-bold text-amber-300">{stats.deaths}</div>
            <div className="text-[9px] uppercase tracking-[0.2em] text-slate-400 mt-1">Losses</div>
          </div>
        </div>

        {peacefulCount > 0 && (
          <div className="mb-6 text-center">
            <div className="text-[10px] text-emerald-400/80 uppercase tracking-[0.2em]">
              {peacefulCount} of {totalMissions} encounters resolved diplomatically
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleViewPortfolio}
            className="w-full rounded-lg border border-amber-500/50 bg-amber-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200 transition-all hover:bg-amber-500/20 hover:border-amber-400 active:scale-95"
          >
            View Portfolio
          </button>
          <button
            onClick={handleReplay}
            className="w-full rounded-lg border border-slate-500/30 bg-slate-800/50 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 transition-all hover:bg-slate-700/50 hover:border-slate-400 active:scale-95"
          >
            Replay Missions
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

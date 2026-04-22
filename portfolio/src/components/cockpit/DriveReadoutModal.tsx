import { motion } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import {
  DRIVE_READOUTS,
  MISSION_BY_ID,
  type MissionId,
} from "../../three/cockpit/missions";

export default function DriveReadoutModal({ missionId }: { missionId: MissionId }) {
  const { closeDrive } = useCockpit();
  const readout = DRIVE_READOUTS[missionId];
  const mission = MISSION_BY_ID[missionId];

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={closeDrive}
      />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative w-full max-w-lg rounded-2xl border bg-slate-950/90 backdrop-blur-xl overflow-hidden shadow-2xl"
        style={{
          borderColor: `${mission.accent}66`,
          boxShadow: `0 0 40px ${mission.accent}33`,
        }}
      >
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${mission.accent}, transparent)`,
          }}
        />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.28em] font-bold"
                style={{ color: mission.accent }}
              >
                {mission.codename} · {mission.driveTitle}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                {readout.headline}
              </h2>
              <div className="text-sm text-slate-400 mt-0.5">
                {readout.subheadline}
              </div>
            </div>
            <button
              onClick={closeDrive}
              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-slate-300 hover:bg-white/10 active:scale-95"
              aria-label="Close drive"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-1.5 text-sm text-slate-200/90 leading-relaxed">
            {readout.lines.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: mission.accent }}
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          {readout.links && (
            <div className="mt-4 flex flex-wrap gap-2">
              {readout.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/10"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

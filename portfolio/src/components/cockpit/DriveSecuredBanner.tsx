import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSION_BY_ID } from "../../three/cockpit/missions";

export default function DriveSecuredBanner() {
  const { lastCollectedDrive, clearLastCollectedDrive } = useCockpit();

  useEffect(() => {
    if (!lastCollectedDrive) return;
    const t = setTimeout(() => clearLastCollectedDrive(), 3500);
    return () => clearTimeout(t);
  }, [lastCollectedDrive, clearLastCollectedDrive]);

  const mission = lastCollectedDrive ? MISSION_BY_ID[lastCollectedDrive] : null;

  return (
    <AnimatePresence>
      {mission && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 z-[255] pointer-events-none"
        >
          <div
            className="px-8 py-4 rounded-lg border-2 backdrop-blur-md shadow-2xl"
            style={{
              borderColor: mission.accent,
              backgroundColor: "rgba(2, 6, 23, 0.85)",
              boxShadow: `0 0 30px ${mission.accent}40`,
            }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mission.accent }}
              />
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-400/80 mb-1">
                  Drive Secured
                </div>
                <div
                  className="text-lg font-bold uppercase tracking-[0.15em]"
                  style={{ color: mission.accent }}
                >
                  {mission.driveTitle}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 tracking-wider">
                  {mission.codename}
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mission.accent }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

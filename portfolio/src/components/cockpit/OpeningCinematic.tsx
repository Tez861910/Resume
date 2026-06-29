import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CINEMATIC_LINES = [
  "AEGIS STATION // SECTOR 7",
  "Recovery operative assigned",
  "Candidate: Tejas S — Full-Stack Product Developer",
  "Status: Career data fragmented across 6 drives",
  "Hostile factions detected in all sectors",
  "Objective: Recover all drives. Return to base. Decrypt the archive.",
];

export default function OpeningCinematic({ onComplete }: { onComplete: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (lineIndex >= CINEMATIC_LINES.length) {
      setFading(true);
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIndex((prev) => prev + 1), 1400);
    return () => clearTimeout(t);
  }, [lineIndex, onComplete]);

  return (
    <AnimatePresence>
      {!fading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-[260] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none"
        >
          <div className="text-center space-y-4 max-w-lg px-6">
            {CINEMATIC_LINES.slice(0, lineIndex + 1).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`text-sm tracking-[0.15em] ${
                  i === 0
                    ? "text-cyan-400 text-xs uppercase tracking-[0.5em]"
                    : i === CINEMATIC_LINES.length - 1
                      ? "text-amber-300 font-bold text-base mt-4"
                      : "text-slate-300"
                }`}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS } from "../../three/cockpit/missions";

export default function DialogueOverlay() {
  const {
    currentDialogue,
    setCurrentDialogue,
    completeNegotiation,
    setGamePhase,
    audio,
  } = useCockpit();
  const [lineIndex, setLineIndex] = useState(0);
  const [showFailResponse, setShowFailResponse] = useState(false);

  const mission = MISSIONS.find((m) => m.id === currentDialogue);

  useEffect(() => {
    // Reset when dialogue changes
    setLineIndex(0);
    setShowFailResponse(false);

    // Start radio static
    audio.startStatic();
    return () => {
      audio.stopStatic();
    };
  }, [currentDialogue, audio]);

  if (!mission || !mission.negotiation) return null;

  const { speaker, lines, failResponse } = mission.negotiation;
  const currentLine = showFailResponse ? failResponse : lines[lineIndex];
  const isLastLine = lineIndex === lines.length - 1;

  const handleNext = () => {
    if (showFailResponse) {
      completeNegotiation(mission.id);
      setGamePhase("space");
      setCurrentDialogue(null);
      return;
    }

    if (isLastLine) {
      setShowFailResponse(true);
    } else {
      setLineIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="absolute inset-0 z-[250] flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[min(500px,90vw)] rounded-2xl border border-cyan-400/30 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-900/20 font-mono"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-cyan-900/50 pb-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-bold">
            Incoming Transmission
          </h2>
        </div>

        <div className="mb-6 min-h-[100px]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">
            FROM: <span className="text-amber-400">{speaker}</span>
          </div>
          <motion.p
            key={currentLine}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-sm leading-relaxed ${showFailResponse ? "text-rose-300" : "text-cyan-50"}`}
          >
            {currentLine}
          </motion.p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleNext}
            className={`rounded-lg border px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
              showFailResponse
                ? "border-rose-500/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                : "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
            }`}
          >
            {showFailResponse
              ? "Initiate Combat"
              : isLastLine
                ? "Finalize Negotiation"
                : "Continue"}
          </button>
        </div>
      </motion.div>

      {/* Static noise effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}

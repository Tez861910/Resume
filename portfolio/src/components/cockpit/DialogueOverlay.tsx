import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS } from "../../three/cockpit/missions";

export default function DialogueOverlay() {
  const {
    currentDialogue,
    setCurrentDialogue,
    completeNegotiation,
    setGamePhase,
    setActiveStage,
    audio,
    collectDrive,
    markPeaceful,
  } = useCockpit();

  const [roundIndex, setRoundIndex] = useState(0);
  const [persuasion, setPersuasion] = useState(0);
  const [npcResponse, setNpcResponse] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPeaceful, setIsPeaceful] = useState(false);

  const mission = MISSIONS.find((m) => m.id === currentDialogue);

  useEffect(() => {
    setRoundIndex(0);
    setPersuasion(0);
    setNpcResponse(null);
    setShowResult(false);
    setIsPeaceful(false);
    audio.startStatic();
    return () => {
      audio.stopStatic();
    };
  }, [currentDialogue, audio]);

  if (!mission || !mission.negotiation) return null;

  const { speaker, faction, rounds, peacefulThreshold, peacefulResponse, failResponse } = mission.negotiation;
  const currentRound = rounds[roundIndex];
  const isLastRound = roundIndex === rounds.length - 1;

  const handleChoice = (choiceIndex: number) => {
    const choice = currentRound.choices[choiceIndex];
    const newPersuasion = persuasion + choice.persuasion;
    setPersuasion(newPersuasion);
    setNpcResponse(choice.npcResponse);

    if (isLastRound) {
      setTimeout(() => {
        setShowResult(true);
        const peaceful = newPersuasion >= peacefulThreshold;
        setIsPeaceful(peaceful);
        if (peaceful) {
          markPeaceful(mission.id);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setNpcResponse(null);
        setRoundIndex((prev) => prev + 1);
      }, 1500);
    }
  };

  const handleProceed = () => {
    completeNegotiation(mission.id);
    if (isPeaceful) {
      audio.playDriveCollect();
      collectDrive(mission.id);
      audio.stopEngine();
      audio.stopMusic();
      setActiveStage(0);
      setGamePhase("homebase");
      setCurrentDialogue(null);
    } else {
      setGamePhase("space");
      setCurrentDialogue(null);
    }
  };

  const persuasionPercent = Math.min(100, Math.max(0, (persuasion / peacefulThreshold) * 100));

  return (
    <div className="absolute inset-0 z-[250] flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-[min(540px,92vw)] rounded-2xl border border-cyan-400/30 bg-slate-900/90 p-6 shadow-2xl shadow-cyan-900/20 font-mono"
        role="dialog"
        aria-modal="true"
        aria-label="Incoming transmission"
      >
        <div className="flex items-center justify-between mb-4 border-b border-cyan-900/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-300 font-bold">
              Incoming Transmission
            </h2>
          </div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider">
            Round {roundIndex + 1}/{rounds.length}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">FROM:</span>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{faction}</span>
          <span className="text-[9px] text-slate-600">({speaker})</span>
        </div>

        <div className="mb-4 min-h-[60px]">
          <AnimatePresence mode="wait">
            {npcResponse ? (
              <motion.p
                key="response"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm leading-relaxed text-slate-300"
              >
                {npcResponse}
              </motion.p>
            ) : showResult ? (
              <motion.p
                key="result"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm leading-relaxed font-bold ${isPeaceful ? "text-emerald-300" : "text-rose-300"}`}
              >
                {isPeaceful ? peacefulResponse : failResponse}
              </motion.p>
            ) : (
              <motion.p
                key={`npc-${roundIndex}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm leading-relaxed text-cyan-50"
              >
                {currentRound.npcLine}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Persuasion</span>
            <span className="text-[9px] font-mono text-cyan-400">{Math.round(persuasionPercent)}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: persuasionPercent >= 100
                  ? "linear-gradient(90deg, #10b981, #34d399)"
                  : persuasionPercent >= 50
                    ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                    : "linear-gradient(90deg, #64748b, #94a3b8)",
              }}
              animate={{ width: `${persuasionPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {showResult ? (
            <button
              onClick={handleProceed}
              className={`w-full rounded-lg border px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 ${
                isPeaceful
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                  : "border-rose-500/50 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
              }`}
            >
              {isPeaceful ? "Accept Drive & Return to Base" : "Initiate Combat"}
            </button>
          ) : !npcResponse ? (
            currentRound.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className="w-full text-left rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3 text-[11px] text-cyan-100 transition-all hover:bg-cyan-500/15 hover:border-cyan-400/50 active:scale-[0.98]"
              >
                <span className="text-amber-400 mr-2">[{String.fromCharCode(65 + i)}]</span>
                {choice.text}
              </button>
            ))
          ) : null}
        </div>
      </motion.div>

      <div className="absolute inset-0 cockpit-noise opacity-[0.03]" />
    </div>
  );
}

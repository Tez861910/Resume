import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MutableRefObject } from "react";
import type { PlayerState } from "../../three/cockpit/usePlayerState";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";

interface Props {
  player: MutableRefObject<PlayerState>;
}

type DeathPhase = "idle" | "destroyed" | "reinitializing" | "restored";

export default function DeathOverlay({ player }: Props) {
  const { audio } = useCockpit();
  const [phase, setPhase] = useState<DeathPhase>("idle");
  const [countdown, setCountdown] = useState(3);
  const wasDeadRef = useRef(false);
  const wasRespawningRef = useRef(false);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      const p = player.current;
      const isDead = p.hull <= 0;

      if (isDead && !wasDeadRef.current) {
        wasDeadRef.current = true;
        setPhase("destroyed");
        audio.playDeath();
        setCountdown(3);

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setPhase("reinitializing");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      if (!isDead && wasDeadRef.current && !wasRespawningRef.current) {
        wasRespawningRef.current = true;
        setPhase("restored");
        audio.playRespawn();

        setTimeout(() => {
          setPhase("idle");
          wasDeadRef.current = false;
          wasRespawningRef.current = false;
        }, 1500);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [player, audio]);

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[260] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-sm" />

          <div className="relative text-center space-y-4">
            {phase === "destroyed" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-3"
              >
                <div className="text-4xl sm:text-5xl font-bold text-rose-400 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]">
                  SHIP DESTROYED
                </div>
                <div className="text-sm text-rose-200/80 uppercase tracking-[0.3em]">
                  Hull integrity: 0%
                </div>
                <div className="text-2xl font-mono text-rose-300 mt-6">
                  Reinitializing in {countdown}...
                </div>
              </motion.div>
            )}

            {phase === "reinitializing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="text-2xl font-bold text-cyan-300 tracking-[0.2em] animate-pulse">
                  REINITIALIZING SYSTEMS...
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {phase === "restored" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="text-3xl font-bold text-emerald-400 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
                  SYSTEMS RESTORED
                </div>
                <div className="text-xs text-emerald-200/70 uppercase tracking-[0.3em]">
                  All systems nominal
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaGamepad, FaRocket } from "react-icons/fa";
import { useGame } from "../three/game/GameContext";
import DevSprintGame from "../three/game/DevSprintGame";

/**
 * Challenge
 *
 * Dedicated `#challenge` section that hosts the Dev Sprint mini-game inline.
 * When idle, shows a "hangar bay" intro card with best score + launch button.
 * When the game is active, the game canvas takes over the inner container.
 */
export default function Challenge() {
  const { isActive, session, launch, resetProgress } = useGame();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="challenge"
      ref={ref}
      className="relative py-16 sm:py-20"
      aria-label="Dev Sprint Challenge"
    >
      <div className="section-container !py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
              <FaRocket className="text-[10px]" /> Challenge Bay
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              Dev Sprint · Inline Mission
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-amber-100 mb-3">
            Dev Sprint Challenge
          </h2>
          <p className="text-sm text-slate-300/80 max-w-2xl mb-8">
            Pilot the shuttle, collect the tech-stack signals, dodge bugs. Your
            best run stays pinned to the portfolio as a systems log.
          </p>

          <div className="relative h-[min(72vh,600px)] sm:h-[min(72vh,640px)] min-h-[360px] sm:min-h-[420px] rounded-2xl border border-white/10 bg-slate-950/55 overflow-hidden shadow-[0_0_32px_-14px_rgba(34,211,238,0.5)]">
            {isActive ? (
              <DevSprintGame />
            ) : (
              <IdleHangar
                bestScore={session.bestScore}
                launchCount={session.launchCount}
                onLaunch={() => launch("challenge-section")}
                onReset={resetProgress}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface IdleHangarProps {
  bestScore: number | null;
  launchCount: number;
  onLaunch: () => void;
  onReset: () => void;
}

function IdleHangar({
  bestScore,
  launchCount,
  onLaunch,
  onReset,
}: IdleHangarProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.14) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(251,191,36,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-cyan-200/80">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse" />
          Hangar Bay · Standby
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-amber-100">
          Ready for launch?
        </h3>

        <p className="text-xs sm:text-sm text-slate-300/80 max-w-lg px-2">
          A short arcade run wired into the portfolio. Tap/mouse to steer,
          <kbd className="mx-1 rounded bg-white/10 px-1 py-0.5 text-[9px] sm:text-[10px] text-slate-200">
            W A S D
          </kbd>
          to boost, <kbd className="rounded bg-white/10 px-1 py-0.5 text-[9px] sm:text-[10px] text-slate-200">
            ESC
          </kbd>{" "}
          to return.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] px-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1 text-slate-300 whitespace-nowrap">
            Best:{" "}
            <span className="text-amber-200 tabular-nums">
              {bestScore ?? "—"}
            </span>
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1 text-slate-300 whitespace-nowrap">
            Runs:{" "}
            <span className="text-cyan-200 tabular-nums">{launchCount}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 px-2">
          <button
            type="button"
            onClick={onLaunch}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/15 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-amber-100 transition-all duration-150 hover:border-amber-300/70 hover:bg-amber-300/25 active:scale-95 whitespace-nowrap"
          >
            <FaGamepad className="text-xs sm:text-base" />
            <span className="hidden xs:inline">{launchCount > 0 ? "Launch another run" : "Launch mission"}</span>
            <span className="inline xs:hidden">{launchCount > 0 ? "Retry" : "Launch"}</span>
          </button>
          {bestScore !== null && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-slate-400/70 hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              reset log
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

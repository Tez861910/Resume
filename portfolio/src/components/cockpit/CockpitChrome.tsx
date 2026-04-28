import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CockpitInputApi } from "../../three/cockpit/useCockpitInput";
import type { PlayerState } from "../../three/cockpit/usePlayerState";
import { MISSIONS, type MissionId } from "../../three/cockpit/missions";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import MissionTerminal from "./MissionTerminal";
import Minimap from "./Minimap";
import InstrumentsHUD from "./InstrumentsHUD";
import InventoryRail from "./InventoryRail";
import DriveReadoutModal from "./DriveReadoutModal";
import MobileControls from "./MobileControls";

interface Props {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  enemyCounts: MutableRefObject<Record<MissionId, number>>;
}

/** DOM/CSS overlay drawn "inside the cockpit" over the R3F canvas. */
export default function CockpitChrome({ input, player, enemyCounts }: Props) {
  const {
    close,
    currentMission,
    progress,
    openDriveId,
    cameraView,
    toggleCameraView,
    setGamePhase,
    audio,
  } = useCockpit();

  // Poll player state each frame for instruments & compass
  const [, tick] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      tick((v) => (v + 1) % 1_000_000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const hullDamage = 1 - Math.max(0, Math.min(1, player.current.hull));
  const damageOpacity = hullDamage * 0.45; // Max 45% red overlay when hull is near 0

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{ zIndex: 1 }}
    >
      {/* Damage overlay */}
      {damageOpacity > 0 && (
        <div
          className="absolute inset-0 bg-rose-600 pointer-events-none transition-opacity duration-75"
          style={{ opacity: damageOpacity }}
        />
      )}

      {/* Canopy vignette + struts */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <radialGradient id="canopyVignette" cx="50%" cy="48%" r="75%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.9)" />
          </radialGradient>
          <linearGradient id="canopyGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(80,120,180,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        <rect width="1000" height="1000" fill="url(#canopyVignette)" />
        <rect width="1000" height="200" fill="url(#canopyGlass)" />
        {/* Canopy struts */}
        <path
          d="M0,0 L120,0 L260,500 L120,1000 L0,1000 Z"
          fill="rgba(6,10,20,0.92)"
          stroke="rgba(125,211,252,0.25)"
          strokeWidth="1"
        />
        <path
          d="M1000,0 L880,0 L740,500 L880,1000 L1000,1000 Z"
          fill="rgba(6,10,20,0.92)"
          stroke="rgba(125,211,252,0.25)"
          strokeWidth="1"
        />
        {/* Central top strut */}
        <path
          d="M420,0 L580,0 L510,60 Z"
          fill="rgba(6,10,20,0.9)"
          stroke="rgba(125,211,252,0.25)"
          strokeWidth="1"
        />
        {/* Bottom dashboard */}
        <path
          d="M120,1000 L260,500 L740,500 L880,1000 Z"
          fill="rgba(6,10,20,0.94)"
          stroke="rgba(125,211,252,0.22)"
          strokeWidth="1"
        />
        {/* Subtle scanline */}
        <rect
          width="1000"
          height="1000"
          fill="url(#scanlinePattern)"
          opacity="0.04"
        />
      </svg>

      {/* Top bar: mission title + progress + exit */}
      <div className="absolute top-0 left-0 right-0 px-4 sm:px-8 pt-4 sm:pt-6 flex items-start justify-between gap-3 pointer-events-none">
        {/* Mission Readout */}
        <div className="relative pointer-events-auto bg-slate-950/80 backdrop-blur-md px-6 py-3 border-l-4 border-cyan-500 shadow-[10px_10px_20px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />

          <div className="flex items-center gap-3 mb-1">
            <div className="text-[9px] uppercase tracking-[0.4em] text-cyan-400 font-bold">
              Mission {currentMission.index + 1} // {MISSIONS.length}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <div className="text-xl sm:text-2xl font-bold text-amber-50 uppercase tracking-[0.1em] drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
            {currentMission.title}
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/60 mt-1 flex items-center gap-2">
            <span>{currentMission.codename}</span>
            <span className="text-cyan-500/50">|</span>
            <span>
              Drives {progress.collected}/{progress.total}
            </span>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-1 rounded bg-slate-950/80 px-2 py-1.5 backdrop-blur-md border border-cyan-500/20">
            {(["mute", "low", "high"] as const).map((level) => (
              <button
                key={level}
                onClick={() => audio.setOutputLevel(level)}
                className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.24em] transition ${
                  audio.outputLevel === level
                    ? "bg-cyan-500/20 text-cyan-100"
                    : "text-cyan-300/70 hover:text-cyan-100"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={toggleCameraView}
            className="pointer-events-auto relative overflow-hidden group rounded bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200 transition-all hover:border-cyan-400 hover:text-cyan-50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95"
          >
            <span className="relative z-10">
              {cameraView === "first" ? "CAM: 3RD" : "CAM: 1ST"}
            </span>
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>

          <button
            onClick={() => setGamePhase("base")}
            className="pointer-events-auto relative overflow-hidden group rounded bg-slate-950/80 backdrop-blur-md border border-amber-500/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200 transition-all hover:border-amber-400 hover:text-amber-50 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] active:scale-95"
          >
            <span className="relative z-10">Return to Base</span>
            <div className="absolute inset-0 bg-amber-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>

          <button
            onClick={close}
            className="pointer-events-auto relative overflow-hidden group rounded bg-slate-950/80 backdrop-blur-md border border-rose-500/30 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-200 transition-all hover:border-rose-400 hover:text-rose-50 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95"
          >
            <span className="relative z-10">Abort</span>
            <div className="absolute inset-0 bg-rose-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
        </div>
      </div>

      {/* Modern Flight Sim Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]"
        >
          {/* Center Dot */}
          <circle cx="100" cy="100" r="1.5" fill="#38bdf8" />

          {/* Inner Reticle Brackets */}
          <path
            d="M 85 95 L 85 85 L 95 85"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <path
            d="M 115 95 L 115 85 L 105 85"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <path
            d="M 85 105 L 85 115 L 95 115"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <path
            d="M 115 105 L 115 115 L 105 115"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />

          {/* Outer Ring (Dashed) */}
          <circle
            cx="100"
            cy="100"
            r="35"
            fill="none"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />

          {/* Pitch Ladder (Static UI representation) */}
          <path
            d="M 60 100 L 75 100"
            fill="none"
            stroke="rgba(56,189,248,0.5)"
            strokeWidth="1.5"
          />
          <path
            d="M 125 100 L 140 100"
            fill="none"
            stroke="rgba(56,189,248,0.5)"
            strokeWidth="1.5"
          />
          <path
            d="M 65 120 L 75 120 M 75 120 L 75 125"
            fill="none"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
          />
          <path
            d="M 135 120 L 125 120 M 125 120 L 125 125"
            fill="none"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
          />
          <path
            d="M 65 80 L 75 80 M 75 80 L 75 75"
            fill="none"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
          />
          <path
            d="M 135 80 L 125 80 M 125 80 L 125 75"
            fill="none"
            stroke="rgba(56,189,248,0.3)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Radar (top-center under canopy strut) */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 pointer-events-none scale-90 sm:scale-100">
        <Minimap />
      </div>

      {/* Instruments (bottom dashboard center) */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 pointer-events-none w-[min(560px,94vw)]">
        <InstrumentsHUD player={player} />
      </div>

      {/* Mission terminal (bottom-left) */}
      <div className="absolute left-3 sm:left-6 bottom-[160px] sm:bottom-[150px] max-w-[min(360px,70vw)] pointer-events-auto">
        <MissionTerminal enemyCounts={enemyCounts} />
      </div>

      {/* Inventory rail (right side) */}
      <div className="absolute right-3 sm:right-6 top-20 sm:top-28 pointer-events-auto">
        <InventoryRail />
      </div>

      {/* Mobile controls (touch) */}
      {isMobile && <MobileControls input={input} />}

      {/* Keyboard hint (desktop only, first few seconds) */}
      {!isMobile && <KbdHint />}

      {/* Drive readout modal */}
      <AnimatePresence>
        {openDriveId && <DriveReadoutModal missionId={openDriveId} />}
      </AnimatePresence>
    </div>
  );
}

function KbdHint() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-[90px] right-6 rounded-lg border border-white/10 bg-slate-950/75 px-3 py-2 text-[10px] text-slate-300 font-mono"
        >
          <div>
            <span className="text-amber-200">W/S</span> throttle ·{" "}
            <span className="text-amber-200">A/D</span> yaw ·{" "}
            <span className="text-amber-200">Q/E</span> roll
          </div>
          <div>
            <span className="text-amber-200">Mouse drag</span> pitch/aim ·{" "}
            <span className="text-amber-200">Space / click</span> fire
          </div>
          <div>
            <span className="text-amber-200">Shift</span> boost ·{" "}
            <span className="text-amber-200">V</span> view ·{" "}
            <span className="text-amber-200">Esc</span> exit
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

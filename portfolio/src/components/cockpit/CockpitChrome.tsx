import { useEffect, useState } from "react";
import type { MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CockpitInputApi } from "../../three/cockpit/useCockpitInput";
import type { PlayerState } from "../../three/cockpit/usePlayerState";
import { MISSIONS, type MissionId } from "../../three/cockpit/missions";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import MissionTerminal from "./MissionTerminal";
import RadarCompass from "./RadarCompass";
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
      <div className="absolute top-0 left-0 right-0 px-3 sm:px-6 pt-3 sm:pt-4 flex items-start justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto rounded-xl border border-cyan-400/25 bg-slate-950/70 px-3 py-2 backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/80">
            Mission {currentMission.index + 1} / {MISSIONS.length}
          </div>
          <div className="text-sm sm:text-base font-bold text-amber-100">
            {currentMission.title}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {currentMission.codename} · Drives {progress.collected}/
            {progress.total}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCameraView}
            className="pointer-events-auto rounded-lg border border-cyan-400/40 bg-cyan-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100 hover:bg-cyan-500/30 active:scale-95 transition"
          >
            {cameraView === "first" ? "3rd Person" : "1st Person"}
          </button>
          <button
            onClick={() => setGamePhase("base")}
            className="pointer-events-auto rounded-lg border border-amber-400/40 bg-amber-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100 hover:bg-amber-500/30 active:scale-95 transition"
          >
            Base
          </button>
          <button
            onClick={close}
            className="pointer-events-auto rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-rose-100 hover:bg-rose-500/30 active:scale-95 transition"
          >
            Exit Cockpit
          </button>
        </div>
      </div>

      {/* Crosshair center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r="18"
            fill="none"
            stroke="rgba(250,204,21,0.45)"
            strokeWidth="1"
          />
          <circle cx="30" cy="30" r="2" fill="rgba(250,204,21,0.9)" />
          <line
            x1="30"
            y1="4"
            x2="30"
            y2="14"
            stroke="rgba(250,204,21,0.55)"
            strokeWidth="1"
          />
          <line
            x1="30"
            y1="46"
            x2="30"
            y2="56"
            stroke="rgba(250,204,21,0.55)"
            strokeWidth="1"
          />
          <line
            x1="4"
            y1="30"
            x2="14"
            y2="30"
            stroke="rgba(250,204,21,0.55)"
            strokeWidth="1"
          />
          <line
            x1="46"
            y1="30"
            x2="56"
            y2="30"
            stroke="rgba(250,204,21,0.55)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Radar / waypoint compass (top-center under canopy strut) */}
      <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 pointer-events-none">
        <RadarCompass player={player} />
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

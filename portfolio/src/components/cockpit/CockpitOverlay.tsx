import { useMemo, useRef, useState, useEffect } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { useCockpitInput } from "../../three/cockpit/useCockpitInput";
import { usePlayerState } from "../../three/cockpit/usePlayerState";
import type { LasersHandle } from "../../three/cockpit/Lasers";
import type { MissilesHandle } from "../../three/cockpit/Missiles";
import type { ExplosionsHandle } from "../../three/cockpit/Explosions";
import type { MissionId } from "../../three/cockpit/missions";
import {
  CockpitRuntimeContext,
  type CockpitRuntime,
} from "../../three/cockpit/CockpitRuntime";
import CockpitScene from "../../three/cockpit/CockpitScene";
import CockpitChrome from "./CockpitChrome";
import DriveReadoutModal from "./DriveReadoutModal";
import DialogueOverlay from "./DialogueOverlay";
import InteractPrompt from "./InteractPrompt";
import usePortraitTouchLayout from "./usePortraitTouchLayout";

function HomeBaseHUD() {
  const { close, progress, resetProgress } = useCockpit();
  const [showHint, setShowHint] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") setShowHint((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-35">
          <circle cx="10" cy="10" r="1.5" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
          <line x1="10" y1="3" x2="10" y2="6.5" stroke="#22d3ee" strokeWidth="0.4" />
          <line x1="10" y1="13.5" x2="10" y2="17" stroke="#22d3ee" strokeWidth="0.4" />
          <line x1="3" y1="10" x2="6.5" y2="10" stroke="#22d3ee" strokeWidth="0.4" />
          <line x1="13.5" y1="10" x2="17" y2="10" stroke="#22d3ee" strokeWidth="0.4" />
        </svg>
      </div>

      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-start justify-between">
        <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-md px-4 py-2 border-l-2 border-cyan-500/50">
          <div className="text-[9px] uppercase tracking-[0.4em] text-cyan-400/80">
            Aegis Station
          </div>
          <div className="text-sm font-bold text-cyan-50 tracking-wider">
            Home Base
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="pointer-events-none bg-slate-950/80 backdrop-blur-md px-4 py-2 border border-cyan-500/30 rounded">
            <div className="text-[9px] uppercase tracking-[0.3em] text-cyan-400/80">
              Drives Recovered
            </div>
            <div className="text-sm font-bold text-amber-200 tracking-wider">
              {progress.collected} / {progress.total}
            </div>
          </div>
          <button
            onClick={() => setShowHint((v) => !v)}
            className="pointer-events-auto group relative overflow-hidden rounded border border-cyan-500/30 bg-slate-900/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95"
            title="Toggle controls hint (H)"
          >
            <span className="relative z-10">?</span>
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
          <button
            onClick={resetProgress}
            className="pointer-events-auto group relative overflow-hidden rounded border border-rose-500/30 bg-slate-900/90 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-rose-300 backdrop-blur-md transition-all hover:bg-rose-500/10 hover:border-rose-400 active:scale-95"
          >
            <span className="relative z-10">Reset</span>
            <div className="absolute inset-0 bg-rose-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
          <button
            onClick={close}
            className="pointer-events-auto group relative overflow-hidden rounded border border-rose-500/40 bg-slate-900/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-200 backdrop-blur-md transition-all hover:bg-rose-500/10 hover:border-rose-400 active:scale-95"
          >
            <span className="relative z-10">Exit</span>
            <div className="absolute inset-0 bg-rose-500/15 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-950/85 backdrop-blur-md rounded-lg border border-cyan-900/40 px-6 py-3 text-center"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 mb-2">Movement Controls</div>
            <div className="text-[11px] text-slate-300 space-y-1">
              <div><span className="text-amber-300">W A S D</span> — Walk &nbsp; <span className="text-amber-300">Shift</span> — Sprint</div>
              <div><span className="text-amber-300">Mouse</span> — Look (click to lock) &nbsp; <span className="text-amber-300">Esc</span> — Release</div>
              <div><span className="text-amber-300">E</span> — Interact (launch mission at sealed terminal)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="text-center space-y-3">
              <div className="text-[10px] uppercase tracking-[0.5em] text-cyan-400/80">Aegis Station // Sector 7</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-50 uppercase tracking-[0.15em]">
                Home Base Online
              </div>
              <div className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                Drives containing the full dossier are scattered across hostile sectors. Recover them sequentially to unlock the archive vault.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InteractPrompt />
    </div>
  );
}

export default function CockpitOverlay() {
  const { isActive, openDriveId, gamePhase, currentDialogue } = useCockpit();
  const isPortraitTouch = usePortraitTouchLayout(isActive);
  const input = useCockpitInput(isActive);
  const player = usePlayerState();
  const lasersRef = useRef<LasersHandle | null>(null);
  const enemyLasersRef = useRef<LasersHandle | null>(null);
  const missilesRef = useRef<MissilesHandle | null>(null);
  const explosionsRef = useRef<ExplosionsHandle | null>(null);
  const enemiesRef = useRef<THREE.Vector3[]>([]);
  const enemyCountsRef = useRef<Record<MissionId, number>>(
    {} as Record<MissionId, number>,
  );

  const runtime = useMemo<CockpitRuntime>(
    () => ({
      input,
      player,
      lasers: lasersRef as RefObject<LasersHandle | null>,
      enemyLasers: enemyLasersRef as RefObject<LasersHandle | null>,
      missiles: missilesRef as RefObject<MissilesHandle | null>,
      explosions: explosionsRef as RefObject<ExplosionsHandle | null>,
      enemies: enemiesRef,
      enemyCounts: enemyCountsRef,
    }),
    [input, player],
  );

  if (!isActive) return null;
  const enabled = !openDriveId && gamePhase === "space";
  const show3dScene = gamePhase === "homebase" || gamePhase === "space" || gamePhase === "dialogue";

  const overlay = (
    <CockpitRuntimeContext.Provider value={runtime}>
      <div
        className="fixed inset-0 z-[200] overflow-hidden bg-[#02030a]"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute left-0 top-0"
          style={
            isPortraitTouch
              ? {
                  width: "100svh",
                  height: "100vw",
                  transform: "rotate(90deg) translateY(-100%)",
                  transformOrigin: "top left",
                }
              : {
                  width: "100%",
                  height: "100%",
                }
          }
        >
          {show3dScene && (
            <div className="absolute inset-0">
              <CockpitScene enabled={enabled} />
            </div>
          )}

          {gamePhase === "homebase" && <HomeBaseHUD />}

          {(gamePhase === "space" || gamePhase === "dialogue") && (
            <>
              <CockpitChrome input={input} player={player} enemyCounts={enemyCountsRef} />
              {gamePhase === "dialogue" && currentDialogue && <DialogueOverlay />}
            </>
          )}

          <AnimatePresence>
            {openDriveId && <DriveReadoutModal missionId={openDriveId} />}
          </AnimatePresence>
        </div>
        {isPortraitTouch && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[220] px-4 text-center text-[11px] tracking-[0.12em] text-slate-400/80">
            Landscape layout applied automatically for mobile play.
          </div>
        )}
      </div>
    </CockpitRuntimeContext.Provider>
  );

  return createPortal(overlay, document.body);
}

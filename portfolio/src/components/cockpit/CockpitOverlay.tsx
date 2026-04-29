import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
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
import CommandCenter from "./CommandCenter";
import DriveReadoutModal from "./DriveReadoutModal";
import DialogueOverlay from "./DialogueOverlay";
import usePortraitTouchLayout from "./usePortraitTouchLayout";

/** Top-level toggleable cockpit overlay. Renders only when active. */
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
  // Gameplay is paused while a drive modal is open
  const enabled = !openDriveId && gamePhase === "space";

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
          {gamePhase === "space" || gamePhase === "dialogue" ? (
            <>
              <div className="absolute inset-0">
                <CockpitScene enabled={enabled} />
              </div>
              <CockpitChrome
                input={input}
                player={player}
                enemyCounts={enemyCountsRef}
              />
              {gamePhase === "dialogue" && currentDialogue && <DialogueOverlay />}
            </>
          ) : (
            <>
              <CommandCenter />
              <AnimatePresence>
                {openDriveId && <DriveReadoutModal missionId={openDriveId} />}
              </AnimatePresence>
            </>
          )}
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

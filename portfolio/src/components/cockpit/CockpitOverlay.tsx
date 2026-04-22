import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { useCockpitInput } from "../../three/cockpit/useCockpitInput";
import { usePlayerState } from "../../three/cockpit/usePlayerState";
import type { LasersHandle } from "../../three/cockpit/Lasers";
import type { MissionId } from "../../three/cockpit/missions";
import {
  CockpitRuntimeContext,
  type CockpitRuntime,
} from "../../three/cockpit/CockpitRuntime";
import CockpitScene from "../../three/cockpit/CockpitScene";
import CockpitChrome from "./CockpitChrome";

/** Top-level toggleable cockpit overlay. Renders only when active. */
export default function CockpitOverlay() {
  const { isActive, openDriveId } = useCockpit();
  const input = useCockpitInput(isActive);
  const player = usePlayerState();
  const lasersRef = useRef<LasersHandle | null>(null);
  const enemyCountsRef = useRef<Record<MissionId, number>>(
    {} as Record<MissionId, number>,
  );

  const runtime = useMemo<CockpitRuntime>(
    () => ({
      input,
      player,
      lasers: lasersRef as RefObject<LasersHandle | null>,
      enemyCounts: enemyCountsRef,
    }),
    [input, player],
  );

  if (!isActive) return null;
  // Gameplay is paused while a drive modal is open
  const enabled = !openDriveId;

  const overlay = (
    <CockpitRuntimeContext.Provider value={runtime}>
      <div
        className="fixed inset-0 z-[200] bg-[#02030a]"
        style={{ touchAction: "none" }}
      >
        <div className="absolute inset-0">
          <CockpitScene enabled={enabled} />
        </div>
        <CockpitChrome
          input={input}
          player={player}
          enemyCounts={enemyCountsRef}
        />
      </div>
    </CockpitRuntimeContext.Provider>
  );

  return createPortal(overlay, document.body);
}

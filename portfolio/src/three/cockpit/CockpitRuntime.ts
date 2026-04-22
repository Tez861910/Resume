import { createContext, useContext } from "react";
import type { MutableRefObject } from "react";
import type { CockpitInputApi } from "./useCockpitInput";
import type { PlayerState } from "./usePlayerState";
import type { LasersHandle } from "./Lasers";
import type { MissionId } from "./missions";

export interface CockpitRuntime {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  lasers: MutableRefObject<LasersHandle | null>;
  enemyLasers: MutableRefObject<LasersHandle | null>;
  enemyCounts: MutableRefObject<Record<MissionId, number>>;
}

export const CockpitRuntimeContext = createContext<CockpitRuntime | null>(null);

export function useCockpitRuntime() {
  const ctx = useContext(CockpitRuntimeContext);
  if (!ctx) throw new Error("CockpitRuntime not provided");
  return ctx;
}

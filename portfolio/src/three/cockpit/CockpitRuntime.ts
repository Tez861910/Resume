import { createContext, useContext } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import type { CockpitInputApi } from "./useCockpitInput";
import type { PlayerState } from "./usePlayerState";
import type { LasersHandle } from "./Lasers";
import type { MissilesHandle } from "./Missiles";
import type { ExplosionsHandle } from "./Explosions";
import type { MissionId } from "./missions";

export interface CockpitRuntime {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  lasers: MutableRefObject<LasersHandle | null>;
  enemyLasers: MutableRefObject<LasersHandle | null>;
  missiles: MutableRefObject<MissilesHandle | null>;
  explosions: MutableRefObject<ExplosionsHandle | null>;
  enemies: MutableRefObject<THREE.Vector3[]>;
  enemyCounts: MutableRefObject<Record<MissionId, number>>;
}

export const CockpitRuntimeContext = createContext<CockpitRuntime | null>(null);

export function useCockpitRuntime() {
  const ctx = useContext(CockpitRuntimeContext);
  if (!ctx) throw new Error("CockpitRuntime not provided");
  return ctx;
}

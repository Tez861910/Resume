import { useContext } from "react";
import { GameContext } from "./GameContextDefinition";
import type { GameCtx } from "./GameContext";

export function useGame(): GameCtx {
  return useContext(GameContext);
}

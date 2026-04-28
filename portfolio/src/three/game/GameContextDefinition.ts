import { createContext } from "react";
import { DEFAULT_SESSION } from "./gameConstants";
import type { GameCtx } from "./GameContext";

export const GameContext = createContext<GameCtx>({
  isActive: false,
  session: DEFAULT_SESSION,
  launch: () => {},
  close: () => {},
  complete: () => {},
  resetProgress: () => {},
});

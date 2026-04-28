import { createContext } from "react";
import type { WorldState } from "./useWorldState";

export type { WorldState };
export const WorldStateContext = createContext<WorldState | null>(null);

import { useContext } from "react";
import { WorldStateContext, type WorldState } from "./WorldStateContext";

export function useSharedWorldState(): WorldState {
  const context = useContext(WorldStateContext);

  if (!context) {
    throw new Error(
      "useSharedWorldState must be used within a WorldStateProvider.",
    );
  }

  return context;
}

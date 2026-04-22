import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import useWorldState, {
  type UseWorldStateOptions,
  type WorldState,
} from "./useWorldState";

const WorldStateContext = createContext<WorldState | null>(null);

interface WorldStateProviderProps extends UseWorldStateOptions {
  children: ReactNode;
}

export function WorldStateProvider({
  children,
  challengeModeActive = false,
  sectionIds,
}: WorldStateProviderProps) {
  const worldState = useWorldState({
    challengeModeActive,
    sectionIds,
  });

  const value = useMemo(
    () => worldState,
    [
      worldState.activeSection,
      worldState.previousSection,
      worldState.capabilityTier,
      worldState.worldIntensity,
      worldState.isReducedMotion,
      worldState.isTouchDevice,
      worldState.isLowPowerMode,
      worldState.isChallengeModeActive,
    ],
  );

  return (
    <WorldStateContext.Provider value={value}>
      {children}
    </WorldStateContext.Provider>
  );
}

export function useSharedWorldState(): WorldState {
  const context = useContext(WorldStateContext);

  if (!context) {
    throw new Error(
      "useSharedWorldState must be used within a WorldStateProvider.",
    );
  }

  return context;
}

export default WorldStateProvider;

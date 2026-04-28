import {
  useMemo,
  type ReactNode,
} from "react";
import useWorldState, {
  type UseWorldStateOptions,
} from "./useWorldState";
import { WorldStateContext } from "./WorldStateContext";

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
    [worldState],
  );

  return (
    <WorldStateContext.Provider value={value}>
      {children}
    </WorldStateContext.Provider>
  );
}

export default WorldStateProvider;

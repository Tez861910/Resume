import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GameCtx {
  /** Whether the Dev Sprint game overlay is currently open */
  isActive: boolean;
  /** Open the game */
  launch: () => void;
  /** Close / dismiss the game */
  close: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const GameContext = createContext<GameCtx>({
  isActive: false,
  launch: () => {},
  close: () => {},
});

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useGame(): GameCtx {
  return useContext(GameContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [isActive, setIsActive] = useState(false);

  const launch = useCallback(() => setIsActive(true), []);
  const close = useCallback(() => setIsActive(false), []);

  return (
    <GameContext.Provider value={{ isActive, launch, close }}>
      {children}
    </GameContext.Provider>
  );
}

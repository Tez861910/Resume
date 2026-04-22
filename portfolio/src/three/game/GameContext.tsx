import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ChallengeEntryPoint =
  | "navbar"
  | "hero"
  | "skills"
  | "projects"
  | "contact"
  | "hud"
  | "challenge-section"
  | "unknown";

export interface ChallengeSessionMeta {
  entryPoint: ChallengeEntryPoint;
  launchedAt: number | null;
  launchCount: number;
  lastCompletedAt: number | null;
  lastScore: number | null;
  bestScore: number | null;
  lastCollectedStack: string[];
}

interface CompleteChallengePayload {
  score: number;
  stack: string[];
  completedAt?: number;
}

interface GameCtx {
  /** Whether the challenge mode overlay is currently open */
  isActive: boolean;
  /** Metadata used to integrate challenge mode into the wider site flow */
  session: ChallengeSessionMeta;
  /** Open the challenge mode from a specific entry point */
  launch: (entryPoint?: ChallengeEntryPoint) => void;
  /** Close / dismiss the challenge mode */
  close: () => void;
  /** Record the latest challenge outcome so the rest of the site can react to it */
  complete: (payload: CompleteChallengePayload) => void;
  /** Clear the latest challenge outcome while preserving launch history */
  resetProgress: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const GameContext = createContext<GameCtx>({
  isActive: false,
  session: {
    entryPoint: "unknown",
    launchedAt: null,
    launchCount: 0,
    lastCompletedAt: null,
    lastScore: null,
    bestScore: null,
    lastCollectedStack: [],
  },
  launch: () => {},
  close: () => {},
  complete: () => {},
  resetProgress: () => {},
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
  const [session, setSession] = useState<ChallengeSessionMeta>({
    entryPoint: "unknown",
    launchedAt: null,
    launchCount: 0,
    lastCompletedAt: null,
    lastScore: null,
    bestScore: null,
    lastCollectedStack: [],
  });

  const launch = useCallback((entryPoint: ChallengeEntryPoint = "unknown") => {
    const launchedAt = Date.now();

    setSession((current) => ({
      ...current,
      entryPoint,
      launchedAt,
      launchCount: current.launchCount + 1,
    }));
    setIsActive(true);
  }, []);

  const close = useCallback(() => setIsActive(false), []);

  const complete = useCallback((payload: CompleteChallengePayload) => {
    const completedAt = payload.completedAt ?? Date.now();

    setSession((current) => ({
      ...current,
      lastCompletedAt: completedAt,
      lastScore: payload.score,
      bestScore:
        current.bestScore === null
          ? payload.score
          : Math.max(current.bestScore, payload.score),
      lastCollectedStack: payload.stack,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setSession((current) => ({
      ...current,
      lastCompletedAt: null,
      lastScore: null,
      lastCollectedStack: [],
    }));
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      session,
      launch,
      close,
      complete,
      resetProgress,
    }),
    [isActive, session, launch, close, complete, resetProgress],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

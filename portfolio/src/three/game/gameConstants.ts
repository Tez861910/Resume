import type { ChallengeSessionMeta } from "./GameContext";

export const DEFAULT_SESSION: ChallengeSessionMeta = {
  entryPoint: "unknown",
  launchedAt: null,
  launchCount: 0,
  lastCompletedAt: null,
  lastScore: null,
  bestScore: null,
  lastCollectedStack: [],
};

import { useSyncExternalStore } from "react";
import type { MissionId } from "../cockpit/missions";

export interface InteractTarget {
  missionId: MissionId | null;
  unlocked: boolean;
  kind: "resume-screen" | "vault-door" | null;
  /** Distance in world units from camera */
  distance: number;
}

const initial: InteractTarget = {
  missionId: null,
  unlocked: false,
  kind: null,
  distance: Infinity,
};

let current: InteractTarget = initial;
const listeners = new Set<() => void>();

export const interactStore = {
  get(): InteractTarget {
    return current;
  },
  set(next: InteractTarget) {
    if (
      next.missionId === current.missionId &&
      next.unlocked === current.unlocked &&
      next.kind === current.kind
    ) {
      // Only diff that matters; ignore distance churn.
      return;
    }
    current = next;
    listeners.forEach((l) => l());
  },
  clear() {
    if (current.kind === null) return;
    current = initial;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useInteractTarget(): InteractTarget {
  return useSyncExternalStore(
    interactStore.subscribe,
    interactStore.get,
    interactStore.get,
  );
}
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MISSIONS, type Mission, type MissionId } from "./missions";
import { useAudio } from "./useAudio";

const STORAGE_KEY = "resume-cockpit-drives-v1";

interface CockpitCtx {
  isActive: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  currentMission: Mission;
  activeMissionId: MissionId;
  setActiveMissionId: (id: MissionId) => void;
  collected: Set<MissionId>;
  collectDrive: (id: MissionId) => void;
  resetProgress: () => void;
  isComplete: (id: MissionId) => boolean;
  progress: { collected: number; total: number };
  openDriveId: MissionId | null;
  openDrive: (id: MissionId) => void;
  closeDrive: () => void;
  cameraView: "first" | "third";
  toggleCameraView: () => void;
  gamePhase: "base" | "space" | "dialogue";
  setGamePhase: (phase: "base" | "space" | "dialogue") => void;
  activeStage: number;
  setActiveStage: (stage: number) => void;
  negotiated: Set<MissionId>;
  completeNegotiation: (id: MissionId) => void;
  currentDialogue: MissionId | null;
  setCurrentDialogue: (id: MissionId | null) => void;
  defeatedCommanders: Set<MissionId>;
  markCommanderDefeated: (id: MissionId) => void;
  clearMissionProgress: (id: MissionId) => void;
  readoutsUnlocked: boolean;
  audio: ReturnType<typeof useAudio>;
}

const CockpitContext = createContext<CockpitCtx | null>(null);

function loadCollected(): Set<MissionId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as MissionId[];
    return new Set(arr.filter((x) => MISSIONS.some((m) => m.id === x)));
  } catch {
    return new Set();
  }
}

function saveCollected(set: Set<MissionId>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

export function CockpitModeProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [collected, setCollected] = useState<Set<MissionId>>(() =>
    loadCollected(),
  );
  const [openDriveId, setOpenDriveId] = useState<MissionId | null>(null);
  const [cameraView, setCameraView] = useState<"first" | "third">("first");
  const [gamePhase, setGamePhase] = useState<"base" | "space" | "dialogue">(
    "base",
  );
  const [activeStage, setActiveStage] = useState<number>(0);
  const [activeMissionId, setActiveMissionId] = useState<MissionId>("launch");
  const [negotiated, setNegotiated] = useState<Set<MissionId>>(new Set());
  const [defeatedCommanders, setDefeatedCommanders] = useState<Set<MissionId>>(
    new Set(),
  );
  const [currentDialogue, setCurrentDialogue] = useState<MissionId | null>(
    null,
  );

  const audio = useAudio();
  const { stopEngine, stopStatic } = audio;

  const resetRuntimeUi = useCallback(() => {
    setOpenDriveId(null);
    setGamePhase("base");
    setActiveStage(0);
    setActiveMissionId("launch");
    setCurrentDialogue(null);
    setCameraView("first");
  }, []);

  const completeNegotiation = useCallback((id: MissionId) => {
    setNegotiated((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const markCommanderDefeated = useCallback((id: MissionId) => {
    setDefeatedCommanders((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const clearMissionProgress = useCallback((id: MissionId) => {
    setNegotiated((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDefeatedCommanders((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const persistedRef = useRef(collected);
  persistedRef.current = collected;

  useEffect(() => {
    saveCollected(collected);
  }, [collected]);

  const open = useCallback(() => setIsActive(true), []);
  const close = useCallback(() => {
    setIsActive(false);
    resetRuntimeUi();
    stopEngine();
    stopStatic();
  }, [resetRuntimeUi, stopEngine, stopStatic]);
  const toggle = useCallback(() => {
    if (isActive) {
      close();
      return;
    }
    open();
  }, [close, isActive, open]);
  const toggleCameraView = useCallback(() => {
    setCameraView((v) => (v === "first" ? "third" : "first"));
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDriveId) {
          setOpenDriveId(null);
        } else {
          close();
        }
      } else if (e.key.toLowerCase() === "v") {
        setCameraView((v) => (v === "first" ? "third" : "first"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, isActive, openDriveId]);

  const currentMission = useMemo(() => {
    return (
      MISSIONS.find((m) => m.id === activeMissionId) ??
      MISSIONS.find((m) => !collected.has(m.id)) ??
      MISSIONS[MISSIONS.length - 1]
    );
  }, [activeMissionId, collected]);

  const collectDrive = useCallback((id: MissionId) => {
    setCollected((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCollected(new Set());
    setNegotiated(new Set());
    setDefeatedCommanders(new Set());
    resetRuntimeUi();
    stopEngine();
    stopStatic();
  }, [resetRuntimeUi, stopEngine, stopStatic]);

  const isComplete = useCallback(
    (id: MissionId) => collected.has(id),
    [collected],
  );

  const progress = useMemo(
    () => ({ collected: collected.size, total: MISSIONS.length }),
    [collected],
  );
  const readoutsUnlocked = useMemo(
    () => collected.size === MISSIONS.length && gamePhase === "base",
    [collected, gamePhase],
  );

  const openDrive = useCallback((id: MissionId) => setOpenDriveId(id), []);
  const closeDrive = useCallback(() => setOpenDriveId(null), []);

  const value = useMemo<CockpitCtx>(
    () => ({
      isActive,
      open,
      close,
      toggle,
      currentMission,
      activeMissionId,
      setActiveMissionId,
      collected,
      collectDrive,
      resetProgress,
      isComplete,
      progress,
      openDriveId,
      openDrive,
      closeDrive,
      cameraView,
      toggleCameraView,
      gamePhase,
      setGamePhase,
      activeStage,
      setActiveStage,
      negotiated,
      completeNegotiation,
      currentDialogue,
      setCurrentDialogue,
      defeatedCommanders,
      markCommanderDefeated,
      clearMissionProgress,
      readoutsUnlocked,
      audio,
    }),
    [
      isActive,
      open,
      close,
      toggle,
      currentMission,
      activeMissionId,
      collected,
      collectDrive,
      resetProgress,
      isComplete,
      progress,
      openDriveId,
      openDrive,
      closeDrive,
      cameraView,
      toggleCameraView,
      gamePhase,
      activeStage,
      setActiveMissionId,
      negotiated,
      completeNegotiation,
      currentDialogue,
      defeatedCommanders,
      markCommanderDefeated,
      clearMissionProgress,
      readoutsUnlocked,
      audio,
    ],
  );

  return (
    <CockpitContext.Provider value={value}>{children}</CockpitContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCockpit() {
  const ctx = useContext(CockpitContext);
  if (!ctx) {
    throw new Error("useCockpit must be used inside <CockpitModeProvider>");
  }
  return ctx;
}

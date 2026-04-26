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
  const [negotiated, setNegotiated] = useState<Set<MissionId>>(new Set());
  const [currentDialogue, setCurrentDialogue] = useState<MissionId | null>(
    null,
  );

  const audio = useAudio();

  const completeNegotiation = useCallback((id: MissionId) => {
    setNegotiated((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
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
    setOpenDriveId(null);
    audio.stopEngine();
    audio.stopStatic();
  }, [audio]);
  const toggle = useCallback(() => setIsActive((v) => !v), []);
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
          setIsActive(false);
        }
      } else if (e.key.toLowerCase() === "v") {
        setCameraView((v) => (v === "first" ? "third" : "first"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive, openDriveId]);

  const currentMission = useMemo(() => {
    return (
      MISSIONS.find((m) => !collected.has(m.id)) ??
      MISSIONS[MISSIONS.length - 1]
    );
  }, [collected]);

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
    setGamePhase("base");
    setActiveStage(0);
    setCurrentDialogue(null);
    audio.stopEngine();
    audio.stopStatic();
  }, [audio]);

  const isComplete = useCallback(
    (id: MissionId) => collected.has(id),
    [collected],
  );

  const progress = useMemo(
    () => ({ collected: collected.size, total: MISSIONS.length }),
    [collected],
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
      audio,
    }),
    [
      isActive,
      open,
      close,
      toggle,
      currentMission,
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
      negotiated,
      completeNegotiation,
      currentDialogue,
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

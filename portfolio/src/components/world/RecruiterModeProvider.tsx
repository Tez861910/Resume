import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ViewMode = "heavy" | "lite";

export interface RecruiterModeState {
  enabled: boolean;
  hasHydrated: boolean;
  mode: ViewMode;
  isLiteMode: boolean;
  isHeavyMode: boolean;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  setMode: (mode: ViewMode) => void;
  enableLiteMode: () => void;
  enableHeavyMode: () => void;
}

const RECRUITER_MODE_STORAGE_KEY = "recruiterModeEnabled";
const VIEW_MODE_STORAGE_KEY = "portfolioViewMode";

const RecruiterModeContext = createContext<RecruiterModeState | null>(null);

interface RecruiterModeProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
  defaultMode?: ViewMode;
}

function readStoredBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // Ignore storage access failures and fall back to defaults.
  }

  return fallback;
}

function readStoredMode(fallback: ViewMode): ViewMode {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === "lite" || stored === "heavy") return stored;
  } catch {
    // Ignore storage access failures and fall back to defaults.
  }

  return fallback;
}

function applyDocumentModeAttributes(enabled: boolean, mode: ViewMode): void {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.recruiterMode = enabled ? "true" : "false";
  document.documentElement.dataset.viewMode = mode;
  document.body.dataset.recruiterMode = enabled ? "true" : "false";
  document.body.dataset.viewMode = mode;
}

function clearDocumentModeAttributes(): void {
  if (typeof document === "undefined") return;

  delete document.documentElement.dataset.recruiterMode;
  delete document.documentElement.dataset.viewMode;
  delete document.body.dataset.recruiterMode;
  delete document.body.dataset.viewMode;
}

export function RecruiterModeProvider({
  children,
  defaultEnabled = false,
  defaultMode = "heavy",
}: RecruiterModeProviderProps) {
  const [enabled, setEnabled] = useState<boolean>(() =>
    readStoredBoolean(RECRUITER_MODE_STORAGE_KEY, defaultEnabled),
  );
  const [mode, setModeState] = useState<ViewMode>(() =>
    readStoredMode(defaultMode),
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setEnabled(readStoredBoolean(RECRUITER_MODE_STORAGE_KEY, defaultEnabled));
    setModeState(readStoredMode(defaultMode));
    setHasHydrated(true);
  }, [defaultEnabled, defaultMode]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) return;

    try {
      window.localStorage.setItem(RECRUITER_MODE_STORAGE_KEY, String(enabled));
      window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      // Ignore storage write failures.
    }

    applyDocumentModeAttributes(enabled, mode);

    return () => {
      clearDocumentModeAttributes();
    };
  }, [enabled, mode, hasHydrated]);

  const setMode = useCallback((nextMode: ViewMode) => {
    setModeState(nextMode);
  }, []);

  const enable = useCallback(() => setEnabled(true), []);
  const disable = useCallback(() => setEnabled(false), []);
  const toggle = useCallback(() => setEnabled((current) => !current), []);

  const enableLiteMode = useCallback(() => {
    setModeState("lite");
    setEnabled(true);
  }, []);

  const enableHeavyMode = useCallback(() => {
    setModeState("heavy");
    setEnabled(false);
  }, []);

  const value = useMemo<RecruiterModeState>(
    () => ({
      enabled,
      hasHydrated,
      mode,
      isLiteMode: mode === "lite",
      isHeavyMode: mode === "heavy",
      toggle,
      enable,
      disable,
      setMode,
      enableLiteMode,
      enableHeavyMode,
    }),
    [
      enabled,
      hasHydrated,
      mode,
      toggle,
      enable,
      disable,
      setMode,
      enableLiteMode,
      enableHeavyMode,
    ],
  );

  return (
    <RecruiterModeContext.Provider value={value}>
      {children}
    </RecruiterModeContext.Provider>
  );
}

export function useRecruiterMode(): RecruiterModeState {
  const context = useContext(RecruiterModeContext);

  if (!context) {
    throw new Error(
      "useRecruiterMode must be used within a RecruiterModeProvider.",
    );
  }

  return context;
}

export default RecruiterModeProvider;

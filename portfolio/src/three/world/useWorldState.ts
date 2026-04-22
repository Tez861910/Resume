import { useEffect, useMemo, useState } from "react";

export type WorldSection =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export type CapabilityTier = "high" | "medium" | "low";

export type WorldIntensity = "full" | "reduced" | "minimal";

export interface WorldState {
  activeSection: WorldSection;
  previousSection: WorldSection | null;
  capabilityTier: CapabilityTier;
  worldIntensity: WorldIntensity;
  isReducedMotion: boolean;
  isTouchDevice: boolean;
  isLowPowerMode: boolean;
  isChallengeModeActive: boolean;
}

export interface UseWorldStateOptions {
  challengeModeActive?: boolean;
  sectionIds?: WorldSection[];
}

const DEFAULT_SECTION_IDS: WorldSection[] = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInitialTouchDevice(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(pointer: coarse)").matches;
}

function getInitialLowPowerMode(): boolean {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const lowCpu =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;

  return lowMemory || lowCpu;
}

function getInitialCapabilityTier(
  isReducedMotion: boolean,
  isTouchDevice: boolean,
  isLowPowerMode: boolean,
): CapabilityTier {
  if (isReducedMotion || isLowPowerMode) return "low";
  if (isTouchDevice) return "medium";
  return "high";
}

function getWorldIntensity(
  capabilityTier: CapabilityTier,
  isReducedMotion: boolean,
): WorldIntensity {
  if (isReducedMotion) return "minimal";
  if (capabilityTier === "low") return "minimal";
  if (capabilityTier === "medium") return "reduced";
  return "full";
}

function getMostVisibleSection(sectionIds: WorldSection[]): WorldSection {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "home";
  }

  const viewportHeight = window.innerHeight || 1;
  let bestSection: WorldSection = "home";
  let bestScore = -Infinity;

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / Math.max(1, Math.min(rect.height, viewportHeight));

    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const centerDistance = Math.abs(sectionCenter - viewportCenter);
    const centerBias = 1 - Math.min(1, centerDistance / viewportHeight);

    const score = visibilityRatio * 0.75 + centerBias * 0.25;

    if (score > bestScore) {
      bestScore = score;
      bestSection = id;
    }
  }

  return bestSection;
}

export default function useWorldState(
  options: UseWorldStateOptions = {},
): WorldState {
  const {
    challengeModeActive = false,
    sectionIds = DEFAULT_SECTION_IDS,
  } = options;

  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(
    getInitialReducedMotion,
  );
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(
    getInitialTouchDevice,
  );
  const [isLowPowerMode] = useState<boolean>(getInitialLowPowerMode);

  const [activeSection, setActiveSection] = useState<WorldSection>("home");
  const [previousSection, setPreviousSection] = useState<WorldSection | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(pointer: coarse)");

    const handleReducedMotionChange = (
      event: MediaQueryListEvent | MediaQueryList,
    ) => {
      setIsReducedMotion(event.matches);
    };

    const handleTouchChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsTouchDevice(event.matches);
    };

    handleReducedMotionChange(reducedMotionQuery);
    handleTouchChange(touchQuery);

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
      touchQuery.addEventListener("change", handleTouchChange);

      return () => {
        reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
        touchQuery.removeEventListener("change", handleTouchChange);
      };
    }

    reducedMotionQuery.addListener(handleReducedMotionChange);
    touchQuery.addListener(handleTouchChange);

    return () => {
      reducedMotionQuery.removeListener(handleReducedMotionChange);
      touchQuery.removeListener(handleTouchChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      const nextSection = getMostVisibleSection(sectionIds);

      setActiveSection((current) => {
        if (current === nextSection) return current;
        setPreviousSection(current);
        return nextSection;
      });
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [sectionIds]);

  const capabilityTier = useMemo(
    () =>
      getInitialCapabilityTier(
        isReducedMotion,
        isTouchDevice,
        isLowPowerMode,
      ),
    [isReducedMotion, isTouchDevice, isLowPowerMode],
  );

  const worldIntensity = useMemo(
    () => getWorldIntensity(capabilityTier, isReducedMotion),
    [capabilityTier, isReducedMotion],
  );

  return {
    activeSection,
    previousSection,
    capabilityTier,
    worldIntensity,
    isReducedMotion,
    isTouchDevice,
    isLowPowerMode,
    isChallengeModeActive: challengeModeActive,
  };
}

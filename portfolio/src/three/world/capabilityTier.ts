export type CapabilityTier = "high" | "medium" | "low";

export interface CapabilitySignals {
  viewportWidth: number;
  hasFinePointer: boolean;
  prefersReducedMotion: boolean;
  deviceMemoryGb: number | null;
  hardwareConcurrency: number | null;
}

export interface CapabilityAssessment {
  tier: CapabilityTier;
  signals: CapabilitySignals;
  score: number;
  reasons: string[];
}

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
}

function getViewportWidth(): number {
  if (typeof window === "undefined") return 1440;
  return window.innerWidth;
}

function getHasFinePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }

  return window.matchMedia("(pointer: fine)").matches;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getDeviceMemoryGb(): number | null {
  if (typeof navigator === "undefined") return null;

  const nav = navigator as NavigatorWithHints;
  return typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;
}

function getHardwareConcurrency(): number | null {
  if (typeof navigator === "undefined") return null;
  return typeof navigator.hardwareConcurrency === "number"
    ? navigator.hardwareConcurrency
    : null;
}

export function readCapabilitySignals(): CapabilitySignals {
  return {
    viewportWidth: getViewportWidth(),
    hasFinePointer: getHasFinePointer(),
    prefersReducedMotion: getPrefersReducedMotion(),
    deviceMemoryGb: getDeviceMemoryGb(),
    hardwareConcurrency: getHardwareConcurrency(),
  };
}

export function assessCapabilityTier(
  signals: CapabilitySignals = readCapabilitySignals(),
): CapabilityAssessment {
  let score = 0;
  const reasons: string[] = [];

  if (signals.prefersReducedMotion) {
    score -= 4;
    reasons.push("Reduced motion is preferred.");
  } else {
    score += 1;
  }

  if (signals.viewportWidth < 640) {
    score -= 3;
    reasons.push("Small viewport suggests a constrained device.");
  } else if (signals.viewportWidth < 1024) {
    score -= 1;
    reasons.push("Mid-sized viewport suggests moderate rendering budget.");
  } else {
    score += 2;
    reasons.push("Large viewport can support richer visuals.");
  }

  if (!signals.hasFinePointer) {
    score -= 2;
    reasons.push("No fine pointer detected; likely touch-first device.");
  } else {
    score += 1;
    reasons.push("Fine pointer detected.");
  }

  if (signals.deviceMemoryGb !== null) {
    if (signals.deviceMemoryGb <= 2) {
      score -= 3;
      reasons.push("Low device memory reported.");
    } else if (signals.deviceMemoryGb <= 4) {
      score -= 1;
      reasons.push("Moderate device memory reported.");
    } else {
      score += 2;
      reasons.push("Higher device memory reported.");
    }
  }

  if (signals.hardwareConcurrency !== null) {
    if (signals.hardwareConcurrency <= 4) {
      score -= 2;
      reasons.push("Lower CPU core count reported.");
    } else if (signals.hardwareConcurrency <= 8) {
      score += 0;
      reasons.push("Moderate CPU core count reported.");
    } else {
      score += 2;
      reasons.push("Higher CPU core count reported.");
    }
  }

  let tier: CapabilityTier;
  if (score >= 4) {
    tier = "high";
  } else if (score >= 0) {
    tier = "medium";
  } else {
    tier = "low";
  }

  return {
    tier,
    signals,
    score,
    reasons,
  };
}

export function getCapabilityTier(): CapabilityTier {
  return assessCapabilityTier().tier;
}

export function isLowCapabilityTier(): boolean {
  return getCapabilityTier() === "low";
}

export function isHighCapabilityTier(): boolean {
  return getCapabilityTier() === "high";
}

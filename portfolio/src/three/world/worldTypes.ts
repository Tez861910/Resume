export type WorldSection =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export type CapabilityTier = "high" | "medium" | "low";

export type WorldIntensity = "full" | "reduced" | "minimal";

export type WorldTheme = "mission-control";

export type WorldMode =
  | "launch"
  | "profile"
  | "constellation"
  | "route"
  | "mission-select"
  | "transmission";

export interface SectionWorldState {
  section: WorldSection;
  mode: WorldMode;
  title: string;
  description: string;
  accentColor: string;
}

export interface CapabilityState {
  tier: CapabilityTier;
  reducedMotion: boolean;
  touchOnly: boolean;
  prefersLowPower: boolean;
}

export interface WorldState {
  activeSection: WorldSection;
  previousSection: WorldSection | null;
  theme: WorldTheme;
  intensity: WorldIntensity;
  capability: CapabilityState;
  isChallengeModeActive: boolean;
}

export interface WorldSectionConfig {
  id: WorldSection;
  label: string;
  mode: WorldMode;
  accentColor: string;
  description: string;
}

export interface WorldTransitionState {
  from: WorldSection | null;
  to: WorldSection;
  startedAt: number;
}

export const WORLD_SECTIONS: WorldSection[] = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

export const CAPABILITY_TIERS: CapabilityTier[] = ["high", "medium", "low"];

export const WORLD_INTENSITIES: WorldIntensity[] = [
  "full",
  "reduced",
  "minimal",
];

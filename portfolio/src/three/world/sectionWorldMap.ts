export type WorldSectionId =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export type WorldModeId =
  | "launch"
  | "profile"
  | "constellation"
  | "route"
  | "mission-select"
  | "transmission";

export type WorldIntensity = "full" | "reduced" | "minimal";

export interface WorldAccentConfig {
  primary: string;
  secondary: string;
  emphasis: string;
}

export interface WorldMotionConfig {
  starfieldSpeed: number;
  particleOpacity: number;
  routeOpacity: number;
  landmarkFloat: number;
  shipPresence: number;
}

export interface SectionWorldConfig {
  section: WorldSectionId;
  label: string;
  mode: WorldModeId;
  description: string;
  intensity: WorldIntensity;
  accents: WorldAccentConfig;
  motion: WorldMotionConfig;
  showRouteNetwork: boolean;
  showShipTrail: boolean;
  showConstellationBias: boolean;
  showTerminalTone: boolean;
}

export const SECTION_WORLD_MAP: Record<WorldSectionId, SectionWorldConfig> = {
  home: {
    section: "home",
    label: "Launch Sequence",
    mode: "launch",
    description:
      "Primary entry state with the strongest ship presence, visible route network, and destination beacons.",
    intensity: "full",
    accents: {
      primary: "#fbbf24",
      secondary: "#22d3ee",
      emphasis: "#fde68a",
    },
    motion: {
      starfieldSpeed: 1,
      particleOpacity: 0.52,
      routeOpacity: 0.12,
      landmarkFloat: 1,
      shipPresence: 1,
    },
    showRouteNetwork: true,
    showShipTrail: true,
    showConstellationBias: false,
    showTerminalTone: false,
  },

  about: {
    section: "about",
    label: "Pilot Profile",
    mode: "profile",
    description:
      "Calmer profile state with reduced motion and a softer signal-oriented atmosphere.",
    intensity: "reduced",
    accents: {
      primary: "#0891b2",
      secondary: "#22d3ee",
      emphasis: "#ffffff",
    },
    motion: {
      starfieldSpeed: 0.45,
      particleOpacity: 0.2,
      routeOpacity: 0.04,
      landmarkFloat: 0.35,
      shipPresence: 0.35,
    },
    showRouteNetwork: false,
    showShipTrail: false,
    showConstellationBias: false,
    showTerminalTone: false,
  },

  skills: {
    section: "skills",
    label: "Constellation Map",
    mode: "constellation",
    description:
      "Skill-focused state where node systems and scan-like interactions should feel most active.",
    intensity: "full",
    accents: {
      primary: "#fbbf24",
      secondary: "#22d3ee",
      emphasis: "#34d399",
    },
    motion: {
      starfieldSpeed: 0.7,
      particleOpacity: 0.3,
      routeOpacity: 0.08,
      landmarkFloat: 0.7,
      shipPresence: 0.45,
    },
    showRouteNetwork: true,
    showShipTrail: false,
    showConstellationBias: true,
    showTerminalTone: false,
  },

  experience: {
    section: "experience",
    label: "Career Route",
    mode: "route",
    description:
      "Checkpoint-driven state emphasizing progression, completed missions, and structured movement.",
    intensity: "reduced",
    accents: {
      primary: "#34d399",
      secondary: "#fbbf24",
      emphasis: "#ffffff",
    },
    motion: {
      starfieldSpeed: 0.55,
      particleOpacity: 0.18,
      routeOpacity: 0.1,
      landmarkFloat: 0.3,
      shipPresence: 0.3,
    },
    showRouteNetwork: true,
    showShipTrail: false,
    showConstellationBias: false,
    showTerminalTone: false,
  },

  projects: {
    section: "projects",
    label: "Mission Select",
    mode: "mission-select",
    description:
      "Project-focused state where sectors feel inspectable and the UI should read like mission terminals.",
    intensity: "full",
    accents: {
      primary: "#22d3ee",
      secondary: "#fbbf24",
      emphasis: "#fde68a",
    },
    motion: {
      starfieldSpeed: 0.65,
      particleOpacity: 0.24,
      routeOpacity: 0.07,
      landmarkFloat: 0.45,
      shipPresence: 0.4,
    },
    showRouteNetwork: true,
    showShipTrail: false,
    showConstellationBias: false,
    showTerminalTone: true,
  },

  contact: {
    section: "contact",
    label: "Transmission Terminal",
    mode: "transmission",
    description:
      "Low-noise closing state with a communication-terminal tone and minimal ambient motion.",
    intensity: "minimal",
    accents: {
      primary: "#fde68a",
      secondary: "#22d3ee",
      emphasis: "#ffffff",
    },
    motion: {
      starfieldSpeed: 0.3,
      particleOpacity: 0.12,
      routeOpacity: 0.03,
      landmarkFloat: 0.18,
      shipPresence: 0.2,
    },
    showRouteNetwork: false,
    showShipTrail: false,
    showConstellationBias: false,
    showTerminalTone: true,
  },
};

export const WORLD_SECTION_ORDER: WorldSectionId[] = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

export function getSectionWorldConfig(
  section: WorldSectionId,
): SectionWorldConfig {
  return SECTION_WORLD_MAP[section];
}

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";
import { useRecruiterMode } from "./RecruiterModeProvider";
import {
  getSectionWorldConfig,
  type WorldSectionId,
} from "../../three/world/sectionWorldMap";

const SECTION_LABELS: Record<WorldSectionId, string> = {
  home: "Launch",
  about: "Profile",
  skills: "Skills",
  experience: "Route",
  projects: "Missions",
  contact: "Transmit",
};

function formatCapabilityLabel(tier: "high" | "medium" | "low") {
  if (tier === "high") return "High";
  if (tier === "medium") return "Medium";
  return "Low";
}

function formatIntensityLabel(intensity: "full" | "reduced" | "minimal") {
  if (intensity === "full") return "Full";
  if (intensity === "reduced") return "Reduced";
  return "Minimal";
}

export default function WorldHUD() {
  const world = useSharedWorldState();
  const { enabled: recruiterModeEnabled } = useRecruiterMode();

  const activeConfig = useMemo(
    () => getSectionWorldConfig(world.activeSection),
    [world.activeSection],
  );

  if (recruiterModeEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-5xl"
      >
        <div className="world-panel pointer-events-auto flex min-h-[56px] items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_14px_currentColor]"
              style={{ backgroundColor: activeConfig.accents.primary }}
              aria-hidden="true"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                <span>Mission Control</span>
                <span className="text-slate-600">•</span>
                <span>{SECTION_LABELS[world.activeSection]}</span>
                <span className="text-slate-600">•</span>
                <span>{activeConfig.mode}</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={world.activeSection}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="truncate text-sm font-semibold text-slate-100 sm:text-base"
                >
                  {activeConfig.label}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <span className="world-chip">
              Capability: {formatCapabilityLabel(world.capabilityTier)}
            </span>

            <span className="world-chip">
              Intensity: {formatIntensityLabel(world.worldIntensity)}
            </span>

            <span
              className={`world-chip ${
                world.isChallengeModeActive ? "world-chip-active" : ""
              }`}
              style={
                world.isChallengeModeActive
                  ? {
                      borderColor: `${activeConfig.accents.primary}44`,
                      background: `${activeConfig.accents.primary}12`,
                      color: activeConfig.accents.primary,
                    }
                  : undefined
              }
            >
              {world.isChallengeModeActive
                ? "Challenge Active"
                : "Challenge Standby"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

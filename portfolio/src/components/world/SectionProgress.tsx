import { motion } from "framer-motion";
import { SECTION_WORLD_MAP } from "../../three/world/sectionWorldMap";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";
import { useRecruiterMode } from "./RecruiterModeProvider";
import type { WorldSection } from "../../three/world/worldTypes";

interface SectionProgressProps {
  className?: string;
}

const SECTION_ORDER: WorldSection[] = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];

const SECTION_SHORT_LABELS: Record<WorldSection, string> = {
  home: "Launch",
  about: "Profile",
  skills: "Skills",
  experience: "Route",
  projects: "Missions",
  contact: "Transmit",
};

function getSectionIndex(section: WorldSection): number {
  return Math.max(0, SECTION_ORDER.indexOf(section));
}

export default function SectionProgress({
  className = "",
}: SectionProgressProps) {
  const { activeSection, previousSection } = useSharedWorldState();
  const { enabled: recruiterModeEnabled } = useRecruiterMode();
  const activeIndex = getSectionIndex(activeSection);
  const progressPct =
    SECTION_ORDER.length <= 1
      ? 0
      : (activeIndex / (SECTION_ORDER.length - 1)) * 100;

  if (recruiterModeEnabled) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 ${className}`}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="world-panel pointer-events-auto w-full max-w-3xl px-4 py-3 sm:px-5"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Route Progress
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-50">
                {SECTION_WORLD_MAP[activeSection].label}
              </span>
              <span
                className="rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{
                  color: SECTION_WORLD_MAP[activeSection].accents.primary,
                  borderColor: `${SECTION_WORLD_MAP[activeSection].accents.primary}44`,
                  background: `${SECTION_WORLD_MAP[activeSection].accents.primary}12`,
                }}
              >
                Active
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Sector
            </p>
            <p className="text-xs font-semibold text-slate-200">
              {activeIndex + 1} / {SECTION_ORDER.length}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-500">
            <span>
              Prev:{" "}
              {previousSection
                ? SECTION_SHORT_LABELS[previousSection]
                : "Origin"}
            </span>
            <span>{Math.round(progressPct)}%</span>
          </div>

          <div className="relative h-2 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${SECTION_WORLD_MAP[activeSection].accents.primary}, ${SECTION_WORLD_MAP[activeSection].accents.secondary})`,
              }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {SECTION_ORDER.map((section, index) => {
            const config = SECTION_WORLD_MAP[section];
            const isActive = section === activeSection;
            const isCompleted = index < activeIndex;
            const wasPrevious = section === previousSection;

            return (
              <motion.div
                key={section}
                initial={false}
                animate={{
                  opacity: isActive || isCompleted ? 1 : 0.68,
                  y: isActive ? -1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div
                  className={`relative flex flex-col items-center gap-1 rounded-xl border px-2 py-2 text-center ${
                    isActive
                      ? "border-white/20 bg-white/10"
                      : isCompleted
                        ? "border-white/10 bg-white/[0.05]"
                        : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  {(isActive || wasPrevious) && (
                    <motion.span
                      className="absolute inset-0 rounded-xl"
                      style={{
                        border: `1px solid ${config.accents.primary}33`,
                      }}
                      animate={
                        isActive
                          ? {
                              opacity: [0.45, 0.1, 0.45],
                            }
                          : {
                              opacity: 0.18,
                            }
                      }
                      transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: isActive
                        ? config.accents.primary
                        : isCompleted
                          ? config.accents.secondary
                          : "rgba(255,255,255,0.35)",
                      boxShadow: isActive
                        ? `0 0 14px ${config.accents.primary}88`
                        : "none",
                    }}
                  />

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                      isActive
                        ? "text-slate-50"
                        : isCompleted
                          ? "text-slate-200/85"
                          : "text-slate-400/80"
                    }`}
                  >
                    {SECTION_SHORT_LABELS[section]}
                  </span>

                  <span
                    className={`hidden text-[9px] uppercase tracking-[0.14em] sm:block ${
                      isActive ? "text-slate-300/80" : "text-slate-500/80"
                    }`}
                  >
                    {config.mode}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

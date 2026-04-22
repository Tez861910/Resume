import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useSharedWorldState } from "../../three/world/WorldStateProvider";
import {
  getSectionWorldConfig,
  WORLD_SECTION_ORDER,
} from "../../three/world/sectionWorldMap";
import type { WorldSection } from "../../three/world/worldTypes";

interface OverlayAccent {
  primary: string;
  secondary: string;
  emphasis: string;
}

interface OverlayLayerProps {
  activeSection: WorldSection;
  accent: OverlayAccent;
  intensity: "full" | "reduced" | "minimal";
  isHero: boolean;
}

function getProgress(activeSection: WorldSection): number {
  const index = WORLD_SECTION_ORDER.indexOf(activeSection);
  if (index <= 0) return 0;
  return index / Math.max(1, WORLD_SECTION_ORDER.length - 1);
}

function AmbientGrid({
  accent,
  intensity,
  isHero,
}: {
  accent: OverlayAccent;
  intensity: "full" | "reduced" | "minimal";
  isHero: boolean;
}) {
  const opacity = isHero
    ? intensity === "full"
      ? 0.025
      : intensity === "reduced"
        ? 0.018
        : 0.012
    : intensity === "full"
      ? 0.05
      : intensity === "reduced"
        ? 0.035
        : 0.02;

  const size = isHero
    ? intensity === "full"
      ? "128px 128px"
      : intensity === "reduced"
        ? "144px 144px"
        : "160px 160px"
    : intensity === "full"
      ? "104px 104px"
      : intensity === "reduced"
        ? "120px 120px"
        : "136px 136px";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{
        opacity,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)
        `,
        backgroundSize: size,
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        maskImage: isHero
          ? "radial-gradient(circle at 50% 42%, rgba(0,0,0,0.38), rgba(0,0,0,0.1) 46%, transparent 100%)"
          : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.58), rgba(0,0,0,0.2) 58%, transparent 100%)",
        WebkitMaskImage: isHero
          ? "radial-gradient(circle at 50% 42%, rgba(0,0,0,0.38), rgba(0,0,0,0.1) 46%, transparent 100%)"
          : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.58), rgba(0,0,0,0.2) 58%, transparent 100%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isHero
            ? `radial-gradient(circle at 50% 42%, ${accent.primary}04 0%, transparent 52%)`
            : `radial-gradient(circle at 50% 50%, ${accent.primary}08 0%, transparent 56%)`,
        }}
      />
    </motion.div>
  );
}

function RouteArcs({
  activeSection,
  accent,
  intensity,
  isHero,
}: OverlayLayerProps) {
  const progress = getProgress(activeSection);
  const opacity = isHero
    ? intensity === "full"
      ? 0.035
      : intensity === "reduced"
        ? 0.022
        : 0.014
    : intensity === "full"
      ? 0.08
      : intensity === "reduced"
        ? 0.05
        : 0.03;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="world-route-gradient-a"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={accent.primary} stopOpacity="0.03" />
            <stop
              offset="50%"
              stopColor={accent.secondary}
              stopOpacity="0.22"
            />
            <stop
              offset="100%"
              stopColor={accent.emphasis}
              stopOpacity="0.05"
            />
          </linearGradient>
          <linearGradient
            id="world-route-gradient-b"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={accent.secondary} stopOpacity="0.03" />
            <stop offset="50%" stopColor={accent.primary} stopOpacity="0.14" />
            <stop
              offset="100%"
              stopColor={accent.emphasis}
              stopOpacity="0.04"
            />
          </linearGradient>
        </defs>

        <motion.path
          d="M 80 760 C 220 620, 320 520, 500 500 S 760 360, 920 220"
          fill="none"
          stroke="url(#world-route-gradient-a)"
          strokeWidth={isHero ? "1" : "1.4"}
          strokeLinecap="round"
          initial={false}
          animate={{
            pathLength: 0.25 + progress * 0.75,
            opacity,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            filter: isHero
              ? "none"
              : `drop-shadow(0 0 6px ${accent.primary}18)`,
          }}
        />

        {!isHero && (
          <motion.path
            d="M 120 220 C 260 280, 360 360, 520 420 S 760 560, 900 760"
            fill="none"
            stroke="url(#world-route-gradient-b)"
            strokeWidth="1.2"
            strokeDasharray="8 10"
            strokeLinecap="round"
            initial={false}
            animate={{
              pathLength: 0.18 + progress * 0.72,
              opacity: opacity * 0.75,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </svg>
    </div>
  );
}

function SectorBeacons({
  activeSection,
  accent,
  intensity,
  isHero,
}: OverlayLayerProps) {
  const activeIndex = WORLD_SECTION_ORDER.indexOf(activeSection);
  const baseOpacity = isHero
    ? intensity === "full"
      ? 0.18
      : intensity === "reduced"
        ? 0.12
        : 0.08
    : intensity === "full"
      ? 0.34
      : intensity === "reduced"
        ? 0.24
        : 0.16;

  const positions = [
    { left: "12%", top: "22%" },
    { left: "24%", top: "68%" },
    { left: "46%", top: "28%" },
    { left: "58%", top: "62%" },
    { left: "78%", top: "34%" },
    { left: "86%", top: "74%" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {WORLD_SECTION_ORDER.map((section, index) => {
        const isActive = section === activeSection;
        const isCompleted = index < activeIndex;
        const pos = positions[index];
        const color = isActive
          ? accent.primary
          : isCompleted
            ? accent.secondary
            : "rgba(255,255,255,0.22)";

        return (
          <motion.div
            key={section}
            className="absolute"
            style={{ left: pos.left, top: pos.top }}
            initial={false}
            animate={{
              opacity: isActive
                ? baseOpacity
                : isCompleted
                  ? baseOpacity * 0.72
                  : baseOpacity * 0.45,
              scale: isActive ? 1.04 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative flex items-center gap-2">
              {!isHero && isActive && (
                <motion.span
                  className="absolute -inset-2 rounded-full"
                  animate={{
                    scale: [1, 1.55, 1],
                    opacity: [0.22, 0, 0.22],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    border: `1px solid ${color}`,
                  }}
                />
              )}

              <span
                className="relative rounded-full"
                style={{
                  width: isHero ? "7px" : "9px",
                  height: isHero ? "7px" : "9px",
                  backgroundColor: color,
                  boxShadow: isHero ? "none" : `0 0 6px ${color}`,
                }}
              />

              {!isHero && (
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300/65 lg:block">
                  {section}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SectionWash({
  activeSection,
  accent,
  intensity,
  isHero,
}: OverlayLayerProps) {
  const washOpacity = isHero
    ? intensity === "full"
      ? 0.045
      : intensity === "reduced"
        ? 0.03
        : 0.018
    : intensity === "full"
      ? 0.08
      : intensity === "reduced"
        ? 0.055
        : 0.03;

  const positionMap: Record<WorldSection, string> = {
    home: "50% 18%",
    about: "28% 34%",
    skills: "42% 28%",
    experience: "38% 62%",
    projects: "72% 38%",
    contact: "78% 72%",
  };

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{
        opacity: washOpacity,
        background: `radial-gradient(circle at ${positionMap[activeSection]}, ${accent.primary} 0%, ${accent.secondary}12 14%, transparent 36%)`,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

function OverlayLegend({
  activeSection,
  accent,
}: {
  activeSection: WorldSection;
  accent: OverlayAccent;
}) {
  const config = getSectionWorldConfig(activeSection);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 0.72, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-none absolute bottom-4 right-4 hidden rounded-full border border-white/10 bg-slate-950/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-300/50 backdrop-blur-md 2xl:block"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: accent.primary,
            boxShadow: `0 0 8px ${accent.primary}`,
          }}
        />
        <span>{config.label}</span>
      </div>
    </motion.div>
  );
}

export default function PersistentWorldOverlay() {
  const world = useSharedWorldState();

  const activeConfig = useMemo(
    () => getSectionWorldConfig(world.activeSection),
    [world.activeSection],
  );

  if (world.isChallengeModeActive) return null;

  const isHero = world.activeSection === "home";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-80"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={world.activeSection}
          className="absolute inset-0"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <SectionWash
            activeSection={world.activeSection}
            accent={activeConfig.accents}
            intensity={world.worldIntensity}
            isHero={isHero}
          />
          <AmbientGrid
            accent={activeConfig.accents}
            intensity={world.worldIntensity}
            isHero={isHero}
          />
          <RouteArcs
            activeSection={world.activeSection}
            accent={activeConfig.accents}
            intensity={world.worldIntensity}
            isHero={isHero}
          />
          <SectorBeacons
            activeSection={world.activeSection}
            accent={activeConfig.accents}
            intensity={world.worldIntensity}
            isHero={isHero}
          />
          {!isHero && (
            <OverlayLegend
              activeSection={world.activeSection}
              accent={activeConfig.accents}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

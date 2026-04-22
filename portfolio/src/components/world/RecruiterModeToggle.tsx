import { motion } from "framer-motion";
import { FaBolt, FaLeaf } from "react-icons/fa";
import type { ReactNode } from "react";
import type { ViewMode } from "./RecruiterModeProvider";

interface RecruiterModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

const MODE_META: Record<
  ViewMode,
  {
    label: string;
    shortLabel: string;
    description: string;
    icon: ReactNode;
  }
> = {
  heavy: {
    label: "Heavy Mode",
    shortLabel: "Heavy",
    description: "Full immersive visuals and richer motion",
    icon: <FaBolt className="text-[11px]" />,
  },
  lite: {
    label: "Lite Mode",
    shortLabel: "Lite",
    description: "Reduced visual load for smoother browsing",
    icon: <FaLeaf className="text-[11px]" />,
  },
};

export default function RecruiterModeToggle({
  mode,
  onModeChange,
  className = "",
}: RecruiterModeToggleProps) {
  const isLite = mode === "lite";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={`inline-flex items-center gap-1 rounded-full border border-white/12 bg-slate-950/60 p-1 text-slate-200 shadow-lg shadow-black/20 backdrop-blur-md ${className}`}
      role="group"
      aria-label="Visual mode switch"
      title={MODE_META[mode].description}
    >
      {(["heavy", "lite"] as ViewMode[]).map((option) => {
        const active = option === mode;
        const meta = MODE_META[option];

        return (
          <button
            key={option}
            type="button"
            onClick={() => onModeChange(option)}
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-200 ${
              active
                ? option === "lite"
                  ? "bg-emerald-300/14 text-emerald-100"
                  : "bg-amber-300/14 text-amber-100"
                : "text-slate-300 hover:bg-white/[0.05] hover:text-slate-50"
            }`}
            aria-pressed={active}
            aria-label={meta.label}
            title={meta.description}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
                active
                  ? option === "lite"
                    ? "border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
                    : "border-amber-300/30 bg-amber-300/12 text-amber-100"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
              aria-hidden="true"
            >
              {meta.icon}
            </span>

            <span className="hidden sm:inline">{meta.label}</span>
            <span className="sm:hidden">{meta.shortLabel}</span>

            {active && (
              <span
                className={`absolute inset-0 rounded-full border ${
                  option === "lite"
                    ? "border-emerald-300/25"
                    : "border-amber-300/25"
                }`}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}

      <span className="sr-only">
        Current mode: {isLite ? "Lite Mode" : "Heavy Mode"}
      </span>
    </motion.div>
  );
}

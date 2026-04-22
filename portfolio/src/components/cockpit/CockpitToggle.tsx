import { useCockpit } from "../../three/cockpit/CockpitModeProvider";

interface Props {
  variant?: "desktop" | "mobile";
}

/** Navbar entry button that activates cockpit mode. */
export default function CockpitToggle({ variant = "desktop" }: Props) {
  const { open, progress } = useCockpit();

  if (variant === "mobile") {
    return (
      <button
        onClick={open}
        title="Enter Cockpit — fly through the portfolio"
        aria-label="Enter Cockpit"
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-cyan-300/40 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/25 active:scale-95 transition-all duration-150 text-base"
      >
        🛸
      </button>
    );
  }

  return (
    <button
      onClick={open}
      title="Enter Cockpit — fly through the portfolio"
      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-100 transition-all duration-150 hover:border-cyan-300/60 hover:bg-cyan-400/22 hover:text-cyan-50 active:scale-95"
    >
      🛸 <span>Cockpit</span>
      <span className="text-[9px] font-mono text-cyan-300/80">
        {progress.collected}/{progress.total}
      </span>
    </button>
  );
}

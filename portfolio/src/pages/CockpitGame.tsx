import { Suspense, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaArrowLeft, FaGamepad } from "react-icons/fa";
import CockpitOverlay from "../components/cockpit/CockpitOverlay";
import { siteConfig } from "../config/site";
import { useCockpit } from "../three/cockpit/CockpitModeProvider";

function CockpitRouteContent() {
  const {
    close,
    closeDrive,
    isActive,
    open,
    setActiveStage,
    setCurrentDialogue,
    setGamePhase,
  } = useCockpit();
  const [hasActivated, setHasActivated] = useState(false);

  useEffect(() => {
    setGamePhase("base");
    setActiveStage(0);
    setCurrentDialogue(null);
    closeDrive();
    open();

    return () => {
      close();
    };
  }, [close, closeDrive, open, setActiveStage, setCurrentDialogue, setGamePhase]);

  useEffect(() => {
    if (isActive) {
      setHasActivated(true);
    }
  }, [isActive]);

  if (hasActivated && !isActive) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[260] p-3 sm:p-4">
        <div className="pointer-events-auto mx-auto flex max-w-6xl flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/75 p-4 text-white shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="app-chip-cyan">
                <FaGamepad className="text-[10px]" />
                {siteConfig.cockpit.title}
              </span>
              <span className="app-chip">Heavy graphics route</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-100">
              Best on a desktop browser with GPU acceleration and solid
              WebGPU/WebGL support. Initial loading can take time, so if this
              route feels too heavy just return to the main portfolio and keep
              browsing the lightweight version.
            </p>
          </div>

          <Link to="/" className="btn-secondary w-full sm:w-auto">
            <FaArrowLeft className="text-xs" />
            Back to portfolio
          </Link>
        </div>
      </div>
      <CockpitOverlay />
    </div>
  );
}

export default function CockpitGame() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
          Loading cockpit...
        </div>
      }
    >
      <CockpitRouteContent />
    </Suspense>
  );
}

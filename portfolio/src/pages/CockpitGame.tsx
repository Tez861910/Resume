import { Suspense, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaArrowLeft, FaGamepad } from "react-icons/fa";
import CockpitOverlay from "../components/cockpit/CockpitOverlay";
import usePortraitTouchLayout from "../components/cockpit/usePortraitTouchLayout";
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
  const isPortraitTouch = usePortraitTouchLayout(false);

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

  const routeContent = (
    <div className="relative h-full w-full overflow-hidden bg-slate-950">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[260] p-3 sm:p-4">
        <div className="cockpit-banner pointer-events-auto mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="cockpit-chip">
                <FaGamepad className="text-[10px]" />
                {siteConfig.cockpit.title}
              </span>
              <span className="cockpit-chip-muted">Heavy graphics route</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-100">
              Best on a desktop browser with GPU acceleration and solid
              WebGPU/WebGL support. If this route feels too heavy, return to the
              main portfolio and continue with the lighter path.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              On touch devices, the cockpit shifts into a landscape-first layout
              automatically.
            </p>
          </div>

          <Link to="/" className="cockpit-button w-full sm:w-auto">
            <FaArrowLeft className="text-xs" />
            Back to portfolio
          </Link>
        </div>
      </div>
      <CockpitOverlay />
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950">
      <div
        className="absolute left-0 top-0"
        style={
          isPortraitTouch
            ? {
                width: "100svh",
                height: "100vw",
                transform: "rotate(90deg) translateY(-100%)",
                transformOrigin: "top left",
              }
            : {
                width: "100%",
                height: "100%",
              }
        }
      >
        {routeContent}
      </div>
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

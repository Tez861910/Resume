import { Suspense } from "react";
import CockpitFrame from "../components/cockpit/CockpitFrame";
import CockpitHUD from "../components/cockpit/CockpitHUD";
import CockpitOverlay from "../components/cockpit/CockpitOverlay";

/**
 * CockpitGame - Immersive 3D game experience
 * Separate from main portfolio to keep main site performant
 * Access via /cockpit route
 */
export default function CockpitGame() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-white">Loading Cockpit...</div>}>
      <div className="relative w-full h-screen overflow-hidden bg-slate-900">
        <CockpitFrame />
        <CockpitHUD />
        <CockpitOverlay />
      </div>
    </Suspense>
  );
}

import { Canvas } from "@react-three/fiber";
import { useCockpit } from "./CockpitModeProvider";
import HomeBaseWorld from "../homebase/HomeBaseWorld";
import PirateMissionScene from "./PirateMissionScene";
import { useMemo } from "react";

interface Props {
  enabled: boolean;
}

export default function CockpitScene({ enabled }: Props) {
  const { activeStage } = useCockpit();

  // Dynamic DPR based on device performance
  const dpr = useMemo(() => {
    const baseDpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    // Cap at 1.5 for mobile/low-end, 2 for desktop
    const isMobile = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return Math.min(baseDpr, isMobile ? 1.5 : 2);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      gl={{ 
        antialias: false, // Disabled for performance — MSAA is expensive
        powerPreference: "high-performance", 
        failIfMajorPerformanceCaveat: false,
        stencil: false,
        depth: true,
        alpha: false,
      }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
      onCreated={({ gl }) => { 
        gl.setClearColor("#02030a"); 
        gl.setPixelRatio(dpr);
        // Disable tone mapping for performance in heavy scenes
        gl.toneMapping = 0; // NoToneMapping
        gl.toneMappingExposure = 1;
      }}
      style={{ background: "#02030a" }}
    >
      {activeStage === 0 && <HomeBaseWorld />}
      {activeStage === 1 && <PirateMissionScene enabled={enabled} />}
    </Canvas>
  );
}

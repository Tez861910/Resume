import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useCockpit } from "./CockpitModeProvider";
import HomeBaseWorld from "../homebase/HomeBaseWorld";
import PirateMissionScene from "./PirateMissionScene";
import { useMemo, useState } from "react";

interface Props {
  enabled: boolean;
}

export default function CockpitScene({ enabled }: Props) {
  const { activeStage } = useCockpit();

  const isMobile = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ),
    [],
  );

  // Adaptive resolution. A weak/integrated GPU can drop the WebGL context
  // ("Context Lost") if the very first frames are too heavy, so we start at a
  // conservative pixel ratio and let PerformanceMonitor raise it only when the
  // GPU proves it can keep a steady framerate — and lower it again if it can't.
  const dprCeil = isMobile ? 1.25 : 1.5;
  const dprFloor = isMobile ? 0.6 : 0.75;
  const [dpr, setDpr] = useState(() => {
    const base = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    return Math.min(base, isMobile ? 1 : 1.25);
  });
  // Latched once the GPU proves too weak to hold framerate — strips the bloom
  // pass for the rest of the session so weak/integrated GPUs stay responsive.
  const [lowPerf, setLowPerf] = useState(false);

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
        preserveDrawingBuffer: false,
      }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#02030a");
        // Disable tone mapping for performance in heavy scenes
        gl.toneMapping = 0; // NoToneMapping
        gl.toneMappingExposure = 1;
      }}
      style={{ background: "#02030a" }}
    >
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setDpr((d) => Math.min(dprCeil, +(d + 0.25).toFixed(2)))}
        onDecline={() =>
          setDpr((d) => {
            const next = Math.max(dprFloor, +(d - 0.25).toFixed(2));
            if (next <= dprFloor) setLowPerf(true);
            return next;
          })
        }
        onFallback={() => {
          setDpr(dprFloor);
          setLowPerf(true);
        }}
      >
        {activeStage === 0 && <HomeBaseWorld lowPerf={lowPerf} />}
        {activeStage === 1 && <PirateMissionScene enabled={enabled} />}
      </PerformanceMonitor>
    </Canvas>
  );
}

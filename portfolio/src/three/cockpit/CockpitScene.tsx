import { Canvas } from "@react-three/fiber";
import { useCockpit } from "./CockpitModeProvider";
import HomeBaseWorld from "../homebase/HomeBaseWorld";
import PirateMissionScene from "./PirateMissionScene";

interface Props {
  enabled: boolean;
}

export default function CockpitScene({ enabled }: Props) {
  const { activeStage } = useCockpit();

  return (
    <Canvas
      dpr={[
        1,
        Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          2,
        ),
      ]}
      gl={{ antialias: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
      onCreated={({ gl }) => { gl.setClearColor("#02030a"); }}
    >
      {activeStage === 0 && <HomeBaseWorld />}
      {activeStage === 1 && <PirateMissionScene enabled={enabled} />}
    </Canvas>
  );
}

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useCockpit } from "./CockpitModeProvider";
import BaseScene from "./BaseScene";
import PirateMissionScene from "./PirateMissionScene";

interface Props {
  /** Whether gameplay input is enabled (disabled if drive modal is open) */
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
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color("#02030a"));
        scene.fog = new THREE.FogExp2("#02030a", 0.0018);
      }}
    >
      {activeStage === 0 && <BaseScene />}
      {activeStage === 1 && <PirateMissionScene enabled={enabled} />}
    </Canvas>
  );
}

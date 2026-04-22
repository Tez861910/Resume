import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Starfield from "./Starfield";
import PlayerController from "./PlayerController";
import Stations from "./Stations";
import HardDrives from "./HardDrives";
import Asteroids from "./Asteroids";
import EnemyBots from "./EnemyBots";
import Lasers, { type LasersHandle } from "./Lasers";
import { MISSIONS, type MissionId } from "./missions";
import { useCockpitRuntime } from "./CockpitRuntime";
import { useCockpit } from "./CockpitModeProvider";

interface Props {
  /** Whether gameplay input is enabled (disabled if drive modal is open) */
  enabled: boolean;
}

export default function CockpitScene({ enabled }: Props) {
  const runtime = useCockpitRuntime();
  const { collected, collectDrive } = useCockpit();

  const stations = useMemo(
    () =>
      MISSIONS.map((m) => ({
        id: m.id,
        position: new THREE.Vector3(...m.position),
        enemyCount: m.enemyCount,
      })),
    [],
  );

  const asteroidCenters = useMemo(
    () => MISSIONS.map((m) => new THREE.Vector3(...m.position)),
    [],
  );

  const currentMissionId =
    MISSIONS.find((m) => !collected.has(m.id))?.id ?? MISSIONS[MISSIONS.length - 1].id;

  return (
    <Canvas
      dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 0], fov: 75, near: 0.1, far: 2000 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color("#02030a"));
        scene.fog = new THREE.FogExp2("#02030a", 0.0018);
      }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[50, 80, 30]} intensity={0.8} />
      <directionalLight position={[-40, -30, -50]} intensity={0.35} color={"#6ea9ff"} />

      <Starfield count={2500} />

      <Stations missions={MISSIONS} currentMissionId={currentMissionId} />

      <EnemyBots
        stations={stations}
        lasers={runtime.lasers}
        counterRef={runtime.enemyCounts}
        enabled={enabled}
      />

      <Asteroids
        centers={asteroidCenters}
        perCenter={7}
        player={runtime.player}
        lasers={runtime.lasers}
        enabled={enabled}
      />

      <HardDrives
        missions={MISSIONS}
        collected={collected as Set<MissionId>}
        enemyCounts={runtime.enemyCounts}
        player={runtime.player}
        onCollect={collectDrive}
        enabled={enabled}
      />

      <Lasers ref={runtime.lasers as React.RefObject<LasersHandle>} />

      <PlayerController
        input={runtime.input}
        player={runtime.player}
        enabled={enabled}
        onFire={(origin, direction) => {
          runtime.lasers.current?.spawn(origin, direction);
        }}
      />
    </Canvas>
  );
}

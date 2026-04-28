import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameAsset } from "./AssetPipeline";
import Starfield from "./Starfield";
import Asteroids from "./Asteroids";
import EnemyBots from "./EnemyBots";
import Lasers, { type LasersHandle } from "./Lasers";
import Missiles, { type MissilesHandle } from "./Missiles";
import Explosions from "./Explosions";
import PlayerController from "./PlayerController";
import HardDrives from "./HardDrives";
import { MISSIONS } from "./missions";
import { useCockpitRuntime } from "./CockpitRuntime";
import { useCockpit } from "./CockpitModeProvider";

/**
 * Warp Streaks Effect
 * Renders fast moving lines past the camera to simulate dropping out of hyperspace.
 */
function WarpInEffect() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [active, setActive] = useState(true);

  const COUNT = 200;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const speeds = useMemo(
    () => Array.from({ length: COUNT }, () => 200 + Math.random() * 400),
    [],
  );
  const zPositions = useMemo(
    () => Array.from({ length: COUNT }, () => Math.random() * -1000),
    [],
  );
  const offsets = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setActive(false), 1500); // 1.5s warp
    return () => clearTimeout(t);
  }, []);

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      zPositions[i] += speeds[i] * delta;

      dummy.position.set(offsets[i].x, offsets[i].y, zPositions[i]);
      // Stretch them long
      dummy.scale.set(1, 1, 20);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        new THREE.BoxGeometry(0.1, 0.1, 1),
        new THREE.MeshBasicMaterial({
          color: "#fff",
          transparent: true,
          opacity: 0.8,
        }),
        COUNT,
      ]}
      frustumCulled={false}
    ></instancedMesh>
  );
}

/**
 * Pirate Cruiser Boss Entity
 * Slowly rotates, has a custom shield that pulses until drones are defeated.
 */
function PirateCruiser({
  position,
  isShielded,
  enabled,
}: {
  position: THREE.Vector3;
  isShielded: boolean;
  enabled: boolean;
}) {
  const pirateAsset = useGameAsset("station");
  const { audio } = useCockpit();
  const runtime = useCockpitRuntime();

  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);

  // Boss State
  const [health, setHealth] = useState(1); // 0..1
  const [alive, setAlive] = useState(true);
  const fireCooldown = useRef(0);
  const patternTimer = useRef(0);

  useFrame((state, delta) => {
    if (!alive || !groupRef.current) return;

    // Menacing movement
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.position.y =
      position.y + Math.sin(state.clock.elapsedTime * 0.4) * 3;

    // Shield animation
    if (shieldRef.current && isShielded) {
      const scale = 3.8 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      shieldRef.current.scale.setScalar(scale);
      (shieldRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.2 + Math.sin(state.clock.elapsedTime * 6) * 0.1;
    }

    if (!enabled) return;

    // Firing Logic (Only if shields are down)
    if (!isShielded) {
      fireCooldown.current -= delta;
      patternTimer.current += delta;

      if (fireCooldown.current <= 0) {
        const playerPos = runtime.player.current.position;
        const dist = groupRef.current.position.distanceTo(playerPos);

        if (dist < 150) {
          // PATTERN 1: Aimed Barrage (Every 3 seconds)
          if (Math.sin(patternTimer.current * 0.5) > 0) {
            fireCooldown.current = 0.4;
            const dir = new THREE.Vector3()
              .subVectors(playerPos, groupRef.current.position)
              .normalize();
            // Offset spawn point to look like it comes from the ship sides
            const sideOffset = new THREE.Vector3(5, 0, 0).applyQuaternion(
              groupRef.current.quaternion,
            );
            runtime.enemyLasers.current?.spawn(
              groupRef.current.position.clone().add(sideOffset),
              dir,
            );
            runtime.enemyLasers.current?.spawn(
              groupRef.current.position.clone().sub(sideOffset),
              dir,
            );
            audio.playLaser(true);
          }
          // PATTERN 2: Defensive Spiral
          else {
            fireCooldown.current = 0.15;
            const angle = patternTimer.current * 8;
            const dir = new THREE.Vector3(
              Math.cos(angle),
              Math.sin(angle * 0.5),
              Math.sin(angle),
            ).normalize();
            runtime.enemyLasers.current?.spawn(
              groupRef.current.position.clone(),
              dir,
            );
            audio.playLaser(true);
          }

          // PHASE 2: Homing Missiles (Below 50% health)
          if (health < 0.5 && Math.random() < 0.015) {
            runtime.missiles.current?.spawn(
              groupRef.current.position.clone(),
              runtime.player.current.position,
            );
          }
        }
      }
    }

    // Damage Detection (Cruiser hit by player lasers)
    if (
      !isShielded &&
      runtime.lasers.current?.consumeHit(groupRef.current.position, 6)
    ) {
      const newHealth = Math.max(0, health - 0.02);
      setHealth(newHealth);
      audio.playImpact();
      if (newHealth <= 0) {
        setAlive(false);
        runtime.explosions.current?.spawn(groupRef.current.position, 100);
      }
    }
  });

  if (!alive) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* The Ship */}
      <mesh
        geometry={pirateAsset.geometry}
        material={pirateAsset.material}
        scale={2.5}
      />

      {/* Boss Health UI (Floating near ship) */}
      {!isShielded && (
        <group position={[0, 8, 0]}>
          <mesh>
            <planeGeometry args={[10, 0.5]} />
            <meshBasicMaterial color="#000" transparent opacity={0.5} />
          </mesh>
          <mesh position={[(-5 * (1 - health)) / 2, 0, 0.01]}>
            <planeGeometry args={[10 * health, 0.4]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* Glowing Engines / Cores */}
      <pointLight
        position={[0, 0, -5]}
        intensity={100}
        color="#ef4444"
        distance={50}
      />
      <mesh position={[0, 0, -4.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Forcefield (only visible if drones are alive) */}
      {isShielded && (
        <mesh ref={shieldRef}>
          <icosahedronGeometry args={[1, 3]} />
          <meshStandardMaterial
            color="#ef4444"
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Stage 1: Pirate Ship Mission
 * A specific combat scene against a pirate vessel.
 */
export default function PirateMissionScene({ enabled }: { enabled: boolean }) {
  const runtime = useCockpitRuntime();
  const { collected, collectDrive, cameraView } = useCockpit();

  // Mission 1 is the Pirate Mission
  const mission = MISSIONS[1];
  const missionId = mission.id;

  const stationPos = useMemo(
    () => new THREE.Vector3(...mission.position),
    [mission],
  );
  const asteroidCenters = useMemo(
    () => [
      stationPos,
      stationPos.clone().add(new THREE.Vector3(40, 10, 20)),
      stationPos.clone().add(new THREE.Vector3(-30, -20, -30)),
    ],
    [stationPos],
  );

  const stations = useMemo(
    () => [
      {
        id: missionId,
        position: stationPos,
        enemyCount: mission.enemyCount,
      },
    ],
    [missionId, stationPos, mission.enemyCount],
  );

  // Check if drones are dead to drop shield
  const aliveDrones =
    runtime.enemyCounts.current[missionId] ?? mission.enemyCount;
  const isShielded = aliveDrones > 0 && !collected.has(missionId);

  // Set initial player position slightly back so they fly in
  useEffect(() => {
    // We warp in from further back on the Z axis
    runtime.player.current.position.set(0, 0, 50);
    runtime.player.current.velocity.set(0, 0, -200); // Initial fast forward velocity
  }, [runtime.player]);

  return (
    <>
      <color attach="background" args={["#0a0305"]} />{" "}
      {/* Deep dark red/purple tint for pirate sector */}
      <fog attach="fog" args={["#0a0305", 20, 400]} />
      <Starfield count={3000} />
      <WarpInEffect />
      {/* Atmospheric Sector Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[-50, 50, -50]}
        intensity={1.5}
        color="#fb7185"
      />{" "}
      {/* Reddish sun */}
      <pointLight
        position={[stationPos.x, stationPos.y + 50, stationPos.z]}
        intensity={2}
        color="#4c1d95"
        distance={200}
      />{" "}
      {/* Purple nebula glow */}
      <PirateCruiser
        position={stationPos}
        isShielded={isShielded}
        enabled={enabled}
      />
      <EnemyBots
        stations={stations}
        lasers={runtime.lasers}
        enemyLasers={runtime.enemyLasers}
        explosions={runtime.explosions}
        enemies={runtime.enemies}
        player={runtime.player}
        counterRef={runtime.enemyCounts}
        enabled={enabled}
      />
      {/* Thicker asteroid field for cover */}
      <Asteroids
        centers={asteroidCenters}
        perCenter={mission.asteroidCount * 2}
        player={runtime.player}
        lasers={runtime.lasers}
        enabled={enabled}
      />
      <HardDrives
        missions={[mission]}
        collected={collected}
        enemyCounts={runtime.enemyCounts}
        player={runtime.player}
        onCollect={collectDrive}
        enabled={enabled}
      />
      <Lasers ref={runtime.lasers as React.RefObject<LasersHandle>} />
      <Lasers
        ref={runtime.enemyLasers as React.RefObject<LasersHandle>}
        color="#ef4444"
      />
      <Missiles
        ref={runtime.missiles as React.RefObject<MissilesHandle>}
        color="#f59e0b"
      />
      <Explosions
        ref={runtime.explosions}
      />
      <PlayerController
        input={runtime.input}
        player={runtime.player}
        enemyLasers={runtime.enemyLasers}
        enabled={enabled}
        cameraView={cameraView}
        onFire={(origin, direction) => {
          runtime.lasers.current?.spawn(origin, direction);
        }}
      />
    </>
  );
}

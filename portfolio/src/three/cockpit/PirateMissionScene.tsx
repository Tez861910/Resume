import { useMemo, useRef, useState, useEffect, useCallback } from "react";
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
import { MISSION_BY_ID, type MissionId } from "./missions";
import { useCockpitRuntime } from "./CockpitRuntime";
import { useCockpit } from "./CockpitModeProvider";

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
    const t = setTimeout(() => setActive(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useFrame((_, delta) => {
    if (!active || !meshRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      zPositions[i] += speeds[i] * delta;
      dummy.position.set(offsets[i].x, offsets[i].y, zPositions[i]);
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
    />
  );
}

function PirateCruiser({
  position,
  missionId,
  hasBoss,
  enabled,
  onDestroyed,
  accentColor,
  scale = 2.5,
}: {
  position: THREE.Vector3;
  missionId: MissionId;
  hasBoss: boolean;
  enabled: boolean;
  onDestroyed: () => void;
  accentColor: string;
  scale?: number;
}) {
  const pirateAsset = useGameAsset("station");
  const { audio, collected, recordKill } = useCockpit();
  const runtime = useCockpitRuntime();

  const groupRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Mesh>(null);
  const healthBarRef = useRef<THREE.Group>(null);

  const [health, setHealth] = useState(1);
  const [alive, setAlive] = useState(true);
  const fireCooldown = useRef(0);
  const patternTimer = useRef(0);
  const destroyedRef = useRef(false);
  const velocityRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!hasBoss || !alive || !groupRef.current) return;

    const enemyCounts = runtime.enemyCounts.current;
    const aliveDrones = enemyCounts[missionId] ?? 0;
    const isShielded = aliveDrones > 0 && !collected.has(missionId);

    // Toggle shield mesh visibility per-frame
    if (shieldRef.current) {
      shieldRef.current.visible = isShielded;
      if (isShielded) {
        const scale = 3.8 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
        shieldRef.current.scale.setScalar(scale);
        (shieldRef.current.material as THREE.MeshStandardMaterial).opacity =
          0.2 + Math.sin(state.clock.elapsedTime * 6) * 0.1;
      }
    }

    // Toggle health bar visibility per-frame (only show when unshielded)
    if (healthBarRef.current) {
      healthBarRef.current.visible = !isShielded;
    }

    // Movement
    const playerPos = runtime.player.current.position;
    const desiredAnchor = position
      .clone()
      .lerp(playerPos, isShielded ? 0.12 : 0.42)
      .add(
        new THREE.Vector3(
          Math.cos(state.clock.elapsedTime * 0.55) * 14,
          Math.sin(state.clock.elapsedTime * 0.65) * 5,
          Math.sin(state.clock.elapsedTime * 0.4) * 18,
        ),
      );

    const steering = desiredAnchor
      .sub(groupRef.current.position)
      .multiplyScalar(isShielded ? 0.45 : 0.9);
    velocityRef.current.lerp(steering, Math.min(1, delta * 1.8));
    if (velocityRef.current.length() > (isShielded ? 8 : 15)) {
      velocityRef.current.setLength(isShielded ? 8 : 15);
    }
    groupRef.current.position.addScaledVector(velocityRef.current, delta);

    const lookTarget = playerPos.clone().add(runtime.player.current.velocity);
    groupRef.current.lookAt(lookTarget);
    groupRef.current.rotation.y += delta * 0.15;

    // Collision damage when player is too close to the cruiser
    const collisionDist = groupRef.current.position.distanceTo(playerPos);
    if (collisionDist < 4) {
      audio.playImpact();
      runtime.player.current.shield = Math.max(0, runtime.player.current.shield - 0.08);
      if (runtime.player.current.shield <= 0) {
        runtime.player.current.hull = Math.max(0, runtime.player.current.hull - 0.04);
      }
    }

    if (!enabled) return;

    if (!isShielded) {
      fireCooldown.current -= delta;
      patternTimer.current += delta;

      if (fireCooldown.current <= 0) {
        const dist = groupRef.current.position.distanceTo(playerPos);

        if (dist < 150) {
          if (Math.sin(patternTimer.current * 0.5) > 0) {
            fireCooldown.current = 0.4;
            const dir = new THREE.Vector3()
              .subVectors(playerPos, groupRef.current.position)
              .normalize();
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
          } else {
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

          if (health < 0.5 && Math.random() < 0.015) {
            runtime.missiles.current?.spawn(
              groupRef.current.position.clone(),
              runtime.player.current.position,
            );
          }
        }
      }
    }

    if (
      !isShielded &&
      runtime.lasers.current?.consumeHit(groupRef.current.position, 6)
    ) {
      const newHealth = Math.max(0, health - 0.02);
      setHealth(newHealth);
      audio.playImpact();
      if (newHealth <= 0) {
        setAlive(false);
        recordKill();
        runtime.explosions.current?.spawn(groupRef.current.position, 100);
        if (!destroyedRef.current) {
          destroyedRef.current = true;
          onDestroyed();
        }
      }
    }

    if (
      !isShielded &&
      runtime.missiles.current?.consumeHit(groupRef.current.position, 8)
    ) {
      const newHealth = Math.max(0, health - 0.08);
      setHealth(newHealth);
      audio.playImpact();
      runtime.explosions.current?.spawn(groupRef.current.position, 50);
      if (newHealth <= 0) {
        setAlive(false);
        recordKill();
        runtime.explosions.current?.spawn(groupRef.current.position, 120);
        if (!destroyedRef.current) {
          destroyedRef.current = true;
          onDestroyed();
        }
      }
    }
  });

  if (!hasBoss || !alive) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh
        geometry={pirateAsset.geometry}
        material={pirateAsset.material}
        scale={scale}
      />

      <group ref={healthBarRef} position={[0, 8, 0]}>
        <mesh>
          <planeGeometry args={[10, 0.5]} />
          <meshBasicMaterial color="#000" transparent opacity={0.5} />
        </mesh>
        <mesh position={[-(5 * (1 - health)) / 2, 0, 0.01]}>
          <planeGeometry args={[10 * health, 0.4]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
      </group>

      <pointLight
        position={[0, 0, -5]}
        intensity={100}
        color={accentColor}
        distance={50}
      />
      <mesh position={[0, 0, -4.5]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      <mesh ref={shieldRef}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function PirateMissionScene({ enabled }: { enabled: boolean }) {
  const runtime = useCockpitRuntime();
  const {
    collected,
    collectDrive,
    cameraView,
    currentDialogue,
    markCommanderDefeated,
    negotiated,
    activeMissionId,
    gamePhase,
    setActiveMissionId,
    setCurrentDialogue,
    setGamePhase,
    audio,
  } = useCockpit();

  const handleCollectDrive = useCallback(
    (id: MissionId) => {
      audio.initContext();
      audio.playLaser(false);
      collectDrive(id);
    },
    [audio, collectDrive],
  );

  const mission = MISSION_BY_ID[activeMissionId];
  const missionId = mission.id;
  const hasBoss = mission.enemyCount > 0;

  const stationPos = useMemo(
    () => new THREE.Vector3(...mission.position),
    [mission],
  );
  const spawnPosition = useMemo(
    () => stationPos.clone().add(new THREE.Vector3(0, 5, 80)),
    [stationPos],
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

  useEffect(() => {
    // Spawn player 40 units behind the station (positive Z side), facing it
    const mPos = new THREE.Vector3(...mission.position);
    const spawnPos = mPos.clone().add(new THREE.Vector3(0, 5, 80));
    runtime.player.current.position.copy(spawnPos);
    // Velocity toward station
    const dir = new THREE.Vector3(0, 0, -40);
    runtime.player.current.velocity.copy(dir);
  }, [runtime.player, mission]);

  useEffect(() => {
    setActiveMissionId(missionId);
    if (hasBoss && !negotiated.has(missionId) && currentDialogue !== missionId) {
      setCurrentDialogue(missionId);
      setGamePhase("dialogue");
    } else if (!hasBoss && gamePhase === "dialogue") {
      setGamePhase("space");
    }
  }, [
    currentDialogue,
    gamePhase,
    hasBoss,
    missionId,
    negotiated,
    setActiveMissionId,
    setCurrentDialogue,
    setGamePhase,
  ]);

  const fogColor = mission.accent === "#fbbf24" ? "#050305" : "#0a0305";

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 20, 400]} />
      <Starfield count={3000} />
      <WarpInEffect />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-50, 50, -50]} intensity={1.5} color="#fb7185" />
      <pointLight
        position={[stationPos.x, stationPos.y + 50, stationPos.z]}
        intensity={2}
        color="#4c1d95"
        distance={200}
      />
      <PirateCruiser
        position={stationPos}
        missionId={missionId}
        hasBoss={hasBoss}
        enabled={enabled}
        onDestroyed={() => {
          markCommanderDefeated(missionId);
        }}
        accentColor={mission.accent}
        scale={2 + mission.enemyCount * 0.35}
      />
      <EnemyBots
        stations={stations}
        lasers={runtime.lasers}
        enemyLasers={runtime.enemyLasers}
        missiles={runtime.missiles}
        explosions={runtime.explosions}
        enemies={runtime.enemies}
        player={runtime.player}
        counterRef={runtime.enemyCounts}
        enabled={enabled}
      />
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
        onCollect={handleCollectDrive}
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
      <Explosions ref={runtime.explosions} />
      <PlayerController
        input={runtime.input}
        player={runtime.player}
        enemyLasers={runtime.enemyLasers}
        enemyMissiles={runtime.missiles}
        enemies={runtime.enemies}
        enabled={enabled}
        cameraView={cameraView}
        spawnPosition={spawnPosition}
        onFire={(origin, direction) => {
          runtime.lasers.current?.spawn(origin, direction);
        }}
        onFireMissile={(origin, target) => {
          runtime.missiles.current?.spawn(origin, target);
        }}
      />
    </>
  );
}
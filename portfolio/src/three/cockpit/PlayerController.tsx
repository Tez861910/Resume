import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { CockpitInputApi } from "./useCockpitInput";
import type { PlayerState } from "./usePlayerState";
import type { LasersHandle } from "./Lasers";
import type { MissilesHandle } from "./Missiles";
import { useCockpit } from "./CockpitModeProvider";
import CockpitInterior from "./CockpitInterior";

interface PlayerControllerProps {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  enemyLasers?: MutableRefObject<LasersHandle | null>;
  enemyMissiles?: MutableRefObject<MissilesHandle | null>;
  /** Called when fireTrigger increments — pass ship pos/dir for spawning a laser */
  onFire: (origin: THREE.Vector3, direction: THREE.Vector3) => void;
  /** Called when missileTrigger increments — pass ship pos and target pos */
  onFireMissile?: (origin: THREE.Vector3, target: THREE.Vector3) => void;
  /** Enemy positions for missile targeting */
  enemies?: MutableRefObject<THREE.Vector3[]>;
  /** Whether input is allowed (blocked by e.g. drive modal open) */
  enabled: boolean;
  /** View mode for the camera */
  cameraView?: "first" | "third";
  /** Position to respawn at on death */
  spawnPosition?: THREE.Vector3;
}

/**
 * Flight controller supporting First-person and Third-person views.
 */
export default function PlayerController({
  input,
  player,
  enemyLasers,
  enemyMissiles,
  onFire,
  onFireMissile,
  enemies,
  enabled,
  cameraView = "first",
  spawnPosition,
}: PlayerControllerProps) {
  const { camera, scene } = useThree();
  const lastFireTrigger = useRef(0);
  const lastMissileTrigger = useRef(0);
  const lastTargetLockTrigger = useRef(0);
  const missileCooldown = useRef(0);
  const shipGroupRef = useRef<THREE.Group>(null);
  const { audio, recordDeath } = useCockpit();
  const shakeRef = useRef(0); // Shake intensity
  const dyingRef = useRef(false);
  const deathTimerRef = useRef(0);
  const camRayFrame = useRef(0);

  const COCKPIT_OFFSET = useMemo(() => new THREE.Vector3(0, 0.22, -0.5), []);

  useEffect(() => {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.isPerspectiveCamera) {
      perspective.fov = 82;
      perspective.near = 0.05;
      perspective.far = 2000;
      perspective.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    input.sampleKeyboard();
    const i = input.input.current;
    const m = input.mouse.current;
    const p = player.current;

    const raycaster = new THREE.Raycaster();
    const updateCamera = () => {
      if (cameraView === "third") {
        const desiredPos = p.position
          .clone()
          .add(new THREE.Vector3(0, 2.6, 11).applyQuaternion(p.quaternion));

        camRayFrame.current++;
        if (camRayFrame.current % 3 === 0) {
          raycaster.set(p.position, new THREE.Vector3().subVectors(desiredPos, p.position).normalize());
          raycaster.far = desiredPos.distanceTo(p.position);
          const hits = raycaster.intersectObjects(scene.children, true);
          const firstHit = hits.find((h) => h.object.parent !== shipGroupRef.current);
          if (firstHit) {
            desiredPos.copy(firstHit.point).addScaledVector(firstHit.face?.normal ?? new THREE.Vector3(0, 0, 0), 0.5);
          }
        }

        camera.position.lerp(desiredPos, Math.min(1, dt * 4));

        const lookAhead = p.position
          .clone()
          .add(new THREE.Vector3(0, 0.5, -45).applyQuaternion(p.quaternion))
          .add(p.velocity.clone().multiplyScalar(0.08));
        camera.lookAt(lookAhead);
      } else {
        // 1st person: camera sits at cockpit eye position inside the ship group
        const eyePos = p.position.clone().add(COCKPIT_OFFSET.clone().applyQuaternion(p.quaternion));
        camera.position.copy(eyePos);
        camera.quaternion.copy(p.quaternion);
      }
    };

    const syncGroup = () => {
      if (shipGroupRef.current) {
        shipGroupRef.current.position.copy(p.position);
        shipGroupRef.current.quaternion.copy(p.quaternion);
      }
    };

    if (!enabled) {
      // damp everything to a stop
      p.velocity.multiplyScalar(0.92);
      p.position.add(p.velocity.clone().multiplyScalar(dt));
      updateCamera();
      syncGroup();
      return;
    }

    // Handle target lock cycling
    if (i.targetLockTrigger !== lastTargetLockTrigger.current) {
      lastTargetLockTrigger.current = i.targetLockTrigger;
      const enemyList = enemies?.current ?? [];
      if (enemyList.length === 0) {
        p.lockTargetIndex = -1;
      } else {
        p.lockTargetIndex = (p.lockTargetIndex + 1) % enemyList.length;
        p.lockTargetPos.copy(enemyList[p.lockTargetIndex]);
      }
    }
    // Update locked target position if still valid
    if (p.lockTargetIndex >= 0 && enemies?.current) {
      if (p.lockTargetIndex < enemies.current.length) {
        p.lockTargetPos.copy(enemies.current[p.lockTargetIndex]);
      } else {
        // Target died, reset
        p.lockTargetIndex = -1;
      }
    }

    // Handle fire trigger
    if (i.fireTrigger !== lastFireTrigger.current) {
      lastFireTrigger.current = i.fireTrigger;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(p.quaternion);
      onFire(p.position.clone(), forward);
      audio.playLaser(false);
    }

    // Handle missile trigger
    missileCooldown.current -= dt;
    if (i.missileTrigger !== lastMissileTrigger.current && missileCooldown.current <= 0) {
      lastMissileTrigger.current = i.missileTrigger;
      missileCooldown.current = 1.2;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(p.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(p.quaternion);
      // Spawn from just below nose — visible in both 1st/3rd person, outside collision radius
      const origin = p.position.clone().add(forward.clone().multiplyScalar(1.2)).add(up.clone().multiplyScalar(-0.35));
      let target: THREE.Vector3;
      if (p.lockTargetIndex >= 0) {
        target = p.lockTargetPos.clone();
      } else {
        // Auto-target nearest
        target = p.position.clone().add(forward.multiplyScalar(200));
        let bestDist = Infinity;
        if (enemies?.current) {
          for (const ePos of enemies.current) {
            const d = p.position.distanceToSquared(ePos);
            if (d < bestDist) {
              bestDist = d;
              target = ePos;
            }
          }
        }
      }
      onFireMissile?.(origin, target);
      audio.playMissile();
    }
    p.missileCooldown = Math.max(0, missileCooldown.current) / 1.2;

    // Mouse pitch/yaw (accumulated) — convert to per-frame angular deltas
    const mouseYaw = m.dx * 0.0018;
    const mousePitch = m.dy * 0.0018;
    m.dx *= 0.55; // decay
    m.dy *= 0.55;

    // Angular rates (rad/s). Slow and legible, not sim-cert.
    const yawRate = 1.1;
    const pitchRate = 1.1;
    const rollRate = 1.6;

    const dYaw = -(i.yaw * yawRate * dt) - mouseYaw;
    const dPitch = -(i.pitch * pitchRate * dt) - mousePitch;
    const dRoll = -(i.roll * rollRate * dt);

    const qYaw = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      dYaw,
    );
    const qPitch = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      dPitch,
    );
    const qRoll = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      dRoll,
    );
    // Apply in ship-local space: q = q * qPitch * qYaw * qRoll
    p.quaternion.multiply(qPitch).multiply(qYaw).multiply(qRoll);
    p.quaternion.normalize();

    // Thrust along local -Z
    const baseSpeed = 22; // units/sec
    const boostMult = i.boost ? 2.2 : 1.0;
    const targetSpeed = i.throttle * baseSpeed * boostMult;

    // Smoothly approach target speed
    p.speed += (targetSpeed - p.speed) * Math.min(1, dt * 2.2);
    p.boost += ((i.boost ? 1 : 0) - p.boost) * Math.min(1, dt * 4);

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(p.quaternion);
    const targetVelocity = forward.multiplyScalar(p.speed);

    // Blend velocity toward forward-aligned speed (gives slight drift feel)
    p.velocity.lerp(targetVelocity, Math.min(1, dt * 2.5));
    p.position.add(p.velocity.clone().multiplyScalar(dt));

    // Enemy laser collision
    if (enabled && enemyLasers?.current?.consumeHit(p.position, 2.5)) {
      audio.playImpact();
      shakeRef.current = Math.min(1, shakeRef.current + 0.5);
      p.shield = Math.max(0, p.shield - 0.2);
      if (p.shield <= 0) {
        p.hull = Math.max(0, p.hull - 0.15);
      }
    }

    // Enemy missile collision
    if (enabled && enemyMissiles?.current?.consumeHit(p.position, 3.5)) {
      audio.playImpact();
      shakeRef.current = Math.min(1, shakeRef.current + 0.8);
      p.shield = Math.max(0, p.shield - 0.5);
      if (p.shield <= 0) {
        p.hull = Math.max(0, p.hull - 0.35);
      }
    }

    // Update shake decay
    shakeRef.current *= 0.9;
    if (shakeRef.current < 0.01) shakeRef.current = 0;

    // Update synthesized engine sound
    audio.updateEngine(p.speed, p.boost);

    // Hull regen (slow) + shield regen (faster)
    p.shield = Math.min(1, p.shield + dt * 0.12);
    if (p.shield >= 0.999) {
      p.hull = Math.min(1, p.hull + dt * 0.03);
    }

    // Death / Respawn logic
    if (p.hull <= 0 && !dyingRef.current) {
      dyingRef.current = true;
      deathTimerRef.current = 1.5;
      audio.playImpact();
      recordDeath();
      p.velocity.set(0, 0, 0);
      p.speed = 0;
    }

    if (dyingRef.current) {
      deathTimerRef.current -= dt;
      // Blackout camera during death
      if (cameraView === "first") {
        camera.position.set(0, -1000, 0);
      }
      if (deathTimerRef.current <= 0) {
        dyingRef.current = false;
        p.hull = 1;
        p.shield = 1;
        p.speed = 0;
        p.velocity.set(0, 0, 0);
        if (spawnPosition) {
          p.position.copy(spawnPosition);
        } else {
          p.position.set(0, 0, 0);
        }
      }
      return;
    }

    // Update camera with shake
    updateCamera();
    syncGroup();

    if (shakeRef.current > 0) {
      camera.position.x += (Math.random() - 0.5) * shakeRef.current * 1.5;
      camera.position.y += (Math.random() - 0.5) * shakeRef.current * 1.5;
    }
  });
  return (
    <group ref={shipGroupRef}>
      {/* Exterior hull only visible in 3rd person — in 1st person the camera is inside it and the front cap blocks the view */}
      {cameraView === "third" && <StarfighterHull />}
      <group position={[COCKPIT_OFFSET.x, COCKPIT_OFFSET.y, COCKPIT_OFFSET.z]}>
        <CockpitInterior />
      </group>
    </group>
  );
}

function StarfighterHull() {
  const HULL = "#94a3b8";
  const DARK = "#1e293b";
  const PANEL = "#475569";
  const GLOW = "#38bdf8";
  return (
    <>
      {/* === Fuselage === */}
      {/* Main body — angular hexagonal prism tapering rear-to-front */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.82, 4.2, 8]} />
        <meshStandardMaterial color={HULL} metalness={0.78} roughness={0.22} flatShading />
      </mesh>

      {/* === Cockpit canopy === */}
      {/* Frame rails */}
      <mesh position={[-0.22, 0.48, -0.8]}>
        <boxGeometry args={[0.04, 0.04, 1.6]} />
        <meshStandardMaterial color={DARK} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.22, 0.48, -0.8]}>
        <boxGeometry args={[0.04, 0.04, 1.6]} />
        <meshStandardMaterial color={DARK} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Canopy glass */}
      <mesh position={[0, 0.52, -0.9]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0ea5e9"
          emissiveIntensity={0.15}
          transparent
          opacity={0.25}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* === Wings — swept delta === */}
      {/* Left wing root */}
      <mesh position={[-0.7, -0.08, -0.2]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[1.8, 0.08, 1.1]} />
        <meshStandardMaterial color={PANEL} metalness={0.8} roughness={0.2} flatShading />
      </mesh>
      {/* Left wing tip */}
      <mesh position={[-1.8, -0.12, 0.3]} rotation={[0, 0, 0.55]}>
        <boxGeometry args={[1.2, 0.06, 0.7]} />
        <meshStandardMaterial color={PANEL} metalness={0.8} roughness={0.2} flatShading />
      </mesh>
      {/* Left wing tip light */}
      <mesh position={[-2.5, -0.12, 0.55]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* Right wing root */}
      <mesh position={[0.7, -0.08, -0.2]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[1.8, 0.08, 1.1]} />
        <meshStandardMaterial color={PANEL} metalness={0.8} roughness={0.2} flatShading />
      </mesh>
      {/* Right wing tip */}
      <mesh position={[1.8, -0.12, 0.3]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[1.2, 0.06, 0.7]} />
        <meshStandardMaterial color={PANEL} metalness={0.8} roughness={0.2} flatShading />
      </mesh>
      {/* Right wing tip light */}
      <mesh position={[2.5, -0.12, 0.55]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>

      {/* === Tail fins === */}
      <mesh position={[-0.35, 0.35, 1.6]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.06, 0.7, 0.45]} />
        <meshStandardMaterial color={DARK} metalness={0.85} roughness={0.18} flatShading />
      </mesh>
      <mesh position={[0.35, 0.35, 1.6]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.06, 0.7, 0.45]} />
        <meshStandardMaterial color={DARK} metalness={0.85} roughness={0.18} flatShading />
      </mesh>

      {/* === Engines — integrated rear === */}
      {/* Main engine housing */}
      <mesh position={[0, -0.05, 2.2]}>
        <boxGeometry args={[0.9, 0.45, 0.7]} />
        <meshStandardMaterial color={DARK} metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Left nozzle */}
      <mesh position={[-0.28, -0.05, 2.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.35, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} flatShading />
      </mesh>
      {/* Right nozzle */}
      <mesh position={[0.28, -0.05, 2.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.18, 0.26, 0.35, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} flatShading />
      </mesh>
      {/* Center nozzle */}
      <mesh position={[0, -0.02, 2.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.3, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} flatShading />
      </mesh>

      {/* === Engine glow & exhaust === */}
      {/* Replaced pointLight with emissive glow mesh for performance */}
      <mesh position={[0, -0.05, 3.2]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial color={GLOW} transparent opacity={0.12} />
      </mesh>
      {/* Inner hot cones */}
      <mesh position={[-0.28, -0.05, 3.0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.9, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.28, -0.05, 3.0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.9, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, -0.02, 2.95]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.08, 0.7, 8]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.25} />
      </mesh>
      {/* Outer glow */}
      <mesh position={[0, -0.05, 3.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.45, 1.4, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
      </mesh>

      {/* === Detail greebles === */}
      {/* Top sensor array */}
      <mesh position={[0, 0.52, 0.2]}>
        <boxGeometry args={[0.15, 0.06, 0.25]} />
        <meshStandardMaterial color={DARK} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bottom intake */}
      <mesh position={[0, -0.38, -0.3]}>
        <boxGeometry args={[0.35, 0.04, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Panel lines on fuselage */}
      <mesh position={[0, 0.36, 0.5]}>
        <boxGeometry args={[0.6, 0.008, 0.008]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.32, -1.0]}>
        <boxGeometry args={[0.5, 0.008, 0.008]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Hull accent stripe */}
      <mesh position={[0, 0.05, -1.2]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[0.08, 0.04, 1.4]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}

import { useEffect, useRef } from "react";
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
  const missileCooldown = useRef(0);
  const shipMeshRef = useRef<THREE.Group>(null);
  const { audio, recordDeath } = useCockpit();
  const shakeRef = useRef(0); // Shake intensity
  const dyingRef = useRef(false);
  const deathTimerRef = useRef(0);
  const camRayFrame = useRef(0);

  useEffect(() => {
    camera.position.set(0, 0, 0);
    camera.rotation.set(0, 0, 0);
    // wider FOV feels speedier
    const perspective = camera as THREE.PerspectiveCamera;
    if (perspective.isPerspectiveCamera) {
      perspective.fov = 75;
      perspective.near = 0.1;
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
    // Camera positioning function
    const updateCamera = () => {
      if (cameraView === "third") {
        const desiredPos = p.position
          .clone()
          .add(new THREE.Vector3(0, 2.6, 11).applyQuaternion(p.quaternion));

        // Camera collision: raycast from player to desired camera position (throttled)
        camRayFrame.current++;
        if (camRayFrame.current % 3 === 0) {
          raycaster.set(p.position, new THREE.Vector3().subVectors(desiredPos, p.position).normalize());
          raycaster.far = desiredPos.distanceTo(p.position);
          const hits = raycaster.intersectObjects(scene.children, true);
          // Ignore the player's own ship mesh
          const firstHit = hits.find((h) => h.object.parent !== shipMeshRef.current);
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
        const cockpitOffset = new THREE.Vector3(
          0,
          0.45 + Math.sin(performance.now() * 0.0035) * 0.015,
          0.8,
        ).applyQuaternion(p.quaternion);
        camera.position.copy(p.position).add(cockpitOffset);
        camera.quaternion.copy(p.quaternion);
      }
    };

    if (!enabled) {
      // damp everything to a stop
      p.velocity.multiplyScalar(0.92);
      p.position.add(p.velocity.clone().multiplyScalar(dt));
      updateCamera();
      return;
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
      const origin = p.position.clone().add(forward.clone().multiplyScalar(1.5));
      let target: THREE.Vector3 | null = null;
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
      if (!target || bestDist > 300 * 300) {
        target = p.position.clone().add(forward.multiplyScalar(200));
      }
      onFireMissile?.(origin, target);
    }

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
    }

    if (shipMeshRef.current && cameraView === "third") {
      shipMeshRef.current.position.copy(p.position);
      shipMeshRef.current.quaternion.copy(p.quaternion);
    }

    // Update camera with shake
    updateCamera();

    if (shakeRef.current > 0) {
      camera.position.x += (Math.random() - 0.5) * shakeRef.current * 1.5;
      camera.position.y += (Math.random() - 0.5) * shakeRef.current * 1.5;
    }
  });
  return (
    <>
      {cameraView === "third" ? (
        <group ref={shipMeshRef}>
          <StarfighterHull />
        </group>
      ) : (
        <CockpitInterior />
      )}
    </>
  );
}

function StarfighterHull() {
  return (
    <>
      {/* Main fuselage */}
      <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.95, 5.8, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.72} roughness={0.28} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 0.15, -3.25]} rotation={[0.18, 0, 0]}>
        <coneGeometry args={[0.58, 3.4, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.58} roughness={0.2} />
      </mesh>
      {/* Cockpit canopy (on top) */}
      <mesh position={[0, 0.52, -1.15]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.42, 1.7, 10]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#22d3ee"
          emissiveIntensity={0.28}
          transparent
          opacity={0.45}
        />
      </mesh>
      {/* Left wing */}
      <mesh position={[-1.55, -0.1, -0.8]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[2.6, 0.12, 1.25]} />
        <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.24} />
      </mesh>
      {/* Right wing */}
      <mesh position={[1.55, -0.1, -0.8]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[2.6, 0.12, 1.25]} />
        <meshStandardMaterial color="#64748b" metalness={0.72} roughness={0.24} />
      </mesh>
      {/* Left engine pod */}
      <mesh position={[-0.88, -0.18, 2.1]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.42, 0.42, 2.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.68} roughness={0.32} />
      </mesh>
      {/* Right engine pod */}
      <mesh position={[0.88, -0.18, 2.1]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.42, 0.42, 2.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.68} roughness={0.32} />
      </mesh>
      {/* Thruster glow point light */}
      <pointLight position={[0, 0.15, 3.6]} intensity={18} distance={12} color="#38bdf8" />
      {/* Engine exhaust cone - inner hot core */}
      <mesh position={[0, 0.1, 3.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.5, 2.5, 16]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
      </mesh>
      {/* Engine exhaust cone - outer cooler glow */}
      <mesh position={[0, 0.1, 4.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.8, 1.5, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </mesh>
      {/* Engine base ring */}
      <mesh position={[0, 0.1, 3.0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 8, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

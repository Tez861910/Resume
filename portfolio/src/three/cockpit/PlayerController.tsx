import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { CockpitInputApi } from "./useCockpitInput";
import type { PlayerState } from "./usePlayerState";
import type { LasersHandle } from "./Lasers";
import { useGameAsset } from "./AssetPipeline";
import { useCockpit } from "./CockpitModeProvider";

interface PlayerControllerProps {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  enemyLasers?: MutableRefObject<LasersHandle | null>;
  /** Called when fireTrigger increments — pass ship pos/dir for spawning a laser */
  onFire: (origin: THREE.Vector3, direction: THREE.Vector3) => void;
  /** Whether input is allowed (blocked by e.g. drive modal open) */
  enabled: boolean;
  /** View mode for the camera */
  cameraView?: "first" | "third";
}

/**
 * Flight controller supporting First-person and Third-person views.
 */
export default function PlayerController({
  input,
  player,
  enemyLasers,
  onFire,
  enabled,
  cameraView = "first",
}: PlayerControllerProps) {
  const { camera } = useThree();
  const lastFireTrigger = useRef(0);
  const shipMeshRef = useRef<THREE.Mesh>(null);
  const asset = useGameAsset("player");
  const { audio } = useCockpit();
  const shakeRef = useRef(0); // Shake intensity

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

    // Camera positioning function
    const updateCamera = () => {
      if (cameraView === "third") {
        // Position behind and slightly above the ship
        const offset = new THREE.Vector3(0, 3, 10).applyQuaternion(
          p.quaternion,
        );
        camera.position.copy(p.position).add(offset);

        // Look ahead of the ship
        const lookAhead = p.position
          .clone()
          .add(new THREE.Vector3(0, 0, -50).applyQuaternion(p.quaternion));
        camera.lookAt(lookAhead);
      } else {
        camera.position.copy(p.position);
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
      // Flash or screen shake could be triggered here via an event or state
      audio.playImpact();
      shakeRef.current = Math.min(1, shakeRef.current + 0.5); // Add shake
      p.shield = Math.max(0, p.shield - 0.2);
      if (p.shield <= 0) {
        p.hull = Math.max(0, p.hull - 0.15);
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
    if (p.hull <= 0) {
      p.hull = 1;
      p.shield = 1;
      p.speed = 0;
      p.velocity.set(0, 0, 0);
      // Push them back a bit or reset to 0,0,0
      p.position.set(0, 0, 0);
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
  return cameraView === "third" ? (
    <mesh ref={shipMeshRef}>
      <group rotation={[Math.PI / 2, 0, Math.PI]}>
        <mesh geometry={asset.geometry} material={asset.material} />
      </group>
    </mesh>
  ) : null;
}

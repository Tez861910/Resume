import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { CockpitInputApi } from "./useCockpitInput";
import type { PlayerState } from "./usePlayerState";

interface PlayerControllerProps {
  input: CockpitInputApi;
  player: MutableRefObject<PlayerState>;
  /** Called when fireTrigger increments — pass ship pos/dir for spawning a laser */
  onFire: (origin: THREE.Vector3, direction: THREE.Vector3) => void;
  /** Whether input is allowed (blocked by e.g. drive modal open) */
  enabled: boolean;
}

/**
 * First-person flight. No visible ship mesh — the camera is the pilot's eyes
 * and the cockpit chrome is DOM. Ship orientation tracked via quaternion.
 */
export default function PlayerController({
  input,
  player,
  onFire,
  enabled,
}: PlayerControllerProps) {
  const { camera } = useThree();
  const lastFireTrigger = useRef(0);

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

    if (!enabled) {
      // damp everything to a stop
      p.velocity.multiplyScalar(0.92);
      p.position.add(p.velocity.clone().multiplyScalar(dt));
      camera.position.copy(p.position);
      camera.quaternion.copy(p.quaternion);
      return;
    }

    // Handle fire trigger
    if (i.fireTrigger !== lastFireTrigger.current) {
      lastFireTrigger.current = i.fireTrigger;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(p.quaternion);
      onFire(p.position.clone(), forward);
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

    // Hull regen (slow) + shield regen (faster)
    p.shield = Math.min(1, p.shield + dt * 0.12);
    if (p.shield >= 0.999) {
      p.hull = Math.min(1, p.hull + dt * 0.03);
    }

    camera.position.copy(p.position);
    camera.quaternion.copy(p.quaternion);
  });

  return null;
}

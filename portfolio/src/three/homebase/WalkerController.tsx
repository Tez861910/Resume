import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const SPEED = 6;
const SPRINT_MULT = 1.5;
const SENSITIVITY = 0.0018;
const HEIGHT = 1.75;
const RADIUS = 0.4;
const MIN_PITCH = -Math.PI / 2.3;
const MAX_PITCH = Math.PI / 2.3;

type Wall = { x1: number; z1: number; x2: number; z2: number };

function distToSegment(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len2 = dx * dx + dz * dz;
  if (len2 === 0) return Math.sqrt((px - x1) ** 2 + (pz - z1) ** 2);
  let t = ((px - x1) * dx + (pz - z1) * dz) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cz = z1 + t * dz;
  return Math.sqrt((px - cx) ** 2 + (pz - cz) ** 2);
}

function buildWalls(vaultOpen: boolean): Wall[] {
  const walls: Wall[] = [];

  // --- Bridge (z=8..18, x=±1.5) ---
  walls.push({ x1: -1.5, z1: 8, x2: -1.5, z2: 18 });
  walls.push({ x1: 1.5, z1: 8, x2: 1.5, z2: 18 });

  // --- Command Center room (z=-12..8, x=±8) ---
  walls.push({ x1: -8, z1: -12, x2: -8, z2: 8 });
  walls.push({ x1: 8, z1: -12, x2: 8, z2: 8 });
  // South wall (z=8) with opening at x=[-1.5,1.5]
  walls.push({ x1: -8, z1: 8, x2: -1.5, z2: 8 });
  walls.push({ x1: 1.5, z1: 8, x2: 8, z2: 8 });
  // North wall (z=-12, vault door wall) with opening at x=[-1.5,1.5] only if vault open
  walls.push({ x1: -8, z1: -12, x2: -1.5, z2: -12 });
  walls.push({ x1: 1.5, z1: -12, x2: 8, z2: -12 });
  if (!vaultOpen) {
    walls.push({ x1: -1.5, z1: -12, x2: 1.5, z2: -12 });
  }

  // --- Vault Room (z=-26..-12, x=±8) — only walkable when open ---
  if (vaultOpen) {
    walls.push({ x1: -8, z1: -26, x2: -8, z2: -12 });
    walls.push({ x1: 8, z1: -26, x2: 8, z2: -12 });
    walls.push({ x1: -8, z1: -26, x2: 8, z2: -26 });
  }

  // --- Landing pad outer ring as straight-segment polygon at radius 9.5, centered (0,22) ---
  const cx = 0;
  const cz = 22;
  const r = 9.5;
  const sides = 16;
  for (let i = 0; i < sides; i++) {
    const a1 = (i / sides) * Math.PI * 2;
    const a2 = ((i + 1) / sides) * Math.PI * 2;
    const x1 = cx + Math.cos(a1) * r;
    const z1 = cz + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a2) * r;
    const z2 = cz + Math.sin(a2) * r;
    // Skip segment where bridge connects (south-center, z<13, x near 0)
    const midZ = (z1 + z2) / 2;
    const midX = (x1 + x2) / 2;
    if (midZ < 13 && Math.abs(midX) < 2.5) continue;
    walls.push({ x1, z1, x2, z2 });
  }

  // Extend bridge railings slightly onto the pad for a smooth transition
  walls.push({ x1: -1.5, z1: 18, x2: -1.5, z2: 20 });
  walls.push({ x1: 1.5, z1: 18, x2: 1.5, z2: 20 });

  return walls;
}

const keys = new Set<string>();

// Reusable temps to avoid per-frame GC
const _fwd = new THREE.Vector3();
const _rgt = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _prev = new THREE.Vector3();
const _euler = new THREE.Euler();

interface Props {
  vaultOpen?: boolean;
}

export default function WalkerController({ vaultOpen = false }: Props) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const vel = useRef(new THREE.Vector3());

  const walls = useMemo(() => buildWalls(vaultOpen), [vaultOpen]);

  useEffect(() => {
    const p = camera as THREE.PerspectiveCamera;
    if (p.isPerspectiveCamera) {
      p.fov = 72;
      p.near = 0.05;
      p.far = 160;
      p.updateProjectionMatrix();
    }
  }, [camera]);

  useEffect(() => {
    camera.position.set(0, HEIGHT, 22);
    yaw.current = Math.PI; // face -z toward bridge
    pitch.current = 0;
  }, [camera]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => keys.add(e.key.toLowerCase());
    const ku = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const bl = () => keys.clear();
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", bl);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", bl);
    };
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => {
      if (!document.pointerLockElement) return;
      yaw.current -= e.movementX * SENSITIVITY;
      pitch.current = Math.max(MIN_PITCH, Math.min(MAX_PITCH, pitch.current - e.movementY * SENSITIVITY));
    };
    window.addEventListener("mousemove", mm);
    return () => window.removeEventListener("mousemove", mm);
  }, []);

  useEffect(() => {
    const cl = () => {
      if (gl.domElement && !document.pointerLockElement) gl.domElement.requestPointerLock();
    };
    gl.domElement.addEventListener("click", cl);
    return () => gl.domElement.removeEventListener("click", cl);
  }, [gl.domElement]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    _fwd.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    _rgt.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    _dir.set(0, 0, 0);
    if (keys.has("w") || keys.has("arrowup")) _dir.add(_fwd);
    if (keys.has("s") || keys.has("arrowdown")) _dir.sub(_fwd);
    if (keys.has("d") || keys.has("arrowright")) _dir.add(_rgt);
    if (keys.has("a") || keys.has("arrowleft")) _dir.sub(_rgt);
    const sprint = keys.has("shift");
    if (_dir.length() > 0) _dir.normalize();
    const spd = SPEED * (sprint ? SPRINT_MULT : 1);
    _dir.multiplyScalar(spd);
    vel.current.lerp(_dir, 1 - Math.pow(0.82, dt * 60));

    _prev.copy(camera.position);
    camera.position.addScaledVector(vel.current, dt);
    camera.position.y = HEIGHT;

    for (const w of walls) {
      const dist = distToSegment(camera.position.x, camera.position.z, w.x1, w.z1, w.x2, w.z2);
      if (dist < RADIUS) {
        const push = RADIUS - dist;
        const wdx = w.x2 - w.x1;
        const wdz = w.z2 - w.z1;
        const wlen = Math.sqrt(wdx * wdx + wdz * wdz);
        if (wlen === 0) continue;
        const nx = -wdz / wlen;
        const nz = wdx / wlen;
        const side = (camera.position.x - w.x1) * nx + (camera.position.z - w.z1) * nz;
        const sign = side >= 0 ? 1 : -1;
        camera.position.x += nx * sign * push;
        camera.position.z += nz * sign * push;
      }
    }

    vel.current.x = (camera.position.x - _prev.x) / Math.max(dt, 0.001);
    vel.current.z = (camera.position.z - _prev.z) / Math.max(dt, 0.001);

    _euler.set(pitch.current, yaw.current, 0, "YXZ");
    camera.quaternion.setFromEuler(_euler);
  });

  return null;
}
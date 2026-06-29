import { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface Missile {
  alive: boolean;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  target: THREE.Vector3 | null;
  ttl: number;
  age: number; // seconds alive — used for spawn invulnerability
}

export interface MissilesHandle {
  spawn: (origin: THREE.Vector3, target: THREE.Vector3) => void;
  /** Returns true if any alive missile is within radius of pos. Consumes the missile. */
  consumeHit: (pos: THREE.Vector3, radius: number) => boolean;
}

const MAX = 16;
const SPEED = 55;
const TURN_RATE = 2.8;
const TTL = 5.0;
const SPAWN_SAFE_TIME = 0.18; // seconds before missile can collide

const Missiles = forwardRef<MissilesHandle, { color?: string }>(function Missiles(
  _props,
  ref,
) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const missilesRef = useRef<Missile[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lightRef = useRef<THREE.PointLight>(null);

  // Main missile body — bright, visible
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ff7700",
      }),
    [],
  );
  const geo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.14, 1.6, 6), []);

  // Engine exhaust glow — long, additive
  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffaa33",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const glowGeo = useMemo(() => new THREE.ConeGeometry(0.35, 2.4, 6), []);

  useEffect(() => {
    missilesRef.current = Array.from({ length: MAX }, () => ({
      alive: false,
      pos: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      target: null,
      ttl: 0,
      age: 0,
    }));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      spawn(origin, target) {
        const m = missilesRef.current.find((x) => !x.alive);
        if (!m) return;
        m.alive = true;
        m.pos.copy(origin);
        const dir = new THREE.Vector3().subVectors(target, origin).normalize();
        m.velocity.copy(dir).multiplyScalar(SPEED);
        m.target = target;
        m.ttl = TTL;
        m.age = 0;
      },
      consumeHit(pos, radius) {
        const r2 = radius * radius;
        for (const m of missilesRef.current) {
          if (!m.alive || m.age < SPAWN_SAFE_TIME) continue;
          if (m.pos.distanceToSquared(pos) <= r2) {
            m.alive = false;
            return true;
          }
        }
        return false;
      },
    }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = meshRef.current;
    const glowMesh = glowRef.current;
    if (!mesh) return;

    let idx = 0;
    let nearestAlive: Missile | null = null;
    let nearestDist = Infinity;
    const cylAxis = new THREE.Vector3(0, 1, 0);

    for (const m of missilesRef.current) {
      if (!m.alive) continue;

      m.age += dt;
      m.ttl -= dt;
      if (m.ttl <= 0) {
        m.alive = false;
        continue;
      }

      // Homing logic
      if (m.target) {
        const desiredDir = new THREE.Vector3().subVectors(m.target, m.pos).normalize();
        const currentDir = m.velocity.clone().normalize();
        currentDir.lerp(desiredDir, dt * TURN_RATE);
        m.velocity.copy(currentDir).multiplyScalar(SPEED);
      }

      m.pos.addScaledVector(m.velocity, dt);

      const velDir = m.velocity.clone().normalize();
      dummy.position.copy(m.pos);
      dummy.quaternion.setFromUnitVectors(cylAxis, velDir);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);

      // Glow trail — positioned behind missile
      if (glowMesh) {
        dummy.position.copy(m.pos).addScaledVector(velDir, -1.2);
        dummy.quaternion.setFromUnitVectors(cylAxis, velDir.clone().negate());
        glowMesh.setMatrixAt(idx, dummy.matrix);
      }

      // Track nearest alive missile for point light
      const d = m.pos.lengthSq();
      if (d < nearestDist) {
        nearestDist = d;
        nearestAlive = m;
      }

      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
    if (glowMesh) {
      glowMesh.count = idx;
      glowMesh.instanceMatrix.needsUpdate = true;
    }

    // Move point light to nearest alive missile
    if (lightRef.current) {
      if (nearestAlive) {
        lightRef.current.position.copy(nearestAlive.pos);
        lightRef.current.intensity = 8;
        lightRef.current.visible = true;
      } else {
        lightRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[geo, mat, MAX]}
        frustumCulled={false}
        count={0}
      />
      <instancedMesh
        ref={glowRef}
        args={[glowGeo, glowMat, MAX]}
        frustumCulled={false}
        count={0}
      />
      <pointLight
        ref={lightRef}
        color="#ff8800"
        intensity={0}
        distance={25}
        decay={2}
        visible={false}
      />
    </>
  );
});

export default Missiles;

import { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface Missile {
  alive: boolean;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  target: THREE.Vector3 | null;
  ttl: number;
}

export interface MissilesHandle {
  spawn: (origin: THREE.Vector3, target: THREE.Vector3) => void;
  /** Returns true if any alive missile is within radius of pos. Consumes the missile. */
  consumeHit: (pos: THREE.Vector3, radius: number) => boolean;
}

const MAX = 16;
const SPEED = 60;
const TURN_RATE = 2.5;
const TTL = 5.0;

const Missiles = forwardRef<MissilesHandle, { color?: string }>(function Missiles(
  { color = "#f59e0b" },
  ref,
) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const missilesRef = useRef<Missile[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
      }),
    [color],
  );
  const geo = useMemo(() => new THREE.CylinderGeometry(0.15, 0.08, 1.2, 6), []);

  const glowMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [color],
  );
  const glowGeo = useMemo(() => new THREE.ConeGeometry(0.2, 1.8, 6), []);

  useEffect(() => {
    missilesRef.current = Array.from({ length: MAX }, () => ({
      alive: false,
      pos: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      target: null,
      ttl: 0,
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
        // Initial direction: toward target with slight variance
        const dir = new THREE.Vector3().subVectors(target, origin).normalize();
        dir.x += (Math.random() - 0.5) * 0.15;
        dir.y += (Math.random() - 0.5) * 0.15;
        dir.z += (Math.random() - 0.5) * 0.15;
        dir.normalize();
        m.velocity.copy(dir).multiplyScalar(SPEED);
        m.target = target;
        m.ttl = TTL;
      },
      consumeHit(pos, radius) {
        const r2 = radius * radius;
        for (const m of missilesRef.current) {
          if (!m.alive) continue;
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
    const cylAxis = new THREE.Vector3(0, 1, 0);

    for (const m of missilesRef.current) {
      if (!m.alive) continue;

      m.ttl -= dt;
      if (m.ttl <= 0) {
        m.alive = false;
        continue;
      }

      // Homing logic
      if (m.target) {
        const desiredDir = new THREE.Vector3().subVectors(m.target, m.pos).normalize();
        const currentDir = m.velocity.clone().normalize();

        // Lerp direction for "turning" effect
        currentDir.lerp(desiredDir, dt * TURN_RATE);
        m.velocity.copy(currentDir).multiplyScalar(SPEED);
      }

      m.pos.addScaledVector(m.velocity, dt);

      const velDir = m.velocity.clone().normalize();
      dummy.position.copy(m.pos);
      dummy.quaternion.setFromUnitVectors(cylAxis, velDir);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);

      // Glow trail — positioned behind missile, pointing backward
      if (glowMesh) {
        dummy.position.copy(m.pos).addScaledVector(velDir, -0.9);
        dummy.quaternion.setFromUnitVectors(cylAxis, velDir.clone().negate());
        glowMesh.setMatrixAt(idx, dummy.matrix);
      }

      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
    if (glowMesh) {
      glowMesh.count = idx;
      glowMesh.instanceMatrix.needsUpdate = true;
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
    </>
  );
});

export default Missiles;

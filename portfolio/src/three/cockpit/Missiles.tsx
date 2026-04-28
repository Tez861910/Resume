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
  const missilesRef = useRef<Missile[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 2,
      }),
    [color],
  );
  const geo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.1, 1.5, 8), []);

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
        // Initial direction: slightly up or random
        m.velocity.set(Math.random() - 0.5, 1, Math.random() - 0.5).normalize().multiplyScalar(SPEED);
        m.target = target;
        m.ttl = TTL;
      },
    }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mesh = meshRef.current;
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

      dummy.position.copy(m.pos);
      dummy.quaternion.setFromUnitVectors(cylAxis, m.velocity.clone().normalize());
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, mat, MAX]}
      frustumCulled={false}
      count={0}
    />
  );
});

export default Missiles;

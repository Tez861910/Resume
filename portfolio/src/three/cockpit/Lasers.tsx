import { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface Laser {
  alive: boolean;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  ttl: number;
}

export interface LasersHandle {
  spawn: (origin: THREE.Vector3, direction: THREE.Vector3) => void;
  /** Returns true if any laser is close to `pos` within `radius`. Consumes the first matching laser. */
  consumeHit: (pos: THREE.Vector3, radius: number) => boolean;
}

const MAX = 64;
const SPEED = 240;
const TTL = 1.6;

const Lasers = forwardRef<LasersHandle, { color?: string }>(function Lasers(
  { color = "#fbbf24" },
  ref,
) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lasersRef = useRef<Laser[]>([]);
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
  const geo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 3.2, 6), []);

  useEffect(() => {
    lasersRef.current = Array.from({ length: MAX }, () => ({
      alive: false,
      pos: new THREE.Vector3(),
      dir: new THREE.Vector3(0, 0, -1),
      ttl: 0,
    }));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      spawn(origin, direction) {
        const l = lasersRef.current.find((x) => !x.alive);
        if (!l) return;
        l.alive = true;
        l.pos.copy(origin);
        l.dir.copy(direction).normalize();
        l.ttl = TTL;
      },
      consumeHit(pos, radius) {
        const r2 = radius * radius;
        for (const l of lasersRef.current) {
          if (!l.alive) continue;
          if (l.pos.distanceToSquared(pos) <= r2) {
            l.alive = false;
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
    if (!mesh) return;
    let idx = 0;
    const cylAxis = new THREE.Vector3(0, 1, 0);
    for (const l of lasersRef.current) {
      if (!l.alive) continue;
      l.ttl -= dt;
      if (l.ttl <= 0) {
        l.alive = false;
        continue;
      }
      l.pos.addScaledVector(l.dir, SPEED * dt);
      dummy.position.copy(l.pos);
      dummy.quaternion.setFromUnitVectors(cylAxis, l.dir);
      dummy.scale.set(1, 1, 1);
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

export default Lasers;

import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  forwardRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ExplosionParticle {
  alive: boolean;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  alpha: number;
  ttl: number;
}

export interface ExplosionsHandle {
  spawn: (pos: THREE.Vector3, count?: number, color?: string) => void;
}

interface ExplosionsProps {
  /* No props currently used */
}

const MAX_PARTICLES = 512;
const Damping = 0.95;

const Explosions = forwardRef<ExplosionsHandle, ExplosionsProps>(
  function Explosions(_, ref) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const particlesRef = useRef<ExplosionParticle[]>([]);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Basic orange/fire material
    const mat = useMemo(
      () =>
        new THREE.MeshBasicMaterial({
          color: "#ffaa00",
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      [],
    );

    const geo = useMemo(() => new THREE.IcosahedronGeometry(0.5, 0), []);

    useEffect(() => {
      particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => ({
        alive: false,
        pos: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        scale: 1,
        alpha: 1,
        ttl: 0,
      }));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        spawn(pos, count = 20) {
          let spawned = 0;
          for (const p of particlesRef.current) {
            if (p.alive) continue;

            p.alive = true;
            p.pos.copy(pos);
            // Random velocity in a sphere
            p.velocity.set(
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
            );
            p.scale = 0.5 + Math.random() * 1.5;
            p.alpha = 1.0;
            p.ttl = 0.5 + Math.random() * 0.8; // Duration

            spawned++;
            if (spawned >= count) break;
          }
        },
      }),
      [],
    );

    useFrame((_, delta) => {
      const dt = Math.min(delta, 0.05);
      const mesh = meshRef.current;
      if (!mesh) return;

      let idx = 0;
      for (const p of particlesRef.current) {
        if (!p.alive) continue;

        p.ttl -= dt;
        if (p.ttl <= 0) {
          p.alive = false;
          continue;
        }

        // Physics
        p.pos.addScaledVector(p.velocity, dt);
        p.velocity.multiplyScalar(Damping);

        // Fade and scale
        p.alpha = p.ttl / 1.0; // Fade out based on TTL
        p.scale *= 0.98;

        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);

        // Note: Setting individual instance colors requires a custom shader or
        // an attribute, which is complex. For now, we'll use the mesh color.

        idx++;
      }
      mesh.count = idx;
      mesh.instanceMatrix.needsUpdate = true;
    });

    return (
      <instancedMesh
        ref={meshRef}
        args={[geo, mat, MAX_PARTICLES]}
        frustumCulled={false}
        count={0}
      />
    );
  },
);

export default Explosions;

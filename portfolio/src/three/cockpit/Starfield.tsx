import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Distant star field using a single Points object. Purely decorative — it
 * follows the camera so stars feel at infinity.
 */
export default function Starfield({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const radius = 800;
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.75 + Math.random() * 0.25);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      // cool/warm tint
      colors[i * 3 + 0] = 0.7 + 0.3 * t;
      colors[i * 3 + 1] = 0.8 + 0.2 * Math.random();
      colors[i * 3 + 2] = 1.0;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const m = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    return { geometry: g, material: m };
  }, [count]);

  useFrame(({ camera }) => {
    if (pointsRef.current) {
      pointsRef.current.position.copy(camera.position);
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

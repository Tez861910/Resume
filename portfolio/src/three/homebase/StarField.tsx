import { useMemo } from "react";
import * as THREE from "three";

export default function StarField() {
  const geo = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 60 + Math.random() * 50;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.15 + Math.random() * 0.35;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial
        color="#c8d6e5"
        size={0.25}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}
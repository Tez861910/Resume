import { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Pre-create fallbacks
const FALLBACKS: Record<
  string,
  {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
  }
> = {
  player: {
    geometry: new THREE.ConeGeometry(1, 4, 4),
    material: new THREE.MeshStandardMaterial({
      color: "#4488ff",
      wireframe: true,
    }),
  },
  enemy: {
    geometry: new THREE.OctahedronGeometry(1.2, 0),
    material: new THREE.MeshStandardMaterial({
      color: "#ef4444",
      emissive: "#7f1d1d",
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.6,
      flatShading: true,
    }),
  },
  asteroid: {
    geometry: new THREE.IcosahedronGeometry(1, 0),
    material: new THREE.MeshStandardMaterial({
      color: "#6b7280",
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    }),
  },
  station: {
    geometry: new THREE.BoxGeometry(4, 4, 4),
    material: new THREE.MeshStandardMaterial({
      color: "#22d3ee",
      wireframe: true,
    }),
  },
  harddrive: {
    geometry: new THREE.BoxGeometry(1.5, 2.5, 0.4),
    material: new THREE.MeshStandardMaterial({
      color: "#34d399",
      emissive: "#059669",
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
    }),
  },
};

export type AssetType = keyof typeof FALLBACKS;

/**
 * A custom hook that tries to load a GLTF model for the given AssetType.
 * If the file (/models/{type}.glb) doesn't exist or fails to load, it gracefully
 * falls back to the defined placeholder primitive geometry and material.
 */
export function useGameAsset(type: AssetType): {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
} {
  const [asset, setAsset] = useState(FALLBACKS[type]);

  useEffect(() => {
    let active = true;
    const loader = new GLTFLoader();

    loader.load(
      `/models/${type}.glb`,
      (gltf) => {
        if (!active) return;

        let geom: THREE.BufferGeometry | null = null;
        let mat: THREE.Material | THREE.Material[] | null = null;

        // Find the first mesh in the loaded GLTF
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && !geom) {
            geom = child.geometry;
            mat = child.material;
          }
        });

        if (geom && mat) {
          const g = geom as THREE.BufferGeometry;
          // Normalize geometry sizing to match our expected scales
          g.computeBoundingBox();
          if (g.boundingBox) {
            const size = new THREE.Vector3();
            g.boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            // Scale models to roughly fit a unit size so game logic isn't broken
            const fallbackSize =
              type === "station" ? 4 : type === "asteroid" ? 2 : 2.4;
            const scale = fallbackSize / maxDim;
            g.scale(scale, scale, scale);
            g.computeBoundingSphere();
          }

          setAsset({ geometry: g, material: mat });
        }
      },
      undefined,
      () => {
        // Suppress 404 logs since we expect missing assets right now
        // console.warn(`Asset Pipeline: Falling back to primitive for ${type}`);
      },
    );

    return () => {
      active = false;
    };
  }, [type]);

  return asset;
}

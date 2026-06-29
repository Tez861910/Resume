import { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Pre-create fallbacks — proper-looking procedural models instead of wireframes
const FALLBACKS: Record<
  string,
  {
    geometry: THREE.BufferGeometry;
    material: THREE.Material | THREE.Material[];
  }
> = {
  player: {
    geometry: (() => {
      // Sleek arrowhead fighter shape
      const geo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        // Nose
        0, 0, -2.2,
        // Top fin
        0, 0.6, 0.8,
        // Bottom fin
        0, -0.3, 1.0,
        // Left wing tip
        -1.4, 0.1, 0.6,
        // Right wing tip
        1.4, 0.1, 0.6,
        // Rear engine left
        -0.35, 0.1, 1.6,
        // Rear engine right
        0.35, 0.1, 1.6,
        // Rear center
        0, 0.15, 1.4,
      ]);
      const indices = [
        0,1,4,  0,3,1,  0,2,3,  0,4,2,
        1,3,7,  1,7,4,  3,2,7,  4,7,2,
        3,5,7,  5,6,7,  4,7,6,  1,4,6,
        1,6,5,  1,5,3,
      ];
      geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    })(),
    material: new THREE.MeshStandardMaterial({
      color: "#38bdf8",
      metalness: 0.9,
      roughness: 0.15,
      emissive: "#0c4a6e",
      emissiveIntensity: 0.3,
    }),
  },
  enemy: {
    geometry: (() => {
      // Aggressive spiked octahedron
      const geo = new THREE.OctahedronGeometry(1.2, 1);
      // Pull some vertices to make it spikier
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const z = pos[i + 2];
        if (z < -0.5) {
          pos[i + 2] *= 1.6; // elongate nose
        }
        if (Math.abs(pos[i]) > 0.8) {
          pos[i] *= 1.3; // widen wings
        }
      }
      geo.computeVertexNormals();
      return geo;
    })(),
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
    geometry: (() => {
      // Higher subdivision for more surface detail
      const geo = new THREE.IcosahedronGeometry(1, 2);
      const pos = geo.attributes.position.array as Float32Array;
      const colors = new Float32Array(pos.length);

      // Simple pseudo-random noise function
      const hash = (x: number, y: number, z: number) => {
        let h = Math.sin(x * 12.9898 + y * 78.233 + z * 53.539) * 43758.5453;
        return h - Math.floor(h);
      };
      const noise = (x: number, y: number, z: number) => {
        let v = 0;
        let amp = 0.35;
        let freq = 1.2;
        for (let o = 0; o < 3; o++) {
          v += hash(x * freq, y * freq, z * freq) * amp;
          amp *= 0.5;
          freq *= 2.1;
        }
        return v;
      };

      for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i];
        const y = pos[i + 1];
        const z = pos[i + 2];
        const len = Math.sqrt(x * x + y * y + z * z) || 1;
        // Multi-octave displacement along normal
        const n = noise(x * 0.8, y * 0.8, z * 0.8) * 0.45 + noise(x * 2.5, y * 2.5, z * 2.5) * 0.12;
        const displacement = 1 + n - 0.25;
        pos[i] = (x / len) * displacement;
        pos[i + 1] = (y / len) * displacement;
        pos[i + 2] = (z / len) * displacement;

        // Vertex color variation: darker crevices, lighter peaks
        const crevice = Math.max(0, Math.min(1, 0.4 + n * 1.2));
        colors[i] = 0.35 * crevice + 0.15;
        colors[i + 1] = 0.37 * crevice + 0.15;
        colors[i + 2] = 0.42 * crevice + 0.18;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      return geo;
    })(),
    material: new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.15,
      flatShading: true,
    }),
  },
  station: {
    geometry: (() => {
      // Hexagonal station with rings
      const core = new THREE.CylinderGeometry(2, 2.4, 3, 6);
      const ring1 = new THREE.TorusGeometry(3.2, 0.3, 8, 24);
      const ring2 = new THREE.TorusGeometry(4.0, 0.2, 8, 24);
      
      // We can't return a Group, so let's merge them manually
      const geometries = [core, ring1, ring2];
      const merged = new THREE.BufferGeometry();
      let totalVerts = 0;
      
      // Position and rotate the rings
      ring1.rotateX(Math.PI / 2);
      ring2.rotateX(Math.PI / 2);
      
      for (const g of geometries) {
        totalVerts += g.attributes.position.count;
      }
      
      const positions = new Float32Array(totalVerts * 3);
      const normals = new Float32Array(totalVerts * 3);
      let offset = 0;
      
      for (const g of geometries) {
        const p = g.attributes.position.array as Float32Array;
        const n = g.attributes.normal?.array as Float32Array;
        const count = g.attributes.position.count;
        
        for (let i = 0; i < count; i++) {
          positions[(offset + i) * 3] = p[i * 3];
          positions[(offset + i) * 3 + 1] = p[i * 3 + 1];
          positions[(offset + i) * 3 + 2] = p[i * 3 + 2];
          
          if (n) {
            normals[(offset + i) * 3] = n[i * 3];
            normals[(offset + i) * 3 + 1] = n[i * 3 + 1];
            normals[(offset + i) * 3 + 2] = n[i * 3 + 2];
          }
        }
        offset += count;
        g.dispose();
      }
      
      merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      merged.computeBoundingSphere();
      return merged;
    })(),
    material: new THREE.MeshStandardMaterial({
      color: "#22d3ee",
      metalness: 0.8,
      roughness: 0.2,
      emissive: "#0891b2",
      emissiveIntensity: 0.25,
    }),
  },
  harddrive: {
    geometry: (() => {
      const geo = new THREE.BoxGeometry(1.5, 2.5, 0.4);
      // Bevel the edges slightly by scaling inner vertices
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const x = Math.abs(pos[i]);
        const y = Math.abs(pos[i + 1]);
        const z = Math.abs(pos[i + 2]);
        if (x > 0.6 && y > 1.1 && z > 0.15) {
          pos[i] *= 0.85;
          pos[i + 1] *= 0.9;
          pos[i + 2] *= 0.85;
        }
      }
      geo.computeVertexNormals();
      return geo;
    })(),
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

const assetCache = new Map<AssetType, { geometry: THREE.BufferGeometry; material: THREE.Material | THREE.Material[] }>();

/**
 * A custom hook that tries to load a GLTF model for the given AssetType.
 * If the file (/models/{type}.glb) doesn't exist or fails to load, it gracefully
 * falls back to the defined placeholder primitive geometry and material.
 * Loaded assets are cached module-level so multiple consumers share one geometry.
 */
export function useGameAsset(type: AssetType): {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
} {
  const cached = assetCache.get(type);
  const [asset, setAsset] = useState(cached ?? FALLBACKS[type]);

  useEffect(() => {
    if (cached) return;
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

          const result = { geometry: g, material: mat };
          assetCache.set(type, result);
          setAsset(result);
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
  }, [type, cached]);

  return asset;
}

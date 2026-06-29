import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";

interface BotLike {
  alive: boolean;
  pos: THREE.Vector3;
}

interface Props {
  botsRef: MutableRefObject<BotLike[]>;
  playerPosRef: MutableRefObject<{ position: THREE.Vector3 }>;
}

const SCALE = 2.5;
const MAX_INSTANCES = 64;

// Build a single merged geometry for the entire drone with vertex colors
function buildDroneGeometry(): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];

  const addPart = (
    geo: THREE.BufferGeometry,
    position: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
    color: [number, number, number],
  ) => {
    geo = geo.clone();
    geo.translate(position[0], position[1], position[2]);
    geo.rotateX(rotation[0]);
    geo.rotateY(rotation[1]);
    geo.rotateZ(rotation[2]);
    geo.scale(scale[0], scale[1], scale[2]);

    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometries.push(geo);
  };

  const bodyColor: [number, number, number] = [0.1, 0.1, 0.18];
  const panelColor: [number, number, number] = [0.18, 0.11, 0.31];
  const glowColor: [number, number, number] = [1.0, 0.2, 0.4];
  const darkMetal: [number, number, number] = [0.1, 0.1, 0.18];
  const engineGlow: [number, number, number] = [1.0, 0.33, 0.0];

  // Core body
  addPart(new THREE.DodecahedronGeometry(0.55, 1), [0, 0, 0], [0, 0, 0], [1, 1, 1], bodyColor);

  // Forward sensor eye
  addPart(new THREE.SphereGeometry(0.18, 8, 8), [0, 0, -0.52], [0, 0, 0], [1, 1, 1], glowColor);
  addPart(new THREE.SphereGeometry(0.08, 6, 6), [0, 0, -0.66], [0, 0, 0], [1, 1, 1], [1, 1, 1]);

  // Top sensor dome
  addPart(new THREE.SphereGeometry(0.22, 8, 8), [0, 0.35, 0], [0, 0, 0], [1, 1, 1], darkMetal);
  addPart(new THREE.SphereGeometry(0.06, 6, 6), [0, 0.42, 0], [0, 0, 0], [1, 1, 1], glowColor);

  // Wing panels (4x)
  addPart(new THREE.BoxGeometry(0.65, 0.06, 0.35), [-0.55, 0.25, 0.15], [0.15, 0.25, 0.35], [1, 1, 1], panelColor);
  addPart(new THREE.BoxGeometry(0.65, 0.06, 0.35), [0.55, 0.25, 0.15], [0.15, -0.25, -0.35], [1, 1, 1], panelColor);
  addPart(new THREE.BoxGeometry(0.55, 0.06, 0.3), [-0.5, -0.3, 0.1], [-0.2, 0.2, 0.4], [1, 1, 1], panelColor);
  addPart(new THREE.BoxGeometry(0.55, 0.06, 0.3), [0.5, -0.3, 0.1], [-0.2, -0.2, -0.4], [1, 1, 1], panelColor);

  // Wing edge glow strips
  addPart(new THREE.BoxGeometry(0.04, 0.008, 0.35), [-0.85, 0.25, 0.15], [0.15, 0.25, 0.35], [1, 1, 1], glowColor);
  addPart(new THREE.BoxGeometry(0.04, 0.008, 0.35), [0.85, 0.25, 0.15], [0.15, -0.25, -0.35], [1, 1, 1], glowColor);

  // Engine nacelles
  addPart(new THREE.CylinderGeometry(0.1, 0.14, 0.35, 6), [-0.25, 0, 0.5], [0, 0, Math.PI / 2], [1, 1, 1], darkMetal);
  addPart(new THREE.CylinderGeometry(0.1, 0.14, 0.35, 6), [0.25, 0, 0.5], [0, 0, Math.PI / 2], [1, 1, 1], darkMetal);

  // Engine exhaust glow
  addPart(new THREE.ConeGeometry(0.1, 0.5, 6), [-0.25, 0, 0.72], [Math.PI / 2, 0, 0], [1, 1, 1], engineGlow);
  addPart(new THREE.ConeGeometry(0.1, 0.5, 6), [0.25, 0, 0.72], [Math.PI / 2, 0, 0], [1, 1, 1], engineGlow);

  // Detail greebles
  addPart(new THREE.BoxGeometry(0.35, 0.008, 0.008), [0, 0.56, 0], [0, 0, 0], [1, 1, 1], [0.24, 0.17, 0.37]);
  addPart(new THREE.BoxGeometry(0.008, 0.15, 0.25), [-0.3, -0.05, 0], [0, 0, 0], [1, 1, 1], panelColor);
  addPart(new THREE.BoxGeometry(0.008, 0.15, 0.25), [0.3, -0.05, 0], [0, 0, 0], [1, 1, 1], panelColor);

  const merged = mergeGeometriesManual(geometries);
  geometries.forEach((g) => g.dispose());
  return merged;
}

function mergeGeometriesManual(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  let totalVerts = 0;
  for (const g of geometries) {
    totalVerts += g.attributes.position.count;
  }

  const positions = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  let offset = 0;

  for (const g of geometries) {
    const pos = g.attributes.position.array as Float32Array;
    const col = g.attributes.color?.array as Float32Array;
    const norm = g.attributes.normal?.array as Float32Array;
    const count = g.attributes.position.count;

    for (let i = 0; i < count; i++) {
      positions[(offset + i) * 3] = pos[i * 3];
      positions[(offset + i) * 3 + 1] = pos[i * 3 + 1];
      positions[(offset + i) * 3 + 2] = pos[i * 3 + 2];

      if (col) {
        colors[(offset + i) * 3] = col[i * 3];
        colors[(offset + i) * 3 + 1] = col[i * 3 + 1];
        colors[(offset + i) * 3 + 2] = col[i * 3 + 2];
      }

      if (norm) {
        normals[(offset + i) * 3] = norm[i * 3];
        normals[(offset + i) * 3 + 1] = norm[i * 3 + 1];
        normals[(offset + i) * 3 + 2] = norm[i * 3 + 2];
      }
    }
    offset += count;
  }

  merged.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  merged.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  merged.computeBoundingSphere();
  return merged;
}

export default function EnemyDrone({ botsRef, playerPosRef }: Props) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const bobOffsets = useRef<number[]>([]);
  
  const geometry = useMemo(() => buildDroneGeometry(), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.85,
    roughness: 0.2,
    flatShading: true,
  }), []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = clock.elapsedTime;
    const bots = botsRef.current;
    let idx = 0;

    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      if (!bot || !bot.alive) continue;

      // Lazily init bob offset so we never get NaN
      if (bobOffsets.current[i] === undefined) {
        bobOffsets.current[i] = Math.random() * Math.PI * 2;
      }

      dummy.position.copy(bot.pos);
      dummy.position.y += Math.sin(t * 3 + bobOffsets.current[i]) * 0.03;
      dummy.lookAt(playerPosRef.current.position);
      dummy.scale.setScalar(SCALE);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      idx++;
    }

    mesh.count = idx;
    if (idx > 0) {
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_INSTANCES]}
      count={0}
      frustumCulled={true}
      castShadow={false}
      receiveShadow={false}
    />
  );
}

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { interactStore, type InteractTarget } from "./interactStore";
import type { MissionId } from "../cockpit/missions";

const MAX_DIST = 3.8;
const INTERACT_LAYER = 5;

interface Props {
  onLaunchMission: (id: MissionId) => void;
  onEnterVault?: () => void;
  vaultUnlocked?: boolean;
  nextMissionId: MissionId | null;
}

export default function InteractSystem({ onLaunchMission, onEnterVault, vaultUnlocked, nextMissionId }: Props) {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const dir = useRef(new THREE.Vector3());
  const frameCount = useRef(0);
  const last = useRef<InteractTarget>(interactStore.get());

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 4 !== 0) return;

    camera.getWorldDirection(dir.current);
    raycaster.current.set(camera.position, dir.current);
    raycaster.current.far = MAX_DIST;
    raycaster.current.near = 0.1;
    raycaster.current.layers.set(INTERACT_LAYER);

    const hits = raycaster.current.intersectObjects(scene.children, true);
    let found: InteractTarget | null = null;

    for (const hit of hits) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj) {
        const ud = obj.userData as
          | { kind?: string; missionId?: MissionId; unlocked?: boolean }
          | undefined;
        if (ud?.kind === "resume-screen") {
          found = {
            kind: "resume-screen",
            missionId: ud.missionId ?? null,
            unlocked: !!ud.unlocked,
            distance: hit.distance,
          };
          break;
        }
        if (ud?.kind === "launch-console") {
          found = {
            kind: "launch-console",
            missionId: "launch",
            unlocked: false,
            distance: hit.distance,
          };
          break;
        }
        if (ud?.kind === "vault-door") {
          found = {
            kind: "vault-door",
            missionId: null,
            unlocked: !!ud.unlocked,
            distance: hit.distance,
          };
          break;
        }
        obj = obj.parent;
      }
      if (found) break;
    }

    if (found) {
      interactStore.set(found);
      last.current = found;
    } else if (last.current.kind !== null) {
      interactStore.clear();
      last.current = interactStore.get();
    }
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "e") return;
      const t = interactStore.get();
      if (t.kind === "resume-screen" && t.missionId && !t.unlocked && t.missionId === nextMissionId) {
        onLaunchMission(t.missionId);
      } else if (t.kind === "launch-console" && nextMissionId === "launch") {
        onLaunchMission("launch");
      } else if (t.kind === "vault-door" && vaultUnlocked) {
        onEnterVault?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLaunchMission, onEnterVault, vaultUnlocked, nextMissionId]);

  return null;
}
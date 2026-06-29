import { useCallback, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import StarField from "./StarField";
import WalkerController from "./WalkerController";
import LandingPad from "./LandingPad";
import Bridge from "./Bridge";
import CommandCenter from "./CommandCenter";
import VaultDoor from "./VaultDoor";
import VaultRoom from "./VaultRoom";
import InteractSystem from "./InteractSystem";
import HomeBasePost from "./HomeBasePost";
import NavWaypoint from "./NavWaypoint";
import DepartureConsole from "./DepartureConsole";
import { HB } from "./hbTheme";
import { useCockpit } from "../cockpit/CockpitModeProvider";
import { MISSIONS, type MissionId } from "../cockpit/missions";

/**
 * CommandShipExterior — a saucer-with-dome floating command ship that
 * surrounds the interior room without ever clipping through it.
 *
 * Strategy:
 *   • A single LatheGeometry profile is revolved around the Y axis to form
 *     the smooth saucer hull (no seams, no boxy primitives).
 *   • A scaled hemisphere on top forms the command dome.
 *   • A torus collar marks the bridge dock at the front nose.
 *   • Running lights (instanced) trim the hull rim.
 *   • The whole group bobs and slowly rotates.
 *   • When the player camera is inside the interior room volume the entire
 *     exterior is hidden so the room renders cleanly from inside.
 *
 * Sizing:
 *   Interior room: x∈[-8,8], y∈[0,5.5], z∈[-26,6].
 *   Saucer is centered at z=-10 with radius 22, so the room sits well inside it.
 *   Saucer top y ≈ 9, bottom y ≈ -3 — clears the floor (y=0) and ceiling (y=5.5).
 */
function CommandShipExterior() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Lathe profile — defines half-cross-section of the saucer (revolved around Y).
  // Points go from top centerline down to bottom centerline.
  const saucerGeom = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    // Top center → outer rim (upper half curves outward)
    pts.push(new THREE.Vector2(0.001, 2.0));
    pts.push(new THREE.Vector2(4.0, 1.9));
    pts.push(new THREE.Vector2(9.0, 1.6));
    pts.push(new THREE.Vector2(14.0, 1.1));
    pts.push(new THREE.Vector2(18.0, 0.55));
    pts.push(new THREE.Vector2(21.0, 0.15));
    pts.push(new THREE.Vector2(22.0, 0.0));
    // Outer rim → underside (lower half curves inward)
    pts.push(new THREE.Vector2(21.0, -0.4));
    pts.push(new THREE.Vector2(18.0, -1.1));
    pts.push(new THREE.Vector2(14.0, -1.9));
    pts.push(new THREE.Vector2(9.0, -2.6));
    pts.push(new THREE.Vector2(4.0, -3.0));
    pts.push(new THREE.Vector2(0.001, -3.1));
    const geo = new THREE.LatheGeometry(pts, 64);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Running-lights instanced mesh around the rim.
  const rimLightsRef = useRef<THREE.InstancedMesh>(null);
  const rimLightCount = 24;
  useMemo(() => {
    if (!rimLightsRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < rimLightCount; i++) {
      const a = (i / rimLightCount) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 22, 0, Math.sin(a) * 22);
      dummy.updateMatrix();
      rimLightsRef.current.setMatrixAt(i, dummy.matrix);
    }
    rimLightsRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  // Bob animation + hide-when-inside-room.
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.25;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.04;

    // Camera world position — hide exterior when inside the room volume
    // (room is centered at z=-10 so we offset back to local saucer space).
    const cx = camera.position.x;
    const cy = camera.position.y;
    const cz = camera.position.z;
    const insideRoom =
      cx > -8 && cx < 8 && cy > 0 && cy < 6 && cz > -26 && cz < 6;
    groupRef.current.visible = !insideRoom;
  });

  return (
    <group ref={groupRef} position={[0, 2.5, -10]}>
      {/* Main saucer hull */}
      <mesh geometry={saucerGeom} castShadow={false} receiveShadow={false}>
        <meshStandardMaterial
          color={HB.hull}
          metalness={0.85}
          roughness={0.32}
          flatShading={false}
        />
      </mesh>

      {/* Hull plating ring — slight darker band around the equator */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[22.05, 0.35, 12, 96]} />
        <meshStandardMaterial
          color={HB.hullDeep}
          metalness={0.95}
          roughness={0.25}
          emissive={HB.cyanDeep}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Command dome on top */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[6.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#0e1a2c"
          metalness={0.6}
          roughness={0.15}
          emissive={HB.cyanDeep}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Dome window-band — bright ring suggesting bridge windows */}
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[6.2, 0.18, 8, 64]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>

      {/* Antenna spire */}
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.18, 3.5, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.4} />
      </mesh>
      <mesh position={[0, 7.4, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Underside thruster glow — single emissive disc, no point light */}
      <mesh position={[0, -3.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 6.0, 48]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Docking collar at the front nose where the bridge meets the ship.
          Bridge runs from z=8 (room edge) to z=20; in saucer-local space that's
          z=18..30. Collar sits at the saucer rim (z≈16 local = z≈6 world). */}
      <mesh position={[0, -0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.4, 0.25, 12, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.95}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Rim running lights */}
      <instancedMesh ref={rimLightsRef} args={[undefined, undefined, rimLightCount]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#f59e0b" />
      </instancedMesh>
    </group>
  );
}

export default function HomeBaseWorld() {
  const {
    collected,
    audio,
    stats,
    setActiveMissionId,
    setActiveStage,
    setCurrentDialogue,
    setGamePhase,
    clearMissionProgress,
  } = useCockpit();

  const total = MISSIONS.length;
  const vaultUnlocked = useMemo(() => collected.size >= total, [collected, total]);

  // Next mission whose predecessor is collected (sequential gating)
  const nextMissionId = useMemo(() => {
    for (let i = 0; i < MISSIONS.length; i++) {
      if (collected.has(MISSIONS[i].id)) continue;
      if (i === 0 || collected.has(MISSIONS[i - 1].id)) return MISSIONS[i].id;
      break;
    }
    return null;
  }, [collected]);

  const handleLaunchMission = useCallback(
    (id: MissionId) => {
      audio.initContext();
      audio.startEngine();
      clearMissionProgress(id);
      setActiveMissionId(id);
      setActiveStage(1);
      setCurrentDialogue(id);
      setGamePhase("dialogue");
    },
    [
      audio,
      clearMissionProgress,
      setActiveMissionId,
      setActiveStage,
      setCurrentDialogue,
      setGamePhase,
    ],
  );

  const handleEnterVault = useCallback(() => {
    audio.initContext();
    audio.playImpact();
  }, [audio]);

  useEffect(() => {
    audio.startAmbient();
    return () => {
      audio.stopAmbient();
    };
  }, [audio]);

  return (
    <>
      <color attach="background" args={[HB.ink]} />
      <fog attach="fog" args={[HB.ink, 16, 95]} />

      {/* Distant starfield (open space backdrop) */}
      <StarField />

      {/* Balanced key/fill: cool key from above-front, warm bounce, soft fill */}
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#3b4d6b", "#020610", 0.4]} />
      <directionalLight position={[8, 18, 22]} intensity={0.55} color="#dbe7f5" />
      <directionalLight position={[-14, 8, -18]} intensity={0.25} color={HB.amber} />

      <CommandShipExterior />
      <LandingPad />
      <Bridge />
      <DepartureConsole active={nextMissionId === "launch"} />
      <CommandCenter collected={collected} />
      <VaultDoor unlocked={vaultUnlocked} total={total} collected={collected.size} />
      {vaultUnlocked && <VaultRoom collected={collected} stats={stats} />}

      <NavWaypoint nextMissionId={nextMissionId} vaultUnlocked={vaultUnlocked} />
      <WalkerController vaultOpen={vaultUnlocked} />
      <InteractSystem onLaunchMission={handleLaunchMission} onEnterVault={handleEnterVault} vaultUnlocked={vaultUnlocked} nextMissionId={nextMissionId} />
      <HomeBasePost />
    </>
  );
}

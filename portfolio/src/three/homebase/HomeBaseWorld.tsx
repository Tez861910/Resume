import { useCallback, useMemo } from "react";
import StarField from "./StarField";
import WalkerController from "./WalkerController";
import LandingPad from "./LandingPad";
import Bridge from "./Bridge";
import CommandCenter from "./CommandCenter";
import VaultDoor from "./VaultDoor";
import VaultRoom from "./VaultRoom";
import InteractSystem from "./InteractSystem";
import { useCockpit } from "../cockpit/CockpitModeProvider";
import { MISSIONS, type MissionId } from "../cockpit/missions";

export default function HomeBaseWorld() {
  const {
    collected,
    audio,
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

  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 12, 90]} />

      {/* Distant starfield (open space backdrop) */}
      <StarField />

      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#334155", "#020610", 0.3]} />
      <directionalLight position={[8, 18, 22]} intensity={0.45} color="#cbd5e1" />

      <LandingPad />
      <Bridge />
      <CommandCenter collected={collected} />
      <VaultDoor unlocked={vaultUnlocked} total={total} collected={collected.size} />
      {vaultUnlocked && <VaultRoom collected={collected} />}

      <WalkerController vaultOpen={vaultUnlocked} />
      <InteractSystem onLaunchMission={handleLaunchMission} onEnterVault={handleEnterVault} vaultUnlocked={vaultUnlocked} nextMissionId={nextMissionId} />
    </>
  );
}
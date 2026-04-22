import { useMemo } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import type { PlayerState } from "../../three/cockpit/usePlayerState";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";

interface Props {
  player: MutableRefObject<PlayerState>;
}

const FORWARD = new THREE.Vector3(0, 0, -1);
const UP = new THREE.Vector3(0, 1, 0);

/**
 * 2D compass in the top canopy. Shows direction of current-mission waypoint
 * relative to ship's forward vector, plus distance.
 */
export default function RadarCompass({ player }: Props) {
  const { currentMission } = useCockpit();
  const target = useMemo(
    () => new THREE.Vector3(...currentMission.position),
    [currentMission.position],
  );

  const p = player.current;
  const forward = FORWARD.clone().applyQuaternion(p.quaternion);
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(p.quaternion);
  const up = UP.clone().applyQuaternion(p.quaternion);

  const toTarget = target.clone().sub(p.position);
  const distance = toTarget.length();

  const nx = toTarget.dot(right);
  const ny = toTarget.dot(up);
  const nz = toTarget.dot(forward); // positive = in front

  // yaw angle (left/right)
  const yaw = Math.atan2(nx, nz);
  // pitch angle (up/down)
  const pitch = Math.atan2(ny, Math.sqrt(nx * nx + nz * nz));

  const behind = nz < 0;

  return (
    <div className="flex flex-col items-center gap-1 pointer-events-none">
      <div
        className="relative rounded-full border border-cyan-400/40 bg-slate-950/70 backdrop-blur-md"
        style={{ width: 110, height: 110 }}
      >
        {/* ticks */}
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400/25" />
        <div className="absolute inset-2 rounded-full border border-cyan-400/15" />
        {/* N marker = ship forward */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-300/80">
          FWD
        </div>
        {/* Waypoint pip */}
        <WaypointPip
          yaw={yaw}
          pitch={pitch}
          behind={behind}
          color={currentMission.accent}
        />
        {/* Center dot = player */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
      </div>
      <div className="rounded-md border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[10px] font-mono text-cyan-200 backdrop-blur-md">
        {currentMission.title} · {Math.round(distance)}u {behind ? "◀ behind" : "▲ ahead"}
      </div>
    </div>
  );
}

function WaypointPip({
  yaw,
  pitch,
  behind,
  color,
}: {
  yaw: number;
  pitch: number;
  behind: boolean;
  color: string;
}) {
  const r = 42;
  // If behind, clamp pip to ring (indicator mode)
  const effectiveYaw = behind ? (yaw > 0 ? Math.PI / 2 : -Math.PI / 2) : yaw;
  const x = Math.sin(effectiveYaw) * r;
  const y = -Math.sin(pitch) * r;
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: behind ? 0.55 : 1,
        }}
      />
    </div>
  );
}

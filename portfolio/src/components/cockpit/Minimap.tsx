import { useEffect, useState } from "react";
import * as THREE from "three";
import { useCockpitRuntime } from "../../three/cockpit/CockpitRuntime";

const RADAR_RADIUS = 70; // px
const SCAN_RANGE = 250;  // units

export default function Minimap() {
  const { player, enemies } = useCockpitRuntime();
  const [, tick] = useState(0);

  // High-frequency poll for UI update
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      tick((v) => (v + 1) % 1_000_000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = player.current;
  const activeEnemies = enemies.current;

  // Compute pips
  const pips = activeEnemies.map((enemyPos, i) => {
    // Relative vector in world space
    const rel = enemyPos.clone().sub(p.position);
    const dist = rel.length();

    // Normalize to range
    const normalizedDist = Math.min(dist / SCAN_RANGE, 1.0);

    // Project onto player's local horizontal plane (XZ)
    // For a simple radar, we'll project the relative vector onto the player's local axes.
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(p.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(p.quaternion);

    // We want a top-down view relative to the ship's orientation
    const x = rel.dot(right);
    const z = rel.dot(forward);

    // Convert to radar space (circular)
    const angle = Math.atan2(x, z);
    const radarX = Math.sin(angle) * normalizedDist * RADAR_RADIUS;
    const radarY = -Math.cos(angle) * normalizedDist * RADAR_RADIUS;

    return {
      id: i,
      x: radarX,
      y: radarY,
      dist,
      outOfRange: dist > SCAN_RANGE
    };
  });

  return (
    <div className="relative group">
      {/* Radar Background */}
      <div
        className="relative rounded-full border-2 border-cyan-500/30 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        style={{ width: RADAR_RADIUS * 2, height: RADAR_RADIUS * 2 }}
      >
        {/* Decorative Grid / Rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/10 scale-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1px] h-full bg-cyan-500/10" />
          <div className="h-[1px] w-full bg-cyan-500/10" />
        </div>

        {/* Scanning Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }} />

        {/* Enemy Pips */}
        {pips.map((pip) => (
          <div
            key={pip.id}
            className={`absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${pip.outOfRange ? 'bg-rose-500/40' : 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]'}`}
            style={{
              transform: `translate(calc(-50% + ${pip.x}px), calc(-50% + ${pip.y}px))`,
            }}
          />
        ))}

        {/* Center Player Pip */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]" />
          {/* Direction triangle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-amber-400" />
        </div>
      </div>

      {/* Label */}
      <div className="mt-1 text-center">
        <span className="text-[8px] uppercase tracking-[0.3em] text-cyan-400/60 font-bold font-mono">Short-Range Radar</span>
      </div>
    </div>
  );
}

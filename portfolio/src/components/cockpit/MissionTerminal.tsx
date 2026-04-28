import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useCockpit } from "../../three/cockpit/CockpitModeProvider";
import { MISSIONS, type MissionId } from "../../three/cockpit/missions";

interface Props {
  enemyCounts: MutableRefObject<Record<MissionId, number>>;
}

interface Line {
  id: number;
  text: string;
  tone: "ctrl" | "sys";
}

let lineIdCounter = 1;

/**
 * Typewriter comms terminal. Advances briefing/debriefing lines based on
 * mission progression (collected drives). Also shows "clear hostiles" status.
 */
export default function MissionTerminal({ enemyCounts }: Props) {
  const { currentMission, collected, currentDialogue, defeatedCommanders, negotiated } =
    useCockpit();
  const [lines, setLines] = useState<Line[]>([]);
  const [activeTyping, setActiveTyping] = useState<string>("");
  const typeIdxRef = useRef(0);
  const queueRef = useRef<Line[]>([]);
  const lastKeyRef = useRef<string>("");
  const prevCollectedRef = useRef<Set<MissionId>>(new Set());

  // When mission changes or a new drive is collected, enqueue appropriate lines
  useEffect(() => {
    const key = `mission:${currentMission.id}:${collected.size}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;

    // Any newly collected drive — debrief its mission first
    const newlyCollected: MissionId[] = [];
    for (const id of collected) {
      if (!prevCollectedRef.current.has(id)) newlyCollected.push(id);
    }
    prevCollectedRef.current = new Set(collected);

    const toEnqueue: Line[] = [];
    for (const id of newlyCollected) {
      const m = MISSIONS.find((x) => x.id === id);
      if (!m) continue;
      for (const t of m.debriefing) {
        toEnqueue.push({ id: lineIdCounter++, text: t, tone: "ctrl" });
      }
    }
    // Then briefing of current mission (if not already all collected)
    if (collected.size < MISSIONS.length) {
      for (const t of currentMission.briefing) {
        toEnqueue.push({ id: lineIdCounter++, text: t, tone: "ctrl" });
      }
    }

    queueRef.current.push(...toEnqueue);
  }, [currentMission, collected]);

  // Pop queue and type out character-by-character
  useEffect(() => {
    if (activeTyping.length > 0) return;
    if (queueRef.current.length === 0) return;
    const next = queueRef.current.shift()!;
    setLines((prev) => [...prev.slice(-5), next]);
    setActiveTyping(next.text);
    typeIdxRef.current = 0;
  }, [activeTyping, lines]);

  // Typewriter
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!activeTyping) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(activeTyping.slice(0, idx));
      if (idx >= activeTyping.length) {
        clearInterval(interval);
        setTimeout(() => setActiveTyping(""), 350);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [activeTyping]);

  const enemiesRemaining = enemyCounts.current[currentMission.id] ?? 0;
  const missionStatus = useMemo(() => {
    if (collected.has(currentMission.id)) return "COMPLETE";
    if (currentDialogue === currentMission.id) return "INCOMING COMMS";
    if (!negotiated.has(currentMission.id)) return "AWAITING NEGOTIATION";
    if (enemiesRemaining > 0) return `CLEAR ESCORTS: ${enemiesRemaining}`;
    if (!defeatedCommanders.has(currentMission.id)) return "DESTROY CRUISER";
    return "DRIVE READY — RETRIEVE";
  }, [
    collected,
    currentDialogue,
    currentMission.id,
    defeatedCommanders,
    enemiesRemaining,
    negotiated,
  ]);

  return (
    <div className="rounded-xl border border-cyan-400/25 bg-slate-950/80 backdrop-blur-md p-3 font-mono shadow-xl shadow-cyan-900/30">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-cyan-300/70 mb-2">
        <span>Comms · {currentMission.codename}</span>
        <span
          className="rounded px-1.5 py-0.5 text-[9px]"
          style={{
            background:
              missionStatus === "COMPLETE"
                ? "rgba(52,211,153,0.18)"
                : missionStatus === "INCOMING COMMS" ||
                    missionStatus === "AWAITING NEGOTIATION"
                  ? "rgba(34,211,238,0.18)"
                  : enemiesRemaining > 0 || missionStatus === "DESTROY CRUISER"
                  ? "rgba(239,68,68,0.18)"
                  : "rgba(251,191,36,0.18)",
              color:
                missionStatus === "COMPLETE"
                  ? "#6ee7b7"
                  : missionStatus === "INCOMING COMMS" ||
                      missionStatus === "AWAITING NEGOTIATION"
                    ? "#67e8f9"
                    : enemiesRemaining > 0 || missionStatus === "DESTROY CRUISER"
                    ? "#fca5a5"
                    : "#fde68a",
          }}
        >
          {missionStatus}
        </span>
      </div>
      <div className="space-y-1 text-[11px] leading-relaxed text-slate-300 max-h-[160px] overflow-hidden">
        {lines.map((l) => (
          <div key={l.id}>
            <span className="text-cyan-300/70">▸ </span>
            <span>{l.text}</span>
          </div>
        ))}
        {displayed && (
          <div>
            <span className="text-cyan-300/70">▸ </span>
            <span>{displayed}</span>
            <span className="animate-pulse text-cyan-300">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}

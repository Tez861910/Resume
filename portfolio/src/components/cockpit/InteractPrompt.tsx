import { useInteractTarget } from "../../three/homebase/interactStore";

export default function InteractPrompt() {
  const t = useInteractTarget();
  if (!t.kind) return null;

  let label = "";
  let action = "INTERACT";
  if (t.kind === "resume-screen") {
    if (t.unlocked) return null; // unlocked screens are passive
    label = `${t.missionId?.toUpperCase() ?? ""} // SEALED`;
    action = "LAUNCH MISSION";
  } else if (t.kind === "vault-door") {
    if (!t.unlocked) {
      label = "VAULT // LOCKED";
      action = "ALL DRIVES REQUIRED";
      return (
        <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 text-center select-none">
          <div className="text-[9px] uppercase tracking-[0.4em] text-rose-400/80 mb-1">
            {label}
          </div>
          <div className="rounded border border-rose-500/40 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-rose-200">
            {action}
          </div>
        </div>
      );
    }
    label = "VAULT // UNLOCKED";
    action = "ENTER";
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 text-center select-none">
      <div className="text-[9px] uppercase tracking-[0.4em] text-cyan-400/80 mb-1">
        {label}
      </div>
      <div className="rounded border border-amber-500/60 bg-slate-950/85 backdrop-blur-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
        <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-sm border border-amber-400/70 bg-amber-500/20 text-amber-100">
          E
        </span>
        {action}
      </div>
    </div>
  );
}
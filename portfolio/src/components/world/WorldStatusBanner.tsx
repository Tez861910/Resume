import { motion } from "framer-motion";

export default function WorldStatusBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none relative z-20 mx-auto mt-8 max-w-xl"
      aria-hidden="true"
    >
      <div className="rounded-full border border-white/10 bg-slate-950/55 px-4 py-2.5 shadow-xl shadow-black/20 backdrop-blur-md sm:px-5">
        <div className="flex items-center justify-center gap-3 text-center">
          <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-slate-300/80">
            Mission Control • Launch Sequence • Challenge Standby
          </p>
        </div>
      </div>
    </motion.div>
  );
}

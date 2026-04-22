import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projects from "../data/projects";
import ProjectCard from "./ProjectCard";
import { useGame } from "../three/game/GameContext";

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
    rootMargin: "0px 0px -8% 0px",
  });
  const { launch, session } = useGame();

  const missionStats = [
    {
      label: "Mission Count",
      value: `${projects.length}`,
      detail: "Shipped systems, platforms, and product experiments",
    },
    {
      label: "Primary Modes",
      value: "Web + Desktop",
      detail: "Full-stack delivery across browser and native workflows",
    },
    {
      label: "Focus",
      value: "Impact + UX",
      detail: "Performance, architecture, and production-ready execution",
    },
  ];

  const missionRoute = [
    "Launch",
    "Profile",
    "Skills",
    "Route",
    "Missions",
    "Transmit",
  ];

  const challengeSummary =
    session.lastScore !== null
      ? `Last run: ${session.lastScore} pts`
      : "No challenge run logged yet";

  return (
    <section id="projects" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-cyan-300/70">
            Mission Select
          </p>
          <h2 className="section-title mb-4">Featured Projects</h2>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300/80 sm:text-base">
            A mission-control view of the products, platforms, and systems I’ve
            designed, optimized, and shipped across web and desktop.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_34%,rgba(255,255,255,0)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300 via-amber-300 to-emerald-300" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    Terminal Online
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Inspect Missions
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-300/80 sm:text-base">
                  Each card below acts like a mission terminal: inspect the
                  stack, understand the problem, and drill into the technical
                  decisions, constraints, and outcomes behind the build.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                {missionStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.28, delay: 0.08 + index * 0.05 }}
                  >
                    <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      {stat.label}
                    </div>
                    <div className="mb-1 text-lg font-bold text-slate-50">
                      {stat.value}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300/75">
                      {stat.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
              <div className="mb-3 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Mission Route
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400/70">
                  Current Sector: Projects
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {missionRoute.map((step) => {
                  const isCurrent = step === "Missions";
                  return (
                    <div
                      key={step}
                      className={`rounded-xl border px-3 py-2 text-center ${
                        isCurrent
                          ? "border-cyan-300/30 bg-cyan-300/10"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                          isCurrent ? "text-cyan-100" : "text-slate-300/75"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {[
                "01 Scan active missions",
                "02 Inspect stack and impact",
                "03 Open full project dossier",
              ].map((step, index) => (
                <motion.div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.28, delay: 0.12 + index * 0.05 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/85">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-300/20 bg-amber-300/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.24 }}
            >
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-amber-200/70">
                  Challenge Mode Integration
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  Run the challenge before or after inspecting missions to
                  collect your stack and carry momentum through the portfolio
                  flow.
                </p>
                <p className="mt-1 text-xs text-slate-300/75">
                  {challengeSummary}
                </p>
              </div>

              <button
                onClick={() => {
                  launch("projects");
                  setTimeout(
                    () =>
                      document
                        .getElementById("challenge")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    50,
                  );
                }}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/12 px-4 py-2 text-sm font-semibold text-amber-100 transition-all duration-150 hover:bg-amber-300/20 hover:border-amber-300/45"
              >
                🚀 Enter Challenge Mode
              </button>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  inView={inView}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import projects from "../data/projects";
import { siteConfig } from "../config/site";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.08,
    rootMargin: "0px 0px -8% 0px",
  });

  const projectStats = [
    {
      label: "Projects",
      value: `${projects.length}`,
      detail: "Private products, live sites, and selected shipped work",
    },
    {
      label: "Platforms",
      value: "Web + Desktop + Mobile",
      detail: "React/Next sites, Windows tooling, and Flutter apps",
    },
    {
      label: "Focus",
      value: "Clarity + Delivery",
      detail: "Useful workflows, readable UI, and maintainable implementation",
    },
  ];

  return (
    <section id="projects" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8 text-center">
          <p className="section-eyebrow">Selected work</p>
          <h2 className="section-title">Featured projects</h2>
          <p className="section-copy">
            A straightforward look at the private products, company platforms,
            and tools I have built or worked on across web, desktop, and
            mobile.
          </p>
        </div>

        <div className="app-panel relative">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_34%,rgba(255,255,255,0)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300 via-amber-300 to-emerald-300" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="app-chip-cyan">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    Selected projects
                  </span>
                  <span className="app-chip">Case-study view</span>
                </div>

                <p className="text-sm leading-relaxed text-slate-300/80 sm:text-base">
                  Each card is easy to scan quickly, with a deeper project page
                  for the fuller context, stack, and implementation decisions.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                {projectStats.map((stat, index) => (
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

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              {[
                "01 Scan the summary",
                "02 Open the case study",
                "03 Review stack and outcomes",
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
                  Quick scan
                </p>
                <p className="text-sm font-semibold text-slate-100">
                  The resume is the short version. These project pages are where
                  I keep the fuller story, scope, and implementation detail.
                </p>
                <p className="mt-1 text-xs text-slate-300/75">
                  Every card opens a deeper breakdown with context, role, stack,
                  responsibilities, and why the work matters.
                </p>
              </div>

              <Link
                to={siteConfig.resumePagePath}
                className="btn-secondary w-full sm:w-auto"
              >
                Download resume
              </Link>
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
}

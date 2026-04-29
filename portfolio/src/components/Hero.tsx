import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaDownload,
  FaGamepad,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "../config/site";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 sm:pt-32"
    >
      <div className="relative z-10 section-container py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10"
        >
          <div className="text-center lg:text-left">
            <span className="app-chip-accent mb-5">
              Open to full-stack and product engineering roles
            </span>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-app-primary sm:text-5xl lg:text-6xl xl:text-7xl">
              I build product software across web, desktop, and mobile that
              feels clear, fast, and ready for real workflows.
            </h1>

            <p className="mb-4 max-w-3xl text-base leading-relaxed text-app-secondary sm:text-lg">
              Recent work spans React and Next.js product platforms, a .NET
              Windows app for 3D manufacturing workflows, and a cross-platform Flutter + Rust
              utility suite. I care about practical UX, clear
              architecture, and software that holds up once people actually use
              it.
            </p>

            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
              <a href="#projects" className="btn-primary w-full sm:w-auto">
                <span>View projects</span>
                <FaArrowRight className="text-xs" />
              </a>
              <button
                type="button"
                onClick={() => navigate(siteConfig.resumePagePath)}
                className="btn-secondary w-full sm:w-auto"
              >
                <FaDownload className="text-xs" />
                <span>Download resume</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(siteConfig.cockpit.route)}
                className="btn-ghost w-full sm:w-auto"
              >
                <FaGamepad className="text-sm" />
                <span>Open cockpit</span>
              </button>
            </div>

            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Current work",
                  value: "Product platforms",
                  detail: "Operational tools, company platforms, and local-first apps",
                },
                {
                  label: "Platforms",
                  value: "Web + Desktop + Mobile",
                  detail: "React, Next.js, .NET, Flutter, Rust",
                },
                {
                  label: "Approach",
                  value: "Clarity first",
                  detail: "Useful flows, maintainable code, stronger handoff",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="app-card px-4 py-4 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 + index * 0.08 }}
                >
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-amber-200/80">
                    {stat.label}
                  </div>
                  <div className="mb-1 text-lg font-bold text-amber-100 sm:text-xl">
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-300/75">{stat.detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center gap-3 lg:justify-start">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="app-panel p-6 sm:p-7"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="app-chip-cyan">Product systems</span>
              <span className="app-chip">Web + desktop + mobile</span>
            </div>

            <div className="space-y-4">
              <div className="app-card-soft">
                <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  What I build
                </p>
                <p className="text-sm leading-relaxed text-slate-100">
                  Operational dashboards, company platforms, local-first
                  utilities, and desktop workflows where clarity matters.
                </p>
              </div>

              <div className="app-card-soft">
                <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Best fit
                </p>
                <p className="text-sm leading-relaxed text-slate-100">
                  Teams that need someone comfortable moving between product
                  narrative, UI decisions, and implementation details.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="app-card-soft">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Preferred work
                  </p>
                  <p className="text-sm font-semibold text-slate-100">
                    Product engineering
                  </p>
                </div>
                <div className="app-card-soft">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-slate-100">
                    {siteConfig.location}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/8 p-5">
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                  Cockpit mode
                </p>
                <p className="text-sm leading-relaxed text-slate-100">
                  An immersive route that turns the portfolio into mission
                  briefings and recovered drive dossiers.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-400/80">
                  Still evolving, especially as the touch layout and mission UI
                  keep getting refined.
                </p>
                <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-300/80">
                  {siteConfig.cockpit.requirements.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-cyan-200">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}

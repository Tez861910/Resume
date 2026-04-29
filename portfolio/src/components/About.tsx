import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const profilePanels = [
    {
      label: "Day-to-day",
      value: "Product systems",
      detail: "Dashboards, company platforms, APIs, and workflow-oriented UI",
    },
    {
      label: "Desktop work",
      value: "Windows 3D tooling",
      detail: "Rendering, model analysis, reporting, and manufacturing workflows",
    },
    {
      label: "How I work",
      value: "Practical and thorough",
      detail:
        "Understand the domain, keep the UX readable, and ship maintainable code",
    },
    {
      label: "Right now",
      value: "Private builds in motion",
      detail:
        "Solar ops, biotech platforms, local-first tools, and manufacturing apps",
    },
  ];

  const currentFocus = [
    "Private products with enough scope to show architecture, workflow, and delivery decisions",
    "Interfaces that make dense information easier to use instead of simply prettier to look at",
    "Systems where frontend, backend, and content structure need to reinforce one another",
    "Projects that benefit from a practical handoff between product thinking and implementation",
  ];

  const profileMetrics = [
    { number: "30+", label: "Pettige Tools" },
    { number: "4", label: "Resolute Verticals" },
    { number: "7", label: "Solar Workstreams" },
    { number: "3", label: "Web/Desktop/Mobile" },
  ];

  return (
    <section id="about" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 text-center">
          <p className="section-eyebrow">Profile</p>
          <h2 className="section-title">About me</h2>
          <p className="section-copy">
            A quick overview of how I work, what I focus on, and the kind of
            software I like building.
          </p>
        </div>

        <div className="app-panel relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.015)_38%,rgba(255,255,255,0)_100%)]" />
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300 via-amber-300 to-emerald-300" />

          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-start lg:gap-6 lg:p-10">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    What I do
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Web + desktop + mobile
                  </span>
                </div>

                <div className="space-y-4 text-base leading-relaxed text-slate-200/90 sm:text-lg">
                  <p>
                    I&apos;m a full-stack developer focused on building software that
                    feels useful in real workflows, not just polished in a demo.
                  </p>
                  <p>
                    My recent work spans private product systems: operational web
                    platforms, multi-page company sites with real content depth, a
                    Windows manufacturing app, and a local-first Flutter + Rust
                    utility product.
                  </p>
                  <p>
                    That mix keeps me comfortable across React, Next.js, Node,
                    SQL-backed systems, .NET desktop work, and newer
                    cross-platform tooling when the product calls for it.
                  </p>
                  <p>
                    I&apos;m especially interested in product clarity, workflow
                    design, maintainable architecture, and the parts of
                    engineering that make software easier to live with over time.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4 sm:p-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                  What I am leaning into
                </p>
                <ul className="space-y-2">
                  {currentFocus.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-xs leading-relaxed text-slate-200/85 sm:text-sm"
                    >
                      <span className="mt-1 text-cyan-200">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  Profile Metrics
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {profileMetrics.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                    >
                      <div className="mb-1 text-3xl font-bold text-amber-200">
                        {stat.number}
                      </div>
                      <div className="text-xs text-slate-300/80 sm:text-sm">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {profilePanels.map((panel, index) => (
                  <motion.div
                    key={panel.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    initial={{ opacity: 0, x: 18 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                  >
                    <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      {panel.label}
                    </div>
                    <div className="mb-1 text-sm font-semibold text-slate-100 sm:text-base">
                      {panel.value}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300/75 sm:text-sm">
                      {panel.detail}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;

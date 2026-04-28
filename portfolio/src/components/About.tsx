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
      value: "Full-Stack Systems",
      detail: "React, Node.js, APIs, performance, and production UX",
    },
    {
      label: "Desktop work",
      value: "WPF / DirectX",
      detail: "3D tooling, MVVM architecture, and workflow automation",
    },
    {
      label: "How I work",
      value: "Practical and measured",
      detail: "Ship clearly, improve what matters, and keep the code maintainable",
    },
    {
      label: "Right now",
      value: "Better product quality",
      detail: "Faster, cleaner software across web and desktop",
    },
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

          <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 p-6 sm:p-8 lg:p-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  What I do
                </span>
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Web + Desktop
                </span>
              </div>

              <div className="space-y-4 text-base sm:text-lg text-slate-200/90 leading-relaxed">
                <p>
                  I’m a full-stack developer focused on building
                  high-performance web applications and desktop tools that feel
                  fast, clear, and useful in real production workflows.
                </p>
                <p>
                  At Printalytix, I delivered measurable impact by increasing
                  engagement by 35% and reducing page load times by 40% through
                  UI refinement, SEO improvements, and performance-focused
                  engineering decisions.
                </p>
                <p>
                  My work spans modern web systems with React, Node.js, and
                  MySQL, as well as desktop development with WPF/.NET 8 and
                  DirectX-based 3D tooling, which lets me design solutions
                  across multiple product surfaces.
                </p>
                <p>
                  I’m especially interested in performance optimization, API
                  design, developer-friendly architecture, and user experiences
                  that translate directly into business value.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-2">
                  Profile Metrics
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { number: "40%", label: "Faster Load Times" },
                    { number: "35%", label: "Higher Engagement" },
                    { number: "30%", label: "API Performance" },
                    { number: "500+", label: "Users Served" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                    >
                      <div className="text-3xl font-bold text-amber-200 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300/80">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {profilePanels.map((panel, index) => (
                  <motion.div
                    key={panel.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    initial={{ opacity: 0, x: 18 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
                      {panel.label}
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-slate-100 mb-1">
                      {panel.value}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300/75 leading-relaxed">
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

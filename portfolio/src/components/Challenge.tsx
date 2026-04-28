import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaArrowRight, FaGamepad, FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { siteConfig } from "../config/site";

export default function Challenge() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="challenge"
      ref={ref}
      className="relative py-16 sm:py-20"
      aria-label="Cockpit game"
    >
      <div className="section-container !py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-10 text-center">
            <p className="section-eyebrow">Optional Immersive Route</p>
            <h2 className="section-title">Cockpit experience</h2>
            <p className="section-copy">
              The main portfolio is the clean, fast version. The cockpit is a
              separate immersive mode for people who want a more experimental
              walkthrough.
            </p>
          </div>

          <div className="app-panel relative p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.14),transparent_24%)]" />
            <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="app-chip-cyan">
                    <FaRocket className="text-[10px]" />
                    {siteConfig.cockpit.badge}
                  </span>
                  <span className="app-chip">Desktop-first experience</span>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-slate-50 sm:text-3xl">
                  Launch the direct cockpit route when you want the 3D version.
                </h3>
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-slate-300/80 sm:text-base">
                  {siteConfig.cockpit.description} It is heavier, it can take a
                  bit to initialize, and it is not the best first stop if you
                  just want the recruiter-friendly overview.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    onClick={() => navigate(siteConfig.cockpit.route)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-ghost w-full sm:w-auto"
                  >
                    <FaGamepad className="text-lg" />
                    <span>Open cockpit</span>
                    <FaArrowRight className="text-sm" />
                  </motion.button>
                  <a href="#projects" className="btn-secondary w-full sm:w-auto">
                    Keep browsing portfolio
                  </a>
                </div>
              </div>

              <div className="grid gap-3">
                {siteConfig.cockpit.requirements.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.28, delay: 0.12 + index * 0.08 }}
                    className="app-card"
                  >
                    <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200/80">
                      Expectation {index + 1}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-100">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

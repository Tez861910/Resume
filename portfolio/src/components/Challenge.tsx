import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaGamepad, FaRocket, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Challenge - CTA to launch the immersive 3D cockpit game
 * Simplified to remove embedded game and keep main portfolio lightweight
 */
export default function Challenge() {
  const navigate = useNavigate();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="challenge"
      ref={ref}
      className="relative py-16 sm:py-20"
      aria-label="3D Challenge Experience"
    >
      <div className="section-container !py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <FaRocket className="text-[10px]" /> Immersive Experience
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
              3D Cockpit Mission · WebGL
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-cyan-100 mb-3">
            3D Mission Challenge
          </h2>
          <p className="text-sm text-slate-300/80 max-w-2xl mb-8">
            Launch into an immersive 3D cockpit experience. Navigate missions, dodge obstacles, and test your piloting skills in this WebGL-powered challenge.
          </p>

          <motion.button
            onClick={() => navigate("/cockpit")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-8 py-4 text-base font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/25 hover:border-cyan-300/60 active:bg-cyan-300/30"
          >
            <FaGamepad className="text-lg" />
            <span>Launch 3D Experience</span>
            <FaArrowRight className="text-sm" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

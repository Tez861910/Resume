import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaBriefcase,
  FaCalendar,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";

const experiences = [
  {
    title: "Software Engineer — Web & Desktop",
    company: "Printalytix",
    location: "Bengaluru, India",
    period: "Dec 2024 – Dec 2025",
    icon: <FaBriefcase />,
    color: "amber",
    achievements: [
      "Boosted engagement 35% and cut load times ~40% via UI/SEO improvements, bundling, and caching",
      "Architected MIND — WPF/.NET 8 desktop app with DirectX/HelixToolkit 3D visualisation, Entra ID auth, MVVM/DI, mesh checks, and GST-ready quotation via QuestPDF",
      "Shipped Printalytix site (React/MUI/Redux/PWA) with intake forms, drag-and-drop uploads, SEO routing; Node/Express + Sequelize/MySQL backend with file handling and structured logging",
      "Automated internal workflows with React/Node apps and RESTful APIs, improving API responsiveness ~30%",
    ],
  },
  {
    title: "Volunteer — Full-Stack Development",
    company: "Old Dominion University",
    location: "Norfolk, VA, USA",
    period: "Oct 2023 – Jan 2024",
    icon: <FaBriefcase />,
    color: "cyan",
    achievements: [
      "Built university threads application supporting 500+ concurrent users with role-based access and real-time messaging",
      "Delivered an examination management system that automated assessments and cut manual overhead ~50%",
      "Optimised backend via query refinement and caching, improving response times ~45%",
    ],
  },
  {
    title: "Bachelor of Computer Applications",
    company: "Bengaluru North University",
    location: "Bengaluru, India",
    period: "Aug 2018 – Aug 2024",
    icon: <FaGraduationCap />,
    color: "emerald",
    achievements: [
      "Relevant coursework: DBMS, Web Development, Data Structures, Algorithms",
      "Final year project covering full-stack web application development with MySQL",
    ],
  },
];

const colorMap: Record<
  string,
  { dot: string; ring: string; line: string; badge: string; label: string }
> = {
  amber: {
    dot: "bg-amber-400",
    ring: "border-amber-400/70",
    line: "text-amber-200",
    badge: "bg-amber-400/15 border-amber-400/30 text-amber-200",
    label: "text-amber-300",
  },
  cyan: {
    dot: "bg-cyan-400",
    ring: "border-cyan-400/70",
    line: "text-cyan-200",
    badge: "bg-cyan-400/15 border-cyan-400/30 text-cyan-200",
    label: "text-cyan-300",
  },
  emerald: {
    dot: "bg-emerald-400",
    ring: "border-emerald-400/70",
    line: "text-emerald-200",
    badge: "bg-emerald-400/15 border-emerald-400/30 text-emerald-200",
    label: "text-emerald-300",
  },
};

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section-container">
      <div ref={sectionRef}>
        {/* ── Heading ──────────────────────────────────────────────── */}
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          Experience
        </motion.h2>

        <motion.p
          className="text-center text-xs tracking-[0.18em] uppercase text-slate-400/45 -mt-6 mb-12 select-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ✦ a journey through code, collaboration &amp; craft
        </motion.p>

        {/* ── Timeline ─────────────────────────────────────────────── */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical spine line */}
          <motion.div
            className="absolute left-[19px] top-8 bottom-8 w-px"
            style={{
              originY: 0,
              background:
                "linear-gradient(to bottom, #fbbf24aa 0%, #22d3ee77 50%, #34d39966 80%, transparent 100%)",
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="space-y-10 pl-14">
            {experiences.map((exp, i) => {
              const c = colorMap[exp.color];

              return (
                <div key={i} className="relative">
                  {/* ── Dot ───────────────────────────────────────── */}
                  <motion.div
                    className={`absolute -left-14 top-3 w-9 h-9 rounded-full border-2 ${c.ring} bg-slate-950 flex items-center justify-center shadow-lg`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      delay: 0.45 + i * 0.22,
                      type: "spring",
                      stiffness: 220,
                      damping: 18,
                    }}
                  >
                    {/* Pulse ring */}
                    <motion.div
                      className={`absolute inset-0 rounded-full border ${c.ring}`}
                      animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{
                        duration: 2.6,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                    <span className={`text-xs ${c.label}`}>{exp.icon}</span>
                  </motion.div>

                  {/* ── Connector to card ─────────────────────────── */}
                  <motion.div
                    className="absolute -left-5 top-[22px] h-px w-5"
                    style={{
                      originX: 0,
                      background:
                        "linear-gradient(to right, transparent, #ffffff22)",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.55 + i * 0.22, duration: 0.3 }}
                  />

                  {/* ── Card ──────────────────────────────────────── */}
                  <motion.div
                    className="card border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors duration-300"
                    initial={{ opacity: 0, x: -18 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 + i * 0.2,
                      ease: "easeOut",
                    }}
                    whileHover={{ y: -2, transition: { duration: 0.18 } }}
                  >
                    {/* Header row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-50 mb-1 leading-snug">
                          {exp.title}
                        </h3>
                        <div
                          className={`flex items-center gap-2 font-semibold text-sm ${c.label}`}
                        >
                          <FaBriefcase className="shrink-0 opacity-70" />
                          <span>{exp.company}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 text-slate-300/75 text-sm shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${c.badge}`}
                        >
                          <FaCalendar className="opacity-70" />
                          {exp.period}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs">
                          <FaMapMarkerAlt className="opacity-60" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Achievements */}
                    <ul className="space-y-2.5">
                      {exp.achievements.map((ach, ai) => (
                        <motion.li
                          key={ai}
                          className="flex items-start gap-3 text-slate-200/85 text-sm leading-relaxed"
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{
                            delay: 0.65 + i * 0.2 + ai * 0.07,
                            duration: 0.35,
                          }}
                        >
                          <span
                            className={`mt-1.5 shrink-0 text-xs ${c.label}`}
                          >
                            ▸
                          </span>
                          <span>{ach}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* ── End-of-timeline flourish ─────────────────────────── */}
          <motion.div
            className="flex items-center gap-3 pl-14 mt-10"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
            <span className="text-xs tracking-widest text-slate-400/50 uppercase select-none">
              story so far
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-amber-400/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaBriefcase,
  FaCalendar,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";

type RouteColor = "amber" | "cyan" | "emerald";

interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  period: string;
  icon: React.ReactNode;
  color: RouteColor;
  routeLabel: string;
  systemLabel: string;
  achievements: string[];
}

const experiences: ExperienceEntry[] = [
  {
    title: "Software Engineer — Web & Desktop",
    company: "Printalytix",
    location: "Bengaluru, India",
    period: "Dec 2024 – Dec 2025",
    icon: <FaBriefcase />,
    color: "amber",
    routeLabel: "Primary Mission",
    systemLabel: "Production Systems",
    achievements: [
      "Boosted engagement 35% and cut load times ~40% via UI/SEO improvements, bundling, and caching.",
      "Architected MIND — a WPF/.NET 8 desktop app with DirectX/HelixToolkit 3D visualisation, Entra ID auth, MVVM/DI, mesh checks, and GST-ready quotation generation.",
      "Shipped the Printalytix web platform with React/MUI/Redux/PWA frontend flows and a Node/Express + Sequelize/MySQL backend for uploads, routing, and structured logging.",
      "Automated internal workflows with React/Node applications and RESTful APIs, improving API responsiveness by roughly 30%.",
    ],
  },
  {
    title: "Volunteer — Full-Stack Development",
    company: "Old Dominion University",
    location: "Norfolk, VA, USA",
    period: "Oct 2023 – Jan 2024",
    icon: <FaBriefcase />,
    color: "cyan",
    routeLabel: "Collaboration Mission",
    systemLabel: "Academic Platforms",
    achievements: [
      "Built a university threads platform supporting 500+ concurrent users with role-based access and real-time messaging.",
      "Delivered an examination management system that automated assessments and reduced manual overhead by about 50%.",
      "Optimised backend queries and caching strategy, improving response times by roughly 45%.",
    ],
  },
  {
    title: "Bachelor of Computer Applications",
    company: "Bengaluru North University",
    location: "Bengaluru, India",
    period: "Aug 2018 – Aug 2024",
    icon: <FaGraduationCap />,
    color: "emerald",
    routeLabel: "Foundation Mission",
    systemLabel: "Core Training",
    achievements: [
      "Built a strong foundation in DBMS, web development, data structures, and algorithms.",
      "Completed a final-year project centered on full-stack web application development with MySQL.",
    ],
  },
];

const colorMap: Record<
  RouteColor,
  {
    ring: string;
    badge: string;
    label: string;
    glow: string;
    panel: string;
  }
> = {
  amber: {
    ring: "border-amber-300/60",
    badge: "border-amber-300/30 bg-amber-300/12 text-amber-100",
    label: "text-amber-200",
    glow: "from-amber-300/35 via-amber-200/10 to-transparent",
    panel: "bg-amber-300/8",
  },
  cyan: {
    ring: "border-cyan-300/60",
    badge: "border-cyan-300/30 bg-cyan-300/12 text-cyan-100",
    label: "text-cyan-200",
    glow: "from-cyan-300/35 via-cyan-200/10 to-transparent",
    panel: "bg-cyan-300/8",
  },
  emerald: {
    ring: "border-emerald-300/60",
    badge: "border-emerald-300/30 bg-emerald-300/12 text-emerald-100",
    label: "text-emerald-100",
    glow: "from-emerald-300/35 via-emerald-200/10 to-transparent",
    panel: "bg-emerald-300/8",
  },
};

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section-container">
      <div ref={sectionRef}>
        <div className="mb-10 text-center">
          <motion.p
            className="mb-3 text-xs uppercase tracking-[0.24em] text-emerald-300/70"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
          >
            Career Route
          </motion.p>

          <motion.h2
            className="section-title mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
          >
            Experience
          </motion.h2>

          <motion.p
            className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-300/80 sm:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            A mission-route view of the teams, systems, and outcomes that shaped
            my path across full-stack engineering, desktop tooling, and
            production-focused delivery.
          </motion.p>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.015)_38%,rgba(255,255,255,0)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-cyan-300 to-emerald-300" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                    Route Online
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Checkpoints Logged
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-300/80 sm:text-base">
                  Each checkpoint below represents a meaningful stage in my
                  development: building production systems, collaborating on
                  academic platforms, and strengthening the technical foundation
                  that supports both.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[520px]">
                {[
                  {
                    label: "Route Length",
                    value: `${experiences.length} checkpoints`,
                    detail:
                      "Professional, collaborative, and academic milestones",
                  },
                  {
                    label: "Primary Focus",
                    value: "Impact Delivery",
                    detail: "Performance, architecture, and product execution",
                  },
                  {
                    label: "Operating Mode",
                    value: "Web + Desktop",
                    detail: "Systems built across browser and native workflows",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left"
                    initial={{ opacity: 0, y: 18 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.12 + index * 0.08 }}
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

            <div className="mb-8 grid gap-3 md:grid-cols-3">
              {[
                "01 Enter checkpoint",
                "02 Inspect systems built",
                "03 Review measurable outcomes",
              ].map((step, index) => (
                <motion.div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.18 + index * 0.08 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200/85">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="relative mx-auto max-w-5xl">
              <motion.div
                className="absolute left-[19px] top-8 bottom-8 w-px"
                style={{
                  originY: 0,
                  background:
                    "linear-gradient(to bottom, #fbbf24aa 0%, #22d3ee88 50%, #34d39977 85%, transparent 100%)",
                }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />

              <div className="space-y-10 pl-14">
                {experiences.map((exp, index) => {
                  const tone = colorMap[exp.color];

                  return (
                    <div key={exp.title} className="relative">
                      <motion.div
                        className={`absolute -left-14 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-slate-950 shadow-lg ${tone.ring}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{
                          delay: 0.35 + index * 0.18,
                          type: "spring",
                          stiffness: 220,
                          damping: 18,
                        }}
                      >
                        <motion.div
                          className={`absolute inset-0 rounded-full border ${tone.ring}`}
                          animate={{
                            scale: [1, 1.55, 1],
                            opacity: [0.55, 0, 0.55],
                          }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            delay: index * 0.35,
                          }}
                        />
                        <span className={`text-xs ${tone.label}`}>
                          {exp.icon}
                        </span>
                      </motion.div>

                      <motion.div
                        className="absolute -left-5 top-[22px] h-px w-5"
                        style={{
                          originX: 0,
                          background:
                            "linear-gradient(to right, transparent, rgba(255,255,255,0.18))",
                        }}
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{
                          delay: 0.45 + index * 0.18,
                          duration: 0.28,
                        }}
                      />

                      <motion.div
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-xl shadow-black/20 backdrop-blur"
                        initial={{ opacity: 0, x: -18 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          delay: 0.42 + index * 0.18,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -2, transition: { duration: 0.18 } }}
                      >
                        <div
                          className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${tone.glow}`}
                        />

                        <div className="relative border-b border-white/10 px-5 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                                Route Checkpoint
                              </p>
                              <p
                                className={`text-xs font-semibold uppercase tracking-[0.18em] ${tone.label}`}
                              >
                                {exp.routeLabel}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.badge}`}
                            >
                              {exp.systemLabel}
                            </span>
                          </div>
                        </div>

                        <div className="relative px-5 py-5">
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                              Checkpoint {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.badge}`}
                            >
                              Active Record
                            </span>
                          </div>

                          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="mb-1 text-xl font-bold leading-snug text-slate-50 transition-colors group-hover:text-amber-200">
                                {exp.title}
                              </h3>
                              <div
                                className={`flex items-center gap-2 text-sm font-semibold ${tone.label}`}
                              >
                                <FaBriefcase className="shrink-0 opacity-70" />
                                <span>{exp.company}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-1 text-sm text-slate-300/75 sm:items-end">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
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

                          <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                Mission Type
                              </div>
                              <div className="text-xs font-semibold text-slate-100">
                                {exp.routeLabel}
                              </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                              <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                System Focus
                              </div>
                              <div className="text-xs font-semibold text-slate-100">
                                {exp.systemLabel}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                              Outcomes Logged
                            </div>
                            <ul className="space-y-2.5">
                              {exp.achievements.map(
                                (achievement, achievementIndex) => (
                                  <motion.li
                                    key={achievementIndex}
                                    className="flex items-start gap-3 text-sm leading-relaxed text-slate-200/85"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={
                                      isInView ? { opacity: 1, x: 0 } : {}
                                    }
                                    transition={{
                                      delay:
                                        0.56 +
                                        index * 0.18 +
                                        achievementIndex * 0.06,
                                      duration: 0.32,
                                    }}
                                  >
                                    <span
                                      className={`mt-1.5 shrink-0 text-xs ${tone.label}`}
                                    >
                                      ▸
                                    </span>
                                    <span>{achievement}</span>
                                  </motion.li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              <motion.div
                className="mt-10 flex items-center gap-3 pl-14"
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.45 }}
              >
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent" />
                <span className="select-none text-xs uppercase tracking-widest text-slate-400/50">
                  route logged
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-amber-400/30 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

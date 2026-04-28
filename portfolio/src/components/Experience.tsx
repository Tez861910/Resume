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
    title: "Software Engineer — Product, Web & Desktop",
    company: "Printalytix",
    location: "Bengaluru, India",
    period: "Dec 2024 – Dec 2025",
    icon: <FaBriefcase />,
    color: "amber",
    routeLabel: "Lead role",
    systemLabel: "Production delivery",
    achievements: [
      "Worked across customer-facing and internal product surfaces, from upload-heavy web flows to operations-focused tooling.",
      "Built and evolved MIND as a .NET 8 Windows desktop app for 3D model inspection, manufacturing guidance, and report generation.",
      "Delivered React and Node-based systems with protected workflows, validation, uploads, and maintainable product structure.",
      "Contributed across frontend, backend, and workflow design instead of staying in a single layer of the stack.",
    ],
  },
  {
    title: "Volunteer — Full-Stack Development",
    company: "Old Dominion University",
    location: "Norfolk, VA, USA",
    period: "Oct 2023 – Jan 2024",
    icon: <FaBriefcase />,
    color: "cyan",
    routeLabel: "Collaboration",
    systemLabel: "Academic platforms",
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
    routeLabel: "Education",
    systemLabel: "Core training",
    achievements: [
      "Built a strong foundation in DBMS, web development, data structures, and algorithms.",
      "Completed a final-year project centered on full-stack web application development with MySQL.",
    ],
  },
];

const colorMap: Record<
  RouteColor,
  { ring: string; badge: string; label: string; dot: string; glow: string }
> = {
  amber: {
    ring: "border-amber-300/50",
    badge: "border-amber-300/30 bg-amber-300/10 text-amber-100",
    label: "text-amber-200",
    dot: "bg-amber-300",
    glow: "from-amber-300/25 via-amber-200/8 to-transparent",
  },
  cyan: {
    ring: "border-cyan-300/50",
    badge: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    label: "text-cyan-200",
    dot: "bg-cyan-300",
    glow: "from-cyan-300/25 via-cyan-200/8 to-transparent",
  },
  emerald: {
    ring: "border-emerald-300/50",
    badge: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    label: "text-emerald-200",
    dot: "bg-emerald-300",
    glow: "from-emerald-300/25 via-emerald-200/8 to-transparent",
  },
};

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // Generous margin so animations fire before user reaches the section
  const isInView = useInView(sectionRef, { once: true, margin: "-40px" });

  return (
    <section id="experience" className="section-container">
      <div ref={sectionRef}>
        {/* ── Heading ──────────────────────────────────── */}
        <div className="mb-8 text-center">
          <motion.p
            className="section-eyebrow"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.35 }}
          >
            Experience
          </motion.p>

          <motion.h2
            className="section-title mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            Experience
          </motion.h2>

          <motion.p
            className="section-copy"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.06 }}
          >
            The teams, products, and responsibilities that shaped my work across
            product engineering, desktop tooling, and production delivery.
          </motion.p>
        </div>

        {/* ── Panel ──────────────────────────────────── */}
        <div className="app-panel relative">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.012)_34%,rgba(255,255,255,0)_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-cyan-300 to-emerald-300" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            {/* Header row */}
            <motion.div
              className="mb-6 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Timeline
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Roles and education
              </span>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
              {/* Static spine line — no animation, plain CSS */}
              <div
                className="absolute left-[19px] top-6 bottom-6 w-px"
                style={{
                  background:
                    "linear-gradient(to bottom, #fbbf24aa 0%, #22d3ee77 50%, #34d39966 85%, transparent 100%)",
                }}
              />

              <div className="space-y-8 pl-14">
                {experiences.map((exp, index) => {
                  const tone = colorMap[exp.color];

                  return (
                    <motion.div
                      key={exp.title}
                      className="relative"
                      initial={{ opacity: 0, y: 14 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.38,
                        delay: 0.1 + index * 0.12,
                        ease: "easeOut",
                      }}
                    >
                      {/* Dot — static, no infinite animation */}
                      <div
                        className={`absolute -left-14 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-slate-950 shadow-md ${tone.ring}`}
                      >
                        <span className={`text-xs ${tone.label}`}>
                          {exp.icon}
                        </span>
                      </div>

                      {/* Connector */}
                      <div
                        className="absolute -left-5 top-[22px] h-px w-5"
                        style={{
                          background:
                            "linear-gradient(to right, transparent, rgba(255,255,255,0.16))",
                        }}
                      />

                      {/* Card — no whileHover to avoid layout recalc on scroll */}
                      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-lg shadow-black/15 backdrop-blur-sm">
                        {/* Top colour wash — CSS only, no JS */}
                        <div
                          className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${tone.glow} opacity-80`}
                        />

                        {/* Card header */}
                        <div className="relative border-b border-white/10 px-5 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                                Entry{" "}
                                {String(index + 1).padStart(2, "0")}
                              </p>
                              <p
                                className={`text-xs font-semibold uppercase tracking-[0.16em] ${tone.label}`}
                              >
                                {exp.routeLabel}
                              </p>
                            </div>

                            <span
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${tone.badge}`}
                            >
                              {exp.systemLabel}
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="relative px-5 py-5">
                          {/* Title row */}
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="mb-1 text-xl font-bold leading-snug text-slate-50 transition-colors duration-200 group-hover:text-amber-200">
                                {exp.title}
                              </h3>
                              <div
                                className={`flex items-center gap-2 text-sm font-semibold ${tone.label}`}
                              >
                                <FaBriefcase className="shrink-0 opacity-70" />
                                <span>{exp.company}</span>
                              </div>
                            </div>

                            <div className="flex flex-col items-start gap-1 sm:items-end">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
                              >
                                <FaCalendar className="opacity-70" />
                                {exp.period}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-slate-300/70">
                                <FaMapMarkerAlt className="opacity-60" />
                                {exp.location}
                              </span>
                            </div>
                          </div>

                          {/* Meta tiles */}
                          <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                              <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                Role focus
                              </div>
                              <div className="text-xs font-semibold text-slate-100">
                                {exp.routeLabel}
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                              <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                Main area
                              </div>
                              <div className="text-xs font-semibold text-slate-100">
                                {exp.systemLabel}
                              </div>
                            </div>
                          </div>

                          {/* Achievements */}
                          <div>
                            <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                              Highlights
                            </div>
                            <ul className="space-y-2">
                              {exp.achievements.map((ach, ai) => (
                                <li
                                  key={ai}
                                  className="flex items-start gap-3 text-sm leading-relaxed text-slate-200/85"
                                >
                                  <span
                                    className={`mt-1.5 shrink-0 text-xs ${tone.label}`}
                                  >
                                    ▸
                                  </span>
                                  <span>{ach}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* End flourish — static, no animation */}
              <div className="mt-8 flex items-center gap-3 pl-14">
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/25 to-transparent" />
                <span className="select-none text-xs uppercase tracking-widest text-slate-400/45">
                  more below
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-amber-400/25 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

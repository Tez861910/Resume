import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ExperienceEntry {
  title: string;
  company: string;
  location: string;
  period: string;
  kind: string;
  focus: string;
  achievements: string[];
}

const experiences: ExperienceEntry[] = [
  {
    title: "Software Engineer — Product, Web & Desktop",
    company: "Printalytix",
    location: "Bengaluru, India",
    period: "Dec 2024 — Dec 2025",
    kind: "Lead role",
    focus: "Production delivery",
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
    period: "Oct 2023 — Jan 2024",
    kind: "Collaboration",
    focus: "Academic platforms",
    achievements: [
      "Built a university threads platform with role-based access, discussion flows, and real-time messaging.",
      "Delivered an examination management system covering assessment workflows, submissions, and administrative coordination.",
      "Worked on backend queries, caching, and application structure to keep the platform responsive as features expanded.",
    ],
  },
  {
    title: "Bachelor of Computer Applications",
    company: "Bengaluru North University",
    location: "Bengaluru, India",
    period: "Aug 2018 — Aug 2024",
    kind: "Education",
    focus: "Core training",
    achievements: [
      "Built a strong foundation in DBMS, web development, data structures, and algorithms.",
      "Completed a final-year project centered on full-stack web application development with MySQL.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-40px" });

  return (
    <section id="experience" className="section-container">
      <div ref={sectionRef}>
        <header className="max-w-3xl">
          <p className="section-kicker">
            <span className="font-mono text-faint">03</span> Experience
          </p>
          <h2 className="section-title">Where the work took shape.</h2>
          <p className="section-copy">
            The teams, products, and responsibilities behind my work across
            product engineering, desktop tooling, and production delivery.
          </p>
        </header>

        <div className="mt-12 border-t border-rule">
          {experiences.map((exp, index) => (
            <motion.article
              key={exp.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 + index * 0.1 }}
              className="grid gap-6 border-b border-rule py-10 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-4">
                <div className="flex items-baseline gap-3">
                  <span className="num-index text-3xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="tag-accent tag">{exp.kind}</span>
                </div>
                <p className="mt-4 font-mono text-[12px] tracking-wide text-soft">
                  {exp.period}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  {exp.location}
                </p>
                <p className="mt-3 mono-label">{exp.focus}</p>
              </div>

              <div className="lg:col-span-8 lg:border-l lg:border-rule lg:pl-8">
                <h3 className="font-display text-[1.6rem] leading-tight text-ink">
                  {exp.title}
                </h3>
                <p className="mt-1 text-[0.95rem] font-medium text-accent">
                  {exp.company}
                </p>
                <ul className="mt-5 space-y-3">
                  {exp.achievements.map((ach) => (
                    <li
                      key={ach}
                      className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-soft"
                    >
                      <span
                        className="mt-2 h-px w-3"
                        style={{ background: "var(--accent)" }}
                      />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

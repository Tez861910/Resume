import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const skillCategories = [
  {
    index: "01",
    title: "Languages",
    detail: "Primary implementation languages across product, desktop, and local-first work.",
    skills: ["TypeScript", "JavaScript", "C#", "Dart", "Rust", "SQL"],
  },
  {
    index: "02",
    title: "Frontend & product UI",
    detail: "Interfaces, routing, motion, and design-system level delivery.",
    skills: [
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "Material UI",
      "Framer Motion",
      "React Router",
      "TanStack Router",
    ],
  },
  {
    index: "03",
    title: "Backend & APIs",
    detail: "Service layers, validation, and protected workflow handling.",
    skills: ["Node.js", "Express", "REST APIs", "Prisma", "Sequelize", "Auth & Validation"],
  },
  {
    index: "04",
    title: "Desktop & 3D",
    detail: "Windows app delivery, rendering, reports, and workflow tooling.",
    skills: [".NET 8", "WinUI 3", "Win2D", "AssimpNet", "MVVM", "iText 7"],
  },
  {
    index: "05",
    title: "Cross-platform & local-first",
    detail: "Cross-platform delivery and on-device processing patterns.",
    skills: ["Flutter", "Flutter Rust Bridge", "FFI", "On-Device Processing", "Encrypted Storage"],
  },
  {
    index: "06",
    title: "Data & delivery",
    detail: "Persistence, versioning, CI, and release workflow support.",
    skills: ["PostgreSQL", "MySQL", "SQLite", "Git", "GitHub Actions", "Build & Release"],
  },
];

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="skills" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <header className="max-w-3xl">
          <p className="section-kicker">
            <span className="font-mono text-faint">02</span> Capabilities
          </p>
          <h2 className="section-title">The tools I keep returning to.</h2>
          <p className="section-copy">
            A working map of the technologies and delivery surfaces behind
            product platforms, desktop tooling, and local-first app work.
          </p>
        </header>

        <div className="mt-12 border-t border-rule">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="grid gap-x-8 gap-y-4 border-b border-rule py-7 lg:grid-cols-12"
            >
              <div className="lg:col-span-5">
                <div className="flex items-baseline gap-3">
                  <span className="num-index text-lg">{category.index}</span>
                  <h3 className="font-display text-xl text-ink">
                    {category.title}
                  </h3>
                </div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-faint lg:pl-9">
                  {category.detail}
                </p>
              </div>
              <div className="flex flex-wrap content-start gap-2 lg:col-span-7">
                {category.skills.map((skill) => (
                  <span key={skill} className="tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

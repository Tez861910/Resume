import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaReact, FaNode, FaDatabase, FaCode } from "react-icons/fa";
import { SiTypescript, SiDotnet } from "react-icons/si";

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skillCategories = [
    {
      title: "Languages",
      detail: "Primary implementation languages across product, desktop, and local-first work",
      icon: <FaCode className="text-4xl text-primary-600" />,
      skills: ["TypeScript", "JavaScript", "C#", "Dart", "Rust", "SQL"],
    },
    {
      title: "Frontend & Product UI",
      detail: "Interfaces, routing, motion, and design-system level delivery",
      icon: <FaReact className="text-4xl text-primary-600" />,
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
      title: "Backend & APIs",
      detail: "Service layers, validation, and protected workflow handling",
      icon: <FaNode className="text-4xl text-primary-600" />,
      skills: [
        "Node.js",
        "Express",
        "REST APIs",
        "Prisma",
        "Sequelize",
        "Auth & Validation",
      ],
    },
    {
      title: "Desktop & 3D",
      detail: "Windows app delivery, rendering, reports, and workflow tooling",
      icon: <SiDotnet className="text-4xl text-primary-600" />,
      skills: [".NET 8", "WinUI 3", "Win2D", "AssimpNet", "MVVM", "iText 7"],
    },
    {
      title: "Mobile & Local-First",
      detail: "Cross-platform delivery and on-device processing patterns",
      icon: <FaDatabase className="text-4xl text-primary-600" />,
      skills: [
        "Flutter",
        "Flutter Rust Bridge",
        "FFI",
        "On-Device Processing",
        "Encrypted Storage",
      ],
    },
    {
      title: "Data & Delivery",
      detail: "Persistence, versioning, CI, and release workflow support",
      icon: <SiTypescript className="text-4xl text-primary-600" />,
      skills: [
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "Git",
        "GitHub Actions",
        "Build & Release Automation",
      ],
    },
  ];

  return (
    <section id="skills" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 text-center">
          <p className="section-eyebrow">Capabilities</p>
          <h2 className="section-title">Technical skills</h2>
          <p className="section-copy">
            The technologies and delivery surfaces I keep returning to across
            product platforms, desktop tooling, and local-first app work.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              className="card border border-white/15"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <div>
                  <h3 className="text-xl font-bold text-slate-50">
                    {category.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300/70">
                    {category.detail}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-white/10 text-amber-100 rounded-full text-sm font-medium border border-white/10"
                  >
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
};

export default Skills;

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
      icon: <FaCode className="text-4xl text-primary-600" />,
      skills: ["JavaScript", "TypeScript", "C#", "Java", "Rust"],
    },
    {
      title: "Frontend",
      icon: <FaReact className="text-4xl text-primary-600" />,
      skills: [
        "React",
        "Next.js",
        "Vite",
        "Material UI",
        "Tailwind",
        "Framer Motion",
        "Flutter",
      ],
    },
    {
      title: "Backend",
      icon: <FaNode className="text-4xl text-primary-600" />,
      skills: ["Node.js", "Express.js", "REST APIs", "Prisma", "Sequelize"],
    },
    {
      title: "Desktop & Mobile",
      icon: <SiDotnet className="text-4xl text-primary-600" />,
      skills: [".NET 8", "WinUI / Win2D", "Flutter", "MVVM", "FFI"],
    },
    {
      title: "Data & Storage",
      icon: <FaDatabase className="text-4xl text-primary-600" />,
      skills: ["PostgreSQL", "MySQL", "SQLite", "Encrypted File Storage"],
    },
    {
      title: "Tools",
      icon: <SiTypescript className="text-4xl text-primary-600" />,
      skills: ["Git", "GitHub Actions", "VS Code", "Release Automation", "Vite"],
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
            The stack I use across product sites, operational systems, desktop
            tooling, and local-first app work. The point is not collecting
            buzzwords - it is choosing the right surface and keeping it
            maintainable.
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
                <h3 className="text-xl font-bold text-slate-50">
                  {category.title}
                </h3>
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

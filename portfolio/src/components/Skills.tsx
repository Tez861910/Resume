import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const coreSkill = {
  title: "Full-stack web development (core)",
  detail:
    "Primary stack for production product work: React frontend, Node backend, and relational databases.",
  skills: ["React", "Node.js", "Express", "MySQL", "PostgreSQL"],
};

const additionalSkillCategories = [
  {
    index: "01",
    title: "Additional web dependencies",
    detail: "Supporting tools and frameworks around the core web stack.",
    skills: [
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Material UI",
      "React Router",
      "TanStack Router",
      "Prisma",
      "Sequelize",
      "REST APIs",
      "Auth & Validation",
      "Upload Workflows",
    ],
  },
  {
    index: "02",
    title: "Desktop development",
    detail: "Windows app delivery, rendering, reports, and workflow tooling.",
    skills: [".NET 8", "C#", "WinUI 3", "Win2D", "AssimpNet", "MVVM", "iText 7"],
  },
  {
    index: "03",
    title: "Cross-platform & local-first",
    detail: "Cross-platform delivery and on-device processing patterns.",
    skills: [
      "Flutter",
      "Dart",
      "Rust",
      "Flutter Rust Bridge",
      "FFI",
      "On-Device Processing",
      "Encrypted Storage",
      "FFmpeg",
    ],
  },
  {
    index: "04",
    title: "Data & delivery",
    detail: "Persistence, versioning, Dockerized workflows, CI/CD, and release support.",
    skills: ["SQLite", "Git", "Docker", "GitHub Actions", "CI/CD Pipelines", "Build & Release"],
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
           Core strength is full-stack web product development. Other stacks
           are listed separately as additional skills for clarity.
          </p>
        </header>

        <div className="mt-12 border-y border-rule py-7">
         <div className="grid gap-x-8 gap-y-4 lg:grid-cols-12">
           <div className="lg:col-span-5">
             <div className="flex items-baseline gap-3">
               <span className="num-index text-lg">Core</span>
               <h3 className="font-display text-xl text-ink">{coreSkill.title}</h3>
             </div>
             <p className="mt-2 max-w-md text-sm leading-relaxed text-faint lg:pl-14">
               {coreSkill.detail}
             </p>
           </div>
           <div className="flex flex-wrap content-start gap-2 lg:col-span-7">
             {coreSkill.skills.map((skill) => (
               <span key={skill} className="tag">
                 {skill}
               </span>
             ))}
           </div>
         </div>
        </div>

        <div className="mt-6 border-t border-rule">
         {additionalSkillCategories.map((category, index) => (
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

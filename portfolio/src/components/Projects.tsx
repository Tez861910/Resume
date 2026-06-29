import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import projects from "../data/projects";
import { siteConfig } from "../config/site";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.06,
    rootMargin: "0px 0px -6% 0px",
  });

  return (
    <section id="projects" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">
              <span className="font-mono text-faint">04</span> Selected work
            </p>
            <h2 className="section-title">Things I&apos;ve built and shipped.</h2>
            <p className="section-copy">
              Products, company platforms, and tools across web, desktop, and
              cross-platform — each card opens a fuller case study.
            </p>
          </div>
          <div className="shrink-0">
            <Link to={siteConfig.resumePagePath} className="btn-secondary">
              Download résumé
            </Link>
          </div>
        </header>

        <div className="mt-10 flex items-center justify-between border-y border-rule py-3">
          <span className="mono-label">{projects.length} projects</span>
          <span className="mono-label">Web · Desktop · Cross-platform</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

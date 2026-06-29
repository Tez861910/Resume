import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaGlobe } from "react-icons/fa";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
}

const liveStatuses = new Set(["Live", "Shipped"]);

export default function ProjectCard({ project, index, inView }: ProjectCardProps) {
  const thumbnail = project.media.find((media) => media.type === "image");
  const status = project.status ?? "Active";
  const isLive = liveStatuses.has(status);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group flex h-full flex-col border border-rule bg-surface-2 transition-colors hover:border-[var(--accent-line)]"
      style={{ borderRadius: "5px" }}
    >
      <div className="flex items-center justify-between border-b border-rule px-5 py-3">
        <div className="flex items-baseline gap-2">
          <span className="num-index text-base">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mono-label">{project.category ?? "Project"}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-faint">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: isLive ? "var(--accent)" : "var(--faint)" }}
          />
          {status}
        </span>
      </div>

      {thumbnail ? (
        <Link
          to={`/project/${project.id}`}
          className="relative block h-44 overflow-hidden border-b border-rule"
        >
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.45rem] leading-tight text-ink">
          <Link
            to={`/project/${project.id}`}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-soft">
          {project.tagline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="self-center font-mono text-[10.5px] text-faint">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-rule pt-4">
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link h-9 w-9"
                aria-label={`${project.title} on GitHub`}
              >
                <FaGithub className="text-sm" />
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link h-9 w-9"
                aria-label={`${project.title} live site`}
              >
                <FaGlobe className="text-sm" />
              </a>
            )}
          </div>

          <Link
            to={`/project/${project.id}`}
            className="link-arrow group/link"
          >
            Read case study
            <FaArrowRight className="text-[10px] transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaGithub, FaGlobe } from "react-icons/fa";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
}

const STATUS_TONE: Record<
  string,
  {
    badge: string;
    glow: string;
    label: string;
  }
> = {
  "In Progress": {
    badge: "border-amber-300/35 bg-amber-300/12 text-amber-100",
    glow: "from-amber-300/35 via-amber-200/10 to-transparent",
    label: "In Progress",
  },
  Live: {
    badge: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    glow: "from-emerald-300/35 via-emerald-200/10 to-transparent",
    label: "Live",
  },
  Shipped: {
    badge: "border-cyan-300/35 bg-cyan-300/12 text-cyan-100",
    glow: "from-cyan-300/35 via-cyan-200/10 to-transparent",
    label: "Shipped",
  },
};

function inferMissionType(project: Project) {
  const tech = project.tech.join(" ").toLowerCase();
  const skills = project.skills.join(" ").toLowerCase();
  const combined = `${tech} ${skills}`;

  if (
    combined.includes("wpf") ||
    combined.includes("directx") ||
    combined.includes("desktop")
  ) {
    return "Desktop app";
  }

  if (
    combined.includes("node") ||
    combined.includes("express") ||
    combined.includes("mysql") ||
    combined.includes("api")
  ) {
    return "Full-stack app";
  }

  if (
    combined.includes("react") ||
    combined.includes("tailwind") ||
    combined.includes("frontend")
  ) {
    return "Frontend app";
  }

  return "Product build";
}

function inferImpactLabel(project: Project) {
  const text = `${project.tagline} ${project.description} ${project.highlights.join(" ")}`;

  if (text.includes("35%")) return "35% engagement lift";
  if (text.includes("40%")) return "40% faster loads";
  if (text.includes("500+")) return "500+ users served";
  if (text.includes("50%")) return "50% less manual work";
  if (text.includes("45%")) return "45% faster responses";

  return "Production-focused build";
}

export default function ProjectCard({
  project,
  index,
  inView,
}: ProjectCardProps) {
  const thumbnail = project.media.find((media) => media.type === "image");

  const missionType = useMemo(() => inferMissionType(project), [project]);
  const impactLabel = useMemo(() => inferImpactLabel(project), [project]);
  const statusTone = STATUS_TONE[project.status ?? ""] ?? {
    badge: "border-white/15 bg-white/[0.06] text-slate-100",
    glow: "from-white/20 via-white/5 to-transparent",
    label: project.status ?? "Active",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-slate-950/55 shadow-lg shadow-black/15 backdrop-blur-sm"
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${statusTone.glow} opacity-70`}
      />

      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
            Project snapshot
          </p>
          <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-slate-300/80">
            {missionType}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusTone.badge}`}
        >
          {statusTone.label}
        </span>
      </div>

      {thumbnail ? (
        <Link
          to={`/project/${project.id}`}
          className="relative block h-44 overflow-hidden border-b border-white/10"
        >
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </Link>
      ) : (
        <Link
          to={`/project/${project.id}`}
          className="relative block h-44 overflow-hidden border-b border-white/10"
          tabIndex={-1}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.18),transparent_22%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.9))]" />
          <div className="relative flex h-full items-end p-5">
            <div>
              <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                {missionType}
              </span>
              <p className="mt-3 max-w-[16rem] text-lg font-semibold text-slate-50">
                {project.title}
              </p>
            </div>
          </div>
        </Link>
      )}

      <div className="flex flex-1 flex-col px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
            Case study
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            {impactLabel}
          </span>
        </div>

        <div className="mb-3">
          <h3 className="text-xl font-bold leading-snug text-slate-50 transition-colors group-hover:text-amber-200">
            {project.title}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-200/85">
          {project.tagline}
        </p>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Stack
            </div>
            <div className="text-xs font-semibold text-slate-100">
              {project.tech.slice(0, 3).join(" · ")}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Skills
            </div>
            <div className="text-xs font-semibold text-slate-100">
              {project.skills.slice(0, 2).join(" · ")}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Tech used
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-xs text-amber-100"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-0.5 text-xs text-slate-400">
                +{project.tech.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                aria-label={`${project.title} GitHub`}
              >
                <FaGithub className="text-sm" />
              </a>
            )}

            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                aria-label={`${project.title} live site`}
              >
                <FaGlobe className="text-sm" />
              </a>
            )}
          </div>

          <Link
            to={`/project/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition-colors hover:text-amber-100 group/link"
          >
            Open case study
            <FaArrowRight className="text-xs transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import type { Project } from "../data/projects";
import ProjectHologram from "../three/scenes/ProjectHologram";

interface ProjectCardProps {
  project: Project;
  index: number;
  inView: boolean;
}

const ProjectCard = ({ project, index, inView }: ProjectCardProps) => {
  const thumbnail = project.media.find((m) => m.type === "image");

  // CSS 3-D tilt on mouse hover — pure transform, no WebGL
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/*
        Inner wrapper owns the 3-D tilt independently of the entry animation.
        Using a plain div instead of motion.div avoids competing transforms.
      */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(820px) rotateX(${-tilt.y * 7}deg) rotateY(${tilt.x * 7}deg)`,
          transition: "transform 0.12s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="card group border border-white/15 flex flex-col h-full"
      >
        {/* ── Header: real image thumbnail OR CSS hologram ─────────────── */}
        {thumbnail ? (
          <Link
            to={`/project/${project.id}`}
            className="block -mx-6 -mt-6 mb-4"
          >
            <img
              src={thumbnail.src}
              alt={thumbnail.alt}
              className="w-full h-44 object-cover rounded-t-2xl"
              loading="lazy"
            />
          </Link>
        ) : (
          /*
            ProjectHologram is now pure CSS + SVG — no WebGL context,
            no requestAnimationFrame loop, no Suspense boundary needed.
            All 6 cards can animate simultaneously with zero GPU stutter.
          */
          <Link
            to={`/project/${project.id}`}
            className="block -mx-6 -mt-6 mb-4 h-44 rounded-t-2xl overflow-hidden"
            tabIndex={-1}
          >
            <ProjectHologram projectId={project.id} />
          </Link>
        )}

        {/* ── Title + status badge ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-50 group-hover:text-amber-200 transition-colors leading-snug">
            {project.title}
          </h3>
          {project.status && (
            <span className="px-3 py-1 bg-amber-200/20 text-amber-100 rounded-full text-xs font-semibold border border-amber-200/40 whitespace-nowrap ml-2 shrink-0">
              {project.status}
            </span>
          )}
        </div>

        {/* ── Tagline ──────────────────────────────────────────────────── */}
        <p className="text-slate-200/85 mb-4 line-clamp-2 text-sm leading-relaxed">
          {project.tagline}
        </p>

        {/* ── Tech pills ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 5).map((t, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 bg-white/8 text-amber-100 rounded-md text-xs border border-white/10"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 5 && (
            <span className="px-2.5 py-0.5 text-slate-400 text-xs">
              +{project.tech.length - 5} more
            </span>
          )}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-auto">
          <Link
            to={`/project/${project.id}`}
            className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 font-medium text-sm transition-colors group/link"
          >
            View Details
            <FaArrowRight className="text-xs transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import projects from "../data/projects";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

function DashList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="grid grid-cols-[1.25rem_1fr] text-[0.95rem] leading-relaxed text-soft"
        >
          <span className="mt-2 h-px w-3" style={{ background: "var(--accent)" }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-4xl text-ink">Project not found</h1>
        <Link to="/#projects" className="btn-primary">
          <FaArrowLeft /> Back to work
        </Link>
      </div>
    );
  }

  const images = project.media.filter((m) => m.type === "image");
  const videos = project.media.filter((m) => m.type === "video");
  const quickFacts = [
    project.category ? { label: "Category", value: project.category } : null,
    project.role ? { label: "Role", value: project.role } : null,
    project.timeline ? { label: "Timeline", value: project.timeline } : null,
    project.status ? { label: "Status", value: project.status } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div {...fade()}>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
          >
            <FaArrowLeft className="text-[10px]" /> Back to work
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header {...fade(0.05)} className="mt-8 border-b border-rule pb-10">
          <p className="section-kicker">{project.category ?? "Case study"}</p>
          <h1 className="font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-[3.25rem]">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">
            {project.tagline}
          </p>

          {(project.github || project.live) && (
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <FaGithub /> View source
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <FaExternalLinkAlt className="text-[11px]" /> {project.liveLabel ?? "Live site"}
                </a>
              )}
            </div>
          )}
        </motion.header>

        {/* Quick facts */}
        {quickFacts.length > 0 && (
          <motion.section
            {...fade(0.1)}
            className="grid border-b border-rule sm:grid-cols-2 lg:grid-cols-4"
          >
            {quickFacts.map((fact, i) => (
              <div
                key={fact.label}
                className={`py-5 lg:px-5 ${i !== 0 ? "border-t border-rule lg:border-l lg:border-t-0" : "lg:pl-0"}`}
              >
                <p className="mono-label">{fact.label}</p>
                <p className="mt-1.5 text-[0.95rem] font-medium leading-relaxed text-ink">
                  {fact.value}
                </p>
              </div>
            ))}
          </motion.section>
        )}

        {/* Media gallery */}
        {project.media.length > 0 && (
          <motion.section {...fade(0.12)} className="mt-12">
            {images.length > 0 && (
              <div
                className={`grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}
              >
                {images.map((img, i) => (
                  <figure
                    key={i}
                    className="overflow-hidden border border-rule"
                    style={{ borderRadius: "5px" }}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className={`w-full object-cover ${images.length > 1 ? "h-64" : "h-auto"}`}
                      loading="lazy"
                    />
                    {img.caption && (
                      <figcaption className="border-t border-rule bg-surface px-4 py-2 text-sm text-faint">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {videos.length > 0 && (
              <div className="mt-4 grid gap-4">
                {videos.map((vid, i) => (
                  <figure
                    key={i}
                    className="overflow-hidden border border-rule"
                    style={{ borderRadius: "5px" }}
                  >
                    <video src={vid.src} controls className="w-full" preload="metadata">
                      Your browser does not support the video tag.
                    </video>
                    {vid.caption && (
                      <figcaption className="border-t border-rule bg-surface px-4 py-2 text-sm text-faint">
                        {vid.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Narrative */}
        <div className="mt-14 space-y-12">
          <motion.section {...fade(0.14)} className="grid gap-3 lg:grid-cols-12">
            <h2 className="font-display text-2xl text-ink lg:col-span-3">
              Why I built it
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-soft lg:col-span-9">
              {project.intent}
            </p>
          </motion.section>

          {project.problem && (
            <motion.section {...fade(0.16)} className="grid gap-3 lg:grid-cols-12">
              <h2 className="font-display text-2xl text-ink lg:col-span-3">
                Context
              </h2>
              <p className="text-[1.0625rem] leading-relaxed text-soft lg:col-span-9">
                {project.problem}
              </p>
            </motion.section>
          )}

          <motion.section {...fade(0.18)} className="grid gap-3 lg:grid-cols-12">
            <h2 className="font-display text-2xl text-ink lg:col-span-3">
              Overview
            </h2>
            <div className="lg:col-span-9">
              <p className="text-[1.0625rem] leading-relaxed text-soft">
                {project.description}
              </p>
              <p className="mb-4 mt-8 mono-label">Key highlights</p>
              <DashList items={project.highlights} />
            </div>
          </motion.section>

          {(project.responsibilities?.length || project.outcomes?.length) && (
            <motion.section
              {...fade(0.2)}
              className="grid gap-10 border-t border-rule pt-12 sm:grid-cols-2"
            >
              {project.responsibilities?.length ? (
                <div>
                  <p className="mb-4 mono-label">What I handled</p>
                  <DashList items={project.responsibilities} />
                </div>
              ) : null}
              {project.outcomes?.length ? (
                <div>
                  <p className="mb-4 mono-label">Why it matters</p>
                  <DashList items={project.outcomes} />
                </div>
              ) : null}
            </motion.section>
          )}

          {/* Tech & skills */}
          <motion.section
            {...fade(0.22)}
            className="grid gap-10 border-t border-rule pt-12 sm:grid-cols-2"
          >
            <div>
              <p className="mb-4 mono-label">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 mono-label">Skills applied</p>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {project.media.length === 0 && (
            <motion.div
              {...fade(0.24)}
              className="border border-dashed border-rule-strong py-10 text-center"
              style={{ borderRadius: "5px" }}
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-faint">
                Screenshots &amp; demo footage coming soon
              </p>
            </motion.div>
          )}
        </div>

        {/* Bottom nav */}
        <motion.div
          {...fade(0.26)}
          className="mt-16 flex items-center justify-between border-t border-rule pt-8"
        >
          <Link to="/#projects" className="link-arrow">
            <FaArrowLeft className="text-[10px]" /> All work
          </Link>
          <Link to="/#contact" className="link-arrow">
            Get in touch <FaArrowRight className="text-[10px]" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

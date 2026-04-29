import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import projects from '../data/projects'

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-slate-50">Project Not Found</h1>
        <Link to="/" className="btn-primary">
          <FaArrowLeft /> Back Home
        </Link>
      </div>
    )
  }

  const images = project.media.filter((m) => m.type === 'image')
  const videos = project.media.filter((m) => m.type === 'video')
  const quickFacts = [
    project.category ? { label: 'Category', value: project.category } : null,
    project.role ? { label: 'Role', value: project.role } : null,
    project.timeline ? { label: 'Timeline', value: project.timeline } : null,
    project.status ? { label: 'Status', value: project.status } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 transition-colors mb-8"
          >
            <FaArrowLeft /> Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-50 tracking-tight">
              {project.title}
            </h1>
            {project.status && (
              <span className="px-4 py-1.5 bg-amber-200/20 text-amber-100 rounded-full text-sm font-semibold border border-amber-200/40">
                {project.status}
              </span>
            )}
          </div>
          <p className="text-xl text-amber-100">{project.tagline}</p>

          {/* Links */}
          <div className="flex gap-4 mt-5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                <FaGithub /> View Source
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {quickFacts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="card border border-white/15"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-2">
                  {fact.label}
                </p>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                  {fact.value}
                </p>
              </div>
            ))}
          </motion.section>
        )}

        {/* Media Gallery */}
        {project.media.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            {/* Images */}
            {images.length > 0 && (
              <div className="grid gap-4 mb-6">
                {images.length === 1 ? (
                  <figure className="rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={images[0].src}
                      alt={images[0].alt}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {images[0].caption && (
                      <figcaption className="px-4 py-2 text-sm text-slate-300 bg-white/5">
                        {images[0].caption}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <figure
                        key={i}
                        className="rounded-2xl overflow-hidden border border-white/10"
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-64 object-cover"
                          loading="lazy"
                        />
                        {img.caption && (
                          <figcaption className="px-4 py-2 text-sm text-slate-300 bg-white/5">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="grid gap-4">
                {videos.map((vid, i) => (
                  <figure
                    key={i}
                    className="rounded-2xl overflow-hidden border border-white/10"
                  >
                    <video
                      src={vid.src}
                      controls
                      className="w-full"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                    {vid.caption && (
                      <figcaption className="px-4 py-2 text-sm text-slate-300 bg-white/5">
                        {vid.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Project Intent */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="card border border-white/15 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Why I Built This</h2>
          <p className="text-lg text-slate-200/90 leading-relaxed">{project.intent}</p>
        </motion.section>

        {project.problem && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="card border border-white/15 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Project Context</h2>
            <p className="text-slate-200/90 leading-relaxed">{project.problem}</p>
          </motion.section>
        )}

        {/* Description & Highlights */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="card border border-white/15 mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Overview</h2>
          <p className="text-slate-200/90 leading-relaxed mb-6">{project.description}</p>

          <h3 className="text-lg font-semibold text-amber-200 mb-3">Key Highlights</h3>
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-200/90">
                <span className="text-amber-300 mt-1">▸</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {(project.responsibilities?.length || project.outcomes?.length) && (
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            {project.responsibilities?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                className="card border border-white/15"
              >
                <h2 className="text-2xl font-bold text-slate-50 mb-4">What I handled</h2>
                <ul className="space-y-2">
                  {project.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-200/90">
                      <span className="text-cyan-300 mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) : null}

            {project.outcomes?.length ? (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="card border border-white/15"
              >
                <h2 className="text-2xl font-bold text-slate-50 mb-4">Why it matters</h2>
                <ul className="space-y-2">
                  {project.outcomes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-200/90">
                      <span className="text-emerald-300 mt-1">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            ) : null}
          </div>
        )}

        {/* Tech Stack & Skills */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card border border-white/15"
          >
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-amber-200/15 text-amber-100 rounded-lg text-sm font-medium border border-amber-200/30"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card border border-white/15"
          >
            <h2 className="text-2xl font-bold text-slate-50 mb-4">Skills Applied</h2>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/10 text-slate-100 rounded-lg text-sm font-medium border border-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Placeholder for empty media */}
        {project.media.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="card border border-dashed border-white/20 text-center mb-8"
          >
            <p className="text-slate-400 text-lg">
              Screenshots & demo videos coming soon
            </p>
          </motion.div>
        )}

        {/* Bottom nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <Link to="/#projects" className="btn-secondary">
            <FaArrowLeft /> All Projects
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectDetail

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  inView: boolean
}

const ProjectCard = ({ project, index, inView }: ProjectCardProps) => {
  const thumbnail = project.media.find((m) => m.type === 'image')

  return (
    <motion.div
      className="card group border border-white/15 flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <Link to={`/project/${project.id}`} className="block -mx-6 -mt-6 mb-4">
          <img
            src={thumbnail.src}
            alt={thumbnail.alt}
            className="w-full h-48 object-cover rounded-t-2xl"
            loading="lazy"
          />
        </Link>
      ) : (
        <Link
          to={`/project/${project.id}`}
          className="block -mx-6 -mt-6 mb-4 h-32 bg-gradient-to-br from-amber-400/10 to-cyan-400/10 rounded-t-2xl flex items-center justify-center"
        >
          <span className="text-3xl font-bold text-white/20">{project.title[0]}</span>
        </Link>
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-slate-50 group-hover:text-amber-200 transition-colors">
          {project.title}
        </h3>
        {project.status && (
          <span className="px-3 py-1 bg-amber-200/20 text-amber-100 rounded-full text-xs font-semibold border border-amber-200/40 whitespace-nowrap ml-2">
            {project.status}
          </span>
        )}
      </div>

      <p className="text-slate-200/90 mb-4 line-clamp-2">{project.tagline}</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.tech.slice(0, 5).map((t, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-white/10 text-amber-100 rounded-md text-sm border border-white/10"
          >
            {t}
          </span>
        ))}
        {project.tech.length > 5 && (
          <span className="px-3 py-1 text-slate-400 text-sm">
            +{project.tech.length - 5} more
          </span>
        )}
      </div>

      <div className="mt-auto">
        <Link
          to={`/project/${project.id}`}
          className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-100 font-medium transition-colors group/link"
        >
          View Details
          <FaArrowRight className="text-sm transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}

export default ProjectCard

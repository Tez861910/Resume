import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects = [
    {
      title: 'Open Solar Toolkit',
      description:
        'Solar project lifecycle platform (sales → install → maintenance) with multi-role dashboards, draggable layouts, monitoring analytics, and security hardening.',
      tech: ['Vite/React (TS)', 'Tailwind', 'DnD Kit', 'Chart.js'],
      status: 'In Progress',
    },
    {
      title: 'Resolute Solutions Site',
      description:
        'Corporate site for four verticals with product catalog, EmailJS flows, PWA, SEO/OG meta; deployed via GoDaddy with custom domain.',
      tech: ['Vite/React (TS)', 'Tailwind', 'PWA', 'GoDaddy'],
    },
    {
      title: 'University Threads & Exam Systems',
      description:
        'Forum platform with JWT auth, rate limiting, optimized queries for 500+ users; exam system with role-based access and automated results.',
      tech: ['React/MUI', 'Express', 'Java/JSP', 'MySQL'],
    },
    {
      title: 'MIND 3D Manufacturing Suite',
      description:
        'WPF/.NET 8 desktop app with DirectX 3D visualization, Entra ID auth, MVVM/DI, mesh checks for printing/CNC, and GST quotation PDFs.',
      tech: ['WPF/.NET 8', 'DirectX/HelixToolkit', 'Entra ID', 'QuestPDF'],
    },
    {
      title: 'Printalytix Web Platform',
      description:
        'Customer site with animated components, PWA caching, SEO routing, and form flows; backed by Express + MySQL API with file handling.',
      tech: ['React/MUI', 'Redux', 'PWA', 'Node/Express', 'MySQL'],
      link: '#',
    },
  ]

  return (
    <section id="projects" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Featured Projects</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="card group border border-white/15"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-50 group-hover:text-amber-200 transition-colors">
                  {project.title}
                </h3>
                {project.status && (
                  <span className="px-3 py-1 bg-amber-200/20 text-amber-100 rounded-full text-xs font-semibold border border-amber-200/40">
                    {project.status}
                  </span>
                )}
              </div>

              <p className="text-slate-200/90 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-white/10 text-amber-100 rounded-md text-sm border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Projects

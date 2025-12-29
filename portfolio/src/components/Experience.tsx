import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBriefcase, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    {
      title: 'Software Engineer — Web & Desktop',
      company: 'Printalytix',
      location: 'Bengaluru, India',
      period: 'Dec 2024 - Dec 2025',
      achievements: [
        'Boosted engagement 35% and cut load times ~40% via UI/SEO improvements, bundling, and caching',
        'Architected MIND WPF/.NET 8 app with DirectX 3D visualization, Entra ID auth, MVVM/DI, mesh checks, and GST quotation via QuestPDF',
        'Shipped Printalytix site (React/MUI/Redux/PWA) with forms, drag-and-drop, SEO routing; Node/Express + MySQL backend with file handling',
        'Automated workflows with React/Node apps, improving API responsiveness ~30%',
      ],
    },
    {
      title: 'Volunteer — Full-Stack Development',
      company: 'Old Dominion University',
      location: 'Norfolk, VA, USA',
      period: 'Oct 2023 - Jan 2024',
      achievements: [
        'Built university threads app supporting 500+ users with role-based access and real-time messaging',
        'Delivered exam management system automating assessments, cutting overhead ~50%',
        'Optimized backend via query refinement and caching, improving response times ~45%',
      ],
    },
  ]

  return (
    <section id="experience" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Experience</h2>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="card border border-white/15"
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex flex-wrap items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-50 mb-1">
                    {exp.title}
                  </h3>
                  <div className="flex items-center gap-2 text-amber-200 font-semibold mb-2">
                    <FaBriefcase />
                    <span>{exp.company}</span>
                  </div>
                </div>
                <div className="text-slate-200/80 text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {exp.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className="flex items-start gap-3 text-slate-200/90">
                    <span className="text-amber-300 mt-1.5">▸</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default Experience

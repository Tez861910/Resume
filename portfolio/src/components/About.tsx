import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">About Me</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-lg text-slate-200/90">
            <p>
              I'm a passionate full-stack developer with 1+ year of professional experience
              specializing in building high-performance web applications and desktop tools.
            </p>
            <p>
              At Printalytix, I've delivered measurable impact by boosting engagement by 35%
              and reducing page load times by 40% through strategic UI/SEO improvements and
              optimization techniques.
            </p>
            <p>
              My expertise spans both modern web technologies (React, Node.js, MySQL) and
              desktop development (WPF/.NET 8, DirectX), allowing me to create comprehensive
              solutions across different platforms.
            </p>
            <p>
              I'm particularly interested in performance optimization, API design, and creating
              intuitive user experiences that drive business results.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '40%', label: 'Faster Load Times' },
              { number: '35%', label: 'Higher Engagement' },
              { number: '30%', label: 'API Performance' },
              { number: '500+', label: 'Users Served' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="card text-center border border-white/15"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-amber-200 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-200/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default About

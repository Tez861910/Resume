import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from 'react-icons/fa'

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-10 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-10 w-[28rem] h-[28rem] bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]" />
      </div>

      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-amber-100 text-sm mb-5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Open to full-time roles & freelance collaborations
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight text-slate-50">
            Tejas Suresh
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl mb-6 text-amber-100">
            Full-Stack Developer crafting performant web and 3D desktop experiences
          </p>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-slate-200/90">
            React / Node / MySQL on the web; WPF / DirectX on desktop. Delivered 40% faster loads
            and 35% higher engagement at Printalytix through performance tuning and UX refinements.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="#contact" className="btn-primary">
              Get In Touch
            </a>
            <a href="#projects" className="btn-secondary">
              View Projects
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[{
              label: 'Performance Wins', value: '40% faster', detail: 'Page loads via bundling & caching'
            }, {
              label: 'Engagement Lift', value: '35% uptick', detail: 'SEO + UX experiments'
            }, {
              label: 'Platforms', value: 'Web & Desktop', detail: 'React/Node + WPF/DirectX'
            }].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="card text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <div className="text-sm uppercase tracking-wide text-amber-200/80 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-amber-100 mb-1">{stat.value}</div>
                <p className="text-sm text-slate-200/80">{stat.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-6 text-3xl text-amber-100">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://bold.pro/my/tejas-s-241209174812/656r"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="Portfolio"
            >
              <FaGlobe />
            </a>
            <a
              href="mailto:tejassuresh98@gmail.com"
              className="hover:text-amber-300 transition-colors"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-8 h-14 border-2 border-amber-200 rounded-full flex justify-center items-start p-2">
          <div className="w-1 h-3 bg-amber-200 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero

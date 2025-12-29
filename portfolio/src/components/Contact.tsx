import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      label: 'Email',
      value: 'tejassureshofficial@gmail.com',
      link: 'mailto:tejassureshofficial@gmail.com',
    },
    {
      icon: <FaPhone className="text-2xl" />,
      label: 'Phone',
      value: '+91-8618904742',
      link: 'tel:+918618904742',
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      label: 'Location',
      value: 'Bengaluru, India',
    },
  ]

  const socialLinks = [
    {
      icon: <FaGithub />,
      label: 'GitHub',
      url: 'https://github.com/',
    },
    {
      icon: <FaLinkedin />,
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/',
    },
  ]

  return (
    <section id="contact" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Get In Touch</h2>

        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xl text-slate-200/90 mb-12">
            I'm always open to discussing new projects, opportunities, or just having a chat.
            Feel free to reach out!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="card text-center border border-white/15"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center text-amber-200 mb-3">
                  {info.icon}
                </div>
                <h3 className="font-semibold text-slate-50 mb-2">{info.label}</h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-slate-200 hover:text-amber-200 transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-slate-200/90">{info.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="card bg-gradient-to-r from-amber-400/80 to-amber-500/80 text-slate-900 text-center border-none shadow-amber-500/30">
            <h3 className="text-2xl font-bold mb-4">Connect With Me</h3>
            <div className="flex justify-center gap-6 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl text-slate-900 hover:text-slate-700 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <a
              href="mailto:tejassureshofficial@gmail.com"
              className="inline-block px-8 py-3 bg-slate-900 text-amber-100 font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Send Me an Email
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Contact

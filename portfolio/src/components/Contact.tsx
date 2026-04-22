import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const Contact = () => {
  const githubUrl = "https://github.com/Tez861910";
  const linkedinUrl = "https://www.linkedin.com/in/tejas-s-57138816a/";
  const emailAddress = "tejassureshofficial@gmail.com";
  const emailUrl = `mailto:${emailAddress}`;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      label: "Primary Channel",
      value: emailAddress,
      link: emailUrl,
      tone: "amber",
    },
    {
      icon: <FaPhone className="text-2xl" />,
      label: "Direct Line",
      value: "+91-8618904742",
      link: "tel:+918618904742",
      tone: "cyan",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      label: "Current Base",
      value: "Bengaluru, India",
      tone: "emerald",
    },
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      label: "GitHub",
      url: githubUrl,
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      url: linkedinUrl,
    },
  ];

  return (
    <section id="contact" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300/70 mb-3">
            Transmission Terminal
          </p>
          <h2 className="section-title mb-4">Get In Touch</h2>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300/80 leading-relaxed">
            Open a direct channel for product work, engineering roles, freelance
            collaborations, or performance-focused builds across web and
            desktop.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/25 backdrop-blur-xl">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.015)_38%,rgba(255,255,255,0)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-cyan-300 to-emerald-300" />

            <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-8 p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                    <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
                    Channel Open
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Response Ready
                  </span>
                </div>

                <div className="space-y-4 text-base sm:text-lg text-slate-200/90 leading-relaxed">
                  <p>
                    I’m always open to discussing new product builds, full-stack
                    engineering roles, desktop tooling, and performance-focused
                    frontend or backend work.
                  </p>
                  <p>
                    If you’re hiring, building something ambitious, or want help
                    improving speed, UX, architecture, or delivery quality, I’d
                    be glad to connect.
                  </p>
                  <p>
                    The fastest way to reach me is by email, but you can also
                    use phone, LinkedIn, or GitHub depending on the context.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-2">
                    Preferred Transmission
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={emailUrl}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 hover:bg-amber-300/20 transition-colors"
                    >
                      <FaEnvelope className="text-sm" />
                      Email First
                    </a>
                    <span className="text-sm text-slate-300/75">
                      Best for roles, project discussions, and detailed
                      inquiries.
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 mb-4">
                    Contact Channels
                  </p>

                  <div className="grid gap-3">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                        initial={{ opacity: 0, x: 18 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-amber-200">
                            {info.icon}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 mb-1">
                              {info.label}
                            </div>

                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-sm sm:text-base font-semibold text-slate-100 hover:text-amber-200 transition-colors break-all"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-sm sm:text-base font-semibold text-slate-100">
                                {info.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-gradient-to-r from-amber-300/90 via-amber-200/85 to-amber-400/90 p-5 text-slate-900 shadow-xl shadow-amber-500/20">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-800/70 mb-2">
                    External Links
                  </p>
                  <h3 className="text-2xl font-bold mb-4">Connect With Me</h3>

                  <div className="flex justify-center sm:justify-start gap-5 mb-6">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-3xl text-slate-900 hover:text-slate-700 transition-colors"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>

                  <a
                    href={emailUrl}
                    className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-amber-100 font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Open Email Channel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;

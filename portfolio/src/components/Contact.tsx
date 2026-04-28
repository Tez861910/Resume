import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { siteConfig } from "../config/site";

const contactInfo = [
  {
    icon: <FaPhone className="text-2xl" />,
    label: "Direct Line",
    value: siteConfig.phone,
    link: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
  },
  {
    icon: <FaMapMarkerAlt className="text-2xl" />,
    label: "Current Base",
    value: siteConfig.location,
  },
  {
    icon: <FaEnvelope className="text-2xl" />,
    label: "Primary Email",
    value: siteConfig.email,
  },
];

const socialLinks = [
  {
    icon: <FaGithub />,
    label: "GitHub",
    url: siteConfig.github,
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    url: siteConfig.linkedin,
  },
];

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 text-center">
          <p className="section-eyebrow">Contact</p>
          <h2 className="section-title">Get in touch</h2>
          <p className="section-copy">
            If you are hiring, building a product, or need help improving an
            existing one, this is the easiest place to reach me.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="app-panel relative">
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.015)_38%,rgba(255,255,255,0)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-cyan-300 to-emerald-300" />

            <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="app-chip-accent">
                    <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.8)]" />
                    One direct contact path
                  </span>
                  <span className="app-chip">Open to roles and projects</span>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-slate-200/90 sm:text-lg">
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
                    I kept the contact flow simple on purpose: one main email
                    action, plus phone and profile links if they are more useful
                    for your context.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/8 p-4 sm:p-5">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Primary contact
                  </p>
                  <div className="flex flex-col items-start gap-4">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="btn-primary w-full sm:w-auto"
                    >
                      <FaEnvelope className="text-sm" />
                      Email Tejas
                    </a>
                    <div>
                      <p className="break-all text-sm font-semibold text-slate-100">
                        {siteConfig.email}
                      </p>
                      <p className="text-sm text-slate-300/75">
                        Best for roles, project discussions, portfolio reviews,
                        and detailed follow-ups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Contact details
                  </p>

                  <div className="grid gap-3">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={info.label}
                        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                        initial={{ opacity: 0, x: 18 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-amber-200">
                            {info.icon}
                          </div>

                          <div className="min-w-0">
                            <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                              {info.label}
                            </div>

                            {info.link ? (
                              <a
                                href={info.link}
                                className="break-all text-sm font-semibold text-slate-100 transition-colors hover:text-amber-200 sm:text-base"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-sm font-semibold text-slate-100 sm:text-base">
                                {info.value}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-5 text-slate-50 shadow-xl shadow-cyan-500/10">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-300/70">
                    Profiles
                  </p>
                  <h3 className="mb-4 text-2xl font-bold text-slate-50">
                    Connect elsewhere
                  </h3>

                  <div className="mb-6 flex justify-center gap-4 sm:justify-start sm:gap-5">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="icon-link text-xl"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300/78">
                    GitHub has code, LinkedIn has the recruiter-facing summary,
                    and email above is the main place to reach me directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

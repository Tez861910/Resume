import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import { siteConfig } from "../config/site";

const contactDetails = [
  {
    label: "Email",
    value: siteConfig.email,
    link: `mailto:${siteConfig.email}`,
  },
  {
    label: "Phone",
    value: siteConfig.phone,
    link: `tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`,
  },
  { label: "Based in", value: siteConfig.location },
];

const reasons = [
  "Full-stack or frontend-heavy product roles where someone owns the details, not just tickets.",
  "Internal tools, operational dashboards, or workflow software that needs clearer UX and structure.",
  "Client or company platforms that need better content architecture and implementation quality.",
  "Work that needs someone moving between interface decisions, code, and product narrative.",
];

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="contact" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <header className="max-w-3xl">
          <p className="section-kicker">
            <span className="font-mono text-faint">05</span> Contact
          </p>
          <h2 className="section-title">
            Open to roles, builds, and the occasional hard problem.
          </h2>
        </header>

        <div className="mt-12 grid gap-10 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7 lg:pr-12">
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-soft">
              If you&apos;re hiring, building something ambitious, or want help
              improving an existing product&apos;s speed, UX, architecture, or
              delivery quality — I&apos;d be glad to connect. I keep the path
              simple: one direct email, plus phone and profiles if they&apos;re
              more useful.
            </p>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group mt-8 inline-flex items-center gap-4 border-b border-rule-strong pb-2 font-display text-2xl text-ink transition-colors hover:text-accent sm:text-3xl"
            >
              {siteConfig.email}
              <FaArrowRight className="text-base transition-transform group-hover:translate-x-1" />
            </a>

            <div className="mt-12">
              <p className="mono-label">Good reasons to reach out</p>
              <ul className="mt-5 divide-y divide-[var(--rule)]">
                {reasons.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-4 py-4 text-[0.95rem] leading-relaxed text-soft"
                  >
                    <span className="num-index pt-0.5 text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12">
            <p className="mono-label">Direct lines</p>
            <dl className="mt-5">
              {contactDetails.map((info, i) => (
                <div
                  key={info.label}
                  className={`py-4 ${
                    i !== contactDetails.length - 1 ? "border-b border-rule" : ""
                  }`}
                >
                  <dt className="mono-label">{info.label}</dt>
                  <dd className="mt-1.5">
                    {info.link ? (
                      <a
                        href={info.link}
                        className="break-all text-[1.05rem] font-medium text-ink transition-colors hover:text-accent"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span className="text-[1.05rem] font-medium text-ink">
                        {info.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex items-center gap-3">
              <span className="mono-label">Profiles</span>
              <span className="h-px flex-1" style={{ background: "var(--rule)" }} />
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FaArrowDown, FaArrowRight, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

const specs = [
  {
    label: "What I build",
    value:
      "Operational dashboards, company platforms, local-first utilities, and desktop workflows.",
  },
  {
    label: "Range",
    value:
      "Comfortable moving between product narrative, interface decisions, and implementation.",
  },
  { label: "Preferred work", value: "Product engineering" },
  { label: "Based in", value: siteConfig.location },
];

const stats = [
  {
    index: "01",
    label: "Current work",
    value: "Product platforms",
    detail: "Operational tools, company platforms, and local-first apps.",
  },
  {
    index: "02",
    label: "Platforms",
    value: "Mobile · Web · Desktop · Cross-platform",
    detail: "React, Next.js, .NET, Flutter, and Rust.",
  },
  {
    index: "03",
    label: "Approach",
    value: "Clarity first",
    detail: "Useful flows, maintainable code, and a stronger handoff.",
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36"
    >
      <div className="section-container !pt-0">
        {/* Masthead meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-faint"
        >
          <span>Portfolio — {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">{siteConfig.location}</span>
          <span className="inline-flex items-center gap-2 text-soft">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Available for work
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-10 sm:mt-14"
        >
          <p className="section-kicker">{siteConfig.role}</p>
          <h1 className="max-w-5xl font-display text-[2.6rem] font-medium leading-[1.02] tracking-[-0.015em] text-ink sm:text-6xl lg:text-[4.6rem]">
            I build product software for mobile, web, and desktop apps, plus cross-platform products —{" "}
            <span className="italic text-soft">
              clear, fast, and ready for real workflows.
            </span>
          </h1>
        </motion.div>

        {/* Lede + actions / spec sheet */}
        <div className="mt-12 grid gap-10 border-t border-rule pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-soft">
              Recent work spans React and Next.js product platforms, a .NET
              Windows app for 3D manufacturing workflows, and a cross-platform
              Flutter + Rust utility suite. I care about practical UX, clear
              architecture, and software that holds up once people actually use
              it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#projects" className="btn-primary">
                <span>View selected work</span>
                <FaArrowRight className="text-[10px]" />
              </a>
              <Link to={siteConfig.resumePagePath} className="btn-secondary">
                <FaArrowDown className="text-[10px]" />
                <span>Download résumé</span>
              </Link>
            </div>

            <div className="mt-9 flex items-center gap-4">
              <span className="mono-label">Find me</span>
              <span className="h-px w-8" style={{ background: "var(--rule)" }} />
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
          </motion.div>

          {/* Spec sheet */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="panel"
          >
            <div className="flex items-center justify-between border-b border-rule px-5 py-3">
              <span className="mono-label">Profile</span>
              <span className="mono-label">/ 04</span>
            </div>
            <dl>
              {specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-4 sm:grid-cols-[9rem_1fr] ${
                    i !== specs.length - 1 ? "border-b border-rule" : ""
                  }`}
                >
                  <dt className="mono-label pt-0.5">{spec.label}</dt>
                  <dd className="text-[0.95rem] leading-relaxed text-ink">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </div>

        {/* Stat strip */}
        <div className="mt-12 grid gap-px overflow-hidden border-y border-rule sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 + index * 0.08 }}
              className="relative py-6 sm:px-6 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-rule"
            >
              <div className="mb-2 flex items-baseline gap-2">
                <span className="num-index text-lg">{stat.index}</span>
                <span className="mono-label">{stat.label}</span>
              </div>
              <p className="font-display text-xl text-ink">{stat.value}</p>
              <p className="mt-1 text-sm leading-relaxed text-faint">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

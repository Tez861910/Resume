import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const currentFocus = [
  "Projects with enough scope to show architecture, workflow, and delivery decisions.",
  "Interfaces that make dense information easier to use, not just prettier to look at.",
  "Systems where frontend, backend, and content structure reinforce one another.",
  "Work that benefits from a practical handoff between product thinking and code.",
];

const recentCoverage = [
  {
    index: "01",
    title: "Operational products",
    detail: "Role-aware dashboards, uploads, protected flows, and admin tooling.",
  },
  {
    index: "02",
    title: "Company platforms",
    detail: "Content-rich sites with stronger information architecture.",
  },
  {
    index: "03",
    title: "Desktop workflows",
    detail: "Windows 3D inspection, manufacturing guidance, and reporting.",
  },
  {
    index: "04",
    title: "Local-first tools",
    detail: "Flutter + Rust utility suite with on-device processing.",
  },
];

const glance = [
  { label: "Day-to-day", value: "Product systems" },
  { label: "Desktop", value: "Windows 3D tooling" },
  { label: "How I work", value: "Practical, thorough" },
  { label: "Right now", value: "Solar · biotech · tooling" },
];

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <header className="max-w-3xl">
          <p className="section-kicker">
            <span className="font-mono text-faint">01</span> Profile
          </p>
          <h2 className="section-title">
            Software that earns its place in real workflows.
          </h2>
        </header>

        <div className="mt-12 grid gap-10 border-t border-rule pt-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7 lg:pr-12">
            <p className="font-display text-2xl leading-snug text-ink sm:text-[1.75rem]">
              I&apos;m a full-stack developer focused on building software that
              feels useful in practice — not just polished in a demo.
            </p>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-soft">
              <p>
                My recent work spans operational web platforms, multi-page
                company sites with real content depth, a Windows manufacturing
                app, and a cross-platform Flutter + Rust utility product.
              </p>
              <p>
                That mix keeps me comfortable across React, Next.js, Node,
                SQL-backed systems, .NET desktop work, and newer cross-platform
                tooling when the product calls for it.
              </p>
              <p>
                I&apos;m especially interested in product clarity, workflow
                design, maintainable architecture, and the parts of engineering
                that make software easier to live with over time.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12">
            <p className="mono-label">Currently leaning into</p>
            <ul className="mt-5 divide-y divide-[var(--rule)]">
              {currentFocus.map((item, i) => (
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

        {/* Recent coverage */}
        <div className="mt-14">
          <div className="flex items-end justify-between border-b border-rule pb-3">
            <p className="mono-label">Recent coverage</p>
            <p className="mono-label">Web · Desktop · Cross-platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {recentCoverage.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="border-b border-rule py-6 sm:[&:nth-child(odd)]:pr-6 lg:px-6 lg:[&:not(:first-child)]:border-l lg:[&:nth-child(odd)]:pr-6"
              >
                <span className="num-index text-base">{item.index}</span>
                <h3 className="mt-3 font-display text-lg text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-faint">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* At a glance */}
          <div className="grid gap-x-8 gap-y-3 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {glance.map((g) => (
              <div
                key={g.label}
                className="flex items-baseline justify-between gap-3 border-b border-rule pb-2"
              >
                <span className="mono-label">{g.label}</span>
                <span className="text-sm font-medium text-ink">{g.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

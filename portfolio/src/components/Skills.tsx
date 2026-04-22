import { Suspense } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaReact, FaNode, FaDatabase, FaCode } from "react-icons/fa";
import { SiTypescript, SiDotnet } from "react-icons/si";
import SkillConstellation from "../three/scenes/SkillConstellation";
import { useRecruiterMode } from "./world/RecruiterModeProvider";

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { isLiteMode } = useRecruiterMode();

  const skillCategories = [
    {
      title: "Languages",
      icon: <FaCode className="text-4xl text-primary-600" />,
      skills: ["JavaScript", "TypeScript", "C#", "Java", "PHP"],
    },
    {
      title: "Frontend",
      icon: <FaReact className="text-4xl text-primary-600" />,
      skills: [
        "React",
        "Vite",
        "Material UI",
        "Tailwind",
        "Framer Motion",
        "PWA",
      ],
    },
    {
      title: "Backend",
      icon: <FaNode className="text-4xl text-primary-600" />,
      skills: ["Node.js", "Express.js", "REST APIs", "Sequelize ORM"],
    },
    {
      title: "Desktop",
      icon: <SiDotnet className="text-4xl text-primary-600" />,
      skills: ["WPF/.NET 8", "DirectX/HelixToolkit", "MVVM", "DI"],
    },
    {
      title: "Databases",
      icon: <FaDatabase className="text-4xl text-primary-600" />,
      skills: ["MySQL", "SQLite", "Query Optimization"],
    },
    {
      title: "Tools",
      icon: <SiTypescript className="text-4xl text-primary-600" />,
      skills: ["Git", "VS Code", "GoDaddy", "App Insights"],
    },
  ];

  return (
    <section id="skills" className="section-container">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Technical Skills</h2>

        {/* ── Skills visual layer: 3D in heavy mode, static mission panel in lite mode ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative w-full rounded-2xl overflow-hidden border border-white/10 mb-4"
        >
          {isLiteMode ? (
            <div className="relative bg-slate-950/55 backdrop-blur-sm p-6 sm:p-8">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_38%,rgba(255,255,255,0)_100%)]" />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-300 via-cyan-300 to-emerald-300" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    Lite Mode
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    Static Skills Panel
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "Frontend Systems",
                      detail: "React, Vite, Tailwind, Framer Motion, PWA",
                    },
                    {
                      title: "Backend Systems",
                      detail:
                        "Node.js, Express.js, REST APIs, Sequelize ORM, MySQL",
                    },
                    {
                      title: "Desktop + 3D",
                      detail: "WPF/.NET 8, DirectX, HelixToolkit, MVVM, DI",
                    },
                  ].map((panel) => (
                    <div
                      key={panel.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
                        Mission Cluster
                      </div>
                      <div className="text-sm font-semibold text-slate-100 mb-2">
                        {panel.title}
                      </div>
                      <p className="text-sm text-slate-300/75 leading-relaxed">
                        {panel.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-[480px]">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-amber-400/50 text-sm tracking-widest uppercase">
                    Loading constellation…
                  </div>
                }
              >
                <SkillConstellation />
              </Suspense>
            </div>
          )}
        </motion.div>

        {/* Subtle interaction hint */}
        <p className="text-center text-xs tracking-[0.18em] text-slate-400/40 uppercase select-none mb-10 pointer-events-none">
          {isLiteMode
            ? "✦ lite mode active · static mission panel enabled"
            : "✦ drag to explore · hover to inspect"}
        </p>

        {/* ── Accessible tag grid (SEO + screen-readers) ───────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              className="card border border-white/15"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <h3 className="text-xl font-bold text-slate-50">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-white/10 text-amber-100 rounded-full text-sm font-medium border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Skills;

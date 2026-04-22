import { Suspense } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaGamepad } from "react-icons/fa";
import HeroScene from "../three/scenes/HeroScene";
import WorldStatusBanner from "./world/WorldStatusBanner";
import { useSharedWorldState } from "../three/world/WorldStateProvider";
import { useGame } from "../three/game/GameContext";

const Hero = () => {
  const githubUrl = "https://github.com/Tez861910";
  const linkedinUrl = "https://www.linkedin.com/in/tejas-s-57138816a/";
  const emailAddress = "tejassureshofficial@gmail.com";
  const emailUrl = `mailto:${emailAddress}`;
  const world = useSharedWorldState();
  const { launch, session } = useGame();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <Suspense fallback={null}>
        <HeroScene world={world} />
      </Suspense>

      {/*
        Radial vignette — darkens the centre where all text lives so it stays
        legible over any particle / glyph combination behind it.
        Pure CSS: zero GPU cost.
      */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 76% 66% at 50% 42%, rgba(2,6,23,0.82) 0%, rgba(2,6,23,0.52) 46%, transparent 72%)",
        }}
      />

      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight text-slate-50"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.95)" }}
          >
            Tejas S
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl mb-6 text-amber-100">
            Full-Stack Developer building performant web platforms and 3D
            desktop systems
          </p>

          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-3 text-slate-200/90">
            Navigate a mission map of shipped products, performance wins, and
            full-stack systems across web and desktop.
          </p>
          <p className="text-base sm:text-lg max-w-3xl mx-auto mb-8 text-slate-300/82">
            React / Node / MySQL on the web; WPF / DirectX on desktop. Delivered
            faster loads, stronger engagement, and production-focused
            engineering outcomes through performance tuning and UX refinement.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a href="#contact" className="btn-primary">
              Get In Touch
            </a>
            <a href="#projects" className="btn-secondary">
              View Projects
            </a>
            <button
              type="button"
              onClick={() => {
                launch("hero");
                setTimeout(
                  () =>
                    document
                      .getElementById("challenge")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  50,
                );
              }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 text-base font-semibold text-cyan-100 transition-all duration-200 hover:bg-cyan-300/18 hover:border-cyan-300/50 hover:text-cyan-50"
            >
              <FaGamepad className="text-sm" />
              <span>
                {session.launchCount > 0
                  ? "Resume Challenge"
                  : "Start Challenge"}
              </span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-10">
            {[
              {
                label: "Performance",
                value: "40% faster",
                detail: "Bundling + caching",
              },
              {
                label: "Engagement",
                value: "35% uplift",
                detail: "SEO + UX",
              },
              {
                label: "Platforms",
                value: "Web + Desktop",
                detail: "React / WPF",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-950/55 px-5 py-4 text-left shadow-lg shadow-black/15 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.18 + index * 0.08 }}
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70 mb-1">
                  {stat.label}
                </div>
                <div className="text-xl font-bold text-amber-100 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-300/75">{stat.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-6 text-3xl text-amber-100">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href={emailUrl}
              className="hover:text-amber-300 transition-colors"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>

          <div className="hidden md:block">
            <WorldStatusBanner />
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-[11px] tracking-[0.16em] text-slate-400/35 uppercase select-none pointer-events-none">
              ✦ navigate the mission map &nbsp;·&nbsp; move cursor
              &nbsp;·&nbsp; W A S D to boost the ship
            </p>

            <p className="text-xs text-slate-300/70 max-w-2xl mx-auto">
              Challenge Mode is part of the portfolio flow — collect core tech
              stack signals, avoid bugs, and return with a stronger systems
              log.
              {session.bestScore !== null && (
                <span className="ml-2 text-amber-200/90">
                  Best score: {session.bestScore}
                </span>
              )}
            </p>
          </div>        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 md:block z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-8 h-14 border-2 border-amber-200 rounded-full flex justify-center items-start p-2">
          <div className="w-1 h-3 bg-amber-200 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

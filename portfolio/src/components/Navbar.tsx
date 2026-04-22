import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaBriefcase, FaBolt } from "react-icons/fa";
import { useGame } from "../three/game/GameContext";
import { useRecruiterMode } from "./world/RecruiterModeProvider";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { launch } = useGame();
  const {
    mode,
    isLiteMode,
    isHeavyMode,
    setMode,
    enableLiteMode,
    enableHeavyMode,
  } = useRecruiterMode();

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Experience", href: "/#experience" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (isHome) {
      const hash = href.replace("/", "");
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const linkClass = `font-medium transition-colors hover:text-amber-200 ${
    isScrolled ? "text-slate-100" : "text-amber-50"
  }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/90 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className={`text-2xl font-bold tracking-tight transition-colors ${
              isScrolled ? "text-amber-200" : "text-amber-300"
            }`}
          >
            TS
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) =>
              isHome ? (
                <a
                  key={item.name}
                  href={item.href.replace("/", "")}
                  onClick={() => handleNavClick(item.href)}
                  className={linkClass}
                >
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.href} className={linkClass}>
                  {item.name}
                </Link>
              ),
            )}

            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button
                onClick={enableLiteMode}
                title="Switch to Lite Mode"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isLiteMode
                    ? "bg-emerald-300/14 text-emerald-100"
                    : "text-slate-300 hover:text-amber-100"
                }`}
                aria-label="Switch to Lite Mode"
                aria-pressed={isLiteMode}
              >
                <FaBriefcase className="text-[11px]" />
                <span>Lite</span>
              </button>

              <button
                onClick={enableHeavyMode}
                title="Switch to Heavy Mode"
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isHeavyMode
                    ? "bg-amber-300/14 text-amber-100"
                    : "text-slate-300 hover:text-amber-100"
                }`}
                aria-label="Switch to Heavy Mode"
                aria-pressed={isHeavyMode}
              >
                <FaBolt className="text-[11px]" />
                <span>Heavy</span>
              </button>
            </div>

            {/* ── Challenge mode trigger ─────────────────────────────── */}
            <button
              onClick={() => launch("navbar")}
              title="Launch Challenge Mode — collect your tech stack!"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200
                         transition-all duration-150 hover:border-amber-400/65 hover:bg-amber-400/22 hover:text-amber-100
                         active:scale-95"
            >
              🚀 <span>Challenge&nbsp;Mode</span>
            </button>
          </div>

          {/* Mobile controls row */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMode(isLiteMode ? "heavy" : "lite")}
              title={
                isLiteMode ? "Switch to Heavy Mode" : "Switch to Lite Mode"
              }
              className={`inline-flex items-center justify-center min-w-[52px] h-8 rounded-full border transition-all duration-150 px-2 text-[11px] font-semibold ${
                isLiteMode
                  ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-100"
                  : "border-amber-300/35 bg-amber-300/12 text-amber-100"
              }`}
              aria-label={
                isLiteMode ? "Switch to Heavy Mode" : "Switch to Lite Mode"
              }
            >
              {isLiteMode ? "Lite" : "Heavy"}
            </button>

            {/* Compact challenge mode button on mobile */}
            <button
              onClick={() => launch("navbar")}
              title="Launch Challenge Mode"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full
                         bg-amber-400/10 border border-amber-400/30 text-amber-200
                         hover:bg-amber-400/22 active:scale-95 transition-all duration-150 text-base"
              aria-label="Launch Challenge Mode"
            >
              🚀
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`text-2xl ${isScrolled ? "text-amber-100" : "text-amber-50"}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-xl">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) =>
              isHome ? (
                <a
                  key={item.name}
                  href={item.href.replace("/", "")}
                  onClick={() => handleNavClick(item.href)}
                  className="block py-2.5 px-3 rounded-lg text-amber-50 hover:text-amber-200 hover:bg-white/5 transition-colors"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-amber-50 hover:text-amber-200 hover:bg-white/5 transition-colors"
                >
                  {item.name}
                </Link>
              ),
            )}

            <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-slate-200">
                  View Mode
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {mode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    enableLiteMode();
                    setIsOpen(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    isLiteMode
                      ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-100"
                      : "border-white/10 bg-slate-900/60 text-slate-200 hover:text-amber-100 hover:border-amber-300/30"
                  }`}
                  aria-label="Switch to Lite Mode"
                >
                  Lite Mode
                </button>

                <button
                  onClick={() => {
                    enableHeavyMode();
                    setIsOpen(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    isHeavyMode
                      ? "border-amber-300/35 bg-amber-300/12 text-amber-100"
                      : "border-white/10 bg-slate-900/60 text-slate-200 hover:text-amber-100 hover:border-amber-300/30"
                  }`}
                  aria-label="Switch to Heavy Mode"
                >
                  Heavy Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useGame, type ChallengeEntryPoint } from "../three/game/GameContext";
import CockpitToggle from "./cockpit/CockpitToggle";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { launch } = useGame();

  const launchChallenge = (entry: ChallengeEntryPoint) => {
    launch(entry);
    setTimeout(() => {
      document
        .getElementById("challenge")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

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

            {/* ── Challenge mode trigger ─────────────────────────────── */}
            <button
              onClick={() => launchChallenge("navbar")}
              title="Launch Challenge Mode — collect your tech stack!"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-200
                         transition-all duration-150 hover:border-amber-400/65 hover:bg-amber-400/22 hover:text-amber-100
                         active:scale-95"
            >
              🚀 <span>Challenge&nbsp;Mode</span>
            </button>

            {/* ── Cockpit mode trigger ──────────────────────────────── */}
            <CockpitToggle variant="desktop" />
          </div>

          {/* Mobile controls row */}
          <div className="md:hidden flex items-center gap-2">
            <CockpitToggle variant="mobile" />
            {/* Compact challenge mode button on mobile */}
            <button
              onClick={() => launchChallenge("navbar")}
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useGame } from "../three/game/GameContext";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { launch } = useGame();

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
          <div className="hidden md:flex items-center space-x-7">
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

            {/* ── Dev Sprint game trigger ─────────────────────────────── */}
            <button
              onClick={launch}
              title="Launch Dev Sprint — collect your tech stack!"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold
                         bg-amber-400/10 border border-amber-400/30 text-amber-200
                         hover:bg-amber-400/22 hover:border-amber-400/65 hover:text-amber-100
                         active:scale-95 transition-all duration-150"
            >
              🚀 <span>Dev&nbsp;Sprint</span>
            </button>
          </div>

          {/* Mobile controls row */}
          <div className="md:hidden flex items-center gap-3">
            {/* Compact game button on mobile */}
            <button
              onClick={launch}
              title="Play Dev Sprint"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full
                         bg-amber-400/10 border border-amber-400/30 text-amber-200
                         hover:bg-amber-400/22 active:scale-95 transition-all duration-150 text-base"
              aria-label="Launch Dev Sprint game"
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

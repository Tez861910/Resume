import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaDownload, FaGamepad, FaTimes } from "react-icons/fa";
import { siteConfig } from "../config/site";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Experience", href: "/#experience" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/#contact" },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);

    if (isHome) {
      const hash = href.replace("/", "");
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
        style={{
          background:
            isScrolled || isOpen ? "var(--surface-soft)" : "transparent",
          borderBottom:
            isScrolled || isOpen ? `1px solid var(--panel-border)` : "none",
          boxShadow: isScrolled ? "var(--shadow-soft)" : "none",
          backdropFilter: isScrolled || isOpen ? "blur(18px)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Link
              to="/"
              className="text-xl font-bold tracking-[0.18em] sm:text-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              TS
            </Link>

            <div className="hidden items-center gap-5 md:flex">
              {navItems.map((item) =>
                isHome ? (
                  <a
                    key={item.name}
                    href={item.href.replace("/", "")}
                    onClick={() => handleNavClick(item.href)}
                    className="text-sm font-medium transition-colors hover:text-amber-300"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium transition-colors hover:text-amber-300"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.name}
                  </Link>
                ),
              )}

              <ThemeToggle />
              <a
                href={siteConfig.resumeDownloadPath}
                download
                className="btn-secondary"
              >
                <FaDownload className="text-xs" />
                Resume
              </a>
              <Link to={siteConfig.cockpit.route} className="btn-ghost">
                <FaGamepad className="text-sm" />
                Cockpit
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-xl"
                style={{
                  background: "var(--surface-soft)",
                  borderColor: "var(--panel-border)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-soft)",
                }}
                aria-label="Toggle menu"
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-slate-950/40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed left-4 right-4 top-20 z-50 rounded-[28px] border p-4 backdrop-blur-xl md:hidden"
            style={{
              background: "var(--surface-strong)",
              borderColor: "var(--panel-border)",
              boxShadow: "var(--panel-shadow)",
            }}
          >
            <div className="space-y-1">
              {navItems.map((item) =>
                isHome ? (
                  <a
                    key={item.name}
                    href={item.href.replace("/", "")}
                    onClick={() => handleNavClick(item.href)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </Link>
                ),
              )}

              <div className="mt-4 grid gap-3">
                <a
                  href={siteConfig.resumeDownloadPath}
                  download
                  className="btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <FaDownload className="text-xs" />
                  Download resume
                </a>
                <Link
                  to={siteConfig.cockpit.route}
                  className="btn-ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <FaGamepad className="text-sm" />
                  Open cockpit
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

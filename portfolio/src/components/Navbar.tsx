import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowDown, FaBars, FaTimes } from "react-icons/fa";
import { siteConfig } from "../config/site";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  isScrolled: boolean;
}

const navItems = [
  { name: "About", href: "/#about", index: "01" },
  { name: "Skills", href: "/#skills", index: "02" },
  { name: "Experience", href: "/#experience", index: "03" },
  { name: "Work", href: "/#projects", index: "04" },
  { name: "Contact", href: "/#contact", index: "05" },
];

export default function Navbar({ isScrolled }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (isHome) {
      const element = document.querySelector(href.replace("/", ""));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
        style={{
          background: isScrolled || isOpen ? "var(--paper)" : "transparent",
          borderBottom: `1px solid ${
            isScrolled || isOpen ? "var(--rule)" : "transparent"
          }`,
        }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
            <Link to="/" className="flex items-baseline gap-2">
              <span
                className="font-display text-xl font-medium tracking-tight"
                style={{ color: "var(--ink)" }}
              >
                Tejas&nbsp;Suresh
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-faint sm:inline">
                / Engineer
              </span>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              <ul className="flex items-center gap-7">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {isHome ? (
                      <a
                        href={item.href.replace("/", "")}
                        onClick={() => handleNavClick(item.href)}
                        className="inline-flex items-baseline gap-1.5 text-[13px] font-medium transition-colors"
                        style={{ color: "var(--ink-2)" }}
                      >
                        <span className="font-mono text-[10px] text-faint">
                          {item.index}
                        </span>
                        <span className="nav-underline">{item.name}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="inline-flex items-baseline gap-1.5 text-[13px] font-medium transition-colors"
                        style={{ color: "var(--ink-2)" }}
                      >
                        <span className="font-mono text-[10px] text-faint">
                          {item.index}
                        </span>
                        <span className="nav-underline">{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              <span className="h-5 w-px" style={{ background: "var(--rule)" }} />
              <ThemeToggle />
              <Link to={siteConfig.resumePagePath} className="btn-secondary">
                <FaArrowDown className="text-[10px]" />
                Résumé
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsOpen((c) => !c)}
                className="inline-flex h-11 w-11 items-center justify-center border"
                style={{
                  borderRadius: "4px",
                  borderColor: "var(--rule-strong)",
                  color: "var(--ink)",
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
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed inset-x-4 top-[4.75rem] z-50 border p-2 md:hidden"
            style={{
              borderRadius: "6px",
              background: "var(--surface)",
              borderColor: "var(--rule)",
            }}
          >
            <div className="divide-y" style={{ borderColor: "var(--rule)" }}>
              {navItems.map((item) =>
                isHome ? (
                  <a
                    key={item.name}
                    href={item.href.replace("/", "")}
                    onClick={() => handleNavClick(item.href)}
                    className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    <span className="font-mono text-[11px] text-faint">
                      {item.index}
                    </span>
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    <span className="font-mono text-[11px] text-faint">
                      {item.index}
                    </span>
                    {item.name}
                  </Link>
                ),
              )}
            </div>
            <Link
              to={siteConfig.resumePagePath}
              className="btn-primary mt-2 w-full"
              onClick={() => setIsOpen(false)}
            >
              <FaArrowDown className="text-[10px]" />
              Download résumé
            </Link>
          </div>
        </>
      )}
    </>
  );
}

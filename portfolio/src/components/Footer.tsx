import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl text-ink">{siteConfig.name}</p>
            <p className="mt-1 text-sm text-soft">{siteConfig.role}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-faint">
              Project case studies and résumé downloads, kept in one place.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="flex items-center gap-3">
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
              <Link to={siteConfig.resumePagePath} className="btn-secondary">
                Résumé
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <span>Built with React · TypeScript · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}

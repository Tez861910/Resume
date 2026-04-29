import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";

export default function Footer() {
  return (
    <footer className="pb-10 pt-8">
      <div className="section-container !py-0">
        <div
          className="flex flex-col gap-6 rounded-[28px] border px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between"
          style={{
            background: "var(--surface-soft)",
            borderColor: "var(--panel-border)",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <div>
            <p className="text-lg font-semibold text-app-primary">
              {siteConfig.name} · {siteConfig.role}
            </p>
            <p className="mt-1 text-sm text-app-muted">
              Detailed website, lean resume, and an optional cockpit route for
              the immersive version of the same story.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Link
              to={siteConfig.resumePagePath}
              className="btn-secondary w-full sm:w-auto"
            >
              Download resume
            </Link>
            <p className="text-xs text-app-muted">
              © {new Date().getFullYear()} {siteConfig.name}. Built with React,
              TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

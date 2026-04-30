import type { ReactNode } from "react";
import {
  FaArrowLeft,
  FaDownload,
  FaFileAlt,
  FaFileCode,
  FaImage,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  RESUME_FORMAT_LABELS,
  type ResumeFormat,
  resumeVariants,
} from "../data/resumes";

const formatIcons: Record<ResumeFormat, ReactNode> = {
  pdf: <FaDownload className="text-xs" />,
  png: <FaImage className="text-xs" />,
  md: <FaFileAlt className="text-xs" />,
  tex: <FaFileCode className="text-xs" />,
};

export default function ResumeDownloads() {
  return (
    <section className="section-container pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Resume downloads</p>
            <h1 className="section-title mb-4">Resume library</h1>
            <p className="section-copy !max-w-none">
              Three resume versions are available here, each with a different
              level of detail and each offered in PDF, PNG image, Markdown, and
              LaTeX.
            </p>
          </div>

          <Link to="/#home" className="btn-ghost w-full sm:w-auto">
            <FaArrowLeft className="text-xs" />
            Back to portfolio
          </Link>
        </div>

        <div className="mb-6 rounded-3xl border border-amber-300/20 bg-amber-300/8 p-5 sm:p-6">
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-amber-200/75">
            At a glance
          </p>
          <p className="text-sm leading-relaxed text-slate-100 sm:text-base">
            The 1-page version is the shortest overview, the 2-page version
            adds broader project coverage, and the 3-page version provides the
            fullest technical context. PNG exports are included for portals that
            only accept image uploads.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {resumeVariants.map((variant) => (
            <article key={variant.id} className="app-panel p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    Resume variant
                  </p>
                  <h2 className="text-2xl font-bold text-app-primary">
                    {variant.label}
                  </h2>
                </div>
                <span className="app-chip-cyan">{variant.id}</span>
              </div>

              <p className="mb-3 text-sm leading-relaxed text-app-secondary">
                {variant.summary}
              </p>
              <p className="mb-5 text-sm leading-relaxed text-app-muted">
                {variant.useCase}
              </p>

              <ul className="mb-6 space-y-2">
                {variant.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-app-secondary"
                  >
                    <span className="mt-1 text-cyan-300">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {(Object.keys(variant.files) as ResumeFormat[]).map((format) => (
                  <a
                    key={format}
                    href={variant.files[format]}
                    download
                    className="btn-secondary justify-center"
                  >
                    {formatIcons[format]}
                    {RESUME_FORMAT_LABELS[format]}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

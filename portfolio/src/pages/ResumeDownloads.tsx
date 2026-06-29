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
  txt: <FaFileAlt className="text-xs" />,
};

export default function ResumeDownloads() {
  return (
    <section className="section-container pt-28 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="section-eyebrow">Downloads</p>
            <h1 className="section-title mb-4">Resume</h1>
            <p className="section-copy !max-w-none">
              Three versions at different levels of detail. Each is available in
              PDF, PNG, Markdown, LaTeX, and plain text.
            </p>
          </div>

          <Link to="/#home" className="btn-ghost w-full sm:w-auto">
            <FaArrowLeft className="text-xs" />
            Back to portfolio
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {resumeVariants.map((variant) => (
            <article key={variant.id} className="app-panel p-6 sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-app-primary">
                  {variant.label}
                </h2>
                <span className="app-chip-cyan">{variant.id}</span>
              </div>

              <p className="mb-5 text-sm leading-relaxed text-app-secondary">
                {variant.summary}
              </p>

              <ul className="mb-6 space-y-2">
                {variant.highlights.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.25rem_1fr] text-sm leading-relaxed text-soft"
                  >
                    <span
                      className="mt-2 h-px w-3"
                      style={{ background: "var(--accent)" }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(variant.files) as ResumeFormat[]).map((format) => (
                  <a
                    key={format}
                    href={variant.files[format]}
                    download
                    className="btn-secondary justify-center text-xs"
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

export type ResumeFormat = "pdf" | "png" | "md" | "tex" | "txt";

export interface ResumeVariant {
  id: "1-page" | "2-page" | "3-page";
  label: string;
  summary: string;
  highlights: string[];
  files: Record<ResumeFormat, string>;
}

export const RESUME_FORMAT_LABELS: Record<ResumeFormat, string> = {
  pdf: "PDF",
  png: "PNG image",
  md: "Markdown",
  tex: "LaTeX",
  txt: "Plain text",
};

export const resumeVariants: ResumeVariant[] = [
  {
    id: "1-page",
    label: "1 page",
    summary: "Concise overview with core stack, experience, and selected projects.",
    highlights: [
      "Condensed summary, stack, experience, and selected projects",
      "Clean one-page layout for email or ATS uploads",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-1-page.pdf",
      png: "/resumes/tejas-suresh-resume-1-page.png",
      md: "/resumes/tejas-suresh-resume-1-page.md",
      tex: "/resumes/tejas-suresh-resume-1-page.tex",
      txt: "/resumes/tejas-suresh-resume-1-page.txt",
    },
  },
  {
    id: "2-page",
    label: "2 pages",
    summary: "Extended project coverage across web, desktop, and cross-platform work.",
    highlights: [
      "More detail on each project and delivery scope",
      "Good match for technical screens or product-focused reviews",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-2-page.pdf",
      png: "/resumes/tejas-suresh-resume-2-page.png",
      md: "/resumes/tejas-suresh-resume-2-page.md",
      tex: "/resumes/tejas-suresh-resume-2-page.tex",
      txt: "/resumes/tejas-suresh-resume-2-page.txt",
    },
  },
  {
    id: "3-page",
    label: "3 pages",
    summary: "Full detail with project narrative, architecture notes, and platform breadth.",
    highlights: [
      "Includes the widest project set and most detailed bullets",
      "Closest companion to the website for deeper technical review",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-3-page.pdf",
      png: "/resumes/tejas-suresh-resume-3-page.png",
      md: "/resumes/tejas-suresh-resume-3-page.md",
      tex: "/resumes/tejas-suresh-resume-3-page.tex",
      txt: "/resumes/tejas-suresh-resume-3-page.txt",
    },
  },
];

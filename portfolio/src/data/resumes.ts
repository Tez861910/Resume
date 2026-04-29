export type ResumeFormat = "pdf" | "md" | "tex";

export interface ResumeVariant {
  id: "1-page" | "2-page" | "3-page";
  label: string;
  summary: string;
  useCase: string;
  highlights: string[];
  files: Record<ResumeFormat, string>;
}

export const RESUME_FORMAT_LABELS: Record<ResumeFormat, string> = {
  pdf: "PDF",
  md: "Markdown",
  tex: "LaTeX",
};

export const resumeVariants: ResumeVariant[] = [
  {
    id: "1-page",
    label: "1 page",
    summary:
      "Fast overview of current role fit, core stack, and the highest-signal shipped work.",
    useCase:
      "Built for recruiter review, application packets, and quick screening passes.",
    highlights: [
      "Condensed summary, stack, experience, and selected projects",
      "Clean one-page snapshot for first-pass review",
      "Most direct version for email attachments and ATS uploads",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-1-page.pdf",
      md: "/resumes/tejas-suresh-resume-1-page.md",
      tex: "/resumes/tejas-suresh-resume-1-page.tex",
    },
  },
  {
    id: "2-page",
    label: "2 pages",
    summary:
      "Balanced version with fuller project coverage across web, desktop, mobile, and company-platform work.",
    useCase:
      "Suited to hiring managers and interviewers who want more project range before a conversation.",
    highlights: [
      "Adds broader project coverage and more detail on delivery scope",
      "Useful for technical screens or teams comparing fit across product types",
      "Still concise enough to share directly as a resume attachment",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-2-page.pdf",
      md: "/resumes/tejas-suresh-resume-2-page.md",
      tex: "/resumes/tejas-suresh-resume-2-page.tex",
    },
  },
  {
    id: "3-page",
    label: "3 pages",
    summary:
      "Detailed version covering the fuller project narrative, architecture focus, and private-product range shown across the portfolio.",
    useCase:
      "For deeper technical review of scope, workflow ownership, and platform breadth.",
    highlights: [
      "Includes the widest project set and the most detailed bullets",
      "Closest companion to the website for deeper technical review",
      "Best fit when a team wants project depth before interviews",
    ],
    files: {
      pdf: "/resumes/tejas-suresh-resume-3-page.pdf",
      md: "/resumes/tejas-suresh-resume-3-page.md",
      tex: "/resumes/tejas-suresh-resume-3-page.tex",
    },
  },
];

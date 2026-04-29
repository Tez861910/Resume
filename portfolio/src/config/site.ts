export const siteConfig = {
  name: "Tejas S",
  role: "Full-Stack Product Developer",
  email: "tejassureshofficial@gmail.com",
  phone: "+91-8618904742",
  location: "Bengaluru, India",
  github: "https://github.com/Tez861910",
  linkedin: "https://www.linkedin.com/in/tejas-s-57138816a/",
  resumePagePath: "/resume",
  cockpit: {
    route: "/cockpit",
    badge: "Detailed immersive route",
    title: "Cockpit dossier",
    description:
      "A separate GPU-heavy mission route that turns the portfolio into a series of briefings, encounters, and recovered drive dossiers.",
    requirements: [
      "Best on a desktop or laptop with GPU acceleration enabled.",
      "Modern WebGPU or WebGL-capable hardware gives the smoothest experience.",
      "Initial loading can take a little time, so the main portfolio stays available as the fast default path.",
    ],
  },
} as const;

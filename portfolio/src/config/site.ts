export const siteConfig = {
  name: "Tejas S",
  role: "Full-Stack Product Developer",
  email: "tejassureshofficial@gmail.com",
  phone: "+91-8618904742",
  location: "Bengaluru, India",
  github: "https://github.com/Tez861910",
  linkedin: "https://www.linkedin.com/in/tejas-s-57138816a/",
  resumeDownloadPath: "/Tejas-Suresh-Resume.txt",
  cockpit: {
    route: "/cockpit",
    badge: "Optional immersive mode",
    title: "Cockpit mission",
    description:
      "A separate GPU-heavy interactive experience for people who want the immersive version of the portfolio.",
    requirements: [
      "Best on a desktop or laptop with GPU acceleration enabled.",
      "Modern WebGPU/WebGL-capable hardware gives the smoothest experience.",
      "Initial loading can take a little time, so the main portfolio stays available as the fast default view.",
    ],
  },
} as const;

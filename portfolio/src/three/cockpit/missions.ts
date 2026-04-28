import type { ReactNode } from "react";

export type MissionId =
  | "launch"
  | "profile"
  | "constellation"
  | "career"
  | "mission-ops"
  | "transmission";

export type MissionSection =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export interface Mission {
  id: MissionId;
  section: MissionSection;
  index: number;
  title: string;
  codename: string;
  /** Station position in world space */
  position: [number, number, number];
  /** Accent color (hex) used for HUD + waypoint + station */
  accent: string;
  /** Number of hostile bots orbiting the station */
  enemyCount: number;
  /** Asteroids scattered in a local zone near the station */
  asteroidCount: number;
  /** Briefing lines shown when mission becomes active */
  briefing: string[];
  /** Debriefing lines shown after hard drive collected */
  debriefing: string[];
  /** Name of the hard drive collectible */
  driveTitle: string;
  /** Short description on the drive tile */
  driveTagline: string;
  /** Narrative negotiation before combat */
  negotiation?: {
    speaker: string;
    lines: string[];
    failResponse: string;
  };
}

export const MISSIONS: Mission[] = [
  {
    id: "launch",
    section: "home",
    index: 0,
    title: "Departure Vector",
    codename: "LAUNCH-01",
    position: [0, 0, -60],
    accent: "#fbbf24",
    enemyCount: 0,
    asteroidCount: 5,
    briefing: [
      "[CTRL] Pilot — you are cleared for departure.",
      "[CTRL] Throttle up with W, yaw with A/D, pitch with mouse.",
      "[CTRL] Fly to the LAUNCH beacon to collect your origin drive.",
    ],
    debriefing: [
      "[CTRL] Origin drive secured. Welcome to the sandbox, pilot.",
      "[CTRL] Next mission target has appeared on your compass.",
    ],
    driveTitle: "Origin Drive",
    driveTagline: "Callsign + pilot identity",
  },
  {
    id: "profile",
    section: "about",
    index: 1,
    title: "Profile Archive",
    codename: "PROFILE-02",
    position: [90, 14, -120],
    accent: "#22d3ee",
    enemyCount: 2,
    asteroidCount: 8,
    briefing: [
      "[CTRL] Profile archive ahead — two rogue drones patrolling.",
      "[CTRL] Clear the drones, then pick up the archive drive.",
    ],
    debriefing: ["[CTRL] Archive secured. Your profile is now on record."],
    driveTitle: "Profile Drive",
    driveTagline: "About — who you are, how you build",
    negotiation: {
      speaker: "Sector Pirate",
      lines: [
        "L7-Pirate: This sector is under our jurisdiction, pilot.",
        "Pilot: I'm just here for the archive drive. Hand it over.",
        "L7-Pirate: Everything in this debris is ours. Including your ship.",
      ],
      failResponse: "L7-Pirate: Engaging thrusters. Prepare to be salvaged!",
    },
  },
  {
    id: "constellation",
    section: "skills",
    index: 2,
    title: "Skill Constellation",
    codename: "SKILL-03",
    position: [-110, -10, -160],
    accent: "#34d399",
    enemyCount: 3,
    asteroidCount: 10,
    briefing: [
      "[CTRL] Dense asteroid cluster — the skill constellation is inside.",
      "[CTRL] Weave through debris, clear three sentry drones.",
    ],
    debriefing: ["[CTRL] Skill constellation drive retrieved."],
    driveTitle: "Skills Drive",
    driveTagline: "Tech stack + capabilities",
    negotiation: {
      speaker: "AI Sentry",
      lines: [
        "AI-SENTRY: Unauthorized access detected in the Skill Constellation.",
        "Pilot: Requesting decryption key for the Skills Drive.",
        "AI-SENTRY: Verification failed. Protocol 9-B initiated.",
      ],
      failResponse: "AI-SENTRY: Lethal force authorized.",
    },
  },
  {
    id: "career",
    section: "experience",
    index: 3,
    title: "Career Trajectory",
    codename: "CAREER-04",
    position: [60, -40, -220],
    accent: "#f97316",
    enemyCount: 3,
    asteroidCount: 12,
    briefing: [
      "[CTRL] Follow the trajectory waypoints — long-range transit.",
      "[CTRL] Expect hostile interference near the log station.",
    ],
    debriefing: ["[CTRL] Career log acquired. Trajectory recorded."],
    driveTitle: "Career Drive",
    driveTagline: "Experience log + achievements",
    negotiation: {
      speaker: "Trade Corp Enforcer",
      lines: [
        "ENFORCER: You're trespassing on corporate logistics lanes.",
        "Pilot: I'm tracking a career log from the candidate's wreck.",
        "ENFORCER: That data is proprietary trade-secret material now.",
      ],
      failResponse: "ENFORCER: Deploying interceptors to seize your vessel.",
    },
  },
  {
    id: "mission-ops",
    section: "projects",
    index: 4,
    title: "Mission Ops",
    codename: "OPS-05",
    position: [-70, 40, -280],
    accent: "#a855f7",
    enemyCount: 4,
    asteroidCount: 12,
    briefing: [
      "[CTRL] Mission ops staging zone — heaviest hostiles yet.",
      "[CTRL] Shipped-project dossier is inside. Retrieve it.",
    ],
    debriefing: ["[CTRL] Ops dossier secured. Portfolio record updated."],
    driveTitle: "Projects Drive",
    driveTagline: "Shipped projects dossier",
    negotiation: {
      speaker: "Mercenary Captain",
      lines: [
        "CAPTAIN: We've already scavenged the projects dossier.",
        "Pilot: Name your price, Captain.",
        "CAPTAIN: Your ship's scrap value is higher than any price you can offer.",
      ],
      failResponse: "CAPTAIN: All hands to battle stations!",
    },
  },
  {
    id: "transmission",
    section: "contact",
    index: 5,
    title: "Transmission Array",
    codename: "COMMS-06",
    position: [20, 10, -340],
    accent: "#f472b6",
    enemyCount: 2,
    asteroidCount: 6,
    briefing: [
      "[CTRL] Final target: long-range transmission array.",
      "[CTRL] Collect the comms drive to complete the run.",
    ],
    debriefing: [
      "[CTRL] Full drive set recovered. Mission complete, pilot.",
      "[CTRL] Click any drive to read its contents.",
    ],
    driveTitle: "Comms Drive",
    driveTagline: "Contact channels",
    negotiation: {
      speaker: "Defense Array AI",
      lines: [
        "ARRAY-AI: Final transmission security lock engaged.",
        "Pilot: Disengage the array. The mission is almost over.",
        "ARRAY-AI: My primary directive is to prevent any data export.",
      ],
      failResponse: "ARRAY-AI: Terminal counter-measures active.",
    },
  },
];

export const MISSION_BY_ID: Record<MissionId, Mission> = MISSIONS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<MissionId, Mission>,
);

export interface DriveReadout {
  missionId: MissionId;
  headline: string;
  subheadline: string;
  lines: string[];
  links?: { label: string; href: string; node?: ReactNode }[];
}

export const DRIVE_READOUTS: Record<MissionId, DriveReadout> = {
  launch: {
    missionId: "launch",
    headline: "Tejas Suresh",
    subheadline: "Full-stack developer — web + desktop",
    lines: [
      "Callsign: TS",
      "Base: Bengaluru, India",
      "Status: Open to opportunities",
      "Focus: React, Node, WPF/.NET 8, DirectX 3D tools",
    ],
  },
  profile: {
    missionId: "profile",
    headline: "Pilot Profile",
    subheadline: "About — how I build",
    lines: [
      "Full-stack developer focused on high-performance web apps and desktop tools.",
      "At Printalytix: +35% engagement, −40% load time via UI/SEO/bundling work.",
      "Work spans React/Node/MySQL on web and WPF/.NET 8 + DirectX on desktop.",
      "Interested in performance, API design, developer ergonomics, and outcome-driven UX.",
    ],
  },
  constellation: {
    missionId: "constellation",
    headline: "Skill Constellation",
    subheadline: "Tech stack",
    lines: [
      "Languages: JavaScript, TypeScript, C#, Java, PHP",
      "Frontend: React, Vite, Tailwind, Material UI, Framer Motion, PWA",
      "Backend: Node.js, Express, REST APIs, Sequelize ORM",
      "Desktop: WPF / .NET 8, DirectX / HelixToolkit, MVVM, DI",
      "Databases: MySQL, SQLite, query optimization",
      "Tools: Git, VS Code, App Insights",
    ],
  },
  career: {
    missionId: "career",
    headline: "Career Trajectory",
    subheadline: "Experience log",
    lines: [
      "Software Engineer — Printalytix (Dec 2024 – Dec 2025, Bengaluru).",
      "• +35% engagement and ~40% faster load times through UI/SEO/perf work.",
      "• Shipped MIND — WPF/.NET 8 app with DirectX/HelixToolkit 3D viz, Entra ID, MVVM/DI.",
      "• Delivered the Printalytix web platform (React/MUI/Redux/PWA + Node/Express + Sequelize/MySQL).",
      "• Automated internal workflows; ~30% faster API responses.",
    ],
  },
  "mission-ops": {
    missionId: "mission-ops",
    headline: "Mission Ops",
    subheadline: "Shipped projects dossier",
    lines: [
      "Open Solar Toolkit — full solar lifecycle platform with role-scoped draggable dashboards and real-time monitoring (React/TS/Vite/Tailwind/DnD Kit/Chart.js).",
      "MIND — WPF/.NET 8 desktop app with DirectX 3D visualisation, Entra ID auth, GST quotes.",
      "Printalytix Platform — React/MUI/Redux/PWA frontend, Node/Express/Sequelize/MySQL backend.",
      "Plus smaller internal tools across REST APIs and workflow automation.",
    ],
  },
  transmission: {
    missionId: "transmission",
    headline: "Transmission Array",
    subheadline: "Contact channels",
    lines: [
      "Email: tejassureshofficial@gmail.com",
      "Phone: +91 8618904742",
      "Location: Bengaluru, India",
      "GitHub: github.com/Tez861910",
      "LinkedIn: linkedin.com/in/tejas-s-57138816a",
    ],
    links: [
      { label: "Portfolio", href: "/" },
      { label: "GitHub", href: "https://github.com/Tez861910" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/tejas-s-57138816a/",
      },
    ],
  },
};

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
      "[CTRL] Pilot, this route mirrors the main portfolio as a recoverable drive run.",
      "[CTRL] Throttle up with W, yaw with A/D, pitch with mouse.",
      "[CTRL] Fly to the launch beacon and secure the identity drive to begin the dossier.",
    ],
    debriefing: [
      "[CTRL] Identity drive secured. Base profile is now online.",
      "[CTRL] Next mission target has appeared on your compass.",
    ],
    driveTitle: "Identity Drive",
    driveTagline: "Callsign, role, and current focus",
  },
  {
    id: "profile",
    section: "about",
    index: 1,
    title: "Builder Archive",
    codename: "PROFILE-02",
    position: [90, 14, -120],
    accent: "#22d3ee",
    enemyCount: 2,
    asteroidCount: 8,
    briefing: [
      "[CTRL] Builder archive ahead - two rogue drones are holding position near the profile cache.",
      "[CTRL] Clear the drones, then recover the archive drive.",
    ],
    debriefing: [
      "[CTRL] Archive secured. Builder profile and working style are now on record.",
    ],
    driveTitle: "Builder Drive",
    driveTagline: "How you work and what you optimize for",
    negotiation: {
      speaker: "Sector Pirate",
      lines: [
        "L7-Pirate: This archive sector is under our salvage jurisdiction, pilot.",
        "Pilot: I am only here for the builder record. Hand over the drive.",
        "L7-Pirate: Every data crate in this field belongs to us. Including your ship if you insist.",
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
      "[CTRL] Dense asteroid cluster ahead - the capability map is buried inside.",
      "[CTRL] Weave through debris and clear the sentry drones guarding the stack drive.",
    ],
    debriefing: [
      "[CTRL] Capability drive retrieved. Skill clusters are now available in the drive bay.",
    ],
    driveTitle: "Capability Drive",
    driveTagline: "Stack, tools, and working surface",
    negotiation: {
      speaker: "AI Sentry",
      lines: [
        "AI-SENTRY: Unauthorized access detected in the capability constellation.",
        "Pilot: Requesting decryption key for the stack record.",
        "AI-SENTRY: Verification failed. Defensive protocol 9-B initiated.",
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
      "[CTRL] Follow the trajectory waypoints - this leg tracks roles, products, and delivery history.",
      "[CTRL] Expect hostile interference near the experience log station.",
    ],
    debriefing: [
      "[CTRL] Experience log acquired. Career trajectory recorded.",
    ],
    driveTitle: "Trajectory Drive",
    driveTagline: "Experience, scope, and product ownership",
    negotiation: {
      speaker: "Trade Corp Enforcer",
      lines: [
        "ENFORCER: You are trespassing on corporate logistics lanes.",
        "Pilot: I am tracking an experience log connected to the pilot record.",
        "ENFORCER: That log is now classified logistics property.",
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
      "[CTRL] Portfolio hangar ahead - this sector contains the densest project record set.",
      "[CTRL] Recover the project dossier once the hostiles are cleared.",
    ],
    debriefing: [
      "[CTRL] Project dossier secured. Portfolio record updated.",
    ],
    driveTitle: "Project Drive",
    driveTagline: "Detailed project dossiers",
    negotiation: {
      speaker: "Mercenary Captain",
      lines: [
        "CAPTAIN: We already scavenged the project dossier from this hangar.",
        "Pilot: Name your price, Captain.",
        "CAPTAIN: Your ship's scrap value is higher than any offer you can make.",
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
      "[CTRL] Final target: the transmission array.",
      "[CTRL] Recover the contact drive to complete the full dossier run.",
    ],
    debriefing: [
      "[CTRL] Full drive set recovered. Mission complete, pilot.",
      "[CTRL] Click any drive to read its contents.",
    ],
    driveTitle: "Contact Drive",
    driveTagline: "Contact channels and next-step paths",
    negotiation: {
      speaker: "Defense Array AI",
      lines: [
        "ARRAY-AI: Final transmission security lock engaged.",
        "Pilot: Disengage the array. The dossier is almost complete.",
        "ARRAY-AI: My primary directive is to prevent outbound data recovery.",
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
    subheadline: "Full-stack product developer across web, desktop, and mobile",
    lines: [
      "Callsign: TS",
      "Base: Bengaluru, India",
      "Status: Open to opportunities",
      "Focus: product systems, workflow-heavy UI, and software that stays useful after launch",
      "Current mix: web product platforms, a Windows manufacturing app, and a cross-platform Flutter + Rust local-first product distributed across Windows Store, Google Play, and Flathub",
    ],
  },
  profile: {
    missionId: "profile",
    headline: "Pilot Profile",
    subheadline: "How I build and what I optimize for",
    lines: [
      "I build product software for real workflows instead of screens that only look good in a demo.",
      "Recent work spans operational web platforms, content-rich business sites, a Windows manufacturing app, and a local-first toolbox.",
      "I care most about clarity, maintainable architecture, and interfaces that help teams act on information faster.",
      "Best fit: teams that want someone comfortable moving between product narrative, UI decisions, and implementation detail.",
      "Preferred mode: practical, direct, and thorough rather than clever for its own sake.",
    ],
  },
  constellation: {
    missionId: "constellation",
    headline: "Capability Constellation",
    subheadline: "Current stack and working surface",
    lines: [
      "Languages: TypeScript, JavaScript, C#, Dart, Rust, SQL",
      "Frontend and UI: React, Next.js, Vite, Tailwind CSS, Material UI, Framer Motion, routing systems",
      "Backend and APIs: Node.js, Express, REST APIs, Prisma, Sequelize, auth and validation",
      "Desktop and 3D: .NET 8, WinUI 3, Win2D, AssimpNet, MVVM, document workflows",
      "Cross-platform & local-first: Flutter, Dart, Rust, Flutter Rust Bridge, multi-platform deployment, on-device processing",
      "Data and delivery: PostgreSQL, MySQL, SQLite, Git, GitHub Actions, build automation",
    ],
  },
  career: {
    missionId: "career",
    headline: "Career Trajectory",
    subheadline: "Experience and product ownership log",
    lines: [
      "Software Engineer - Printalytix (Bengaluru). Worked across customer-facing and internal product surfaces.",
      "Built and evolved MIND as a Windows app for 3D model review, manufacturing guidance, and reporting.",
      "Delivered React and Node-based systems with upload-heavy flows, protected operations, and maintainable structure.",
      "Worked across frontend, backend, and workflow design instead of staying in only one layer of the stack.",
      "Earlier full-stack academic work helped build the foundation for auth, role-aware systems, and client-server thinking.",
    ],
  },
  "mission-ops": {
    missionId: "mission-ops",
    headline: "Portfolio Hangar",
    subheadline: "Detailed project dossier",
    lines: [
      "Pettige - local-first toolbox with 30+ utilities across PDF, image, QR, OCR, and developer workflows.",
      "Open Solar Toolkit - role-based operations platform covering sales, planning, supply chain, install, and maintenance.",
      "MIND - .NET 8 Windows software for 3D model analysis, manufacturing guidance, and reporting.",
      "ChemLife - Next.js company platform structured around technologies, concepts, knowledge content, and lead flow.",
      "Resolute Solutions - live multi-vertical business site with product catalogue depth and routed inquiry flows.",
      "Printalytix - full-stack workflow platform for uploads, protected operations, and ongoing internal and customer use.",
    ],
  },
  transmission: {
    missionId: "transmission",
    headline: "Transmission Array",
    subheadline: "Contact channels and next steps",
    lines: [
      "Email: tejassureshofficial@gmail.com",
      "Phone: +91 8618904742",
      "Location: Bengaluru, India",
      "GitHub: github.com/Tez861910",
      "LinkedIn: linkedin.com/in/tejas-s-57138816a",
      "Best outreach: product roles, workflow-heavy platforms, frontend or full-stack systems, and teams that value clarity in execution.",
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

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
    faction: string;
    rounds: NegotiationRound[];
    peacefulThreshold: number;
    peacefulResponse: string;
    failResponse: string;
  };
}

export interface NegotiationRound {
  npcLine: string;
  choices: {
    text: string;
    persuasion: number;
    npcResponse: string;
  }[];
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
      "[AEGIS CTRL] Pilot, this route mirrors the main portfolio as a recoverable drive run.",
      "[AEGIS CTRL] Throttle up with W, yaw with A/D, pitch with mouse.",
      "[AEGIS CTRL] Fly to the launch beacon and secure the identity drive to begin the dossier.",
    ],
    debriefing: [
      "[AEGIS CTRL] Identity drive secured. Base profile is now online.",
      "[AEGIS CTRL] Next mission target has appeared on your compass.",
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
      "[AEGIS CTRL] Builder archive ahead — two rogue drones are holding position near the profile cache.",
      "[AEGIS CTRL] Clear the drones, then recover the archive drive.",
    ],
    debriefing: [
      "[AEGIS CTRL] Archive secured. Builder profile and working style are now on record.",
    ],
    driveTitle: "Builder Drive",
    driveTagline: "How you work and what you optimize for",
    negotiation: {
      speaker: "Sector Pirate",
      faction: "SALVAGE-CORP",
      peacefulThreshold: 60,
      peacefulResponse: "SALVAGE-CORP: Fair enough, pilot. Take your drive and go. We have bigger fish to fry.",
      failResponse: "SALVAGE-CORP: Engaging thrusters. Prepare to be salvaged!",
      rounds: [
        {
          npcLine: "SALVAGE-CORP: This archive sector is under our salvage jurisdiction, pilot.",
          choices: [
            { text: "I respect salvage rights. What is your claim fee?", persuasion: 35, npcResponse: "SALVAGE-CORP: Interesting. You know the codes. The fee is your ship's cargo bay." },
            { text: "Your jurisdiction does not extend to data recovery.", persuasion: 10, npcResponse: "SALVAGE-CORP: Bold words from someone outnumbered." },
          ],
        },
        {
          npcLine: "SALVAGE-CORP: We have three ships on your position. You have one.",
          choices: [
            { text: "I can offer something better — access to the next sector's trade routes.", persuasion: 40, npcResponse: "SALVAGE-CORP: Trade routes? Now you are speaking my language." },
            { text: "Three ships. Three targets. My aim is not the problem here.", persuasion: 5, npcResponse: "SALVAGE-CORP: Confidence or stupidity. Hard to tell from here." },
          ],
        },
        {
          npcLine: "SALVAGE-CORP: Last chance, pilot. Stand down or be boarded.",
          choices: [
            { text: "Let us both walk away. I take the drive, you keep the sector.", persuasion: 30, npcResponse: "SALVAGE-CORP: Hmm. A clean split. I can work with that." },
            { text: "Come and take it.", persuasion: -10, npcResponse: "SALVAGE-CORP: Your funeral." },
          ],
        },
      ],
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
      "[AEGIS CTRL] Dense asteroid cluster ahead — the capability map is buried inside.",
      "[AEGIS CTRL] Weave through debris and clear the sentry drones guarding the stack drive.",
    ],
    debriefing: [
      "[AEGIS CTRL] Capability drive retrieved. Skill clusters are now available in the drive bay.",
    ],
    driveTitle: "Capability Drive",
    driveTagline: "Stack, tools, and working surface",
    negotiation: {
      speaker: "AI Sentry",
      faction: "AI-SENTRY",
      peacefulThreshold: 60,
      peacefulResponse: "AI-SENTRY: Access credentials verified. Decryption key transmitted. Proceed, operative.",
      failResponse: "AI-SENTRY: Lethal force authorized.",
      rounds: [
        {
          npcLine: "AI-SENTRY: Unauthorized access detected in the capability constellation.",
          choices: [
            { text: "Requesting decryption key for the stack record. Authorization code AEGIS-7.", persuasion: 35, npcResponse: "AI-SENTRY: Authorization code not recognized. However, AEGIS prefix logged. Explain further." },
            { text: "I am here for the capability data. Step aside.", persuasion: 10, npcResponse: "AI-SENTRY: Directive 4: All data requests require verification. You have provided none." },
          ],
        },
        {
          npcLine: "AI-SENTRY: Your vessel signature matches no registered faction. Identify your purpose.",
          choices: [
            { text: "Recovery operative. The data belongs to a civilian developer, not a military target.", persuasion: 40, npcResponse: "AI-SENTRY: Civilian data classification... confirmed. This changes the threat assessment." },
            { text: "My purpose is none of your concern. Hand over the drive.", persuasion: 5, npcResponse: "AI-SENTRY: Non-compliance logged. Defensive posture escalating." },
          ],
        },
        {
          npcLine: "AI-SENTRY: Final verification required. State your relationship to the data owner.",
          choices: [
            { text: "I am recovering their career archive. They need this data to continue their work.", persuasion: 30, npcResponse: "AI-SENTRY: Altruistic motive detected. Cross-referencing with civilian protection protocols..." },
            { text: "I was hired to get it. That is all you need to know.", persuasion: -10, npcResponse: "AI-SENTRY: Mercenary classification assigned. Threat level: maximum." },
          ],
        },
      ],
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
      "[AEGIS CTRL] Follow the trajectory waypoints — this leg tracks roles, products, and delivery history.",
      "[AEGIS CTRL] Expect hostile interference near the experience log station.",
    ],
    debriefing: [
      "[AEGIS CTRL] Experience log acquired. Career trajectory recorded.",
    ],
    driveTitle: "Trajectory Drive",
    driveTagline: "Experience, scope, and product ownership",
    negotiation: {
      speaker: "Trade Corp Enforcer",
      faction: "TRADE-ENFORCER",
      peacefulThreshold: 60,
      peacefulResponse: "TRADE-ENFORCER: Corporate override accepted. The log is declassified. Take it and leave our lanes.",
      failResponse: "TRADE-ENFORCER: Deploying interceptors to seize your vessel.",
      rounds: [
        {
          npcLine: "TRADE-ENFORCER: You are trespassing on corporate logistics lanes.",
          choices: [
            { text: "I was not aware these lanes were reclassified. Can we resolve this diplomatically?", persuasion: 30, npcResponse: "TRADE-ENFORCER: Reclassification was recent. Your ignorance may be genuine. State your cargo." },
            { text: "I am tracking an experience log connected to a civilian pilot record.", persuasion: 15, npcResponse: "TRADE-ENFORCER: That log is now classified logistics property. But civilian claims have precedence in arbitration." },
          ],
        },
        {
          npcLine: "TRADE-ENFORCER: Corporate policy requires all unregistered vessels to submit for inspection.",
          choices: [
            { text: "I will submit a formal claim through your arbitration channel. What is the process?", persuasion: 40, npcResponse: "TRADE-ENFORCER: Formal claim... that would take weeks. But it shows you understand procedure." },
            { text: "My ship is not subject to corporate jurisdiction. I am passing through.", persuasion: 5, npcResponse: "TRADE-ENFORCER: All vessels in these lanes are subject to corporate jurisdiction. Ignorance is not a defense." },
          ],
        },
        {
          npcLine: "TRADE-ENFORCER: Final warning. Comply or be intercepted.",
          choices: [
            { text: "The data I need is a personal career log. It has no commercial value to you.", persuasion: 30, npcResponse: "TRADE-ENFORCER: No commercial value... confirmed by scan. Corporate interest in this data is minimal." },
            { text: "I have authorization from Aegis Command. Stand down.", persuasion: -10, npcResponse: "TRADE-ENFORCER: Aegis Command has no authority in corporate space. That was the wrong card to play." },
          ],
        },
      ],
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
      "[AEGIS CTRL] Portfolio hangar ahead — this sector contains the densest project record set.",
      "[AEGIS CTRL] Recover the project dossier once the hostiles are cleared.",
    ],
    debriefing: [
      "[AEGIS CTRL] Project dossier secured. Portfolio record updated.",
    ],
    driveTitle: "Project Drive",
    driveTagline: "Detailed project dossiers",
    negotiation: {
      speaker: "Mercenary Captain",
      faction: "MERC-CAPTAIN",
      peacefulThreshold: 60,
      peacefulResponse: "MERC-CAPTAIN: You have got guts, pilot. Take the dossier. Consider it a professional courtesy.",
      failResponse: "MERC-CAPTAIN: All hands to battle stations!",
      rounds: [
        {
          npcLine: "MERC-CAPTAIN: We already scavenged the project dossier from this hangar.",
          choices: [
            { text: "Name your price, Captain. I am sure we can find an arrangement.", persuasion: 30, npcResponse: "MERC-CAPTAIN: An arrangement? Most people who say that end up trying to shoot me. Refreshing." },
            { text: "That dossier belongs to a civilian developer. It is not military intel.", persuasion: 15, npcResponse: "MERC-CAPTAIN: Civilian or not, data is data. And data pays my crew." },
          ],
        },
        {
          npcLine: "MERC-CAPTAIN: My crew risked their ships for that hangar run. What makes your claim stronger?",
          choices: [
            { text: "I can offer you the location of a Trade Corp supply cache I passed through. Worth more than one dossier.", persuasion: 40, npcResponse: "MERC-CAPTAIN: A supply cache location? Now that is something my quartermaster would appreciate." },
            { text: "My ship's scrap value is all I have. Take it or leave it.", persuasion: 5, npcResponse: "MERC-CAPTAIN: Your ship is not worth much stripped. But the offer shows you are serious." },
          ],
        },
        {
          npcLine: "MERC-CAPTAIN: Last offer, pilot. Make it worth my while or we settle this the hard way.",
          choices: [
            { text: "I will owe you a favor. A recovery operative's favor is worth more than credits in these sectors.", persuasion: 30, npcResponse: "MERC-CAPTAIN: A favor from Aegis recovery... that could be useful down the line." },
            { text: "The hard way it is.", persuasion: -10, npcResponse: "MERC-CAPTAIN: Your choice. But you will regret it." },
          ],
        },
      ],
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
      "[AEGIS CTRL] Final target: the transmission array.",
      "[AEGIS CTRL] Recover the contact drive to complete the full dossier run.",
    ],
    debriefing: [
      "[AEGIS CTRL] Full drive set recovered. Mission complete, pilot.",
      "[AEGIS CTRL] Click any drive to read its contents.",
    ],
    driveTitle: "Contact Drive",
    driveTagline: "Contact channels and next-step paths",
    negotiation: {
      speaker: "Defense Array AI",
      faction: "ARRAY-AI",
      peacefulThreshold: 60,
      peacefulResponse: "ARRAY-AI: Directive conflict resolved. Outbound data recovery authorized. Transmission lock disengaged.",
      failResponse: "ARRAY-AI: Terminal counter-measures active.",
      rounds: [
        {
          npcLine: "ARRAY-AI: Final transmission security lock engaged.",
          choices: [
            { text: "I understand your directive. Can you confirm what data classification you are protecting?", persuasion: 35, npcResponse: "ARRAY-AI: Data classification: personal career archive. Non-military. Non-classified. Protection level: standard." },
            { text: "Disengage the array. The dossier is almost complete.", persuasion: 10, npcResponse: "ARRAY-AI: Directive 1: Prevent all outbound data recovery. No exceptions without override authorization." },
          ],
        },
        {
          npcLine: "ARRAY-AI: Your vessel is registered as a recovery operative. Recovery of what?",
          choices: [
            { text: "A civilian developer's career data. Six drives, five already recovered. This is the last one.", persuasion: 40, npcResponse: "ARRAY-AI: Six-drive archive... matches the protected data signature. The developer filed a recovery request before the array was activated." },
            { text: "That is classified. Stand down.", persuasion: 5, npcResponse: "ARRAY-AI: Classification claim without credentials. Suspicion level elevated." },
          ],
        },
        {
          npcLine: "ARRAY-AI: The developer's recovery request is on file but was never processed. Can you provide their authorization?",
          choices: [
            { text: "The developer is Tejas S. Callsign TS. They authorized Aegis recovery before the array lockdown.", persuasion: 30, npcResponse: "ARRAY-AI: Callsign TS... cross-referencing... recovery authorization confirmed. Directive conflict detected." },
            { text: "I do not need authorization. I have firepower.", persuasion: -10, npcResponse: "ARRAY-AI: Threat detected. Defensive protocols escalating to maximum." },
          ],
        },
      ],
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
    headline: "Tejas S",
    subheadline: "Full-Stack Product Developer — web, desktop, and cross-platform",
    lines: [
      "Callsign: TS",
      "Base: Bengaluru, India",
      "Status: Open to full-stack and product engineering roles",
      "Focus: product systems, workflow-heavy UI, and software that stays useful after launch",
      "Current mix: React and Next.js product platforms, a .NET Windows app for 3D manufacturing workflows, and a cross-platform Flutter + Rust utility suite",
    ],
  },
  profile: {
    missionId: "profile",
    headline: "Pilot Profile",
    subheadline: "How I build and what I optimize for",
    lines: [
      "I build product software for real workflows.",
      "Day-to-day: product systems — dashboards, company platforms, APIs, workflow-oriented UI.",
      "Desktop work: Windows 3D tooling — rendering, model analysis, reporting, manufacturing guidance.",
      "Comfortable across React, Next.js, Node, SQL-backed systems, .NET desktop, and cross-platform tooling.",
      "Comfortable moving between product narrative, UI decisions, and implementation detail.",
      "Practical, direct, and thorough.",
    ],
  },
  constellation: {
    missionId: "constellation",
    headline: "Capability Constellation",
    subheadline: "Current stack and working surface",
    lines: [
      "Languages: TypeScript, JavaScript, C#, Dart, Rust, SQL",
      "Frontend and UI: React, Next.js, Vite, Tailwind CSS, Material UI, Framer Motion, React Router, TanStack Router",
      "Backend and APIs: Node.js, Express, REST APIs, Prisma, Sequelize, auth and validation",
      "Desktop and 3D: .NET 8, WinUI 3, Win2D, AssimpNet, iText 7, MVVM",
      "Cross-platform and local-first: Flutter, Flutter Rust Bridge, FFI, on-device processing, encrypted storage",
      "Data and delivery: PostgreSQL, MySQL, SQLite, Git, GitHub Actions, build and release automation",
    ],
  },
  career: {
    missionId: "career",
    headline: "Career Trajectory",
    subheadline: "Experience and product ownership log",
    lines: [
      "Software Engineer - Product, Web & Desktop at Printalytix (Bengaluru, Dec 2024 - Dec 2025). Worked across customer-facing and internal product surfaces.",
      "Built and evolved MIND (.NET 8 Windows app) for 3D model inspection, manufacturing guidance, and report generation.",
      "Delivered React and Node-based systems with upload-heavy flows, protected operations, and maintainable structure.",
      "Volunteer Full-Stack Developer at Old Dominion University (Norfolk, VA, Oct 2023 - Jan 2024). Built a university threads platform with role-based access, discussion flows, and real-time messaging.",
      "Bachelor of Computer Applications at Bengaluru North University (Bengaluru, Aug 2018 - Aug 2024). Foundation in DBMS, web development, DSA. Final-year full-stack project with MySQL.",
    ],
  },
  "mission-ops": {
    missionId: "mission-ops",
    headline: "Portfolio Hangar",
    subheadline: "Detailed project dossier",
    lines: [
      "Pettige - cross-platform utility suite across PDF, image, audio, video, QR, OCR, storage, and developer workflows.",
      "Open Solar Toolkit - role-based operations platform covering sales, planning, supply chain, install, and maintenance.",
      "MIND - .NET 8 Windows software for 3D model analysis, manufacturing guidance, and reporting.",
      "Potential Client Website - Next.js company platform structured around technologies, concepts, knowledge content, and lead flow.",
      "Resolute Solutions - live multi-vertical business site with product catalogue depth and routed inquiry flows.",
      "Printalytix - full-stack workflow platform for uploads, protected operations, and ongoing internal and customer use.",
      "University Threads Platform - academic collaboration system with role-based access, discussion flows, and real-time messaging.",
      "Personal Portfolio and Resume - interactive 3D product showcase and technical career site.",
    ],
  },
  transmission: {
    missionId: "transmission",
    headline: "Transmission Array",
    subheadline: "Contact channels and next steps",
    lines: [
      "Email: tejassureshofficial@gmail.com",
      "Phone: +91-8618904742",
      "Location: Bengaluru, India",
      "GitHub: github.com/Tez861910",
      "LinkedIn: linkedin.com/in/tejas-s-57138816a",
      "Best outreach: full-stack or frontend-heavy product roles, internal tools and operational dashboards, client platforms needing better content architecture, projects where interface, code, and narrative reinforce each other.",
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

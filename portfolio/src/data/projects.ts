export interface ProjectMedia {
  type: 'image' | 'video'
  src: string
  alt: string
  caption?: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  description: string
  intent: string
  highlights: string[]
  tech: string[]
  skills: string[]
  media: ProjectMedia[]
  github?: string
  live?: string
  status?: string
}

const projects: Project[] = [
  {
    id: 'pettige',
    title: 'Pettige',
    tagline: 'Local-first toolbox with 30+ utilities powered by Flutter and Rust',
    description:
      'Pettige is a privacy-first utility app where document, image, developer, and storage workflows run on-device instead of through a remote backend. Flutter handles the UI, routing, and app shell, while Rust modules take care of the heavy lifting for PDF operations, image processing, hashing, QR workflows, OCR-related features, and encrypted file storage through Flutter Rust Bridge. The repo also includes packaging and release paths across Android, Windows, iOS, and macOS, so it is structured like a real cross-platform product rather than a one-off demo.',
    intent:
      'I wanted a toolbox that feels genuinely useful without asking people to upload private files to someone else\'s server. That pushed the architecture toward local-first defaults: keep the interface approachable in Flutter, move CPU-heavy work into Rust, and make privacy the normal path instead of a premium feature.',
    highlights: [
      '30+ local utilities spanning PDF, image, QR, OCR, and developer workflows',
      'Flutter + Rust architecture connected through Flutter Rust Bridge',
      'Encrypted on-device storage with SQLite metadata and AES-256-GCM file protection',
      'Modular Rust plugins for PDF, image, storage, audio, common, and developer-tool domains',
      'Cross-platform packaging and release workflows for Android and Windows, with Apple platforms wired in',
    ],
    tech: ['Flutter', 'Dart', 'Rust', 'Flutter Rust Bridge', 'SQLite', 'FFI'],
    skills: ['Local-First Product Design', 'Cross-Platform Development', 'Rust Integration', 'Privacy-Focused Architecture', 'Native Performance', 'Release Engineering'],
    media: [],
    status: 'Shipped',
  },
  {
    id: 'open-solar-toolkit',
    title: 'Open Solar Toolkit',
    tagline: 'Role-based solar operations platform spanning sales, install, and maintenance',
    description:
      'OpenSolar is a modern management platform for solar installation businesses, covering the full lifecycle from sales and project planning to supply chain, installation, maintenance, and role-specific dashboards. The frontend uses React, Vite, Tailwind, TanStack tooling, DnD Kit, and charting/reporting libraries to support a dense operational UI, while the workspace also includes a backend/API sidecar and project-level validation scripts. It reads like an operations product in progress, not just a landing page: multiple business areas, mobile-aware layouts, theming, file validation, and workflow-oriented structure are all already present.',
    intent:
      'The problem here was operational sprawl. A solar business has sales, project planning, supply chain, installation, and maintenance teams all looking at the same work through different lenses, so I approached the product as a set of specialized interfaces inside one system instead of one generic dashboard trying to do everything.',
    highlights: [
      'Lifecycle coverage across administration, project management, sales, supply chain, installation, maintenance, and user dashboards',
      'Role-aware dashboard architecture instead of one shared generic surface',
      'Drag-and-drop interaction support, charting, and responsive layouts for operational workflows',
      'Dark and light theming with mobile-first delivery',
      'Workspace includes backend integration hooks, tests, linting, and file-structure validation',
    ],
    tech: ['React 19', 'Vite', 'TypeScript', 'Tailwind CSS', 'TanStack Router', 'DnD Kit', 'Recharts'],
    skills: ['Dashboard Architecture', 'Workflow Design', 'Responsive UI', 'Product Structuring', 'Data Visualization', 'Operational UX'],
    media: [],
    status: 'In Progress',
  },
  {
    id: 'mind-manufacturing-intelligence',
    title: 'MIND Manufacturing Intelligence',
    tagline: '.NET 8 Windows app for 3D model analysis, manufacturing guidance, and reporting',
    description:
      'MIND is a Windows desktop application for inspecting 3D models and supporting manufacturing decisions. The current codebase targets .NET 8 and WinUI 3, with Win2D, AssimpNet, view models, rendering services, PDF/report generation, ML-related packages, assets, and tests all living in the same workspace. The product goes beyond just displaying a mesh: it is organized around the full workflow of loading models, analysing them, generating manufacturing guidance, capturing visuals, and producing client-facing outputs.',
    intent:
      'This project is about reducing context switching for manufacturing teams. Instead of bouncing between a model viewer, separate analysis tools, and document templates, I wanted one desktop workflow where model review, manufacturing guidance, and report generation all sit together.',
    highlights: [
      'Windows desktop architecture with views, view models, rendering services, and dedicated assets',
      'Custom 3D model loading and rendering pipeline backed by Win2D and AssimpNet',
      'Manufacturing guidance, quotation/reporting, and screenshot/document workflows in the same app',
      'Debugging and diagnostics are treated as first-class concerns in the rendering stack',
      'Project-level docs and tests support ongoing product evolution rather than a throwaway prototype',
    ],
    tech: ['.NET 8', 'C#', 'WinUI 3', 'Win2D', 'AssimpNet', 'iText 7'],
    skills: ['Windows Desktop Development', '3D Rendering Pipelines', 'Manufacturing Workflow Design', 'MVVM', 'Performance Diagnostics', 'Document Generation'],
    media: [],
    status: 'In Progress',
  },
  {
    id: 'chemlife-platform',
    title: 'ChemLife Innovations Platform',
    tagline: 'Next.js 14 platform for biotech content, technology pages, and B2B lead flow',
    description:
      'ChemLife is a content-rich company platform for an animal-nutrition and biotech business. Built on Next.js and Tailwind, it structures the business around technology pages, concept verticals, awards, a knowledge hub, and contact flows, with the core content modeled in TypeScript data files for predictable rendering and maintainability. The repo also shows ongoing product thinking beyond a brochure site: lead-generation flows, downloads, analytics, richer case-study content, and SEO/metadata improvements are all being treated as part of the product surface.',
    intent:
      'I wanted the site to feel credible to technical buyers and business stakeholders at the same time. That meant treating company content like a system: technology data, concept offerings, knowledge content, awards, and contact flows all needed to be structured clearly enough to grow without becoming hard to maintain.',
    highlights: [
      'Next.js App Router structure for content-heavy company and product storytelling',
      'Technology, concept, knowledge, and awards content modeled in reusable TypeScript data files',
      'Clear room for lead-generation, downloads, analytics, and richer evidence-based content flows',
      'Static-friendly structure with a strong separation between content modeling and page surfaces',
      'Balances marketing presentation with technical depth for B2B audiences',
    ],
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'App Router', 'Server Routes'],
    skills: ['Content Architecture', 'B2B Product Messaging', 'Static Site Structuring', 'Technical Storytelling', 'Information Design', 'SEO-Aware Development'],
    media: [],
    status: 'In Progress',
  },
  {
    id: 'resolute-solutions',
    title: 'Resolute Solutions Site',
    tagline: 'Multi-vertical business site with product catalogues and routed inquiry flows',
    description:
      'The Resolute Solutions site presents four business verticals inside one shared web platform: ingredient sourcing, risk management, project management, and housekeeping products. It uses React, Vite, Tailwind, routed pages, themed visual treatment per vertical, EmailJS-based inquiry handling, and PWA support to make the site feel more like a polished business platform than a static brochure. The housekeeping side also goes deeper into structured product content, which gives the build more complexity than a typical marketing site.',
    intent:
      'The interesting challenge here was variety. Each business vertical needed enough visual identity and content depth to feel like its own destination, but the whole site still had to behave like one coherent product with shared navigation, inquiry handling, and maintainable components.',
    highlights: [
      'Four business verticals presented inside one routed React site',
      'Per-vertical theming and content structure without splitting into separate codebases',
      'Inquiry and contact flows wired through EmailJS',
      'PWA support and production-oriented build scripts',
      'Structured product content for the housekeeping catalogue, not just generic service copy',
    ],
    tech: ['React 19', 'Vite', 'TypeScript', 'Tailwind CSS', 'EmailJS', 'PWA'],
    skills: ['Multi-Brand UI Systems', 'Component Reuse', 'B2B Site Architecture', 'Inquiry Flow Design', 'Responsive Design', 'Content Structuring'],
    media: [],
    live: 'https://resolutesolutions.co.in',
    status: 'Live',
  },
  {
    id: 'printalytix-platform',
    title: 'Printalytix Platform',
    tagline: 'Full-stack workflow platform for customer intake, uploads, and protected operations',
    description:
      'Printalytix is a multi-workspace product with a React frontend, a Node/Express backend, and a Prisma-backed data layer. The frontend has been modernized around Vite and uses Redux, forms, tables, upload flows, and a broader component stack suited to customer-facing operations, while the backend layers in validation, rate limiting, sanitization, logging, file handling, and seeded access roles. The result is a practical product surface for intake, protected workflows, and ongoing operations rather than just a marketing front end.',
    intent:
      'This work needed to support real transactions and internal follow-through, not just presentation. I treated uploads, validation, role control, and maintainability as core product requirements, because those are the parts that start to matter once a customer-facing system becomes part of daily operations.',
    highlights: [
      'Frontend workspace migrated onto Vite while keeping a broader React product surface intact',
      'Node/Express backend with Prisma, validation, security middleware, logging, and role seeding',
      'Upload-oriented flows and operational APIs designed for ongoing customer and internal use',
      'Separate frontend/backend workspaces support clear iteration across product layers',
      'Local database and dev orchestration scripts make the project practical to run and extend',
    ],
    tech: ['React 19', 'Vite', 'Redux Toolkit', 'Node.js', 'Express', 'Prisma', 'PostgreSQL'],
    skills: ['Full-Stack Product Development', 'Upload Workflows', 'API Design', 'Operational Security', 'State Management', 'System Modernization'],
    media: [],
    status: 'Shipped',
  },
  {
    id: 'university-threads',
    title: 'University Threads Platform',
    tagline: 'Role-aware discussion platform built with a React client and Express backend',
    description:
      'This was an earlier multi-user platform built as a split client/server application, with React and Material UI on the frontend and an Express-based backend using Sequelize plus SQL-oriented dependencies. The repo includes authentication, validation, logging, rate limiting, cookie/session handling, file upload support, and database integration across MySQL/MSSQL-related tooling. It is older than the private product work above, but it still matters because it shows the foundation of my full-stack thinking around roles, protected flows, and application structure.',
    intent:
      'The goal was to build a discussion environment where different user types could share one system without sharing the same permissions or experience. That made it a good training ground for the kind of auth, validation, and multi-user application decisions that still show up in my later work.',
    highlights: [
      'Separate client and backend workspaces for a multi-user discussion product',
      'React + Material UI frontend with form-heavy and authenticated flows',
      'Express backend with auth, validation, rate limiting, logging, and Sequelize-based data access',
      'Cookie/session and token-oriented dependencies reflect real multi-user access control concerns',
      'Good early example of structured full-stack application design rather than a static student project',
    ],
    tech: ['React', 'Material UI', 'Express', 'Sequelize', 'MySQL', 'JWT', 'REST API'],
    skills: ['Authentication & Authorization', 'Full-Stack Development', 'Validation', 'Role-Aware UX', 'API Structuring', 'Multi-User Systems'],
    media: [],
    status: 'Shipped',
  },
  {
    id: 'portfolio-site',
    title: 'Personal Portfolio & Resume',
    tagline: 'Fast case-study portfolio with an optional immersive cockpit route',
    description:
      'This site is the lightweight, recruiter-friendly front door for my work. It is built with React, TypeScript, Vite, Tailwind, motion-driven sections, routed project case studies, and a separate heavier cockpit route for people who want the interactive version. The goal was to make the main experience quick to browse while still leaving room for deeper project context.',
    intent:
      'I wanted the portfolio to feel like a clear handoff instead of a flashy obstacle course. The main site stays fast and readable, while the project pages and optional cockpit route let me show more depth without forcing every visitor through the same path.',
    highlights: [
      'Project case-study pages with deeper context, stack details, and intent',
      'Fast main route with a separate optional immersive mode',
      'Responsive design built to be easy to scan on first pass',
      'React Router SPA setup with GitHub Pages support',
      'Resume download and portfolio content kept in the same repo',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router', 'GitHub Pages'],
    skills: ['Frontend Development', 'Information Design', 'Responsive UI', 'Motion Design', 'Content Structuring', 'Personal Branding'],
    media: [],
    github: 'https://github.com/Tez861910/Resume',
    live: 'https://tejassureshofficial.in',
    status: 'Live',
  },
]

export default projects

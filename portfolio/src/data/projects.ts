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
  category?: string
  timeline?: string
  role?: string
  problem?: string
  responsibilities?: string[]
  outcomes?: string[]
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
    tagline:
      'Cross-platform local-first utility suite for PDF, image, audio, video, QR, OCR, storage, and developer workflows',
    category: 'Cross-platform utility application',
    timeline: '2025 - present',
    role: 'Product developer',
    description:
      'Pettige is a privacy-first cross-platform utility suite where document, image, audio, video, QR, OCR, developer, and storage workflows run on-device instead of through a remote backend. Flutter handles the app shell, routing, and studio-style workspaces, while Rust handles heavy processing through Flutter Rust Bridge for PDF operations, image transforms, audio effects, video workflows, hashing, OCR, and encrypted file storage. The platform matrix is broader than a typical mobile app: Android is a primary target, Windows is release-ready, iOS and macOS are build-ready, and Linux support is already wired with experimental desktop paths.',
    intent:
      'I wanted a toolbox that feels genuinely useful without asking people to upload private files to someone else\'s server. That pushed the architecture toward local-first defaults: keep the interface approachable in Flutter, move CPU-heavy work into Rust, and make privacy the normal path instead of a premium feature.',
    problem:
      'Most utility apps solve convenience by shipping user files to the cloud, which is the exact tradeoff I wanted to avoid. Pettige is built around the opposite idea: keep the product broad enough to replace a collection of one-off tools, but keep the execution local so private files stay on the device.',
    responsibilities: [
      'Designed the split architecture between Flutter screens and a Rust core connected through Flutter Rust Bridge.',
      'Built the product around dedicated PDF Studio, Image Studio, Audio Studio, Video Studio, and Dev Workbench flows so a large tool surface stays usable.',
      'Worked on the local storage model, where SQLite metadata, resumable uploads, AES-256-GCM file protection, and wrapped keys support privacy-focused workflows.',
      'Kept release packaging and platform-specific OCR paths in scope so the app behaves like a real cross-platform product across Android, Windows, Linux, iOS, and macOS.',
    ],
    outcomes: [
      'The app now covers document, media, QR, storage, and developer workflows inside one local-first product instead of a narrow single-purpose utility.',
      'Studio-style navigation keeps a broad tool surface usable instead of turning into one crowded catch-all screen.',
      'Heavy work stays in Rust, which keeps PDF, image, audio, video, encryption, and storage operations close to native performance.',
      'The product story is stronger because privacy is embedded in the architecture, not bolted on as a marketing claim.',
    ],
    highlights: [
      '30+ local tools spanning PDF, image, audio, video, QR, OCR, storage, and developer workflows',
      'Dedicated PDF Studio, Image Studio, Audio Studio, Video Studio, and Dev Workbench flows',
      'Flutter + Rust architecture connected through Flutter Rust Bridge',
      'Encrypted on-device storage with SQLite metadata, resumable uploads, and AES-256-GCM file protection',
      'Platform-aware OCR paths across desktop and mobile targets',
      'Cross-platform packaging and release workflows for Windows, Linux, Android, iOS, and macOS',
    ],
    tech: ['Flutter', 'Dart', 'Rust', 'Flutter Rust Bridge', 'SQLite', 'FFmpeg'],
    skills: ['Local-First Product Design', 'Cross-Platform Development', 'Rust Integration', 'Privacy-Focused Architecture', 'Native Performance', 'Release Engineering'],
    media: [],
    status: 'Shipped',
  },
  {
    id: 'open-solar-toolkit',
    title: 'Open Solar Toolkit',
    tagline: 'Role-based solar operations platform spanning sales, install, and maintenance',
    category: 'Operations platform',
    timeline: '2025 - present',
    role: 'Frontend and product systems developer',
    description:
      'OpenSolar is a modern management platform for solar installation businesses, covering the full lifecycle from sales and project planning to supply chain, installation, maintenance, and role-specific dashboards. The frontend uses React, Vite, Tailwind, TanStack tooling, DnD Kit, and charting/reporting libraries to support a dense operational UI, while the workspace also includes a backend/API sidecar and project-level validation scripts. It reads like an operations product in progress, not just a landing page: multiple business areas, mobile-aware layouts, theming, file validation, and workflow-oriented structure are all already present.',
    intent:
      'The problem here was operational sprawl. A solar business has sales, project planning, supply chain, installation, and maintenance teams all looking at the same work through different lenses, so I approached the product as a set of specialized interfaces inside one system instead of one generic dashboard trying to do everything.',
    problem:
      'Solar workflows usually fragment fast: CRM-style work for sales, planning views for project teams, inventory concerns for supply chain, and execution tracking for installation and maintenance. The goal was to build one product that respects those differences without forcing every team into the same dashboard.',
    responsibilities: [
      'Mapped the platform around operational areas instead of a flat feature list, so the product reads like a real business system.',
      'Worked on the dashboard-heavy React surface using Vite, Tailwind, TanStack tooling, DnD Kit, and reporting/chart components.',
      'Kept responsiveness, theme support, validation scripts, and product structure in scope so the interface can scale with added workflows.',
      'Treated the repo as an evolving product workspace rather than a static front end, with backend hooks, linting, and tests already present.',
    ],
    outcomes: [
      'The platform already covers seven meaningful workstreams, which makes it stronger as a portfolio piece than a generic admin template.',
      'Its structure is clear enough to keep expanding into operations logic, reporting, and API-backed workflows without rewriting the whole UI.',
      'It demonstrates how I think about multi-role products: shared system, specialized surfaces, consistent interaction model.',
    ],
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
    category: 'Desktop manufacturing software',
    timeline: '2025 - present',
    role: 'Desktop product developer',
    description:
      'MIND is a Windows desktop application for inspecting 3D models and supporting manufacturing decisions. The current codebase targets .NET 8 and WinUI 3, with Win2D, AssimpNet, view models, rendering services, PDF/report generation, ML-related packages, assets, and tests all living in the same workspace. The product goes beyond just displaying a mesh: it is organized around the full workflow of loading models, analysing them, generating manufacturing guidance, capturing visuals, and producing client-facing outputs.',
    intent:
      'This project is about reducing context switching for manufacturing teams. Instead of bouncing between a model viewer, separate analysis tools, and document templates, I wanted one desktop workflow where model review, manufacturing guidance, and report generation all sit together.',
    problem:
      'Manufacturing review work tends to sprawl across separate tools: one app to open the model, another to inspect issues, and more manual work to explain pricing or process recommendations. MIND is aimed at collapsing those steps into one Windows workflow that is easier to operate and easier to maintain.',
    responsibilities: [
      'Worked across the Windows product structure rather than a single screen: views, view models, rendering services, assets, and reporting workflows all matter here.',
      'Focused on the 3D and manufacturing flow as a product problem, not just a rendering exercise, so analysis, guidance, screenshots, and outputs sit in the same system.',
      'Kept diagnostics and debuggability central in the rendering stack because graphics-heavy desktop tools need strong observability to stay maintainable.',
      'Treated the desktop app like a real product surface with supporting documentation, tests, and layered services.',
    ],
    outcomes: [
      'The repo now communicates a full product shape: input, inspection, guidance, export, and reporting all live in one application.',
      'It expands my portfolio beyond web work into a higher-complexity desktop problem space with 3D rendering, Windows UI, and structured outputs.',
      'It shows that I can work on workflow-heavy internal software where correctness and operator clarity matter as much as polish.',
    ],
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
    id: 'potential-client-website',
    title: 'Potential Client Website',
    tagline: 'Next.js 14 platform for biotech content, technology pages, and B2B lead flow',
    category: 'Content-rich company platform',
    timeline: '2025',
    role: 'Web platform developer',
    description:
      'Potential Client Website is a content-rich company platform for an animal-nutrition and biotech business. Built on Next.js and Tailwind, it structures the business around technology pages, concept verticals, awards, a knowledge hub, and contact flows, with the core content modeled in TypeScript data files for predictable rendering and maintainability. The repo also shows ongoing product thinking beyond a brochure site: lead-generation flows, downloads, analytics, richer case-study content, and SEO/metadata improvements are all being treated as part of the product surface.',
    intent:
      'I wanted the site to feel credible to technical buyers and business stakeholders at the same time. That meant treating company content like a system: technology data, concept offerings, knowledge content, awards, and contact flows all needed to be structured clearly enough to grow without becoming hard to maintain.',
    problem:
      'A biotech or animal-nutrition company site has to do more than look polished. It has to explain technology credibly, support future lead-generation flows, hold educational content, and still remain editable enough for the business to keep extending it. That made content architecture just as important as page design.',
    responsibilities: [
      'Structured the product around reusable data models for technologies, concepts, awards, knowledge content, and company information.',
      'Used the Next.js App Router setup to support a content-heavy site that can still grow into richer metadata, downloads, and lead-gen flows.',
      'Treated the repo backlog itself as part of the product thinking, with clear follow-on paths for analytics, gated resources, case studies, and deeper SEO support.',
      'Balanced clean editorial presentation with enough information density for technical and B2B audiences.',
    ],
    outcomes: [
      'The site has a maintainable information model instead of hard-coded content scattered across unrelated pages.',
      'It demonstrates that I can turn a company website into a real product surface with evidence, education, and inquiry flow in mind.',
      'It is also a good example of writing and structuring technical content for business readers without flattening everything into generic marketing copy.',
    ],
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
    category: 'Multi-vertical business website',
    timeline: '2025',
    role: 'Frontend developer and content systems builder',
    description:
      'The Resolute Solutions site presents four business verticals inside one shared web platform: ingredient sourcing, risk management, project management, and housekeeping products. It uses React, Vite, Tailwind, routed pages, themed visual treatment per vertical, EmailJS-based inquiry handling, and PWA support to make the site feel more like a polished business platform than a static brochure. The housekeeping side also goes deeper into structured product content, which gives the build more complexity than a typical marketing site.',
    intent:
      'The interesting challenge here was variety. Each business vertical needed enough visual identity and content depth to feel like its own destination, but the whole site still had to behave like one coherent product with shared navigation, inquiry handling, and maintainable components.',
    problem:
      'Resolute Solutions spans multiple business lines that do not naturally read like one simple landing page. The challenge was to build a shared system where each vertical could feel distinct in tone and content depth, while still behaving like one company presence with shared inquiry and navigation patterns.',
    responsibilities: [
      'Built the site around multiple verticals rather than one repeating service template, which meant handling content structure and visual differentiation together.',
      'Used React, Vite, Tailwind, routed pages, and EmailJS-based forms to keep the product maintainable while still feeling custom per vertical.',
      'Extended the housekeeping side beyond generic copy into a more catalogue-like product surface with structured entries.',
      'Kept production concerns in scope through PWA support, build scripts, and a live deployment target.',
    ],
    outcomes: [
      'The site works as one coherent business platform while still letting each vertical have its own identity.',
      'It demonstrates multi-theme component reuse and content architecture in a real client-facing context.',
      'Because the site is live, it also serves as proof that I can carry a project through to production delivery rather than stopping at a local prototype.',
    ],
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
    category: 'Full-stack product platform',
    timeline: '2024 - 2025',
    role: 'Full-stack product developer',
    description:
      'Printalytix is a multi-workspace product with a React frontend, a Node/Express backend, and a Prisma-backed data layer. The frontend has been modernized around Vite and uses Redux, forms, tables, upload flows, and a broader component stack suited to customer-facing operations, while the backend layers in validation, rate limiting, sanitization, logging, file handling, and seeded access roles. The result is a practical product surface for intake, protected workflows, and ongoing operations rather than just a marketing front end.',
    intent:
      'This work needed to support real transactions and internal follow-through, not just presentation. I treated uploads, validation, role control, and maintainability as core product requirements, because those are the parts that start to matter once a customer-facing system becomes part of daily operations.',
    problem:
      'Customer-facing workflow tools stop being simple as soon as users need uploads, protected access, and reliable follow-through on the backend. Printalytix needed a product surface that could support that operational reality instead of acting like a thin brochure over a messy process.',
    responsibilities: [
      'Worked across the React frontend and Express backend layers so uploads, validation, state, and access rules behave like one product.',
      'Helped move the frontend onto a Vite-based workflow while preserving a richer component and form surface.',
      'Kept backend robustness visible through Prisma, security middleware, logging, seeded roles, and operational scripts.',
      'Treated internal and customer-facing needs as part of the same system rather than separate disconnected tools.',
    ],
    outcomes: [
      'The product now reads as a maintainable full-stack system with clear boundaries between frontend, backend, and data concerns.',
      'It demonstrates the kind of work I enjoy most: practical software that supports real operational tasks rather than isolated flashy screens.',
      'It also shows end-to-end ownership, from UI structure to backend safety and development workflow.',
    ],
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
    category: 'Academic collaboration system',
    timeline: '2023 - 2024',
    role: 'Full-stack developer',
    description:
      'This was an earlier multi-user platform built as a split client/server application, with React and Material UI on the frontend and an Express-based backend using Sequelize plus SQL-oriented dependencies. The repo includes authentication, validation, logging, rate limiting, cookie/session handling, file upload support, and database integration across MySQL/MSSQL-related tooling. It is older than the more recent product platforms above, but it still matters because it shows the foundation of my full-stack thinking around roles, protected flows, and application structure.',
    intent:
      'The goal was to build a discussion environment where different user types could share one system without sharing the same permissions or experience. That made it a good training ground for the kind of auth, validation, and multi-user application decisions that still show up in my later work.',
    problem:
      'The challenge here was not just rendering threads. It was designing a multi-user environment where access rules, validation, database interactions, and client behaviour all reinforce one another instead of working at cross purposes.',
    responsibilities: [
      'Worked on the client/server split using React on the front end and Express plus Sequelize-backed data access on the backend.',
      'Handled the kind of early full-stack concerns that still matter now: auth, validation, rate limiting, logging, and role-aware behaviour.',
      'Structured the app as a real multi-user system rather than a single-user CRUD exercise.',
      'Used the project to build a stronger foundation in how interfaces and backend rules need to align in shared environments.',
    ],
    outcomes: [
      'Even as an earlier project, it still shows solid full-stack instincts around multi-user software and protected routes.',
      'It adds range to the portfolio by showing how my later product work grew out of structured client/server thinking.',
      'It remains useful here because it demonstrates foundation, not just polish.',
    ],
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
    category: 'Personal product and technical showcase',
    timeline: '2025',
    role: 'Designer, writer, and frontend developer',
    description:
      'This site is the main front door for my work. It is built with React, TypeScript, Vite, Tailwind, motion-driven sections, routed project case studies, and a separate heavier cockpit route that reinterprets the same portfolio through briefings and recovered-drive UI. The goal was to keep the main experience quick to browse while still leaving room for deeper project context.',
    intent:
      'I wanted the portfolio to feel clear and considered instead of theatrical. The main site stays fast and readable, while the project pages and cockpit route add depth without hiding the work behind spectacle.',
    problem:
      'A portfolio has to serve different reading modes: a quick pass through the main story and a deeper technical review of project decisions. I built this site to support both without making either path feel compromised.',
    responsibilities: [
      'Designed the fast main narrative so visitors can understand the work quickly without being pushed through an overly cinematic experience.',
      'Built the project data model and routed detail pages so the site can hold more context than a one-page summary allows.',
      'Added the cockpit route as an alternate interactive layer built from the same project data and story.',
      'Kept the repo tied to the resume workflow so the web portfolio and lean PDF stay aligned.',
    ],
    outcomes: [
      'The site can now act as the detailed companion to the resume instead of duplicating it.',
      'It gives me room to explain product work with more context and specificity than a bullet-only resume can.',
      'It also serves as a live example of how I think about narrative, information density, and frontend delivery.',
    ],
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

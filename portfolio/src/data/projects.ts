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
  liveLabel?: string
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
      'Pettige is a privacy-first cross-platform utility suite. Document, image, audio, video, QR, OCR, developer, and storage workflows all run on-device — no remote backend. Flutter handles the app shell, routing, and studio-style workspaces. Rust handles PDF operations, image transforms, audio effects, video workflows, hashing, OCR, and encrypted file storage through Flutter Rust Bridge. Android, Windows, iOS, macOS, and Linux are all targeted.',
    intent:
      'I wanted a toolbox that does not need to upload private files to someone else\'s server. Local-first by default: keep the interface approachable in Flutter, move CPU-heavy work into Rust, and make privacy the standard path.',
    problem:
      'Most utility apps solve convenience by shipping user files to the cloud, which is the exact tradeoff I wanted to avoid. Pettige is built around the opposite idea: keep the product broad enough to replace a collection of one-off tools, but keep the execution local so private files stay on the device.',
    responsibilities: [
      'Designed the split architecture between Flutter screens and a Rust core connected through Flutter Rust Bridge.',
      'Built the product around dedicated PDF Studio, Image Studio, Audio Studio, Video Studio, and Dev Workbench flows so a large tool surface stays usable.',
      'Worked on the local storage model, where SQLite metadata, resumable uploads, AES-256-GCM file protection, and wrapped keys support privacy-focused workflows.',
      'Kept release packaging and platform-specific OCR paths in scope so the app behaves like a real cross-platform product across Android, Windows, Linux, iOS, and macOS.',
    ],
    outcomes: [
      'Covers document, media, QR, storage, and developer workflows in one local-first product shell.',
      'Studio-style navigation keeps a broad tool surface usable across many task types.',
      'Rust handles PDF, image, audio, video, encryption, and storage operations at native performance.',
      'Privacy is built into the architecture, not layered on as a claim.',
    ],
    highlights: [
      '30+ local tools spanning PDF, image, audio, video, QR, OCR, storage, and developer workflows',
      'Dedicated PDF Studio, Image Studio, Audio Studio, Video Studio, and Dev Workbench flows',
      'Flutter + Rust architecture connected through Flutter Rust Bridge',
      'Encrypted on-device storage with SQLite metadata, resumable uploads, and AES-256-GCM file protection',
      'Platform-aware OCR paths across desktop and cross-platform targets',
      'Cross-platform packaging and release workflows for Windows, Linux, Android, iOS, and macOS',
    ],
    tech: ['Flutter', 'Dart', 'Rust', 'Flutter Rust Bridge', 'SQLite', 'FFmpeg'],
    skills: ['Local-First Product Design', 'Cross-Platform Development', 'Rust Integration', 'Privacy-Focused Architecture', 'Native Performance', 'Release Engineering'],
    media: [],
    live: 'https://apps.microsoft.com/detail/9n5pvgmpv9wk?ocid=webpdpshare',
    liveLabel: 'Microsoft Store',
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
      'Solar operations platform covering sales, project planning, supply chain, installation, maintenance, and role-specific dashboards. The frontend uses React, Vite, Tailwind, TanStack tooling, DnD Kit, and charting libraries. The repo includes a backend/API sidecar, validation scripts, and project-level structure.',
    intent:
      'Solar businesses have sales, project planning, supply chain, installation, and maintenance teams looking at the same work through different lenses. Each area needs its own view without being a completely separate tool.',
    problem:
      'Solar workflows usually fragment fast: CRM-style work for sales, planning views for project teams, inventory concerns for supply chain, and execution tracking for installation and maintenance. The goal was to build one product that respects those differences without forcing every team into the same dashboard.',
    responsibilities: [
      'Mapped the platform around operational areas rather than a flat feature list.',
      'Built the React surface with Vite, Tailwind, TanStack tooling, DnD Kit, and reporting components.',
      'Kept responsiveness, theme support, validation scripts, and product structure in scope.',
      'Maintained backend hooks, linting, and tests alongside the frontend work.',
    ],
    outcomes: [
      'Seven workstreams covered under one product: administration, project management, sales, supply chain, installation, maintenance, and user dashboards.',
      'Each team gets a specialised interface without duplicating shared platform code.',
    ],
    highlights: [
      'Lifecycle coverage across administration, project management, sales, supply chain, installation, maintenance, and user dashboards',
      'Role-aware dashboard architecture across different team views',
      'Drag-and-drop, charting, and responsive layouts for operational workflows',
      'Dark and light theming',
      'Backend integration hooks, tests, linting, and validation tools',
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
      'MIND is a Windows desktop application for inspecting 3D models and supporting manufacturing decisions. The codebase uses .NET 8, WinUI 3, Win2D, AssimpNet, with view models, rendering services, PDF/report generation, tests, and assets in the same workspace. It covers model loading, analysis, manufacturing guidance, visual capture, and client-facing outputs.',
    intent:
      'Manufacturing review work tends to sprawl across separate tools: one app to open the model, another to inspect issues, and manual work to generate pricing or recommendations. MIND collapses those steps into one Windows workflow.',
    problem:
      'Manufacturing review sprawls across separate tools. MIND collapses model viewing, inspection, guidance, and reporting into one Windows workflow.',
    responsibilities: [
      'Worked across the Windows product structure: views, view models, rendering services, assets, and reporting workflows.',
      'Focused on the 3D and manufacturing flow as a product problem — analysis, guidance, screenshots, and outputs in the same system.',
      'Kept diagnostics and debuggability central in the rendering stack.',
      'Built the desktop app with supporting documentation, tests, and layered services.',
    ],
    outcomes: [
      'Input, inspection, guidance, export, and reporting all live in one application.',
      'Expands beyond web work into desktop software with 3D rendering and structured outputs.',
    ],
    highlights: [
      'Windows desktop architecture with views, view models, rendering services, and dedicated assets',
      'Custom 3D model loading and rendering pipeline backed by Win2D and AssimpNet',
      'Manufacturing guidance, reporting, and screenshot workflows in the same app',
      'Debugging and diagnostics treated as first-class concerns in the rendering stack',
      'Project-level docs and tests support ongoing product evolution',
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
      'Content-rich company platform for an animal-nutrition and biotech business. Built on Next.js and Tailwind with TypeScript data files for technology pages, concept verticals, awards, a knowledge hub, and contact flows. The repo includes lead-generation paths, downloads, analytics, and SEO improvements as part of the product surface.',
    intent:
      'I wanted the site to feel credible to technical buyers and business stakeholders at the same time. That meant treating company content like a system: technology data, concept offerings, knowledge content, awards, and contact flows all needed to be structured clearly enough to grow without becoming hard to maintain.',
    problem:
      'Technology content, concept pages, awards, knowledge articles, and contact flows all needed clear data models so the site stays maintainable as the business grows.',
    responsibilities: [
      'Structured the product around reusable data models for technologies, concepts, awards, knowledge content, and company information.',
      'Used the Next.js App Router for a content-heavy site with room for metadata, downloads, and lead-gen flows.',
      'Kept follow-on paths in the backlog: analytics, gated resources, case studies, and deeper SEO support.',
    ],
    outcomes: [
      'Content is modelled in TypeScript data files rather than hard-coded across pages.',
      'Site can grow into lead generation, downloads, and analytics without restructuring.',
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
      'Four business verticals inside one shared web platform: ingredient sourcing, risk management, project management, and housekeeping products. Uses React, Vite, Tailwind, routed pages, themed visual treatment per vertical, EmailJS-based inquiry handling, and PWA support.',
    intent:
      'Each business vertical needed distinct visual identity and content depth while sharing navigation, inquiry handling, and maintainable components.',
    problem:
      'Multiple business lines that need distinct site presences, not a single template repeated four times.',
    responsibilities: [
      'Built the site with multiple verticals, each with its own theming and content structure.',
      'Used React, Vite, Tailwind, routed pages, and EmailJS-based forms.',
      'Extended the housekeeping side into a catalogue-like product surface with structured entries.',
      'Kept production concerns in scope through PWA support, build scripts, and live deployment.',
    ],
    outcomes: [
      'One coherent business platform where each vertical has its own identity.',
      'Multi-theme component reuse in a real client-facing context.',
      'Live production delivery with PWA support and deployment scripts.',
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
      'Multi-workspace product with a React frontend, Node/Express backend, and Prisma-backed data layer. The frontend uses Vite, Redux, forms, tables, and upload flows. The backend layers validation, rate limiting, sanitization, logging, file handling, and role-based access.',
    intent:
      'This work needed to support real transactions and internal follow-through, not just presentation. I treated uploads, validation, role control, and maintainability as core product requirements, because those are the parts that start to matter once a customer-facing system becomes part of daily operations.',
    problem:
      'Customer-facing systems need uploads, protected access, validation, and reliable backend operations — not a thin front over messy processes.',
    responsibilities: [
      'Worked across the React frontend and Express backend — uploads, validation, state, and access rules as one system.',
      'Helped move the frontend onto a Vite-based workflow while preserving existing component surfaces.',
      'Kept backend robustness through Prisma, security middleware, logging, seeded roles, and operational scripts.',
      'Maintained internal and customer-facing needs as part of the same system.',
    ],
    outcomes: [
      'Maintainable full-stack system with clear frontend/backend/data boundaries.',
      'End-to-end ownership from UI structure to backend safety and development workflow.',
    ],
    highlights: [
      'Frontend workspace migrated onto Vite while keeping existing product surfaces intact',
      'Node/Express backend with Prisma, validation, security middleware, logging, and role seeding',
      'Upload-oriented flows and operational APIs for ongoing customer and internal use',
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
      'Split client/server platform with React and Material UI on the frontend and Express with Sequelize on the backend. Includes authentication, validation, logging, rate limiting, cookie/session handling, file uploads, and MySQL database integration.',
    intent:
      'A discussion environment where different user types share one system without sharing the same permissions.',
    problem:
      'Multi-user environments where access rules, validation, database interactions, and client behaviour need to align.',
    responsibilities: [
      'Worked on the client/server split with React frontend and Express + Sequelize backend.',
      'Handled authentication, validation, rate limiting, logging, and role-aware behaviour.',
      'Built it as a multi-user system rather than a single-user CRUD exercise.',
    ],
    outcomes: [
      'Multi-user discussion platform with role-based access and protected routes.',
      'Foundation skills in how interfaces and backend rules align in shared environments.',
    ],
    highlights: [
      'Separate client and backend workspaces for a multi-user discussion product',
      'React + Material UI frontend with authenticated flows',
      'Express backend with auth, validation, rate limiting, logging, and Sequelize data access',
      'Cookie/session and token handling for multi-user access control',
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
      'This site is the main front door for my work. Built with React, TypeScript, Vite, Tailwind, motion-driven sections, routed case studies, and a separate immersive cockpit route that reinterprets the same portfolio through briefing and drive-recovery UI.',
    intent:
      'I wanted the portfolio to feel clear and considered instead of theatrical. The main site stays fast and readable, while the project pages and cockpit route add depth without hiding the work behind spectacle.',
    problem:
      'A portfolio needs to serve quick browsing and deeper technical review in the same site.',
    responsibilities: [
      'Designed the fast main narrative route alongside deeper case-study pages.',
      'Built the project data model and routed detail pages for richer context than a one-page summary.',
      'Added the cockpit route as an alternate interactive layer from the same project data.',
      'Kept the repo tied to the resume workflow so web and PDF versions stay aligned.',
    ],
    outcomes: [
      'Site serves as a detailed companion to the resume without duplicating it.',
      'Room to explain product work with more context than bullet points allow.',
      'Live example of narrative design, information density, and frontend delivery together.',
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

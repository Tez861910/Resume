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
    id: 'open-solar-toolkit',
    title: 'Open Solar Toolkit',
    tagline: 'Solar project lifecycle platform — sales to maintenance',
    description:
      'End-to-end platform managing the full solar project lifecycle from initial sales through installation and ongoing maintenance. Admins, sales reps, and field technicians each get purpose-built dashboards with granular permissions. Dashboard layouts are fully draggable so every user can arrange widgets to match their workflow. Chart.js and Recharts power real-time monitoring analytics — energy output, installation progress, and maintenance schedules are all visualized at a glance. A theme toggle supports light and dark modes, and every commit is gated by lint checks and file-structure validation to keep the codebase clean as the project grows.',
    intent:
      'Solar companies typically juggle spreadsheets, email chains, and disconnected CRMs across their sales, installation, and maintenance teams. I set out to unify that entire lifecycle into a single platform where each role sees exactly what they need — no more, no less. The drag-and-drop dashboards grew out of user interviews that showed no two sales reps organize their day the same way, so a rigid layout would never stick.',
    highlights: [
      'Multi-role dashboards with granular, route-level access control',
      'Fully draggable & resizable dashboard layouts powered by DnD Kit',
      'Real-time energy monitoring and installation progress charts via Chart.js / Recharts',
      'Light and dark theme toggle with system-preference detection',
      'Security-hardened: input validation, CSRF protection, and sanitized outputs',
      'Commit-gated quality: ESLint, Prettier, and file-structure validation on every push',
    ],
    tech: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'DnD Kit', 'Chart.js', 'Recharts'],
    skills: ['Frontend Architecture', 'Drag-and-Drop UX', 'Data Visualization', 'Security Hardening', 'Role-Based Access', 'Theming'],
    media: [],
    github: 'https://github.com/Tez861910',
    status: 'In Progress',
  },
  {
    id: 'resolute-solutions',
    title: 'Resolute Solutions Site',
    tagline: 'Corporate B2B platform covering four specialized business verticals',
    description:
      'A comprehensive digital platform for Resolute Solutions — "The Right Choice" — showcasing four specialized business verticals: Ingredient Sourcing & Risk Management Analysis, Project Management (engineering consulting for pharmaceutical, feed, and chemical manufacturing units), and House Keeping Products with a full product catalog. The site features per-vertical themed pages with unique color schemes (emerald/cyan for home, amber/orange for sourcing, orange/pink for project management, blue for housekeeping), a reusable animated background slideshow system, hero sections with factory and industry imagery, and dark/light theme support throughout. An advanced contact management system uses EmailJS for serverless form submissions with service-specific fields and customer auto-reply confirmations. The housekeeping vertical includes a detailed product catalog with GermiCheck, Multi Clean, Deep Clean, and other cleaning products — each with descriptions, benefits, application instructions, usage ratios, and product images. Deployed via GoDaddy with custom domain (resolutesolutions.co.in), GitHub Actions CI/CD pipeline, and automated SSL renewal via ACME.',
    intent:
      'Resolute Solutions operates across four very different verticals — from chemical ingredient sourcing to housekeeping product sales. They needed a single professional web presence that could represent each vertical with its own branding and content depth, while sharing a consistent navigation and contact flow. I built the site to let each vertical feel like its own standalone page (unique gradients, hero imagery, CTAs) while keeping the codebase DRY through shared layout components, a reusable animated background system, and a single contact modal that adapts its fields and color scheme based on the vertical.',
    highlights: [
      'Four themed vertical pages with unique gradient color schemes and hero slideshows',
      'Full housekeeping product catalog with images, benefits, application instructions, and bulk ordering',
      'EmailJS-powered serverless contact forms with service-specific fields and auto-reply confirmations',
      'Reusable AnimatedBackground and HeroBackgroundSlideshow components for rich visual storytelling',
      'Dark/light theme toggle with per-vertical color adaptation',
      'PWA support: installable, offline-capable via service worker caching',
      'Full SEO/OG meta and JSON-LD structured data for each page',
      'GitHub Actions CI/CD to GoDaddy shared hosting with automated ACME SSL renewal',
      'Performance: ~335KB JS (code-split), ~66KB CSS, Lighthouse 90+, <3s TTI on 3G',
      'Security headers: CSP, HSTS, X-Frame-Options, Referrer Policy, Permissions Policy',
    ],
    tech: ['React 19', 'Vite 7', 'JavaScript', 'Tailwind CSS', 'React Router', 'EmailJS', 'PWA', 'GitHub Actions', 'GoDaddy'],
    skills: ['Responsive Design', 'PWA Architecture', 'SEO & Structured Data', 'Serverless Email', 'CI/CD Pipelines', 'SSL Automation', 'Component Architecture', 'Multi-Theme Design'],
    media: [],
    live: 'https://resolutesolutions.co.in',
  },
  {
    id: 'university-threads',
    title: 'University Threads Platform',
    tagline: 'Real-time forum for 500+ concurrent users at Old Dominion University',
    description:
      'A threaded discussion forum built during a volunteer stint under Prof. Ajay Gupta at Old Dominion University. The platform supports 500+ concurrent users with role-based access (students, TAs, professors), real-time messaging, and protected routes. Authentication uses JWT tokens stored in HTTP-only cookies, with rate limiting to prevent abuse and input validation to guard against injection. On the backend, Express serves a REST API backed by MySQL, with query optimization and response caching that brought response times down ~45% under load.',
    intent:
      'The university\'s existing communication tools were fragmented — students used email, group chats, and LMS forums that didn\'t thread well or support role-based visibility. I built this to give the Hands On Lab a purpose-built platform where professors could pin announcements, TAs could manage threads by section, and students could discuss assignments in real-time — all with proper access control so sensitive content stayed within the right groups.',
    highlights: [
      'Served 500+ concurrent users with sub-second response times',
      'JWT authentication with HTTP-only cookies and refresh token rotation',
      'Rate limiting and input sanitization against brute-force and injection attacks',
      'Role-based access: students, TAs, and professors see different content and controls',
      'Real-time messaging with WebSocket-style updates',
      'Query optimization and Redis-style caching for ~45% faster backend responses',
      'Protected routes with middleware-level authorization checks',
    ],
    tech: ['React', 'Material UI', 'Express', 'MySQL', 'JWT', 'REST API'],
    skills: ['Full-Stack Development', 'Authentication & Authorization', 'Query Optimization', 'Caching', 'Real-Time Messaging', 'Security Hardening'],
    media: [],
  },
  {
    id: 'exam-management-system',
    title: 'Examination Management System',
    tagline: 'Automated assessment platform that cut manual overhead by 50%',
    description:
      'A role-based exam platform built with Java, JSP, and MySQL for the Hands On Lab at Old Dominion University. The system handles the full exam lifecycle — registration, question-bank management, timed assessments, auto-grading, and results publishing. Professors create exams from a question bank with configurable time limits and randomized question order. Students register, take exams in a proctored timed interface, and receive automated results immediately. Admin dashboards provide analytics on pass rates, question difficulty, and class performance. The database schema was optimized with proper indexing and normalized tables to keep query times low even with hundreds of concurrent test-takers.',
    intent:
      'Before this system, exam administration at the lab was entirely manual — professors emailed question papers, students submitted answers by email, and grading took days. I built this to automate the entire pipeline so professors could focus on teaching instead of logistics, and students could get instant feedback on their performance.',
    highlights: [
      'Full exam lifecycle: registration, timed assessments, auto-grading, and results',
      'Role-based access: admins, professors, and students with distinct capabilities',
      'Randomized question order and configurable time limits for exam integrity',
      'Automated results with class-wide analytics (pass rates, question difficulty)',
      'Optimized MySQL schema with indexing — handles hundreds of concurrent test-takers',
      'Cut manual exam administration overhead by approximately 50%',
    ],
    tech: ['Java', 'JSP', 'MySQL', 'HTML/CSS', 'JDBC'],
    skills: ['Backend Development', 'Database Design', 'Role-Based Access', 'Schema Optimization', 'Server-Side Rendering'],
    media: [],
  },
  {
    id: 'mind-3d-suite',
    title: 'MIND 3D Manufacturing Suite',
    tagline: 'Enterprise WPF desktop app with DirectX 3D visualization and automated quotations',
    description:
      'A WPF/.NET 8 desktop application built at Printalytix for 3D manufacturing workflows. Engineers load STL/OBJ/3MF models and the app renders them in a real-time DirectX viewport via HelixToolkit — users can orbit, pan, zoom, and inspect mesh geometry interactively. The application performs automated mesh integrity checks: it detects non-manifold edges, flipped normals, and holes that would cause 3D printing or CNC failures, flagging issues before expensive manufacturing runs. Authentication uses Microsoft Entra ID (MSAL) for enterprise single sign-on, so only authorized Printalytix staff can access the tool. The architecture follows MVVM with dependency injection for clean testability and separation of concerns. Once a model passes validation, the quoting module calculates material volume, build time, and GST-compliant pricing, then generates a client-ready quotation PDF via QuestPDF. App Insights telemetry tracks usage patterns and errors in production.',
    intent:
      'Before MIND, manufacturing engineers at Printalytix used a patchwork of free STL viewers, manual Excel calculations, and Word templates to quote jobs. A bad mesh could slip through and waste an entire print run. I built MIND to consolidate visualization, validation, and quoting into one tool — so an engineer can load a model, verify it\'s printable, and hand the client a professional PDF quote in minutes instead of hours.',
    highlights: [
      'Real-time DirectX 3D viewport via HelixToolkit with orbit, pan, and zoom controls',
      'Automated mesh integrity checks: non-manifold edges, flipped normals, hole detection',
      'Microsoft Entra ID (MSAL) single sign-on for enterprise authentication',
      'MVVM architecture with dependency injection for testability and modularity',
      'Multi-module analysis: supports different presets for 3D printing, CNC, and injection molding',
      'GST-compliant automated quotation PDF generation via QuestPDF',
      'SQLite local storage for project history, presets, and user preferences',
      'App Insights telemetry for production monitoring and error tracking',
    ],
    tech: ['WPF', '.NET 8', 'C#', 'DirectX', 'HelixToolkit', 'MSAL / Entra ID', 'QuestPDF', 'SQLite', 'App Insights'],
    skills: ['Desktop Development', '3D Graphics & Rendering', 'Enterprise Authentication', 'MVVM Architecture', 'PDF Generation', 'Telemetry & Monitoring', 'Mesh Analysis'],
    media: [],
  },
  {
    id: 'printalytix-platform',
    title: 'Printalytix Web Platform',
    tagline: 'Full-stack customer site that boosted engagement 35% and cut load times 40%',
    description:
      'The primary customer-facing web platform for Printalytix, a 3D printing services company. The frontend is a React SPA with Material UI and Redux for state management, enhanced with Framer Motion animations for page transitions and micro-interactions. It features multi-step intake forms with drag-and-drop file uploads (STL, OBJ, 3MF), SEO-friendly routing with dynamic meta tags, and PWA support via a service worker that caches critical assets for instant repeat visits. The backend is a Node.js/Express REST API with Sequelize ORM over MySQL, handling file uploads with streaming and UUID-based tracking, structured logging for debugging, and input validation at every endpoint. Through a combination of route-based code splitting, image optimization, aggressive caching headers, and bundle tuning, I achieved a 40% reduction in page load times and a 35% increase in user engagement metrics (time on site, pages per session).',
    intent:
      'Printalytix needed a site that could handle the full customer journey — from browsing services to uploading 3D models and receiving quotes. The previous site was a static WordPress page with no upload capability and slow load times. I rebuilt it from scratch as a React + Node full-stack platform, focusing on performance (every second of load time lost customers) and engagement (animated transitions and progressive enhancement kept users exploring).',
    highlights: [
      'Boosted user engagement 35% through animated UI, progressive enhancement, and UX experiments',
      'Cut page load times ~40% via code splitting, image optimization, bundling, and caching',
      'Multi-step intake forms with drag-and-drop 3D file uploads (STL/OBJ/3MF)',
      'PWA: installable, offline-capable with service worker caching of critical assets',
      'SEO-optimized: dynamic meta tags, structured routing, OG/Twitter cards',
      'Node/Express REST API with Sequelize ORM, streaming file uploads, and UUID tracking',
      'Structured logging and input validation across all API endpoints',
      'Redux state management for complex form flows and upload progress tracking',
    ],
    tech: ['React', 'Material UI', 'Redux', 'Framer Motion', 'PWA', 'Node.js', 'Express', 'MySQL', 'Sequelize'],
    skills: ['Performance Optimization', 'SEO', 'REST API Design', 'File Upload Handling', 'State Management', 'Progressive Web Apps', 'Animation & Micro-Interactions'],
    media: [],
  },
  {
    id: 'portfolio-site',
    title: 'Personal Portfolio & Resume',
    tagline: 'This very site — React + Tailwind with project showcase pages',
    description:
      'My personal portfolio built with React, TypeScript, Vite, and Tailwind CSS. Features a dark-mode design with amber/gold accents, Framer Motion scroll-triggered animations, and a full project showcase system with individual profile pages for each project (the page you\'re reading right now). Deployed to GitHub Pages with a custom domain (tejassureshofficial.in) and a GitHub Actions CI/CD pipeline. Includes a LaTeX resume that compiles alongside the web portfolio.',
    intent:
      'I wanted a portfolio that goes beyond listing project names — each project deserves its own page with context on why I built it, what technical decisions I made, and what the results were. This site is both a resume and a living technical showcase.',
    highlights: [
      'Individual project profile pages with media galleries, intent, tech stack, and skills',
      'Framer Motion scroll-triggered animations with intersection observer',
      'Responsive dark-mode design with amber/gold accent system',
      'React Router SPA with GitHub Pages 404.html redirect for deep links',
      'GitHub Actions CI/CD: auto-deploys on push to main',
      'Custom domain with CNAME persistence across deploys',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router', 'GitHub Actions', 'GitHub Pages'],
    skills: ['Frontend Development', 'Responsive Design', 'CI/CD', 'Animation', 'SPA Routing'],
    media: [],
    github: 'https://github.com/Tez861910/Resume',
    live: 'https://tejassureshofficial.in',
  },
]

export default projects

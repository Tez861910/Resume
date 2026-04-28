# Tejas Suresh - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 Modern and clean design
- 📱 Fully responsive layout
- ⚡ Fast performance with Vite
- 🎭 Smooth animations with Framer Motion
- 🎯 SEO optimized
- 🌐 Ready for deployment

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Deployment**: Ready for GoDaddy, Vercel, or Netlify

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.33.2 or higher)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
pnpm run build
```

The production-ready files will be in the `dist` folder.

## Preview Production Build

```bash
pnpm run preview
```

## Deployment

### Deploy to GoDaddy

1. Build the project: `pnpm run build`
2. Upload the contents of the `dist` folder to your GoDaddy hosting via FTP or File Manager
3. Configure your domain to point to the hosting

### Deploy to Vercel

1. Install Vercel CLI: `pnpm add -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `pnpm run build`
2. Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)

## Customization

- Update personal information in component files
- Add your GitHub, LinkedIn, and portfolio links
- Replace placeholder project links with actual URLs
- Add your own images to the `public` folder

## Project Structure

```
portfolio/
├── src/
│   ├── components/     # React components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## License

MIT License - feel free to use this for your own portfolio!

## Contact

Tejas Suresh - tejassuresh98@gmail.com

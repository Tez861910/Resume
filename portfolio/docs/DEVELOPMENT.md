# Development Setup

This project uses **pnpm** as the package manager and is configured for cross-platform development (Windows & Linux).

## Prerequisites

- **Node.js**: v18 or higher (v24.15.0+ recommended)
- **pnpm**: v10.33.2 or higher

### Install pnpm (if not already installed)

```bash
# Recommended on modern Node installs
corepack enable
corepack prepare pnpm@10.33.2 --activate

# Or using your system package manager:
# Ubuntu/Kubuntu:
sudo apt update && sudo apt install pnpm

# Windows (PowerShell):
iwr https://get.pnpm.io -useb | iex
```

Verify installation:
```bash
pnpm --version  # Should be 10.33.2+
```

## Getting Started

### 1. Clone or Pull the Repository

```bash
# First time
git clone <repo-url>
cd vs\ code\ projects/Resume/portfolio

# Subsequent pulls
git pull origin dev
```

### 2. Install Dependencies

```bash
cd portfolio
pnpm install
```

This will:
- Read from the committed `pnpm-lock.yaml`
- Generate platform-specific bindings for your OS
- Install all dependencies

**Important**: On a fresh machine, `pnpm install` may take a minute the first time. That is normal.

### 3. Development Workflow

```bash
# Start dev server (hot reload)
pnpm run dev
# Opens at http://localhost:5173

# Build for production
pnpm run build
# Output in ./dist/

# Preview production build locally
pnpm run preview

# Lint code
pnpm run lint
```

## Cross-Platform Notes

### Line Endings
This repo uses `.gitattributes` to automatically normalize line endings:
- **Source files** (`.ts`, `.tsx`, `.json`, etc.): Always **LF** (Unix)
- **Windows scripts** (`.bat`, `.cmd`, `.ps1`): Always **CRLF** (Windows)

No manual configuration needed - git handles it automatically.

### Package Lock Files

This repo uses **one committed lockfile**: `pnpm-lock.yaml`

- Commit `pnpm-lock.yaml`
- Do **not** commit `package-lock.json` or `yarn.lock`
- CI and all contributors should install through pnpm so dependency resolution stays consistent

### Developing on Both Windows and Linux

Since files are shared (dual-boot setup):

1. **After switching OS**, run:
   ```bash
   cd portfolio
   rm -rf node_modules
   pnpm install
   ```
   This regenerates platform-specific bindings.

2. **Do NOT delete** `pnpm-lock.yaml` - it is the shared lockfile for the project.

3. **Commit policy**:
   - ✅ Commit: Source code, config files, `.gitignore`, `.gitattributes`, `pnpm-lock.yaml`
   - ❌ Do NOT commit: `package-lock.json`, `node_modules`, `.env.local`, OS-specific artifacts

## Troubleshooting

### "Cannot find module" errors after pulling

```bash
# Clear install artifacts and reinstall
rm -rf node_modules
pnpm install
```

### Build fails on Windows but works on Linux (or vice versa)

```bash
# Regenerate platform-specific bindings
rm -rf node_modules
pnpm install
pnpm run build
```

### ESLint/TypeScript issues

```bash
# Clear TypeScript cache
rm -rf .vscode/settings.json
pnpm run lint
```

## Project Structure

```
portfolio/
├── src/
│   ├── components/        # React components
│   ├── three/             # Three.js and WebGL code
│   ├── data/              # Constants and data
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── dist/                  # Build output (generated)
├── package.json           # Dependencies
├── pnpm-lock.yaml         # Shared pnpm lock file
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── tailwind.config.js     # Tailwind CSS config
```

## Key Technologies

- **React 19** - UI framework
- **Three.js + React Three Fiber** - 3D graphics
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool & dev server
- **Framer Motion** - Animations
- **pnpm** - Package manager

## Need Help?

Check the main `README.md` for project overview and deployment info.

For any OS-specific issues, document them and we'll add a solution here.

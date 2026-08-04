# AGENTS.md

## Stack
- React 19 + Vite 8 + Tailwind CSS 4 (plain JSX, no TypeScript)
- Tailwind v4: uses `@tailwindcss/vite` plugin — no `tailwind.config.js` or `postcss.config.js`
- `react-router-dom@7` installed; routing is wired in `src/App.jsx` via `BrowserRouter`/`Routes`
- No test runner or typecheck configured

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — ESLint (flat config, `eslint .`)

## Conventions
- All CSS via Tailwind utility classes; single entry point is `src/index.css` (`@import "tailwindcss"`)
- Components go in `src/components/`, pages in `src/pages/`; register new pages as `<Route>`s in `src/App.jsx`
- Plain JSX files (`.jsx`) — no TypeScript, no tests yet
- **Brand accent is lime** (`lime-400` for fills, `text-white/90`+ on dark backgrounds) — use it for CTAs/accents everywhere to keep the visual identity consistent
- **Typography uses Tailwind's default sans stack** (`ui-sans-serif, system-ui, sans-serif`) — no web fonts are loaded; don't add external fonts unless explicitly asked, to preserve the current look and avoid font-swap layout shift

## Gotchas
- Tailwind v4 has no config file — all customization happens in CSS via `@theme` blocks in `index.css`
- `index.html` title is still "frontend" — update it when a real app name is chosen
- `src/assets/landing-page-background.jpg` is the only kept asset from the old build
- `.opencode/skills/kmp-glassmorphism-ui/` targets Kotlin Multiplatform — ignore it in this React app

# AGENTS.md

## Stack
- React 19 + Vite 8 + Tailwind CSS 4 (plain JSX, no TypeScript), `@tanstack/react-query`, `axios`, `react-router-dom@7`
- Tailwind v4 uses `@tailwindcss/vite` plugin — no `tailwind.config.js`/`postcss.config.js`; customization happens via `@theme` blocks in `src/index.css` (custom `animate-*` keyframes live there, incl. `prefers-reduced-motion` overrides)
- No test runner or typecheck configured

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — ESLint (flat config, `eslint .`)
- Verification is `npm run lint` + `npm run build` (no tests)

## Architecture
- Routing in `src/App.jsx`: `BrowserRouter` > `PageTransitionProvider` > `Routes`. Route guards (`VerifiedRoute`, `GuestRoute`, `VerifyEmailRoute`) are defined inline there — wrap new protected pages with `VerifiedRoute`.
- API layer is `src/lib/api.js` (axios): `baseURL` from `VITE_API_URL`, bearer token in `localStorage` key `auth_token`, 401 response interceptor clears the token and hard-redirects to `/login`. No Vite dev proxy — calls hit the backend origin directly.
- Backend is a Laravel API (`http://localhost:8000` per `.env.development`): `/api/login`, `/api/register`, `/api/logout`, `/api/user`, `/api/email/verification-notification`. Field errors arrive as `error.response.data.errors` keyed by field.
- Auth state is TanStack Query: `AuthProvider` in `src/context/AuthContext.jsx` owns `useQuery({ queryKey: ['user'] })`; the context object and `useAuth()` hook are defined in `src/hooks/useAuth.js` (unusual split: provider in `context/`, context+hook in `hooks/`).
- Page transitions: the global LEAN panel sweep (via `TransitionLink` for internal links and `usePageTransition().start(path)` for programmatic nav) applies to non-dashboard navigation. Intra-dashboard nav in `DashboardLayout` uses a **scroll transition** instead (sidebar `Link`s run it via `handleNavClick`): it stacks the target page and animates `window.scrollTo`, down or up depending on sidebar order. Both short-circuit under `prefers-reduced-motion` (scroll transition falls back to plain navigation). Dashboard pages/routes/order are defined once in `src/lib/dashboardPages.js` (used by both `App.jsx` routes and the sidebar).

## Conventions
- All CSS via Tailwind utility classes; single entry `src/index.css`
- **Brand accent is lime** (`lime-400` fills, black text on lime, `text-white/90`+ on dark backgrounds) — use for CTAs/accents everywhere
- **Typography is Tailwind's default sans stack** — no web fonts; don't add external fonts unless asked (avoids font-swap layout shift)
- Assets are `.webp` in `src/assets/` (e.g. `landing-page-background.webp`, `login-side-picture.webp`, `signup-side-picture.webp`, `logo.svg`); original `.jpg`s are kept in `src/assets/original assets/` — prefer importing the webp
- Pages in `src/pages/`, components in `src/components/`

## Gotchas
- `.env.development` is the only env file; production builds must supply `VITE_API_URL` at build time. Env vars need the `VITE_` prefix to be exposed
- `.opencode/skills/kmp-glassmorphism-ui/` targets Kotlin Multiplatform — ignore it in this React app (same for `.github/copilot/skills/`)

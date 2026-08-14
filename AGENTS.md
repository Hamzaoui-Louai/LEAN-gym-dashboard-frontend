# AGENTS.md

## Stack
- React 19 + Vite 8 + Tailwind CSS 4 (plain JSX, no TypeScript), `@tanstack/react-query`, `axios`, `react-router-dom@7`
- Tailwind v4 uses `@tailwindcss/vite` plugin — no `tailwind.config.js`/`postcss.config.js`; customization happens via `@theme` blocks in `src/index.css` (custom `animate-*` keyframes live there, incl. `prefers-reduced-motion` overrides)
- No test runner or typecheck configured. `eslint-plugin-react-hooks` v7 `flat.recommended` enforces **React Compiler rules at lint time** (immutability/purity) — see Gotchas.

## Commands
- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — ESLint (flat config, `eslint .`)
- Verification is `npm run lint` + `npm run build` (no tests). Build has a known ~517 kB chunk-size warning — non-blocking.

## Architecture
- Routing in `src/App.jsx`: `BrowserRouter` > `PageTransitionProvider` > `Routes`. Route guards (`VerifiedRoute`, `GuestRoute`, `VerifyEmailRoute`) are defined inline there — wrap new protected pages with `VerifiedRoute`.
- API layer is `src/lib/api.js` (axios): `baseURL` from `VITE_API_URL`, bearer token in `localStorage` key `auth_token`, 401 response interceptor clears the token and hard-redirects to `/login`. No Vite dev proxy — calls hit the backend origin directly.
- Backend is a Laravel API (sibling `backend/` folder, `http://localhost:8000` per `.env.development`). **Only auth endpoints exist today** (`/api/login`, `/api/register`, `/api/logout`, `/api/user`, `/api/email/verification-notification`); field errors arrive as `error.response.data.errors` keyed by field. Dashboard resource endpoints (members/staff/equipment/check-ins/finances/gym) are **not implemented yet**.
- Auth state is TanStack Query: `AuthProvider` in `src/context/AuthContext.jsx` owns `useQuery({ queryKey: ['user'] })` and exposes `login`/`register`/`logout`/`refreshUser` via its value.
- Contexts follow an unusual split: the provider lives in `src/context/` (`AuthContext.jsx`, `BackgroundContext.jsx`, `DashboardNavContext.jsx`), while the `createContext` object + `useX` hook live in `src/hooks/` (`useAuth.js`, `useBackground.js`, `useDashboardNav.js`). Exception: `PageTransitionProvider` lives in `src/components/PageTransition.jsx` with its hook in `src/hooks/usePageTransition.js`. Keep new contexts on this pattern.
- **All 8 dashboard module pages are fully built out with mock data**, not placeholders: data comes from `src/lib/{members,staff,equipment,checkins,finances,gym}.js`, each page owning its slice in one `useState`. `WIRING_PLAN.md` specifies how to swap these for react-query calls to the Laravel API, which features are out of scope (show an "out of scope" toast instead of linking), and the frontend↔backend field mappings. `SubscriptionsPage.jsx` is an unreferenced placeholder (removed from `DASHBOARD_PAGES`).
- Page transitions: the global LEAN panel sweep (via `TransitionLink` for internal links and `usePageTransition().start(path)` for programmatic nav) applies to non-dashboard navigation. Intra-dashboard nav in `DashboardLayout` uses a **scroll transition** instead: `handleNavClick` stacks the target page and animates `window.scrollTo`, down or up depending on sidebar order; it's exposed app-wide as `DashboardNavProvider`/`useDashboardNav().navigateTo` (used by `DashboardPage` quick-nav). Both short-circuit under `prefers-reduced-motion`. Dashboard pages/routes/order are defined once in `src/lib/dashboardPages.js` (used by both `App.jsx` routes and the sidebar).

## Conventions
- All CSS via Tailwind utility classes; single entry `src/index.css`
- **Brand accent is lime** (`lime-400` fills, black text on lime, `text-white/90`+ on dark backgrounds) — use for CTAs/accents everywhere
- **Typography is Tailwind's default sans stack** — no web fonts; don't add external fonts unless asked (avoids font-swap layout shift)
- Assets are `.webp` in `src/assets/` (e.g. `landing-page-background.webp`, `login-side-picture.webp`, `signup-side-picture.webp`, `logo.svg`); original `.jpg`s are kept in `src/assets/original assets/` — prefer importing the webp
- Pages in `src/pages/`, components in `src/components/`
- Shared dashboard building blocks in `src/components/`: `PageHeader` (page title/actions), `Panel` (card), `Pagination`, and hand-rolled SVG charts in `charts/` (`DonutChart`, `BarChart`, `LineChart`, `Legend`) — **no chart library**. Chart dots use translucent `rgba(9,9,11,0.85)` fills because dashboard backgrounds are user-selectable, not a fixed dark color.

## Gotchas
- `.env.development` is the only env file; production builds must supply `VITE_API_URL` at build time. Env vars need the `VITE_` prefix to be exposed
- **React Compiler lint rules** (from `eslint-plugin-react-hooks` v7): no reassigning render-scope variables (`react-hooks/immutability` — build chart segment offsets with `reduce`, not `let offset = ...`), no `new Date()`/`Math.random()` in render (`react-hooks/purity`), no `setState` in effects (`react-hooks/set-state-in-effect` — split into keyed inner components instead). Violations fail `npm run lint`.
- **Scrollbar styling**: Chromium is styled via `::-webkit-scrollbar` pseudo-element rules in `src/index.css`; a global `scrollbar-width`/`scrollbar-color` on `*` overrides them in Chrome 121+, so the Firefox fallback is gated behind `@supports not selector(::-webkit-scrollbar)`. Don't "fix" the scrollbar with a global rule or Chromium shows a white track.
- `.opencode/skills/kmp-glassmorphism-ui/` targets Kotlin Multiplatform — ignore it in this React app (same for `.github/copilot/skills/`)

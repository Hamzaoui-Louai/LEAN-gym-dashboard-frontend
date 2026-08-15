# Frontend Structure

React 19 + Vite 8 + Tailwind CSS 4. All code is in `src/`. Pages are stateful containers; components are presentational; data + mock data live in `src/lib/`.

```
frontend/
├── AGENTS.md                          # Conventions, commands, gotchas for AI agents
├── WIRING_PLAN.md                     # Spec for swapping mock data for the Laravel API (backend handoff)
├── index.html                         # Vite HTML entry
├── vite.config.js                     # Vite + @tailwindcss/vite plugin config
├── package.json                       # Deps + scripts (dev/build/preview/lint)
├── .env.development                   # Dev env (VITE_API_URL → http://localhost:8000)
└── src/
    ├── main.jsx                       # App bootstrap (root render)
    ├── App.jsx                        # Thin provider composition (Auth > Router > PageTransition > Routes)
    ├── index.css                      # Single CSS entry: Tailwind v4 @theme tokens + custom keyframes
    │
    ├── assets/                        # WebP images + logo (original JPGs kept in "original assets/")
    │
    ├── routes/                        # Routing table + guards (all route wiring)
    │   ├── AppRoutes.jsx              # Route table: landing/auth pages + guarded dashboard modules
    │   ├── guards.jsx                 # VerifiedRoute / GuestRoute / VerifyEmailRoute route guards
    │   └── EmailVerifiedHandler.jsx   # Post-email-verification redirect logic
    │
    ├── context/                       # React context providers (split from hooks/ — see AGENTS.md)
    │   ├── AuthContext.jsx            # Auth provider: owns ['user'] query, exposes login/register/logout
    │   ├── BackgroundContext.jsx      # Background provider: current page background theme
    │   ├── DashboardNavContext.jsx    # Dashboard nav provider: exposes intra-dashboard scroll navigation
    │   └── DataSourceContext.jsx      # Data-source provider: mock vs live (Laravel) mode state
    │
    ├── hooks/                         # createContext objects + useX hooks (consumers)
    │   ├── useAuth.js                 # Auth context hook (current user + auth actions)
    │   ├── useBackground.js           # Background context hook
    │   ├── useDashboardNav.js         # Dashboard nav context hook
    │   ├── useDataSource.js           # Data source context hook (isLive toggle)
    │   ├── useSourceData.js           # Query hook: live API call with mock-data fallback
    │   ├── usePrefetchDashboardModules.js # Background-prefetch hook for module queries
    │   └── usePageTransition.js       # Page transition hook (programmatic LEAN panel sweep)
    │
    ├── lib/                           # Data, mock data, and pure logic (no JSX)
    │   ├── api.js                     # Axios instance: baseURL, bearer token, 401 interceptor
    │   ├── dashboardApi.js            # Live API call map for all dashboard resources
    │   ├── dashboardPages.js          # Single source of truth for dashboard page order/routes
    │   ├── dashboardBackgrounds.js    # Background theme options for the dashboard
    │   ├── members.js                 # Member mock data + helpers
    │   ├── staff.js                   # Staff mock data + helpers (payslips)
    │   ├── equipment.js               # Equipment + repairs mock data + helpers
    │   ├── checkins.js                # Check-in mock data + TODAY + helpers
    │   ├── finances.js                # Finance months mock data + aggregation helpers
    │   ├── gym.js                     # Gym profile mock data + helpers
    │   ├── dashboardStats.js          # Pure per-section Dashboard stat computation
    │   ├── financeMetrics.js          # Pure Finances page metrics computation
    │   └── format.js                  # Shared formatters (dates, money)
    │
    ├── pages/                         # Route components: stateful containers, thin on logic
    │   ├── LandingPage.jsx            # Public marketing landing page
    │   ├── LoginPage.jsx              # Login form
    │   ├── SignupPage.jsx             # Signup form
    │   ├── EmailVerificationPage.jsx  # "Verify your email" screen
    │   ├── NotFoundPage.jsx           # 404 screen
    │   ├── DashboardPage.jsx          # Home: overview, insights, operations, finances, quick nav
    │   ├── MembersPage.jsx            # Member directory: list/search/add/edit/details
    │   ├── StaffPage.jsx              # Staff directory: list/add/edit/details/payslips
    │   ├── EquipmentPage.jsx          # Equipment fleet: cards/add/edit/maintenance/repairs
    │   ├── CheckInsPage.jsx           # Check-ins: clock in/out, history, search + pagination
    │   ├── FinancesPage.jsx           # Finances: revenue/expense/profit analytics + period pills
    │   ├── GymProfilePage.jsx         # Gym profile: hours, contact, facilities, save
    │   └── SettingsPage.jsx           # Settings: account/plan/notifications/security/prefs/theme
    │
    ├── components/                    # Presentational components (own no server state)
    │   ├── PageHeader.jsx             # Page title + description header
    │   ├── Panel.jsx                  # Card wrapper for dashboard content blocks
    │   ├── SectionHeader.jsx          # Section title + subtitle (shared by dashboard pages)
    │   ├── Pagination.jsx             # Shared pagination control
    │   ├── DataSourceToggle.jsx       # Mock / Live API mode toggle
    │   ├── DataErrorBanner.jsx        # Inline error banner with retry
    │   ├── DataErrorState.jsx         # Full error state with retry
    │   ├── Skeletons.jsx              # Loading skeletons (table/card/tile/panel/page)
    │   ├── DashboardIcons.jsx         # Sidebar/nav icon set (ICONS map)
    │   ├── DashboardLayout.jsx        # Dashboard shell: sidebar + mobile header + outlet
    │   ├── PageTransition.jsx         # LEAN panel sweep provider for page changes
    │   ├── TransitionLink.jsx         # Link that triggers the page transition
    │   ├── DashboardBackground.jsx    # Selectable dashboard background renderer
    │   ├── GlowBackground.jsx         # Glow background theme
    │   ├── FullPageLoader.jsx         # Full-screen loading spinner
    │   ├── AuthErrorScreen.jsx        # Auth error screen
    │   ├── ImageUploader.jsx          # Image upload/editor control
    │   ├── HeroSection.jsx            # Landing hero section
    │   ├── StatsSection.jsx           # Landing stats section
    │   ├── PricingSection.jsx         # Landing pricing section
    │   ├── LandingBackground.jsx      # Landing page background renderer
    │   ├── backgrounds/               # Animated background themes (blobs, rain, ripples)
    │   ├── charts/                    # Hand-rolled SVG charts (no chart library)
    │   │   ├── DonutChart.jsx         # Donut chart
    │   │   ├── BarChart.jsx           # Bar chart
    │   │   ├── LineChart.jsx          # Line chart
    │   │   └── Legend.jsx             # Chart legend
    │   ├── dashboard/                 # Dashboard-specific building blocks
    │   │   ├── Sidebar.jsx            # Desktop sidebar navigation
    │   │   ├── MobileHeader.jsx       # Mobile top bar navigation
    │   │   ├── useScrollTransition.js # Intra-dashboard scroll navigation animation hook
    │   │   ├── widgets.jsx            # Shared widgets: Tile, ShareList, Avatar, InsidePill, StatusDot
    │   │   └── sections/              # Dashboard home sections (each owns its own data slice)
    │   │       ├── OverviewSection.jsx   # Overview tiles (skeleton + retry per section)
    │   │       ├── InsightsSection.jsx   # Revenue / membership / check-in panels
    │   │       ├── OperationsSection.jsx # Staff / equipment overview panels
    │   │       └── FinancesSection.jsx   # Financial overview + trend chart
    │   ├── members/                   # Members module components (tables, modals, badges, avatar)
    │   ├── staff/                     # Staff module components (tables, modals, badges, payslips)
    │   ├── equipment/                 # Equipment module components (cards, modals, badges, image)
    │   ├── checkins/                  # Check-in module components (panel, history, list)
    │   ├── finances/                  # Finances module components (MetricCard, DonutLegend)
    │   ├── gym/                       # Gym profile module components (modal, badges)
    │   └── settings/                  # Settings panels (presentational, props down / events up)
    │       ├── AccountPanel.jsx       # Profile edit panel
    │       ├── SubscriptionPanel.jsx  # Plan selection panel
    │       ├── NotificationsPanel.jsx # Notification toggles panel
    │       ├── SecurityPanel.jsx      # Password / 2FA panel
    │       ├── PreferencesPanel.jsx   # Language/locale preferences panel
    │       ├── ThemePanel.jsx         # Dashboard background picker panel
    │       ├── DangerZonePanel.jsx    # Delete account panel
    │       ├── form.jsx               # Shared form primitives + class strings
    │       └── constants.js           # Settings page constants (plans, sessions, locales)
    └── ...
```

## Key rules
- Pages own state and data hooks; components are presentational.
- Pure derivation lives in `src/lib/` (e.g. `dashboardStats.js`, `financeMetrics.js`).
- Route guards: every protected dashboard page is wrapped in `VerifiedRoute` (`src/routes/guards.jsx`).
- `dashboardPages.js` is the single source of truth for sidebar order and dashboard routes.

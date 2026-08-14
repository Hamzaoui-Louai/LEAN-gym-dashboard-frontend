# Frontend ↔ Backend Wiring Plan (FINAL)

Scope decisions agreed with the user. Use this to wire the React dashboard to the Laravel API.

## A. Out of scope (for good) → "out of scope" toast on interaction, data stays filler

Only in Settings, plus field removals:

| Feature | Behavior |
|---|---|
| **LEAN Subscription** (plan, status, valid until, plans, upgrade) | Filler. `Upgrade` → toast |
| **Notifications** (toggles) | Filler. Toggling → toast |
| **Recent logins** (renamed from "Active sessions") | Filler static list (device/location/time). "Log out of all other devices" + row logout → toast (JWT has no sessions) |
| **Preferences** (Language, Currency, Date format) | Filler. Changing → toast |
| **Account → Profile picture** | Upload UI removed; static avatar placeholder |
| **Equipment images** | Upload/change/remove removed; static picture placeholder |
| **Danger zone → Deactivate account** | → toast; **Delete account is in scope** (`DELETE /api/user`) |
| **Theme / dashboard background** | Frontend-only, keeps working, **no toast** |

## B. In scope (real API)

Auth (done), Members, Staff, Equipment, Gym Profile, Finances, Dashboard, Settings Account (name/email/password), Delete account, Check-ins, and payment/payslip method + status (backend columns added).

## C. Backend additions (Laravel)

1. **New `Checkin` model** — `member_id`, `date`, `check_in`, `check_out` (nullable) to match the frontend shape.
2. **Status columns**: `Member.status` (`active|frozen|expired`), `Staff.status` (`active|on_leave|departed`), `Gym.status` (`active|inactive`).
3. **Payment**: add `method` + `status` columns (`paid|pending|failed`).
4. **Payslip**: add `method` + `status` columns.
5. **Endpoints** (all `auth:api`):

```
GET/POST/PUT/DELETE  /api/members           GET /api/members/{id}/payments
GET/POST/PUT/DELETE  /api/staff             GET /api/staff/{id}/payslips
GET/POST/PUT/DELETE  /api/equipment         GET /api/equipment/{id}/purchase-bills
                                            GET /api/equipment/{id}/repair-bills
GET/POST            /api/checkins           POST /api/checkins/{id}/check-out
GET/PUT             /api/gym
GET                 /api/finances/overview?period=...   (server aggregates; expenses = payslips vs purchase+repair bills)
PUT                 /api/user               (name/email)
PUT                 /api/user/password
DELETE              /api/user
GET /api/user       → include gym + subscription
```

## D. Seeders & factories (backend)

Seed data should mirror the frontend mocks so the "mock" and "real" views match.

- **Factories** (one per model, `database/factories/`): Gym, User, UserSubscription, Member, MemberSubscription, Payment, Staff, Payslip, Equipment, PurchaseBill, RepairBill, Checkin. Use Faker + more filler data. Factory states must match the frontend status sets: Member `active|frozen|expired`, Staff `active|on_leave|departed`, Equipment `available|maintenance|broken` (with PurchaseBill/RepairBill for non-available), Payment/Payslip `paid|pending|failed`.
- **Seeder** (`database/seeders/DashboardSeeder.php`): the canonical seed is a **port of the frontend mock libs** (`frontend/src/lib/{members,staff,equipment,checkins,finances,gym}.js`) mapped to backend columns per the field mapping in §E — split Member `name` → `first_name`/`last_name`, collapse Equipment 4-state → 3-state, collapse Gym per-day hours → single `opening_time`/`closing_time`, derive payslip `period` from `month`/`year`.
- **Top up with filler**: after the mock port, generate extra volume (e.g. ~150 members, ~30 staff, ~40 equipment, check-ins/payments across the last 12 months) so pagination and the Finances page look populated.
- **Seed order matters**: Gym → User + UserSubscription → Member → MemberSubscription → Payment → Staff → Payslip → Equipment → PurchaseBill/RepairBill → Checkin.
- **Idempotent**: truncate/refresh before seeding so switching mock ↔ real is predictable. Run with `php artisan db:seed --class=DashboardSeeder`.

## E. Field mapping

| Frontend (mock) | Backend |
|---|---|
| Member `name` | `first_name` + `last_name` |
| Member `membership{plan,price,started_at,ends_at}` | `MemberSubscription{plan_name,price,starts_at,ends_at}` |
| Member payment `{date,amount,method,status}` | `Payment{paid_at,amount,method,status}` via `member_subscription_id` |
| Staff `role` / `joined_at` | `position` / `hire_date` |
| Payslip `{date,period,amount,method,status}` | `Payslip{month,year,amount,method,status}`; `period` derived from month/year |
| Equipment `state` (4) | `status` enum (3): operational+in_use→`available`, under_repair→`maintenance`, out_of_order→`broken` |
| Equipment `purchased_at` / `price` | `purchase_date` / `PurchaseBill.amount` |
| Purchase bill `{date,item,amount,vendor}` | `PurchaseBill{amount,purchase_date,vendor}` (drop `method`/`status`) |
| Repair `{equipment,issue,cost,date}` | `RepairBill{description,amount,repair_date}` |
| Gym `opening_hours` (per-day) | single `opening_time`/`closing_time` → **frontend collapses to one Opening/Closing pair** |
| Gym `registered_at` | derived from `created_at` |

## F. Frontend wiring

- **Mock/real data toggle (top of each page)**: a shared `DataSourceToggle` mounted in `DashboardLayout`'s top bar (so it appears on every dashboard page) flips each module between **mock** data (`src/lib/*.js`, the existing `useState` slices) and **real** data (react-query against the Laravel API). Follow the repo context convention: provider in `src/context/DataSourceContext.jsx`, hook in `src/hooks/useDataSource.js`, value persisted to `localStorage` key `data_source` (default `mock`).
  - Pages read `source` and pick the data layer: mock mode → current mock lib + local `useState`; api mode → `useQuery`/`useMutation` (gate queries with `enabled: source === 'api'`). Keep both paths during the transition; drop the mock branch once the backend is stable.
  - Mutations behave per mode: mock mode mutates local state only; api mode calls the endpoints in §C.
- Replace each page's mock `useState` data with **react-query** (`useQuery`/`useMutation`); drop mock libs.
- Add API helpers to `src/lib/api.js` (reuse existing 401 interceptor).
- Finances: replace generated `MOCK_FINANCE_MONTHS` with `/api/finances/overview`; period pills → query params.
- Dashboard: derive stats from the six resource queries instead of module-scope mock constants.
- **Toast system**: `ToastProvider` mounted in `DashboardLayout` + `useToast()`; each out-of-scope control calls `showOutOfScope('<feature>')` (e.g. `"Upgrading your plan is out of scope in this build."`), no action/persistence.

## G. Verification

- Frontend: `npm run lint` + `npm run build`. Backend: `php artisan test` + `route:list`, and verify seeding with `php artisan migrate:fresh --seed` (DashboardSeeder).

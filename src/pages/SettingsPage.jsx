import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ImageUploader from '../components/ImageUploader'
import { DASHBOARD_BACKGROUNDS } from '../lib/dashboardBackgrounds'
import { useBackground } from '../hooks/useBackground'
import { useAuth } from '../hooks/useAuth'
import { useDataSource } from '../hooks/useDataSource'
import { dashboardApi } from '../lib/dashboardApi'
import { formatDate, formatMoney } from '../lib/format'

const VISIBLE_ON_LOAD = 3

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition placeholder:text-white/30 focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20'

const buttonGhost =
  'rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white'
const buttonLime =
  'rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300'

const LEAN_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    tagline: 'For a single gym',
    features: ['Up to 500 members', 'Core dashboard modules'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    tagline: 'For growing gyms',
    features: ['Unlimited members', 'Full analytics suite'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    tagline: 'For multi-location',
    features: ['Multiple locations', 'Priority support'],
  },
]

const INITIAL_SESSIONS = [
  { id: 1, device: 'MacBook Pro · Chrome', location: 'Casablanca, MA', last_active: 'Now', current: true },
  { id: 2, device: 'iPhone 15 · Safari', location: 'Casablanca, MA', last_active: '2 hours ago', current: false },
  { id: 3, device: 'Windows PC · Edge', location: 'Rabat, MA', last_active: '3 days ago', current: false },
  { id: 4, device: 'iPad · Safari', location: 'Paris, FR', last_active: '1 week ago', current: false },
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'es', label: 'Español' },
]

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-black"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function FieldLabel({ children }) {
  return <span className="block text-sm font-medium text-white/70">{children}</span>
}

function InputField({ label, value, onChange, type = 'text', placeholder, autoComplete }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`mt-2 ${inputClass}`}
      />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 appearance-none ${inputClass} [color-scheme:dark]`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-white/40">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-lime-400' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function ActivePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-xs font-semibold text-lime-400">
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
      Active
    </span>
  )
}

function DeviceIcon({ session }) {
  const mobile = /iPhone|iPad|Android/i.test(session.device)
  if (mobile) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-white/40"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white/40"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" ry="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}

function SettingsPage() {
  const { user, logout, refreshUser } = useAuth()
  const { isLive } = useDataSource()
  const { backgroundId, setBackgroundId } = useBackground()
  const [expanded, setExpanded] = useState(false)

  const [account, setAccount] = useState(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    picture: null,
  }))
  const [accountSaved, setAccountSaved] = useState(false)

  const [currentPlan, setCurrentPlan] = useState('pro')

  const [notifications, setNotifications] = useState({
    expiration: true,
    system: true,
    email: true,
  })

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [sessions, setSessions] = useState(INITIAL_SESSIONS)

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  })

  const [confirmAction, setConfirmAction] = useState(null)
  const [notice, setNotice] = useState(null)

  const showToggle = DASHBOARD_BACKGROUNDS.length > VISIBLE_ON_LOAD
  const visibleBackgrounds = expanded
    ? DASHBOARD_BACKGROUNDS
    : DASHBOARD_BACKGROUNDS.slice(0, VISIBLE_ON_LOAD)

  const handleAccountSave = async () => {
    if (isLive) {
      await dashboardApi.user
        .update({ name: account.name, email: account.email })
        .catch(() => null)
      await refreshUser()
    }
    setAccountSaved(true)
    window.setTimeout(() => setAccountSaved(false), 2500)
  }

  const handlePasswordSave = async () => {
    if (!password.current) {
      setPasswordError('Enter your current password.')
      return
    }
    if (password.next.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (password.next !== password.confirm) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    if (isLive) {
      await dashboardApi.user
        .password({
          current_password: password.current,
          password: password.next,
          password_confirmation: password.confirm,
        })
        .catch(() => null)
    }
    setPasswordError(null)
    setPasswordSaved(true)
    setPassword({ current: '', next: '', confirm: '' })
    window.setTimeout(() => setPasswordSaved(false), 2500)
  }

  const handleConfirmAction = async (action) => {
    if (action === 'delete' && isLive) {
      await dashboardApi.user.remove().catch(() => null)
      logout()
      return
    }
    setNotice(
      action === 'delete'
        ? 'Delete requested — this is demo data, nothing changed.'
        : 'Account deactivated — this is demo data, nothing changed.',
    )
    setConfirmAction(null)
    window.setTimeout(() => setNotice(null), 3000)
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Configure your account, subscription, notifications and preferences."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Account" subtitle="Your profile details">
          <ImageUploader
            image={account.picture}
            onImageChange={(picture) => setAccount((current) => ({ ...current, picture }))}
            onRemove={() => setAccount((current) => ({ ...current, picture: null }))}
            label="Profile picture"
            previewClass="aspect-square w-24"
          />
          <div className="mt-6 space-y-4">
            <InputField
              label="Name"
              value={account.name}
              onChange={(name) => setAccount((current) => ({ ...current, name }))}
            />
            <InputField
              label="Email"
              type="email"
              value={account.email}
              onChange={(email) => setAccount((current) => ({ ...current, email }))}
            />
            <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="mt-0.5 text-xs text-white/40">
                  Last changed February 2026 — update it under Security.
                </p>
              </div>
              <span className="text-sm tracking-widest text-white/40">••••••••</span>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <button type="button" onClick={handleAccountSave} className={buttonLime}>
              Save changes
            </button>
            {accountSaved && <span className="text-xs font-medium text-lime-400">Saved ✓</span>}
          </div>
        </Panel>

        <Panel title="LEAN subscription" subtitle="Your plan and billing">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div>
              <p className="text-xs text-white/40">Current plan</p>
              <p className="mt-1 text-lg font-black text-white">
                {LEAN_PLANS.find((plan) => plan.id === currentPlan)?.name}
              </p>
            </div>
            <ActivePill />
          </div>
          <p className="mt-3 text-xs text-white/40">
            Valid until <span className="font-semibold text-white/70">{formatDate('2027-02-14')}</span>
          </p>

          <div className="my-5 h-px bg-white/10" />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Available plans
          </p>
          <div className="mt-3 space-y-3">
            {LEAN_PLANS.map((plan) => {
              const selected = plan.id === currentPlan
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-4 transition ${
                    selected ? 'border-lime-400/50 bg-lime-400/[0.06]' : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{plan.name}</p>
                        {selected && (
                          <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-black">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-white/40">{plan.tagline}</p>
                      <p className="mt-2 text-sm text-white">
                        <span className="text-lg font-black text-white">
                          {formatMoney(plan.price).replace(/\.00$/, '')}
                        </span>
                        <span className="text-xs text-white/40">/month</span>
                      </p>
                    </div>
                    {selected ? (
                      <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/40">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCurrentPlan(plan.id)}
                        className="rounded-full bg-lime-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-lime-300"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-white/50">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3 text-lime-400"
                        >
                          <path d="m5 13 4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Notifications" subtitle="Choose what you hear about">
          <div className="divide-y divide-white/5">
            <Toggle
              label="Membership expiration"
              description="Remind you when a membership is about to expire"
              checked={notifications.expiration}
              onChange={(expiration) => setNotifications((current) => ({ ...current, expiration }))}
            />
            <Toggle
              label="System notifications"
              description="Updates and maintenance from LEAN"
              checked={notifications.system}
              onChange={(system) => setNotifications((current) => ({ ...current, system }))}
            />
            <Toggle
              label="Email notifications"
              description="Send the above to your inbox as well"
              checked={notifications.email}
              onChange={(email) => setNotifications((current) => ({ ...current, email }))}
            />
          </div>
        </Panel>

        <Panel title="Security" subtitle="Password and active sessions">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Current password"
              type="password"
              value={password.current}
              onChange={(current) => setPassword((prev) => ({ ...prev, current }))}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <div className="hidden sm:block" />
            <InputField
              label="New password"
              type="password"
              value={password.next}
              onChange={(next) => setPassword((prev) => ({ ...prev, next }))}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <InputField
              label="Confirm new password"
              type="password"
              value={password.confirm}
              onChange={(confirm) => setPassword((prev) => ({ ...prev, confirm }))}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={handlePasswordSave} className={buttonLime}>
              Change password
            </button>
            {passwordSaved && (
              <span className="text-xs font-medium text-lime-400">Password updated ✓</span>
            )}
            {passwordError && <span className="text-xs font-medium text-rose-400">{passwordError}</span>}
          </div>

          <div className="my-5 h-px bg-white/10" />
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Active sessions
            </p>
            <button
              type="button"
              onClick={() => setSessions((current) => current.filter((session) => session.current))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Log out of all other devices
            </button>
          </div>
          <ul className="mt-3 divide-y divide-white/5">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <DeviceIcon session={session} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate text-sm font-medium text-white">
                      {session.device}
                      {session.current && (
                        <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-black">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {session.location} · {session.last_active}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    aria-label={`Log out ${session.device}`}
                    onClick={() =>
                      setSessions((current) => current.filter((item) => item.id !== session.id))
                    }
                    className="shrink-0 rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Preferences" subtitle="Language, currency and formatting">
          <div className="space-y-4">
            <SelectField
              label="Language"
              value={preferences.language}
              onChange={(language) => setPreferences((current) => ({ ...current, language }))}
              options={LANGUAGES}
            />
            <SelectField
              label="Currency"
              value={preferences.currency}
              onChange={(currency) => setPreferences((current) => ({ ...current, currency }))}
              options={CURRENCIES}
            />
            <SelectField
              label="Date format"
              value={preferences.dateFormat}
              onChange={(dateFormat) => setPreferences((current) => ({ ...current, dateFormat }))}
              options={DATE_FORMATS}
            />
          </div>
        </Panel>

        <Panel title="Theme" subtitle="Dashboard background">
          <p className="text-sm leading-relaxed text-white/50">
            Pick the animated backdrop shown behind your dashboard. The change applies instantly
            and is saved for next time.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {visibleBackgrounds.map((background) => {
              const selected = background.id === backgroundId
              return (
                <button
                  key={background.id}
                  type="button"
                  onClick={() => setBackgroundId(background.id)}
                  aria-pressed={selected}
                  className={`group overflow-hidden rounded-2xl border text-left transition ${
                    selected
                      ? 'border-lime-400 ring-1 ring-lime-400/60'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="relative h-24 overflow-hidden">
                    <background.Background compact />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 shadow-lg shadow-lime-400/30">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <div className="border-t border-white/10 bg-black/60 px-3 py-2.5">
                    <span
                      className={`text-sm font-medium ${
                        selected ? 'text-lime-400' : 'text-white/70'
                      }`}
                    >
                      {background.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
          {showToggle && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-4 text-sm font-medium text-white/60 transition hover:text-white"
            >
              {expanded ? 'Show less' : `Show all ${DASHBOARD_BACKGROUNDS.length} backgrounds`}
            </button>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Danger zone" subtitle="Irreversible actions">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Deactivate account</p>
              <p className="mt-0.5 text-xs text-white/40">
                Suspend your account temporarily. You can reactivate it at any time.
              </p>
            </div>
            {confirmAction === 'deactivate' ? (
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => setConfirmAction(null)} className={buttonGhost}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmAction('deactivate')}
                  className="rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
                >
                  Confirm deactivation
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmAction('deactivate')}
                className="shrink-0 rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
              >
                Deactivate
              </button>
            )}
          </div>

          <div className="my-5 h-px bg-white/10" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete account</p>
              <p className="mt-0.5 text-xs text-white/40">
                Permanently remove your account and all associated data.
              </p>
            </div>
            {confirmAction === 'delete' ? (
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => setConfirmAction(null)} className={buttonGhost}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmAction('delete')}
                  className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Confirm delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmAction('delete')}
                className="shrink-0 rounded-full border border-rose-400/50 px-5 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-400/10"
              >
                Delete account
              </button>
            )}
          </div>
          {notice && <p className="mt-4 text-xs font-medium text-lime-400">{notice}</p>}
        </Panel>
      </div>
    </div>
  )
}

export default SettingsPage

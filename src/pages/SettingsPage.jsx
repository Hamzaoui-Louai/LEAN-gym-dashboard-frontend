import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import AccountPanel from '../components/settings/AccountPanel'
import SubscriptionPanel from '../components/settings/SubscriptionPanel'
import NotificationsPanel from '../components/settings/NotificationsPanel'
import SecurityPanel from '../components/settings/SecurityPanel'
import PreferencesPanel from '../components/settings/PreferencesPanel'
import ThemePanel from '../components/settings/ThemePanel'
import DangerZonePanel from '../components/settings/DangerZonePanel'
import { INITIAL_SESSIONS } from '../components/settings/constants'
import { useBackground } from '../hooks/useBackground'
import { useAuth } from '../hooks/useAuth'
import { useDataSource } from '../hooks/useDataSource'
import { dashboardApi } from '../lib/dashboardApi'

function SettingsPage() {
  const { user, logout, refreshUser } = useAuth()
  const { source } = useDataSource()
  const isLive = source === 'api'
  const { backgroundId, setBackgroundId } = useBackground()

  const [account, setAccount] = useState(() => ({
    name: user?.name ?? '',
    email: user?.email ?? '',
    picture: null,
  }))
  const [accountSaved, setAccountSaved] = useState(false)
  const [accountSubmitting, setAccountSubmitting] = useState(false)

  const [currentPlan] = useState('pro')

  const [notifications] = useState({
    expiration: true,
    system: true,
    email: true,
  })

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' })
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)

  const [sessions, setSessions] = useState(INITIAL_SESSIONS)

  const [preferences] = useState({
    language: 'en',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
  })

  const [backgroundsExpanded, setBackgroundsExpanded] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [notice, setNotice] = useState(null)
  const [scopeToast, setScopeToast] = useState(false)
  const [scopeClosing, setScopeClosing] = useState(false)

  const showScopeToast = () => {
    setScopeClosing(false)
    setScopeToast(true)
  }
  const closeScopeToast = () => {
    if (!scopeToast) return
    setScopeClosing(true)
    setTimeout(() => {
      setScopeToast(false)
      setScopeClosing(false)
    }, 300)
  }

  const handleAccountSave = async () => {
    setAccountSubmitting(true)
    try {
      if (isLive) {
        await dashboardApi.user
          .update({ name: account.name, email: account.email })
          .catch(() => null)
        await refreshUser()
      }
      setAccountSaved(true)
      window.setTimeout(() => setAccountSaved(false), 2500)
    } finally {
      setAccountSubmitting(false)
    }
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
    setPasswordSubmitting(true)
    try {
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
    } finally {
      setPasswordSubmitting(false)
    }
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
        <AccountPanel
          account={account}
          onChange={setAccount}
          onSave={handleAccountSave}
          saved={accountSaved}
          submitting={accountSubmitting}
        />
        <SubscriptionPanel currentPlan={currentPlan} onSelectPlan={showScopeToast} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <NotificationsPanel notifications={notifications} onChange={showScopeToast} />
        <SecurityPanel
          password={password}
          onPasswordChange={setPassword}
          passwordError={passwordError}
          passwordSaved={passwordSaved}
          passwordSubmitting={passwordSubmitting}
          onSave={handlePasswordSave}
          sessions={sessions}
          onSessionsChange={setSessions}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PreferencesPanel preferences={preferences} onChange={showScopeToast} />
        <ThemePanel
          backgroundId={backgroundId}
          onSelect={setBackgroundId}
          expanded={backgroundsExpanded}
          onToggleExpanded={() => setBackgroundsExpanded((current) => !current)}
        />
      </div>

      <div className="mt-6">
        <DangerZonePanel
          confirmAction={confirmAction}
          onConfirm={setConfirmAction}
          onSubmit={handleConfirmAction}
          notice={notice}
        />
      </div>

      {scopeToast && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm transition-opacity duration-300 ${scopeClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={closeScopeToast}
        >
          <div
            role="alert"
            className={`w-full max-w-md rounded-2xl border border-lime-400/40 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl ${scopeClosing ? 'animate-fade-out' : 'animate-fade-up'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-white">Just a showcase</h3>
              <button
                type="button"
                onClick={closeScopeToast}
                aria-label="Close notification"
                className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              This is not a functioning part of the website — it's not meant to be part of the showcase.
            </p>
            <button
              type="button"
              onClick={closeScopeToast}
              className="mt-5 rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage

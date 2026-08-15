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
  const { isLive } = useDataSource()
  const { backgroundId, setBackgroundId } = useBackground()

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

  const [backgroundsExpanded, setBackgroundsExpanded] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [notice, setNotice] = useState(null)

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
        <AccountPanel
          account={account}
          onChange={setAccount}
          onSave={handleAccountSave}
          saved={accountSaved}
        />
        <SubscriptionPanel currentPlan={currentPlan} onSelectPlan={setCurrentPlan} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <NotificationsPanel notifications={notifications} onChange={setNotifications} />
        <SecurityPanel
          password={password}
          onPasswordChange={setPassword}
          passwordError={passwordError}
          passwordSaved={passwordSaved}
          onSave={handlePasswordSave}
          sessions={sessions}
          onSessionsChange={setSessions}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PreferencesPanel preferences={preferences} onChange={setPreferences} />
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
    </div>
  )
}

export default SettingsPage

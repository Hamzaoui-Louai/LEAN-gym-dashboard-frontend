import Panel from '../Panel'
import { DeviceIcon, InputField, buttonLime } from './form'

function SecurityPanel({
  password,
  onPasswordChange,
  passwordError,
  passwordSaved,
  onSave,
  sessions,
  onSessionsChange,
}) {
  const setField = (key, value) => onPasswordChange({ ...password, [key]: value })

  const revokeSession = (id) => {
    onSessionsChange((current) => current.filter((item) => item.id !== id))
  }

  const logoutOthers = () => {
    onSessionsChange((current) => current.filter((session) => session.current))
  }

  return (
    <Panel title="Security" subtitle="Password and active sessions">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Current password"
          type="password"
          value={password.current}
          onChange={(current) => setField('current', current)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
        <div className="hidden sm:block" />
        <InputField
          label="New password"
          type="password"
          value={password.next}
          onChange={(next) => setField('next', next)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <InputField
          label="Confirm new password"
          type="password"
          value={password.confirm}
          onChange={(confirm) => setField('confirm', confirm)}
          placeholder="Repeat new password"
          autoComplete="new-password"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={onSave} className={buttonLime}>
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
          onClick={logoutOthers}
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
                onClick={() => revokeSession(session.id)}
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
  )
}

export default SecurityPanel

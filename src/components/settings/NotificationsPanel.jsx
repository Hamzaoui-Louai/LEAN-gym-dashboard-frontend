import Panel from '../Panel'
import { Toggle } from './form'

const NOTIFICATION_ROWS = [
  {
    key: 'expiration',
    label: 'Membership expiration',
    description: 'Remind you when a membership is about to expire',
  },
  {
    key: 'system',
    label: 'System notifications',
    description: 'Updates and maintenance from LEAN',
  },
  {
    key: 'email',
    label: 'Email notifications',
    description: 'Send the above to your inbox as well',
  },
]

function NotificationsPanel({ notifications, onChange }) {
  return (
    <Panel title="Notifications" subtitle="Choose what you hear about">
      <div className="divide-y divide-white/5">
        {NOTIFICATION_ROWS.map((row) => (
          <Toggle
            key={row.key}
            label={row.label}
            description={row.description}
            checked={notifications[row.key]}
            onChange={(value) => onChange({ ...notifications, [row.key]: value })}
          />
        ))}
      </div>
    </Panel>
  )
}

export default NotificationsPanel

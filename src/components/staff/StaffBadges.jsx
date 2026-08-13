const STAFF_STATUS_LABELS = {
  active: 'Active',
  on_leave: 'On leave',
  departed: 'Departed',
}

const STAFF_STATUS_STYLES = {
  active: 'border-lime-400/30 bg-lime-400/10 text-lime-400',
  on_leave: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  departed: 'border-red-400/30 bg-red-400/10 text-red-400',
}

export function StaffStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STAFF_STATUS_STYLES[status] ?? STAFF_STATUS_STYLES.departed}`}
    >
      {STAFF_STATUS_LABELS[status] ?? 'Unknown'}
    </span>
  )
}

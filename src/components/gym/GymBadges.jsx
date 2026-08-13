const GYM_STATUS_STYLES = {
  active: 'border-lime-400/30 bg-lime-400/10 text-lime-400',
  inactive: 'border-white/10 bg-white/5 text-white/60',
}

export function GymStatusBadge({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${GYM_STATUS_STYLES[status] ?? GYM_STATUS_STYLES.inactive}`}
    >
      {label}
    </span>
  )
}

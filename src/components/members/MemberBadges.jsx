const MEMBERSHIP_STYLES = {
  active: 'border-lime-400/30 bg-lime-400/10 text-lime-400',
  frozen: 'border-white/10 bg-white/5 text-white/60',
  expired: 'border-red-400/30 bg-red-400/10 text-red-400',
}

export function MembershipBadge({ status }) {
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Unknown'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${MEMBERSHIP_STYLES[status] ?? MEMBERSHIP_STYLES.frozen}`}
    >
      {label}
    </span>
  )
}

const PAYMENT_STYLES = {
  paid: 'border-lime-400/30 bg-lime-400/10 text-lime-400',
  pending: 'border-white/10 bg-white/5 text-white/60',
  failed: 'border-red-400/30 bg-red-400/10 text-red-400',
}

export function PaymentBadge({ status }) {
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : 'Unknown'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${PAYMENT_STYLES[status] ?? PAYMENT_STYLES.pending}`}
    >
      {label}
    </span>
  )
}

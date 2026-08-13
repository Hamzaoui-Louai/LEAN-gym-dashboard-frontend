const EQUIPMENT_STATE_STYLES = {
  operational: 'border-lime-400/30 bg-lime-400/10 text-lime-400',
  in_use: 'border-sky-400/30 bg-sky-400/10 text-sky-400',
  under_repair: 'border-amber-400/30 bg-amber-400/10 text-amber-400',
  out_of_order: 'border-red-400/30 bg-red-400/10 text-red-400',
}

export function EquipmentStateBadge({ state }) {
  const label = state ? state.replaceAll('_', ' ') : 'Unknown'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${EQUIPMENT_STATE_STYLES[state] ?? EQUIPMENT_STATE_STYLES.out_of_order}`}
    >
      {label}
    </span>
  )
}

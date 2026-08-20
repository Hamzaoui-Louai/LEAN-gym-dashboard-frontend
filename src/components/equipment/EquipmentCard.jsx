import { formatDate, formatMoney } from '../../lib/format'
import EquipmentImage from './EquipmentImage'
import { EquipmentStateBadge } from './EquipmentBadges'

const ACTION_BUTTONS = {
  out_of_order: { label: 'Mark for Repair', className: 'bg-amber-400 text-black hover:bg-amber-300' },
  under_repair: { label: 'Mark as Repaired', className: 'bg-lime-400 text-black hover:bg-lime-300' },
  operational: { label: 'Out of Order', className: 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white' },
}

function Spinner({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  )
}

function EquipmentCard({ item, onOpen, onStatusAction, loading = false }) {
  const actionConfig = ACTION_BUTTONS[item.state]

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-white/25 hover:bg-white/[0.05]">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="w-full text-left"
      >
        <EquipmentImage item={item} />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-white">{item.name}</h3>
              <p className="mt-0.5 text-xs text-white/40">{item.category}</p>
            </div>
            <EquipmentStateBadge state={item.state} />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
            <span className="text-white/40">Bought {formatDate(item.purchased_at)}</span>
            <span className="font-semibold text-white/80">{formatMoney(item.price)}</span>
          </div>
        </div>
      </button>

      {actionConfig && (
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={loading}
            onClick={(event) => {
              event.stopPropagation()
              onStatusAction(item, item.state === 'out_of_order' ? 'repair' : item.state === 'under_repair' ? 'repaired' : 'out-of-order')
            }}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${actionConfig.className}`}
          >
            {loading && <Spinner />}
            {loading ? 'Updating…' : actionConfig.label}
          </button>
        </div>
      )}
    </div>
  )
}

export default EquipmentCard

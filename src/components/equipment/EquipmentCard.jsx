import { formatDate, formatMoney } from '../../lib/format'
import EquipmentImage from './EquipmentImage'
import { EquipmentStateBadge } from './EquipmentBadges'

function EquipmentCard({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`Edit ${item.name}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-white/25 hover:bg-white/[0.05]"
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
  )
}

export default EquipmentCard

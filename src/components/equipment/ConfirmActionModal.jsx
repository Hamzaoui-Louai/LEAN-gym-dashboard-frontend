import { useState } from 'react'
import MembersModal from '../members/MembersModal'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'
const labelClass = 'block text-sm font-medium text-white/70'

const ACTION_CONFIG = {
  repair: {
    title: 'Mark for repair',
    description: (name) => `Log the repair cost for ${name}.`,
    confirmLabel: 'Start repair',
    confirmClass: 'bg-amber-400 text-black hover:bg-amber-300',
    showCostField: true,
  },
  repaired: {
    title: 'Mark as repaired',
    description: (name) => `Are you sure ${name} is fully repaired and operational?`,
    confirmLabel: 'Mark repaired',
    confirmClass: 'bg-lime-400 text-black hover:bg-lime-300',
    showCostField: false,
  },
  'out-of-order': {
    title: 'Mark as out of order',
    description: (name) => `Are you sure you want to mark ${name} as out of order?`,
    confirmLabel: 'Confirm',
    confirmClass: 'border border-white/10 bg-white/10 text-white hover:bg-white/20',
    showCostField: false,
  },
}

function ConfirmActionModal({ open, item, action, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)
  const [cost, setCost] = useState('')

  const config = action ? ACTION_CONFIG[action] : null

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const payload = config?.showCostField && cost !== ''
        ? { cost: Number(cost) || 0 }
        : undefined
      await onConfirm(payload)
      setCost('')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCost('')
    onClose()
  }

  if (!item || !config) return null

  return (
    <MembersModal
      open={open}
      onClose={handleClose}
      title={config.title}
      description={config.description(item.name)}
    >
      <div className="flex flex-col gap-4">
        {config.showCostField && (
          <div>
            <label htmlFor="repair-cost" className={labelClass}>
              Repair cost
            </label>
            <input
              id="repair-cost"
              type="number"
              min="0"
              step="10"
              placeholder="0"
              value={cost}
              onChange={(event) => setCost(event.target.value)}
              className={`mt-2 ${inputClass}`}
            />
          </div>
        )}

        <div className="mt-2 flex justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${config.confirmClass}`}
          >
            {loading ? 'Saving…' : config.confirmLabel}
          </button>
        </div>
      </div>
    </MembersModal>
  )
}

export default ConfirmActionModal

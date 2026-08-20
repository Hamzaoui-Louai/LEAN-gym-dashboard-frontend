import { useState } from 'react'
import MembersModal from './MembersModal'

function ConfirmActionModal({ open, member, action, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const isFreeze = action === 'freeze'
  const title = isFreeze ? 'Freeze membership' : 'Unfreeze membership'
  const description = isFreeze
    ? `Are you sure you want to freeze ${member?.name}'s membership? Their subscription end date will be extended by the frozen duration once unfrozen.`
    : `Are you sure you want to unfreeze ${member?.name}'s membership? Their subscription end date will be extended accordingly.`
  const confirmLabel = isFreeze ? 'Freeze' : 'Unfreeze'
  const confirmClass = isFreeze
    ? 'rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20'
    : 'rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(member.id)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!member) return null

  return (
    <MembersModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="mt-2 flex justify-end gap-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={confirmClass}
        >
          {loading ? `${confirmLabel}ing…` : confirmLabel}
        </button>
      </div>
    </MembersModal>
  )
}

export default ConfirmActionModal

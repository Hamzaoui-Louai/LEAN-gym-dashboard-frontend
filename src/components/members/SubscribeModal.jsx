import { useState } from 'react'
import MembersModal from './MembersModal'
import Select from '../Select'
import { MEMBERSHIP_PLANS } from '../../lib/members'

const labelClass = 'block text-sm font-medium text-white/70'

function SubscribeModal({ open, member, onClose, onSubscribe }) {
  const [planId, setPlanId] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const selectedPlan = MEMBERSHIP_PLANS.find((plan) => plan.id === planId)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await onSubscribe(member.id, {
        plan: selectedPlan.label,
        price: selectedPlan.price,
      })
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
      title="Subscribe member"
      description={`Choose a plan for ${member.name}. The subscription starts today.`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="subscribe-plan" className={labelClass}>
            Membership plan
          </label>
          <div className="mt-2">
            <Select
              id="subscribe-plan"
              value={planId}
              onChange={setPlanId}
              options={MEMBERSHIP_PLANS.map((plan) => ({
                value: plan.id,
                label: `${plan.label} — $${plan.price}`,
              }))}
            />
          </div>
          <p className="mt-2 text-xs text-white/40">
            Starts today{selectedPlan.months > 0 ? `, ends in ${selectedPlan.months} month${selectedPlan.months > 1 ? 's' : ''}` : ' — no end date'}.
          </p>
        </div>

        <div className="mt-2 flex justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:opacity-50"
          >
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </div>
      </form>
    </MembersModal>
  )
}

export default SubscribeModal

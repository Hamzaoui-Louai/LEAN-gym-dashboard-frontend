import { useState } from 'react'
import MembersModal from './MembersModal'
import { MEMBERSHIP_PLANS } from '../../lib/members'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'
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
          <div className="relative mt-2">
            <select
              id="subscribe-plan"
              value={planId}
              onChange={(event) => setPlanId(event.target.value)}
              className={`${inputClass} appearance-none pr-10`}
            >
              {MEMBERSHIP_PLANS.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.label} — ${plan.price}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
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

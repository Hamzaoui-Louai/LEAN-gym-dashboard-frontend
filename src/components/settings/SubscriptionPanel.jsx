import Panel from '../Panel'
import { formatDate, formatMoneyCompact } from '../../lib/format'
import { LEAN_PLANS } from './constants'
import { ActivePill } from './form'

function SubscriptionPanel({ currentPlan, onSelectPlan }) {
  return (
    <Panel title="LEAN subscription" subtitle="Your plan and billing">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
        <div>
          <p className="text-xs text-white/40">Current plan</p>
          <p className="mt-1 text-lg font-black text-white">
            {LEAN_PLANS.find((plan) => plan.id === currentPlan)?.name}
          </p>
        </div>
        <ActivePill />
      </div>
      <p className="mt-3 text-xs text-white/40">
        Valid until <span className="font-semibold text-white/70">{formatDate('2027-02-14')}</span>
      </p>

      <div className="my-5 h-px bg-white/10" />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        Available plans
      </p>
      <div className="mt-3 space-y-3">
        {LEAN_PLANS.map((plan) => {
          const selected = plan.id === currentPlan
          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-4 transition ${
                selected ? 'border-lime-400/50 bg-lime-400/[0.06]' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{plan.name}</p>
                    {selected && (
                      <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold text-black">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{plan.tagline}</p>
                  <p className="mt-2 text-sm text-white">
                    <span className="text-lg font-black text-white">
                      {formatMoneyCompact(plan.price)}
                    </span>
                    <span className="text-xs text-white/40">/month</span>
                  </p>
                </div>
                {selected ? (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/40">
                    Active
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectPlan(plan.id)}
                    className="rounded-full bg-lime-400 px-4 py-2 text-xs font-bold text-black transition hover:bg-lime-300"
                  >
                    Upgrade
                  </button>
                )}
              </div>
              <ul className="mt-3 space-y-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-white/50">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-lime-400"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

export default SubscriptionPanel

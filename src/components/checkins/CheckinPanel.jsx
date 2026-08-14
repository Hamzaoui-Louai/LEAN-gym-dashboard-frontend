import MemberAvatar from '../members/MemberAvatar'
import { MembershipBadge } from '../members/MemberBadges'
import { formatDate, formatMoney } from '../../lib/format'
import { formatDuration } from '../../lib/checkins'

function InsidePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[11px] font-semibold text-lime-400">
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
      Inside
    </span>
  )
}

function CheckinPanel({ member, visits, inside, onCheckIn, onCheckOut, onViewAll }) {
  if (!member) {
    return (
      <div className="flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 px-6 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-8 w-8 text-white/30"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
        </svg>
        <p className="text-sm text-white/50">
          Select a member from the list to manage their check-ins.
        </p>
      </div>
    )
  }

  const recent = visits.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-4">
          <MemberAvatar name={member.name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-white">
                {member.name}
              </h3>
              <MembershipBadge status={member.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {member.email}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          {[
            { label: 'Plan', value: member.membership.plan },
            { label: 'Price', value: formatMoney(member.membership.price) },
            { label: 'Started', value: formatDate(member.membership.started_at) },
            { label: 'Ends', value: formatDate(member.membership.ends_at) },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">
                {stat.label}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCheckIn}
            disabled={inside}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
            Check in
          </button>
          <button
            type="button"
            onClick={onCheckOut}
            disabled={!inside}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-400/40 bg-lime-400/10 px-4 py-2.5 text-sm font-semibold text-lime-400 transition hover:bg-lime-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Check out
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">Check-in history</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {visits.length} visits
            </p>
          </div>
          {visits.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              View all
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-white/40">
            No check-ins recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-white/5 px-5">
            {recent.map((visit) => (
              <li
                key={visit.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    {formatDate(visit.date)}
                  </p>
                  <p className="truncate text-xs text-white/40">
                    {visit.check_in} – {visit.check_out ?? 'Now'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center">
                  {visit.check_out ? (
                    <span className="text-xs font-semibold text-white/60">
                      {formatDuration(visit.check_in, visit.check_out)}
                    </span>
                  ) : (
                    <InsidePill />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CheckinPanel

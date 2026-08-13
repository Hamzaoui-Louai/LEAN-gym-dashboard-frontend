import { useMemo, useState } from 'react'
import MembersModal from './MembersModal'
import MemberAvatar from './MemberAvatar'
import { MembershipBadge, PaymentBadge } from './MemberBadges'
import Pagination from '../Pagination'
import { formatDate, formatMoney } from '../../lib/format'

const PAGE_SIZE = 15

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'

function MemberDetailsContent({ member, onClose, onEdit }) {
  const [historyOpen, setHistoryOpen] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)

  const payments = useMemo(() => {
    return member.payments
      .filter((payment) => (from ? payment.date >= from : true))
      .filter((payment) => (to ? payment.date <= to : true))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [member, from, to])

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayedPayments = payments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const endsLabel =
    member.status === 'expired'
      ? 'Expired'
      : member.status === 'frozen'
        ? 'Frozen'
        : 'Renews'

  const hasFilters = Boolean(from || to)

  return (
    <MembersModal
      open
      onClose={onClose}
      size="lg"
      title={member.name}
      description={`Member since ${formatDate(member.joined_at)}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <MemberAvatar name={member.name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate text-lg font-bold text-white">
                {member.name}
              </h3>
              <MembershipBadge status={member.status} />
            </div>
            <p className="mt-0.5 truncate text-sm text-white/60">{member.email}</p>
            <p className="mt-0.5 text-sm text-white/60">{member.phone}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Current membership
          </p>
          <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { label: 'Plan', value: member.membership.plan },
              { label: 'Price', value: formatMoney(member.membership.price) },
              { label: 'Started', value: formatDate(member.membership.started_at) },
              { label: endsLabel, value: formatDate(member.membership.ends_at) },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                  {stat.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <button
            type="button"
            onClick={() => setHistoryOpen((current) => !current)}
            aria-expanded={historyOpen}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/[0.03]"
          >
            <span className="text-sm font-bold text-white">Payment history</span>
            <span className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/60">
                {payments.length}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-4 w-4 text-white/40 transition-transform ${historyOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          {historyOpen && (
            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="flex-1">
                  <span className="block text-xs font-medium text-white/50">
                    From
                  </span>
                  <input
                    type="date"
                    value={from}
                    onChange={(event) => {
                      setFrom(event.target.value)
                      setPage(1)
                    }}
                    className={`mt-1.5 ${inputClass}`}
                  />
                </label>
                <label className="flex-1">
                  <span className="block text-xs font-medium text-white/50">
                    To
                  </span>
                  <input
                    type="date"
                    value={to}
                    onChange={(event) => {
                      setTo(event.target.value)
                      setPage(1)
                    }}
                    className={`mt-1.5 ${inputClass}`}
                  />
                </label>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setFrom('')
                      setTo('')
                      setPage(1)
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {payments.length === 0 ? (
                <p className="mt-5 text-sm text-white/40">
                  {member.payments.length === 0
                    ? 'No payments recorded yet.'
                    : 'No payments in this date range.'}
                </p>
              ) : (
                <>
                  <ul className="mt-4 divide-y divide-white/5">
                    {displayedPayments.map((payment) => (
                      <li
                        key={payment.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {formatDate(payment.date)}
                          </p>
                          <p className="truncate text-xs text-white/40">
                            {payment.plan} · {payment.method}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            {formatMoney(payment.amount)}
                          </span>
                          <PaymentBadge status={payment.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-center border-t border-white/10 pt-4">
                      <Pagination
                        page={safePage}
                        totalPages={totalPages}
                        onChange={setPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            Edit member
          </button>
        </div>
      </div>
    </MembersModal>
  )
}

function MemberDetailsModal({ member, onClose, onEdit }) {
  if (!member) return null
  return (
    <MemberDetailsContent
      key={member.id}
      member={member}
      onClose={onClose}
      onEdit={onEdit}
    />
  )
}

export default MemberDetailsModal

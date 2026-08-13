import { useMemo, useState } from 'react'
import MembersModal from '../members/MembersModal'
import MemberAvatar from '../members/MemberAvatar'
import { PaymentBadge } from '../members/MemberBadges'
import { StaffStatusBadge } from './StaffBadges'
import Pagination from '../Pagination'
import { formatDate, formatMoney } from '../../lib/format'

const PAGE_SIZE = 15

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'

function StaffDetailsContent({ person, onClose, onEdit, onPayslip }) {
  const [historyOpen, setHistoryOpen] = useState(true)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)

  const payslips = useMemo(() => {
    return person.payslips
      .filter((payslip) => (from ? payslip.date >= from : true))
      .filter((payslip) => (to ? payslip.date <= to : true))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [person, from, to])

  const totalPages = Math.max(1, Math.ceil(payslips.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayedPayslips = payslips.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const hasFilters = Boolean(from || to)

  return (
    <MembersModal
      open
      onClose={onClose}
      size="lg"
      title={person.name}
      description={`${person.role} · joined ${formatDate(person.joined_at)}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <MemberAvatar name={person.name} size="lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate text-lg font-bold text-white">
                {person.name}
              </h3>
              <StaffStatusBadge status={person.status} />
            </div>
            <p className="mt-0.5 truncate text-sm text-white/60">{person.email}</p>
            <p className="mt-0.5 text-sm text-white/60">{person.phone}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Role &amp; pay
          </p>
          <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { label: 'Role', value: person.role },
              { label: 'Monthly salary', value: formatMoney(person.salary) },
              { label: 'Joined', value: formatDate(person.joined_at) },
              {
                label: 'Payslips',
                value: String(person.payslips.length),
              },
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
            <span className="text-sm font-bold text-white">Payslip history</span>
            <span className="flex items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/60">
                {payslips.length}
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

              {payslips.length === 0 ? (
                <p className="mt-5 text-sm text-white/40">
                  {person.payslips.length === 0
                    ? 'No payslips recorded yet.'
                    : 'No payslips in this date range.'}
                </p>
              ) : (
                <>
                  <ul className="mt-4 divide-y divide-white/5">
                    {displayedPayslips.map((payslip) => (
                      <li
                        key={payslip.id}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {payslip.period}
                          </p>
                          <p className="truncate text-xs text-white/40">
                            {formatDate(payslip.date)} · {payslip.method}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            {formatMoney(payslip.amount)}
                          </span>
                          <PaymentBadge status={payslip.status} />
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

        <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onPayslip(person)}
            className="rounded-full border border-lime-400/40 bg-lime-400/10 px-5 py-2.5 text-sm font-semibold text-lime-400 transition hover:bg-lime-400/20"
          >
            New payslip
          </button>
          <button
            type="button"
            onClick={() => onEdit(person)}
            className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
          >
            Edit staff
          </button>
        </div>
      </div>
    </MembersModal>
  )
}

function StaffDetailsModal({ person, onClose, onEdit, onPayslip }) {
  if (!person) return null
  return (
    <StaffDetailsContent
      key={person.id}
      person={person}
      onClose={onClose}
      onEdit={onEdit}
      onPayslip={onPayslip}
    />
  )
}

export default StaffDetailsModal

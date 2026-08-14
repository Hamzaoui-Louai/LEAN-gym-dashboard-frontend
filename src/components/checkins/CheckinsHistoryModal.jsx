import { useMemo, useState } from 'react'
import MembersModal from '../members/MembersModal'
import Pagination from '../Pagination'
import { formatDate } from '../../lib/format'
import { formatDuration } from '../../lib/checkins'

const PAGE_SIZE = 15

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'

function InsidePill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[11px] font-semibold text-lime-400">
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
      Inside
    </span>
  )
}

function CheckinsHistoryContent({ member, visits, onClose }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return visits
      .filter((visit) => (from ? visit.date >= from : true))
      .filter((visit) => (to ? visit.date <= to : true))
      .sort((a, b) =>
        (b.date + b.check_in).localeCompare(a.date + a.check_in),
      )
  }, [visits, from, to])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayed = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const hasFilters = Boolean(from || to)

  return (
    <MembersModal
      open
      onClose={onClose}
      size="lg"
      title="Check-in history"
      description={`${member.name}'s visits`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="block text-xs font-medium text-white/50">From</span>
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
            <span className="block text-xs font-medium text-white/50">To</span>
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

        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/40">
            {visits.length === 0
              ? 'No check-ins recorded yet.'
              : 'No check-ins in this date range.'}
          </p>
        ) : (
          <>
            <ul className="divide-y divide-white/5">
              {displayed.map((visit) => (
                <li
                  key={visit.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {formatDate(visit.date)}
                    </p>
                    <p className="text-xs text-white/40">
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
            {totalPages > 1 && (
              <div className="flex justify-center border-t border-white/10 pt-4">
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
    </MembersModal>
  )
}

function CheckinsHistoryModal({ member, visits, onClose }) {
  if (!member) return null
  return (
    <CheckinsHistoryContent
      key={member.id}
      member={member}
      visits={visits}
      onClose={onClose}
    />
  )
}

export default CheckinsHistoryModal

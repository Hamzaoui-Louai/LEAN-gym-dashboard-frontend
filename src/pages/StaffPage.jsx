import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import StaffTable from '../components/staff/StaffTable'
import StaffFormModal from '../components/staff/StaffFormModal'
import StaffDetailsModal from '../components/staff/StaffDetailsModal'
import PayslipModal from '../components/staff/PayslipModal'
import Pagination from '../components/Pagination'
import DataErrorState from '../components/DataErrorState'
import { TableSkeleton } from '../components/Skeletons'
import { PaymentBadge } from '../components/members/MemberBadges'
import { formatDate, formatMoney } from '../lib/format'
import { MOCK_STAFF } from '../lib/staff'
import { dashboardApi } from '../lib/dashboardApi'
import { useSourceData } from '../hooks/useSourceData'

const PAYSLIP_PAGE_SIZE = 15
const PAGE_SIZE = 15

function StaffPage() {
  const {
    data: staff,
    setData: setStaff,
    isLive,
    isPending,
    isError,
    refetch,
  } = useSourceData({
    queryKey: ['staff'],
    queryFn: dashboardApi.staff.list,
    mockData: MOCK_STAFF,
    emptyValue: [],
  })
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [payslipPage, setPayslipPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [viewingStaff, setViewingStaff] = useState(null)
  const [payslipFor, setPayslipFor] = useState(null)
  const nextIdRef = useRef(MOCK_STAFF.length + 1)
  const tableAreaRef = useRef(null)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const area = tableAreaRef.current
    if (!area) return
    const check = () => {
      setOverflowing(area.scrollHeight > area.clientHeight + 4)
    }
    const observer = new ResizeObserver(check)
    observer.observe(area)
    return () => observer.disconnect()
  }, [expanded, staff.length, page])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staff
    return staff.filter((person) =>
      [person.name, person.email, person.phone, person.role, person.status]
        .some((field) => String(field).toLowerCase().includes(q)),
    )
  }, [staff, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayed = expanded
    ? filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : filtered

  const toggleExpanded = () => {
    setExpanded((current) => !current)
    setPage(1)
  }

  const payslips = useMemo(() => {
    return staff
      .flatMap((person) =>
        person.payslips.map((payslip) => ({
          ...payslip,
          staffId: person.id,
          staffName: person.name,
        })),
      )
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [staff])

  const totalPaid = useMemo(
    () =>
      payslips
        .filter((payslip) => payslip.status === 'paid')
        .reduce((sum, payslip) => sum + payslip.amount, 0),
    [payslips],
  )

  const payslipTotalPages = Math.max(
    1,
    Math.ceil(payslips.length / PAYSLIP_PAGE_SIZE),
  )
  const safePayslipPage = Math.min(payslipPage, payslipTotalPages)
  const visiblePayslips = payslips.slice(
    (safePayslipPage - 1) * PAYSLIP_PAGE_SIZE,
    safePayslipPage * PAYSLIP_PAGE_SIZE,
  )

  const handleAdd = async (person) => {
    if (isLive) {
      await dashboardApi.staff.create(person).catch(() => null)
      await refetch()
      return
    }
    const id = nextIdRef.current
    nextIdRef.current += 1
    setStaff((current) => [...current, { ...person, id }])
  }

  const handleEdit = async (person) => {
    if (isLive) {
      await dashboardApi.staff.update(person).catch(() => null)
      await refetch()
      return
    }
    setStaff((current) =>
      current.map((item) => (item.id === person.id ? person : item)),
    )
  }

  const handleAddPayslip = async (payslip) => {
    if (!payslipFor) return
    if (isLive) {
      await dashboardApi.staff.addPayslip(payslipFor.id, payslip).catch(() => null)
      await refetch()
      setPayslipFor(null)
      return
    }
    setStaff((current) =>
      current.map((person) =>
        person.id === payslipFor.id
          ? { ...person, payslips: [...person.payslips, payslip] }
          : person,
      ),
    )
    setPayslipFor(null)
  }

  const isEmpty = staff.length === 0

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Staff"
        description="Manage your gym's team — profiles, roles, pay and payslips."
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
            placeholder="Search by name, email, phone or role…"
            aria-label="Search staff"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add staff
        </button>
      </div>

      <div className="mt-4 flex flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">All staff</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {filtered.length} of {staff.length}
            </p>
          </div>
          {!isEmpty && (
            <button
              type="button"
              onClick={toggleExpanded}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {expanded ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>

        <div
          ref={tableAreaRef}
          className={`relative ${
            expanded ? 'overflow-visible' : 'max-h-[30rem] overflow-hidden'
          }`}
        >
          {isLive && isPending ? (
            <TableSkeleton rows={8} />
          ) : isLive && isError ? (
            <DataErrorState
              message="Couldn't reach the API. Check that the backend is running and you're logged in."
              onRetry={refetch}
            />
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white/40"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">No staff yet</h3>
                <p className="mt-1 text-sm text-white/60">
                  Add your first staff member to start managing your team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
              >
                Add your first staff member
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <h3 className="text-base font-bold text-white">No staff found</h3>
              <p className="text-sm text-white/60">No staff match “{query}”.</p>
            </div>
          ) : (
            <StaffTable
              staff={displayed}
              onView={setViewingStaff}
              onEdit={setEditingStaff}
              onPayslip={setPayslipFor}
            />
          )}

          {!expanded && overflowing && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent"
            />
          )}
        </div>

        {expanded && totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-center border-t border-white/10 px-6 py-3">
            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        )}

        {!isEmpty && filtered.length > 0 && (
          <div className="flex shrink-0 items-center justify-center border-t border-white/10 px-6 py-3">
            <button
              type="button"
              onClick={toggleExpanded}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              {expanded
                ? 'Collapse'
                : `Show all ${filtered.length} staff ${filtered.length === 1 ? 'member' : 'members'}`}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">Payslip history</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {payslips.length} payslips · {formatMoney(totalPaid)} paid
            </p>
          </div>
        </div>

        {isLive && isPending ? (
          <TableSkeleton rows={5} />
        ) : payslips.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-white/40">
            No payslips yet. Use the Payslip button on any staff row to write one.
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {visiblePayslips.map((payslip) => (
              <li
                key={`${payslip.staffId}-${payslip.id}`}
                className="flex items-center justify-between gap-4 px-6 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {payslip.staffName}
                    <span className="text-white/40"> · {payslip.period}</span>
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
        )}

        {payslipTotalPages > 1 && (
          <div className="flex items-center justify-center border-t border-white/10 px-6 py-3">
            <Pagination
              page={safePayslipPage}
              totalPages={payslipTotalPages}
              onChange={setPayslipPage}
            />
          </div>
        )}
      </div>

      <StaffFormModal
        open={isAddOpen}
        mode="add"
        onClose={() => setIsAddOpen(false)}
        onSubmit={(person) => {
          handleAdd(person)
          setIsAddOpen(false)
        }}
      />

      <StaffFormModal
        open={Boolean(editingStaff)}
        mode="edit"
        person={editingStaff}
        onClose={() => setEditingStaff(null)}
        onSubmit={(person) => {
          handleEdit(person)
          setEditingStaff(null)
        }}
      />

      <StaffDetailsModal
        person={viewingStaff}
        onClose={() => setViewingStaff(null)}
        onEdit={(person) => {
          setViewingStaff(null)
          setEditingStaff(person)
        }}
        onPayslip={(person) => {
          setViewingStaff(null)
          setPayslipFor(person)
        }}
      />

      <PayslipModal
        person={payslipFor}
        onClose={() => setPayslipFor(null)}
        onSubmit={handleAddPayslip}
      />
    </div>
  )
}

export default StaffPage

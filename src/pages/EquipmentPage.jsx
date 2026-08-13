import { useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import EquipmentCard from '../components/equipment/EquipmentCard'
import EquipmentFormModal from '../components/equipment/EquipmentFormModal'
import Pagination from '../components/Pagination'
import { PaymentBadge } from '../components/members/MemberBadges'
import { formatDate, formatMoney } from '../lib/format'
import {
  EQUIPMENT_STATES,
  EQUIPMENT_STATE_ORDER,
  MOCK_EQUIPMENT,
  MOCK_PAYMENTS,
  MOCK_REPAIRS,
} from '../lib/equipment'

const PAGE_SIZE = 15

const selectClass =
  'w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-10 text-sm text-white transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20'

function HistoryList({ rows, totalPages, page, onPageChange, emptyNote }) {
  return (
    <>
      {rows.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-white/40">{emptyNote}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-4 px-6 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {row.title}
                </p>
                <p className="truncate text-xs text-white/40">{row.subtitle}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  {formatMoney(row.amount)}
                </span>
                <PaymentBadge status={row.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center border-t border-white/10 px-6 py-3">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </>
  )
}

function EquipmentPage() {
  const [equipment, setEquipment] = useState(MOCK_EQUIPMENT)
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [repairs] = useState(MOCK_REPAIRS)
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [paymentPage, setPaymentPage] = useState(1)
  const [repairPage, setRepairPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const nextIdRef = useRef(MOCK_EQUIPMENT.length + 1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return equipment.filter((item) => {
      const matchesQuery =
        !q ||
        [item.name, item.category].some((field) =>
          String(field).toLowerCase().includes(q),
        )
      const matchesState =
        stateFilter === 'all' || item.state === stateFilter
      return matchesQuery && matchesState
    })
  }, [equipment, query, stateFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayed = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  const paymentTotalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE))
  const safePaymentPage = Math.min(paymentPage, paymentTotalPages)
  const displayedPayments = payments
    .slice((safePaymentPage - 1) * PAGE_SIZE, safePaymentPage * PAGE_SIZE)
    .map((payment) => ({
      id: payment.id,
      title: payment.item,
      subtitle: `${formatDate(payment.date)} · ${payment.method}`,
      amount: payment.amount,
      status: payment.status,
    }))

  const paymentTotal = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0),
    [payments],
  )

  const repairTotalPages = Math.max(1, Math.ceil(repairs.length / PAGE_SIZE))
  const safeRepairPage = Math.min(repairPage, repairTotalPages)
  const displayedRepairs = repairs
    .slice((safeRepairPage - 1) * PAGE_SIZE, safeRepairPage * PAGE_SIZE)
    .map((repair) => ({
      id: repair.id,
      title: repair.equipment,
      subtitle: `${formatDate(repair.date)} · ${repair.issue}`,
      amount: repair.cost,
      status: repair.status,
    }))

  const repairTotal = useMemo(
    () =>
      repairs
        .filter((repair) => repair.status === 'paid')
        .reduce((sum, repair) => sum + repair.cost, 0),
    [repairs],
  )

  const handleAdd = (item) => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setEquipment((current) => [...current, { ...item, id }])
    setPayments((current) => [
      {
        id: `payment-${id}`,
        date: item.purchased_at,
        item: item.name,
        amount: item.price,
        method: 'Card',
        status: 'paid',
      },
      ...current,
    ])
  }

  const handleEdit = (item) => {
    setEquipment((current) =>
      current.map((entry) => (entry.id === item.id ? item : entry)),
    )
  }

  const isEmpty = equipment.length === 0
  const noResults = !isEmpty && filtered.length === 0

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Equipment"
        description="Track your gym's equipment — inventory, condition, purchases and repairs."
      />

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
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
            placeholder="Search by name or category…"
            aria-label="Search equipment"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
          />
        </div>
        <div className="relative lg:w-52">
          <select
            value={stateFilter}
            onChange={(event) => {
              setStateFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Filter by state"
            className={`${selectClass} [color-scheme:dark]`}
          >
            <option value="all">All states</option>
            {EQUIPMENT_STATE_ORDER.map((value) => (
              <option key={value} value={value}>
                {EQUIPMENT_STATES[value]}
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
          Add equipment
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">All equipment</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {filtered.length} of {equipment.length}
            </p>
          </div>
        </div>

        {isEmpty ? (
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
                <path d="M7 6v12" />
                <path d="M17 6v12" />
                <path d="M5 9v6" />
                <path d="M19 9v6" />
                <path d="M7 12h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No equipment yet</h3>
              <p className="mt-1 text-sm text-white/60">
                Add your first piece of equipment to start tracking it.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
            >
              Add your first equipment
            </button>
          </div>
        ) : noResults ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <h3 className="text-base font-bold text-white">No equipment found</h3>
            <p className="text-sm text-white/60">
              No equipment matches your search and filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayed.map((item) => (
              <EquipmentCard key={item.id} item={item} onOpen={setEditingItem} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex shrink-0 items-center justify-center border-t border-white/10 px-6 py-3">
            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-white">Payment history</h2>
              <p className="mt-0.5 text-xs text-white/40">
                {payments.length} purchases · {formatMoney(paymentTotal)} paid
              </p>
            </div>
          </div>
          <HistoryList
            rows={displayedPayments}
            totalPages={paymentTotalPages}
            page={safePaymentPage}
            onPageChange={setPaymentPage}
            emptyNote="No purchases recorded yet."
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-white">Repair history</h2>
              <p className="mt-0.5 text-xs text-white/40">
                {repairs.length} repairs · {formatMoney(repairTotal)} spent
              </p>
            </div>
          </div>
          <HistoryList
            rows={displayedRepairs}
            totalPages={repairTotalPages}
            page={safeRepairPage}
            onPageChange={setRepairPage}
            emptyNote="No repairs recorded yet."
          />
        </div>
      </div>

      <EquipmentFormModal
        open={isAddOpen}
        mode="add"
        onClose={() => setIsAddOpen(false)}
        onSubmit={(item) => {
          handleAdd(item)
          setIsAddOpen(false)
        }}
      />

      <EquipmentFormModal
        open={Boolean(editingItem)}
        mode="edit"
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={(item) => {
          handleEdit(item)
          setEditingItem(null)
        }}
      />
    </div>
  )
}

export default EquipmentPage

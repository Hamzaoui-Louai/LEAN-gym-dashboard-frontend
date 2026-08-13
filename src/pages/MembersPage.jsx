import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import MembersTable from '../components/members/MembersTable'
import MemberFormModal from '../components/members/MemberFormModal'
import MemberDetailsModal from '../components/members/MemberDetailsModal'
import Pagination from '../components/Pagination'
import { MOCK_MEMBERS } from '../lib/members'

const PAGE_SIZE = 15

function MembersPage() {
  const [members, setMembers] = useState(MOCK_MEMBERS)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [page, setPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [viewingMember, setViewingMember] = useState(null)
  const nextIdRef = useRef(MOCK_MEMBERS.length + 1)
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
  }, [expanded, members.length, page])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((member) =>
      [member.name, member.email, member.phone, member.membership.plan, member.status]
        .some((field) => String(field).toLowerCase().includes(q)),
    )
  }, [members, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const displayed = expanded
    ? filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
    : filtered

  const toggleExpanded = () => {
    setExpanded((current) => !current)
    setPage(1)
  }

  const handleAdd = (member) => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setMembers((current) => [...current, { ...member, id }])
  }

  const handleEdit = (member) => {
    setMembers((current) =>
      current.map((item) => (item.id === member.id ? member : item)),
    )
  }

  const isEmpty = members.length === 0

  return (
    <div
      className={`flex flex-col ${
        expanded
          ? 'min-h-[calc(100dvh-4rem)]'
          : 'h-[calc(100dvh-4rem)]'
      }`}
    >
      <PageHeader
        title="Members"
        description="Manage your gym's members — profiles, memberships and payment history."
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
            placeholder="Search by name, email, phone or plan…"
            aria-label="Search members"
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
          Add member
        </button>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold text-white">All members</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {filtered.length} of {members.length}
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
          className={`relative min-h-0 flex-1 ${
            expanded ? 'overflow-visible' : 'overflow-hidden'
          }`}
        >
          {isEmpty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
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
                <h3 className="text-base font-bold text-white">No members yet</h3>
                <p className="mt-1 text-sm text-white/60">
                  Add your first member to start managing your gym.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
              >
                Add your first member
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <h3 className="text-base font-bold text-white">
                No members found
              </h3>
              <p className="text-sm text-white/60">
                No members match “{query}”.
              </p>
            </div>
          ) : (
            <MembersTable
              members={displayed}
              onView={setViewingMember}
              onEdit={setEditingMember}
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
                : `Show all ${filtered.length} member${filtered.length === 1 ? '' : 's'}`}
            </button>
          </div>
        )}
      </div>

      <MemberFormModal
        open={isAddOpen}
        mode="add"
        onClose={() => setIsAddOpen(false)}
        onSubmit={(member) => {
          handleAdd(member)
          setIsAddOpen(false)
        }}
      />

      <MemberFormModal
        open={Boolean(editingMember)}
        mode="edit"
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSubmit={(member) => {
          handleEdit(member)
          setEditingMember(null)
        }}
      />

      <MemberDetailsModal
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onEdit={(member) => {
          setViewingMember(null)
          setEditingMember(member)
        }}
      />
    </div>
  )
}

export default MembersPage

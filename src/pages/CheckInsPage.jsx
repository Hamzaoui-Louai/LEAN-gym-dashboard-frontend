import { useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import CheckinsList from '../components/checkins/CheckinsList'
import CheckinPanel from '../components/checkins/CheckinPanel'
import CheckinsHistoryModal from '../components/checkins/CheckinsHistoryModal'
import { MOCK_MEMBERS } from '../lib/members'
import { currentTime, MOCK_CHECKINS, TODAY } from '../lib/checkins'

function StatCard({ label, value, subtitle, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {label}
        </p>
        <span className="shrink-0 text-white/30">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-white/40">{subtitle}</p>
    </div>
  )
}

const iconClass = 'h-4 w-4'

function CheckInsPage() {
  const [checkins, setCheckins] = useState(MOCK_CHECKINS)
  const [selectedId, setSelectedId] = useState(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const nextIdRef = useRef(MOCK_CHECKINS.length + 1)

  const insideIds = useMemo(
    () =>
      new Set(
        checkins
          .filter((visit) => visit.date === TODAY && visit.check_out === null)
          .map((visit) => visit.member_id),
      ),
    [checkins],
  )

  const todayCount = useMemo(
    () => checkins.filter((visit) => visit.date === TODAY).length,
    [checkins],
  )

  const selectedMember = useMemo(
    () => MOCK_MEMBERS.find((member) => member.id === selectedId) ?? null,
    [selectedId],
  )

  const selectedVisits = useMemo(() => {
    if (!selectedId) return []
    return checkins
      .filter((visit) => visit.member_id === selectedId)
      .sort((a, b) => (b.date + b.check_in).localeCompare(a.date + a.check_in))
  }, [checkins, selectedId])

  const handleCheckIn = () => {
    if (!selectedMember) return
    const id = nextIdRef.current
    nextIdRef.current += 1
    setCheckins((current) => [
      ...current,
      {
        id,
        member_id: selectedMember.id,
        date: TODAY,
        check_in: currentTime(),
        check_out: null,
      },
    ])
  }

  const handleCheckOut = () => {
    if (!selectedMember) return
    setCheckins((current) =>
      current.map((visit) =>
        visit.member_id === selectedMember.id &&
        visit.date === TODAY &&
        visit.check_out === null
          ? { ...visit, check_out: currentTime() }
          : visit,
      ),
    )
  }

  const selectedInside = selectedMember ? insideIds.has(selectedMember.id) : false

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Check-ins"
        description="See who's in the gym right now and manage daily visits."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Currently inside"
          value={insideIds.size}
          subtitle={`${insideIds.size} of ${MOCK_MEMBERS.length} members`}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={iconClass}
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
          }
        />
        <StatCard
          label="Check-ins today"
          value={todayCount}
          subtitle="visits today"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={iconClass}
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          }
        />
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-bold text-white">Members</h2>
            <p className="mt-0.5 text-xs text-white/40">
              {MOCK_MEMBERS.length} members · {insideIds.size} inside now
            </p>
          </div>
          <CheckinsList
            members={MOCK_MEMBERS}
            insideIds={insideIds}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <aside className="w-full shrink-0 xl:w-[400px]">
          <CheckinPanel
            member={selectedMember}
            visits={selectedVisits}
            inside={selectedInside}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onViewAll={() => setHistoryOpen(true)}
          />
        </aside>
      </div>

      {historyOpen && selectedMember && (
        <CheckinsHistoryModal
          member={selectedMember}
          visits={selectedVisits}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </div>
  )
}

export default CheckInsPage

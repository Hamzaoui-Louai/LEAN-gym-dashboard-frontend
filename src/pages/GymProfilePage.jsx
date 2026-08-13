import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import GymProfileModal from '../components/gym/GymProfileModal'
import { GymStatusBadge } from '../components/gym/GymBadges'
import { formatDate } from '../lib/format'
import { formatDays, MOCK_GYM } from '../lib/gym'
import { MOCK_MEMBERS } from '../lib/members'
import { MOCK_STAFF } from '../lib/staff'
import { MOCK_EQUIPMENT } from '../lib/equipment'

const iconClass = 'h-4 w-4'

const STATS = [
  {
    label: 'Total members',
    value: MOCK_MEMBERS.length,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Active members',
    value: MOCK_MEMBERS.filter((member) => member.status === 'active').length,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    label: 'Total staff',
    value: MOCK_STAFF.length,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Total equipment',
    value: MOCK_EQUIPMENT.length,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClass}
      >
        <path d="M7 6v12" />
        <path d="M17 6v12" />
        <path d="M5 9v6" />
        <path d="M19 9v6" />
        <path d="M7 12h10" />
      </svg>
    ),
  },
]

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-widest text-white/40">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </div>
  )
}

function GymProfilePage() {
  const [gym, setGym] = useState(MOCK_GYM)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleSave = (next) => {
    setGym(next)
    setIsEditOpen(false)
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Gym Profile"
        description="Your gym's public information, opening hours and statistics."
      />

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-5">
            {gym.logo ? (
              <img
                src={gym.logo}
                alt={`${gym.name} logo`}
                className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-lime-400 text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-8 w-8"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l7-4 7 4v14" />
                  <path d="M9 21v-4h6v4" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="truncate text-xl font-black tracking-tight text-white">
                  {gym.name}
                </h2>
                <GymStatusBadge status={gym.status} />
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                {gym.description}
              </p>
              <p className="mt-3 text-sm text-white/50">{gym.address}</p>
              <p className="mt-1 text-xs text-white/40">
                Registered {formatDate(gym.registered_at)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
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
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Edit profile
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {stat.label}
              </p>
              <span className="shrink-0 text-white/30">{stat.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
          <h2 className="text-sm font-bold text-white">Contact information</h2>
          <div className="mt-2 divide-y divide-white/5">
            <InfoRow
              label="Email"
              value={gym.email}
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
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
            />
            <InfoRow
              label="Phone number"
              value={gym.phone}
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
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
          <h2 className="text-sm font-bold text-white">Opening hours</h2>
          <div className="mt-2 divide-y divide-white/5">
            <InfoRow
              label="Opening time"
              value={gym.opens_at}
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <InfoRow
              label="Closing time"
              value={gym.closes_at}
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
            />
            <InfoRow
              label="Days open"
              value={formatDays(gym.days_open)}
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
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {isEditOpen && (
        <GymProfileModal gym={gym} onClose={() => setIsEditOpen(false)} onSubmit={handleSave} />
      )}
    </div>
  )
}

export default GymProfilePage

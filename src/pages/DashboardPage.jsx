import { useAuth } from '../hooks/useAuth'
import PlaceholderBody from '../components/PlaceholderBody'

const stats = [
  { label: 'Members', value: '—' },
  { label: 'Active subscriptions', value: '—' },
  { label: 'Check-ins today', value: '—' },
  { label: 'Revenue this month', value: '—' },
]

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
        Dashboard
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
        Welcome, {user?.name ?? 'there'}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-white/60">
        Here is an overview of your gym. Pick a section from the sidebar to get
        started.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <PlaceholderBody note="Detailed modules for members, staff, equipment and more will appear here next." />
    </div>
  )
}

export default DashboardPage

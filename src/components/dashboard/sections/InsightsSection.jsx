import DataErrorBanner from '../../DataErrorBanner'
import Panel from '../../Panel'
import { PanelSkeleton } from '../../Skeletons'
import DonutChart from '../../charts/DonutChart'
import { Avatar, InsidePill, ShareList, Tile } from '../widgets'
import { formatDate, formatMoneyCompact } from '../../../lib/format'
import { MEMBERSHIP_COLORS } from '../../../lib/finances'

function withColor(row, key, colors) {
  return { ...row, color: row.color ?? colors[row[key]] }
}

function InsightsSection({ stats, isPending, isError, onRetry }) {
  if (isPending) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PanelSkeleton />
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-3">
        <DataErrorBanner message="Couldn't load insights." onRetry={onRetry} />
      </div>
    )
  }

  const membershipRevenue = stats.membershipRevenue.map((row) =>
    withColor(row, 'plan', MEMBERSHIP_COLORS),
  )
  const rosterDonut = stats.rosterDonut.map((row) =>
    withColor(row, 'label', MEMBERSHIP_COLORS),
  )

  return (
    <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Panel title="Revenue overview" subtitle="This month">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-white/40">Revenue this month</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-lime-400">
              {formatMoneyCompact(stats.monthRevenue)}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              stats.revenueGrowth >= 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-rose-400/10 text-rose-400'
            }`}
          >
            {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth).toFixed(1)}% vs last month
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-white/40">
          <span>Monthly average</span>
          <span className="font-semibold text-white/70">{formatMoneyCompact(stats.avgMonthlyRevenue)}</span>
        </div>
        <div className="my-4 h-px bg-white/10" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Revenue by membership type
        </p>
        <ShareList rows={membershipRevenue} format={formatMoneyCompact} />
      </Panel>

      <Panel title="Membership overview" subtitle="Current roster">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-2xl font-black text-lime-400">{stats.activeMembers}</p>
            <p className="mt-1 text-[11px] text-white/40">Active</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-2xl font-black text-amber-400">{stats.expiringMemberships}</p>
            <p className="mt-1 text-[11px] text-white/40">Expiring</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-2xl font-black text-rose-400">{stats.expiredMembers}</p>
            <p className="mt-1 text-[11px] text-white/40">Expired</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <DonutChart data={rosterDonut} size={104} strokeWidth={12} />
          <ul className="flex-1 space-y-1.5">
            {rosterDonut.map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-white/60">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
                  {row.label}
                </span>
                <span className="font-semibold text-white">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="Check-in overview" subtitle="Today">
        <div className="grid grid-cols-2 gap-3">
          <Tile label="Today's check-ins" value={stats.todayCheckins} />
          <Tile label="Current attendance" value={stats.insideNow} tone="lime" sub="inside now" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Recent check-ins
        </p>
        <ul className="mt-1 divide-y divide-white/5">
          {stats.recentCheckins.map((visit) => (
            <li key={visit.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={visit.member} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{visit.member}</p>
                  <p className="text-xs text-white/40">{formatDate(visit.date)}</p>
                </div>
              </div>
              {visit.check_out === null ? (
                <InsidePill />
              ) : (
                <span className="shrink-0 text-xs font-semibold text-white/60">
                  {visit.check_in}
                </span>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export default InsightsSection

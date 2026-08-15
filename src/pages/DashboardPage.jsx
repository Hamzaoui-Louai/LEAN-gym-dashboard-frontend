import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import DataErrorBanner from '../components/DataErrorBanner'
import { PageSkeleton } from '../components/Skeletons'
import { ICONS } from '../components/DashboardIcons'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import Legend from '../components/charts/Legend'
import { useAuth } from '../hooks/useAuth'
import { useDashboardNav } from '../hooks/useDashboardNav'
import { useSourceData } from '../hooks/useSourceData'
import { formatMoney, formatDate } from '../lib/format'
import { MOCK_MEMBERS } from '../lib/members'
import { MOCK_STAFF } from '../lib/staff'
import { MOCK_EQUIPMENT, MOCK_REPAIRS } from '../lib/equipment'
import { MOCK_CHECKINS, TODAY } from '../lib/checkins'
import { dashboardApi } from '../lib/dashboardApi'
import {
  MEMBERSHIP_COLORS,
  MEMBERSHIP_TYPES,
  MOCK_FINANCE_MONTHS,
  netIncomeFor,
  totalExpenses,
} from '../lib/finances'

const money = (value) => formatMoney(value).replace(/\.00$/, '')

const TONES = {
  white: 'text-white',
  lime: 'text-lime-400',
  rose: 'text-rose-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
}

function isoDaysFromNow(days) {
  const date = new Date(`${TODAY}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const EXPIRING_MIN = TODAY
const EXPIRING_MAX = isoDaysFromNow(30)

function computeDashboardStats({ members, staff, equipment, repairs, checkins, financeMonths }) {
  const activeMembers = members.filter((member) => member.status === 'active').length
  const expiredMembers = members.filter((member) => member.status === 'expired').length
  const expiringMemberships = members.filter((member) => {
    const ends = member.membership?.ends_at
    return ends && ends >= EXPIRING_MIN && ends <= EXPIRING_MAX
  }).length

  const activeStaff = staff.filter((person) => person.status === 'active').length
  const monthlyPayroll = staff
    .filter((person) => person.status === 'active')
    .reduce((sum, person) => sum + person.salary, 0)

  const availableEquipment = equipment.filter(
    (item) => item.state === 'operational' || item.state === 'in_use',
  ).length
  const maintenanceEquipment = equipment.filter((item) => item.state === 'under_repair').length
  const brokenEquipment = equipment.filter((item) => item.state === 'out_of_order').length

  const todayCheckins = checkins.filter((visit) => visit.date === TODAY).length
  const insideNow = checkins.filter(
    (visit) => visit.date === TODAY && visit.check_out === null,
  ).length

  const memberById = Object.fromEntries(members.map((member) => [member.id, member]))
  const recentCheckins = checkins
    .slice(0, 5)
    .map((visit) => ({ member: memberById[visit.member_id], visit }))
    .filter((row) => row.member)

  const recentPayslips = staff
    .flatMap((person) =>
      (person.payslips ?? []).map((payslip) => ({ ...payslip, name: person.name })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  const recentRepairs = repairs.slice(0, 5)

  const latest = financeMonths[financeMonths.length - 1]
  const previous = financeMonths.length > 1 ? financeMonths[financeMonths.length - 2] : latest
  const monthRevenue = latest?.revenue ?? 0
  const previousRevenue = previous?.revenue ?? 0
  const avgMonthlyRevenue = financeMonths.length
    ? Math.round(
        financeMonths.reduce((sum, month) => sum + month.revenue, 0) /
          financeMonths.length,
      )
    : 0
  const revenueGrowth = previousRevenue
    ? ((monthRevenue - previousRevenue) / previousRevenue) * 100
    : 0
  const monthExpenses = latest ? totalExpenses(latest.expenses) : 0
  const monthNet = latest ? netIncomeFor(latest) : 0
  const netMargin = monthRevenue ? (monthNet / monthRevenue) * 100 : 0

  const membershipRevenue = MEMBERSHIP_TYPES.map((plan) => ({
    plan,
    value: latest?.memberships[plan] ?? 0,
    color: MEMBERSHIP_COLORS[plan],
  }))

  const rosterDonut = MEMBERSHIP_TYPES.map((plan) => ({
    label: plan,
    value: members.filter((member) => member.membership?.plan === plan).length,
    color: MEMBERSHIP_COLORS[plan],
  })).filter((row) => row.value > 0)

  const revExpData = financeMonths.slice(-6).map((month) => ({
    label: month.label,
    revenue: month.revenue,
    expenses: totalExpenses(month.expenses),
  }))

  return {
    totalMembers: members.length,
    activeMembers,
    expiringMemberships,
    expiredMembers,
    totalStaff: staff.length,
    activeStaff,
    monthlyPayroll,
    totalEquipment: equipment.length,
    availableEquipment,
    maintenanceEquipment,
    brokenEquipment,
    todayCheckins,
    insideNow,
    recentCheckins,
    recentPayslips,
    recentRepairs,
    monthRevenue,
    avgMonthlyRevenue,
    revenueGrowth,
    monthExpenses,
    monthNet,
    netMargin,
    membershipRevenue,
    rosterDonut,
    revExpData,
  }
}

const QUICK_LINKS = [
  { path: '/dashboard/members', label: 'Members', icon: ICONS['/dashboard/members'] },
  { path: '/dashboard/staff', label: 'Staff', icon: ICONS['/dashboard/staff'] },
  { path: '/dashboard/equipment', label: 'Equipment', icon: ICONS['/dashboard/equipment'] },
  { path: '/dashboard/check-ins', label: 'Check-ins', icon: ICONS['/dashboard/check-ins'] },
  { path: '/dashboard/finances', label: 'Finances', icon: ICONS['/dashboard/finances'] },
  { path: '/dashboard/gym-profile', label: 'Gym Profile', icon: ICONS['/dashboard/gym-profile'] },
  { path: '/dashboard/settings', label: 'Settings', icon: ICONS['/dashboard/settings'] },
]

function Tile({ label, value, sub, tone = 'white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{label}</p>
      <p className={`mt-2 text-2xl font-black tracking-tight ${TONES[tone]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mt-8">
      <h2 className="text-base font-bold text-white">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>}
    </div>
  )
}

function ShareList({ rows, format }) {
  const max = Math.max(...rows.map((row) => row.value), 1)
  return (
    <ul className="mt-3 space-y-2.5">
      {rows.map((row) => (
        <li key={row.plan}>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-white/60">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
              {row.plan}
            </span>
            <span className="font-semibold text-white">{format(row.value)}</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.value / max) * 100}%`, backgroundColor: row.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function Avatar({ name }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

function InsidePill() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[11px] font-semibold text-lime-400">
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
      Inside
    </span>
  )
}

function StatusDot({ status }) {
  const color =
    status === 'paid' ? 'bg-lime-400' : status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
}

function DashboardPage() {
  const { user } = useAuth()
  const { navigateTo } = useDashboardNav()

  const membersQuery = useSourceData({
    queryKey: ['members'],
    queryFn: dashboardApi.members.list,
    mockData: MOCK_MEMBERS,
    emptyValue: [],
  })
  const staffQuery = useSourceData({
    queryKey: ['staff'],
    queryFn: dashboardApi.staff.list,
    mockData: MOCK_STAFF,
    emptyValue: [],
  })
  const equipmentQuery = useSourceData({
    queryKey: ['equipment'],
    queryFn: dashboardApi.equipment.list,
    mockData: MOCK_EQUIPMENT,
    emptyValue: [],
  })
  const repairsQuery = useSourceData({
    queryKey: ['equipment-repairs'],
    queryFn: dashboardApi.equipment.repairs,
    mockData: MOCK_REPAIRS,
    emptyValue: [],
  })
  const checkinsQuery = useSourceData({
    queryKey: ['checkins'],
    queryFn: dashboardApi.checkins.list,
    mockData: MOCK_CHECKINS,
    emptyValue: [],
  })
  const financeMonthsQuery = useSourceData({
    queryKey: ['finances'],
    queryFn: dashboardApi.finances.overview,
    mockData: MOCK_FINANCE_MONTHS,
    emptyValue: [],
  })

  const members = membersQuery.data
  const staff = staffQuery.data
  const equipment = equipmentQuery.data
  const repairs = repairsQuery.data
  const checkins = checkinsQuery.data
  const financeMonths = financeMonthsQuery.data

  const isLive = membersQuery.isLive
  const loadError = [
    membersQuery,
    staffQuery,
    equipmentQuery,
    repairsQuery,
    checkinsQuery,
    financeMonthsQuery,
  ].some((query) => query.isError)
  const anyPending = [
    membersQuery,
    staffQuery,
    equipmentQuery,
    repairsQuery,
    checkinsQuery,
    financeMonthsQuery,
  ].some((query) => query.isPending)

  const refetchAll = () => {
    membersQuery.refetch()
    staffQuery.refetch()
    equipmentQuery.refetch()
    repairsQuery.refetch()
    checkinsQuery.refetch()
    financeMonthsQuery.refetch()
  }

  const stats = computeDashboardStats({
    members,
    staff,
    equipment,
    repairs,
    checkins,
    financeMonths,
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name ?? 'there'} — here's what's happening at your gym today (${formatDate(TODAY)}).`}
      />

      {isLive && loadError && (
        <DataErrorBanner
          message="Couldn't load some live data."
          onRetry={refetchAll}
        />
      )}

      {isLive && anyPending ? (
        <div className="mt-6">
          <PageSkeleton />
        </div>
      ) : (
        <>
          <SectionHeader title="Overview" subtitle="At a glance" />
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <Tile label="Total members" value={stats.totalMembers} />
        <Tile label="Active members" value={stats.activeMembers} tone="lime" />
        <Tile
          label="Expiring memberships"
          value={stats.expiringMemberships}
          tone="amber"
          sub="next 30 days"
        />
        <Tile label="Total staff" value={stats.totalStaff} sub={`${stats.activeStaff} active`} />
        <Tile label="Total equipment" value={stats.totalEquipment} tone="sky" />
        <Tile label="Today's check-ins" value={stats.todayCheckins} tone="lime" sub={`${stats.insideNow} inside now`} />
      </div>

      <SectionHeader title="Insights" subtitle="Revenue, memberships and attendance" />
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Revenue overview" subtitle="This month">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-white/40">Revenue this month</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-lime-400">
                {money(stats.monthRevenue)}
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
            <span className="font-semibold text-white/70">{money(stats.avgMonthlyRevenue)}</span>
          </div>
          <div className="my-4 h-px bg-white/10" />
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Revenue by membership type
          </p>
          <ShareList rows={stats.membershipRevenue} format={money} />
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
            <DonutChart data={stats.rosterDonut} size={104} strokeWidth={12} />
            <ul className="flex-1 space-y-1.5">
              {stats.rosterDonut.map((row) => (
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
            {stats.recentCheckins.map(({ member, visit }) => (
              <li key={visit.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={member.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{member.name}</p>
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

      <SectionHeader title="Operations" subtitle="Staff, payroll and equipment" />
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Staff overview" subtitle="Payroll and recent payslips">
          <div className="grid grid-cols-2 gap-3">
            <Tile label="Total staff" value={stats.totalStaff} sub={`${stats.activeStaff} active`} />
            <Tile label="Monthly payroll" value={money(stats.monthlyPayroll)} tone="lime" />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Recent payslips
          </p>
          <ul className="mt-1 divide-y divide-white/5">
            {stats.recentPayslips.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{row.name}</p>
                  <p className="truncate text-xs text-white/40">{row.period}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusDot status={row.status} />
                  <span className="text-xs font-semibold text-white/80">{money(row.amount)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Equipment overview" subtitle="Fleet status and recent repairs">
          <div className="grid grid-cols-2 gap-3">
            <Tile label="Total equipment" value={stats.totalEquipment} />
            <Tile label="Available" value={stats.availableEquipment} tone="lime" />
            <Tile label="Under maintenance" value={stats.maintenanceEquipment} tone="amber" />
            <Tile label="Broken" value={stats.brokenEquipment} tone="rose" />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Recent repairs
          </p>
          <ul className="mt-1 divide-y divide-white/5">
            {stats.recentRepairs.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{row.equipment}</p>
                  <p className="truncate text-xs text-white/40">{row.issue}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusDot status={row.status} />
                  <span className="text-xs font-semibold text-white/80">{money(row.cost)}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <SectionHeader title="Finances" subtitle="Revenue vs expenses over the last 6 months" />
      <div className="mt-3">
        <Panel title="Financial overview" subtitle="This month and the recent trend">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Revenue</p>
                <p className="mt-1 text-2xl font-black text-lime-400">{money(stats.monthRevenue)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Expenses</p>
                <p className="mt-1 text-2xl font-black text-rose-400">{money(stats.monthExpenses)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/40">Net income</p>
                <p className={`mt-1 text-2xl font-black ${stats.monthNet >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                  {money(stats.monthNet)}
                </p>
                <p className="mt-1 text-xs text-white/40">{stats.netMargin.toFixed(1)}% margin</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <BarChart
                data={stats.revExpData}
                series={[
                  { key: 'revenue', color: '#a3e635' },
                  { key: 'expenses', color: '#fb7185' },
                ]}
                height={220}
              />
              <div className="mt-4">
                <Legend
                  items={[
                    { label: 'Revenue', color: '#a3e635' },
                    { label: 'Expenses', color: '#fb7185' },
                  ]}
                />
              </div>
            </div>
          </div>
        </Panel>
      </div>
        </>
      )}

      <SectionHeader title="Navigation" subtitle="Jump straight to a module" />
      <div className="mt-3">
        <Panel title="Quick navigation">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(event) => navigateTo(event, link.path)}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center transition hover:border-lime-400/40 hover:bg-white/5"
              >
                <span className="text-white/50 transition group-hover:text-lime-400">
                  {link.icon}
                </span>
                <span className="text-xs font-semibold text-white/70 transition group-hover:text-white">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default DashboardPage

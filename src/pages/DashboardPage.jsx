import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import SectionHeader from '../components/SectionHeader'
import { ICONS } from '../components/DashboardIcons'
import OverviewSection from '../components/dashboard/sections/OverviewSection'
import InsightsSection from '../components/dashboard/sections/InsightsSection'
import OperationsSection from '../components/dashboard/sections/OperationsSection'
import FinancesSection from '../components/dashboard/sections/FinancesSection'
import { useAuth } from '../hooks/useAuth'
import { useDashboardNav } from '../hooks/useDashboardNav'
import { useSourceData } from '../hooks/useSourceData'
import { formatDate } from '../lib/format'
import { MOCK_MEMBERS } from '../lib/members'
import { MOCK_STAFF } from '../lib/staff'
import { MOCK_EQUIPMENT, MOCK_REPAIRS } from '../lib/equipment'
import { MOCK_CHECKINS, TODAY } from '../lib/checkins'
import { MOCK_FINANCE_MONTHS } from '../lib/finances'
import { dashboardApi } from '../lib/dashboardApi'
import {
  computeOverviewStats,
  computeInsightsStats,
  computeOperationsStats,
  computeFinancesStats,
} from '../lib/dashboardStats'

const QUICK_LINKS = [
  { path: '/dashboard/members', label: 'Members', icon: ICONS['/dashboard/members'] },
  { path: '/dashboard/staff', label: 'Staff', icon: ICONS['/dashboard/staff'] },
  { path: '/dashboard/equipment', label: 'Equipment', icon: ICONS['/dashboard/equipment'] },
  { path: '/dashboard/check-ins', label: 'Check-ins', icon: ICONS['/dashboard/check-ins'] },
  { path: '/dashboard/finances', label: 'Finances', icon: ICONS['/dashboard/finances'] },
  { path: '/dashboard/gym-profile', label: 'Gym Profile', icon: ICONS['/dashboard/gym-profile'] },
  { path: '/dashboard/settings', label: 'Settings', icon: ICONS['/dashboard/settings'] },
]

const EMPTY_OVERVIEW = {
  totalMembers: 0,
  activeMembers: 0,
  expiringMemberships: 0,
  expiredMembers: 0,
  totalStaff: 0,
  activeStaff: 0,
  totalEquipment: 0,
  availableEquipment: 0,
  maintenanceEquipment: 0,
  brokenEquipment: 0,
  todayCheckins: 0,
  insideNow: 0,
}

const EMPTY_INSIGHTS = {
  activeMembers: 0,
  expiringMemberships: 0,
  expiredMembers: 0,
  todayCheckins: 0,
  insideNow: 0,
  monthRevenue: 0,
  avgMonthlyRevenue: 0,
  revenueGrowth: 0,
  membershipRevenue: [],
  rosterDonut: [],
  recentCheckins: [],
}

const EMPTY_OPERATIONS = {
  totalStaff: 0,
  activeStaff: 0,
  monthlyPayroll: 0,
  recentPayslips: [],
  totalEquipment: 0,
  availableEquipment: 0,
  maintenanceEquipment: 0,
  brokenEquipment: 0,
  recentRepairs: [],
}

const EMPTY_FINANCES = {
  monthRevenue: 0,
  monthExpenses: 0,
  monthNet: 0,
  netMargin: 0,
  revExpData: [],
}

const MOCK_OVERVIEW_STATS = computeOverviewStats({
  members: MOCK_MEMBERS,
  staff: MOCK_STAFF,
  equipment: MOCK_EQUIPMENT,
  checkins: MOCK_CHECKINS,
})

const MOCK_INSIGHTS_STATS = computeInsightsStats({
  members: MOCK_MEMBERS,
  checkins: MOCK_CHECKINS,
  financeMonths: MOCK_FINANCE_MONTHS,
})

const MOCK_OPERATIONS_STATS = computeOperationsStats({
  staff: MOCK_STAFF,
  equipment: MOCK_EQUIPMENT,
  repairs: MOCK_REPAIRS,
})

const MOCK_FINANCES_STATS = computeFinancesStats({ financeMonths: MOCK_FINANCE_MONTHS })

function DashboardPage() {
  const { user } = useAuth()
  const { navigateTo } = useDashboardNav()

  const overviewQuery = useSourceData({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardApi.dashboard.overview,
    mockData: MOCK_OVERVIEW_STATS,
    emptyValue: EMPTY_OVERVIEW,
  })
  const insightsQuery = useSourceData({
    queryKey: ['dashboard-insights'],
    queryFn: dashboardApi.dashboard.insights,
    mockData: MOCK_INSIGHTS_STATS,
    emptyValue: EMPTY_INSIGHTS,
  })
  const operationsQuery = useSourceData({
    queryKey: ['dashboard-operations'],
    queryFn: dashboardApi.dashboard.operations,
    mockData: MOCK_OPERATIONS_STATS,
    emptyValue: EMPTY_OPERATIONS,
  })
  const financesQuery = useSourceData({
    queryKey: ['dashboard-finances'],
    queryFn: dashboardApi.dashboard.finances,
    mockData: MOCK_FINANCES_STATS,
    emptyValue: EMPTY_FINANCES,
  })

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name ?? 'there'} — here's what's happening at your gym today (${formatDate(TODAY)}).`}
      />

      <SectionHeader title="Overview" subtitle="At a glance" />
      <OverviewSection
        stats={overviewQuery.data}
        isPending={overviewQuery.isPending}
        isError={overviewQuery.isError}
        onRetry={overviewQuery.refetch}
      />

      <SectionHeader title="Insights" subtitle="Revenue, memberships and attendance" />
      <InsightsSection
        stats={insightsQuery.data}
        isPending={insightsQuery.isPending}
        isError={insightsQuery.isError}
        onRetry={insightsQuery.refetch}
      />

      <SectionHeader title="Operations" subtitle="Staff, payroll and equipment" />
      <OperationsSection
        stats={operationsQuery.data}
        isPending={operationsQuery.isPending}
        isError={operationsQuery.isError}
        onRetry={operationsQuery.refetch}
      />

      <SectionHeader title="Finances" subtitle="Revenue vs expenses over the last 6 months" />
      <FinancesSection
        stats={financesQuery.data}
        isPending={financesQuery.isPending}
        isError={financesQuery.isError}
        onRetry={financesQuery.refetch}
      />

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

import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import SectionHeader from '../components/SectionHeader'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import Legend from '../components/charts/Legend'
import { Tile } from '../components/dashboard/widgets'
import MetricCard from '../components/finances/MetricCard'
import DonutLegend from '../components/finances/DonutLegend'
import { formatMoneyCompact } from '../lib/format'
import {
  DEFAULT_PERIOD_ID,
  MEMBERSHIP_COLORS,
  MEMBERSHIP_TYPES,
  MOCK_FINANCE_MONTHS,
  netIncomeFor,
  PERIODS,
  rosterByTypeDetails,
  rosterByTypeDetailsFor,
  rosterStatusCounts,
  rosterStatusCountsFor,
} from '../lib/finances'
import { MOCK_MEMBERS } from '../lib/members'
import { buildFinanceMetrics } from '../lib/financeMetrics'
import DataErrorState from '../components/DataErrorState'
import { PageSkeleton } from '../components/Skeletons'
import { dashboardApi } from '../lib/dashboardApi'
import { useSourceData } from '../hooks/useSourceData'

const pillActive =
  'rounded-full bg-lime-400 px-4 py-2 text-xs font-semibold text-black hover:bg-lime-300'
const pillIdle =
  'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white'

function FinancesPage() {
  const [periodId, setPeriodId] = useState(DEFAULT_PERIOD_ID)

  const {
    data: financeMonths,
    isLive,
    isPending: financePending,
    isError,
    refetch,
  } = useSourceData({
    queryKey: ['finances'],
    queryFn: dashboardApi.finances.overview,
    mockData: MOCK_FINANCE_MONTHS,
    emptyValue: [],
  })
  const { data: members, isPending: membersPending } = useSourceData({
    queryKey: ['members'],
    queryFn: dashboardApi.members.list,
    mockData: MOCK_MEMBERS,
    emptyValue: [],
  })

  const period = PERIODS.find((p) => p.id === periodId)
  const sourceMonths = isLive ? financeMonths : MOCK_FINANCE_MONTHS

  if (isLive && (financePending || membersPending)) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Finances"
          description="Revenue, expenses, memberships and profit overview."
        />
        <div className="mt-6">
          <PageSkeleton />
        </div>
      </div>
    )
  }

  if (isLive && isError) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Finances"
          description="Revenue, expenses, memberships and profit overview."
        />
        <DataErrorState
          message="Couldn't reach the API. Check that the backend is running and you're logged in."
          onRetry={refetch}
        />
      </div>
    )
  }

  if (isLive && sourceMonths.length === 0) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Finances"
          description="Revenue, expenses, memberships and profit overview."
        />
        <p className="mt-10 text-center text-sm text-white/40">
          Live finance data unavailable.
        </p>
      </div>
    )
  }

  const months = sourceMonths.slice(-period.months)
  const roster = isLive ? rosterByTypeDetailsFor(members) : rosterByTypeDetails()
  const {
    aggregate,
    latest,
    previous,
    expensesTotal,
    netIncome,
    monthlyRevenue,
    monthlyExpenses,
    revenueGrowth,
    netMargin,
    bestMonth,
    revenueByMonth,
    expensesByMonth,
    revExpData,
    netIncomeByMonth,
    membershipDonut,
    mostProfitable,
    expenseDonut,
    staffVsEquipment,
    subsTotal,
    rosterDonut,
  } = buildFinanceMetrics({ months, roster })

  const statusCounts = isLive ? rosterStatusCountsFor(members) : rosterStatusCounts()
  const activeCount = statusCounts.active ?? 0
  const frozenCount = statusCounts.frozen ?? 0
  const expiredCount = statusCounts.expired ?? 0

  return (
    <div className="flex flex-col">
      <PageHeader title="Finances" description="Revenue, expenses, memberships and profit overview." />

      <div className="mt-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriodId(p.id)}
            className={periodId === p.id ? pillActive : pillIdle}
          >
            {p.label}
          </button>
        ))}
      </div>

      <SectionHeader title="Financial overview" subtitle={`Summary for ${period.label}`} />
      <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <Tile size="md" label="Total revenue" value={formatMoneyCompact(aggregate.revenue)} tone="lime" />
        <Tile size="md" label="Total expenses" value={formatMoneyCompact(expensesTotal)} tone="rose" />
        <Tile
          size="md"
          label="Net income"
          value={formatMoneyCompact(netIncome)}
          tone={netIncome >= 0 ? 'lime' : 'rose'}
          sub={`${netMargin.toFixed(1)}% margin`}
        />
        <Tile size="md" label="Monthly revenue" value={formatMoneyCompact(monthlyRevenue)} sub={latest.label} />
        <Tile size="md" label="Monthly expenses" value={formatMoneyCompact(monthlyExpenses)} sub={latest.label} />
      </div>

      <SectionHeader title="Revenue analytics" subtitle="Where your income comes from" />
      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Revenue by month"
          subtitle={`Per month for ${period.label}`}
        >
          <BarChart data={revenueByMonth} series={[{ key: 'value', color: '#a3e635' }]} />
          <div className="mt-4">
            <Legend items={[{ label: 'Revenue', color: '#a3e635' }]} />
          </div>
        </Panel>
        <Panel title="Revenue distribution" subtitle="By membership type">
          <div className="flex justify-center">
            <DonutChart data={membershipDonut} />
          </div>
          <DonutLegend rows={membershipDonut} format={formatMoneyCompact} />
        </Panel>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Revenue growth" subtitle="Latest month vs the one before">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                revenueGrowth >= 0 ? 'bg-lime-400/10 text-lime-400' : 'bg-rose-400/10 text-rose-400'
              }`}
            >
              {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth).toFixed(1)}%
            </span>
            <span className="text-xs text-white/40">vs {previous.label}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-white/40">This period</p>
            <p className="mt-1 text-2xl font-black text-white">{formatMoneyCompact(aggregate.revenue)}</p>
          </div>
        </Panel>
        <Panel
          className="lg:col-span-2"
          title="New subscriptions vs renewals"
          subtitle="Volume in this period"
        >
          <div className="grid grid-cols-2 gap-4">
            <MetricCard label="New subscriptions" value={aggregate.new_subscriptions} tone="lime" />
            <MetricCard label="Renewals" value={aggregate.renewals} tone="sky" />
          </div>
          <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-lime-400"
              style={{ width: `${(aggregate.new_subscriptions / subsTotal) * 100}%` }}
            />
            <div
              className="h-full bg-sky-400"
              style={{ width: `${(aggregate.renewals / subsTotal) * 100}%` }}
            />
          </div>
          <div className="mt-3">
            <Legend
              items={[
                { label: 'New subscriptions', color: '#a3e635' },
                { label: 'Renewals', color: '#38bdf8' },
              ]}
            />
          </div>
        </Panel>
      </div>

      <SectionHeader title="Expense analytics" subtitle="Where your money goes" />
      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          className="lg:col-span-2"
          title="Expenses by month"
          subtitle={`Per month for ${period.label}`}
        >
          <BarChart data={expensesByMonth} series={[{ key: 'value', color: '#fb7185' }]} />
          <div className="mt-4">
            <Legend items={[{ label: 'Expenses', color: '#fb7185' }]} />
          </div>
        </Panel>
        <Panel title="Expenses by category" subtitle="Within this period">
          <div className="flex justify-center">
            <DonutChart data={expenseDonut} />
          </div>
          <DonutLegend rows={expenseDonut} format={formatMoneyCompact} />
        </Panel>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Staff salaries vs equipment expenses" subtitle="The two biggest cost drivers">
          <div className="flex justify-center">
            <DonutChart data={staffVsEquipment} />
          </div>
          <DonutLegend rows={staffVsEquipment} format={formatMoneyCompact} />
        </Panel>
        <Panel title="Equipment costs" subtitle="Repairs and purchases in this period">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MetricCard
              label="Equipment repair costs"
              value={formatMoneyCompact(aggregate.expenses.equipment_repairs)}
              tone="amber"
            />
            <MetricCard
              label="Equipment purchase costs"
              value={formatMoneyCompact(aggregate.expenses.equipment_purchases)}
              tone="sky"
            />
          </div>
        </Panel>
      </div>

      <SectionHeader title="Membership analytics" subtitle="Your membership base" />
      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Members by membership type" subtitle="Current roster">
          <div className="flex justify-center">
            <DonutChart data={rosterDonut} />
          </div>
          <DonutLegend rows={rosterDonut} format={(value) => `${value} members`} />
        </Panel>
        <Panel title="Most profitable type" subtitle="Revenue by membership type this period">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/40">Top contributor</p>
            <p className="mt-1 text-2xl font-black text-lime-400">{mostProfitable}</p>
            <p className="mt-1 text-sm font-bold text-white">
              {formatMoneyCompact(aggregate.memberships[mostProfitable])}
            </p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {MEMBERSHIP_TYPES.map((plan) => (
              <li key={plan} className="flex items-center justify-between gap-3 text-xs">
                <span className="inline-flex items-center gap-2 text-white/60">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: MEMBERSHIP_COLORS[plan] }}
                  />
                  {plan}
                </span>
                <span className="font-semibold text-white">
                  {formatMoneyCompact(aggregate.memberships[plan])}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Active vs expired memberships" subtitle="Current roster">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-black text-lime-400">{activeCount}</p>
              <p className="mt-1 text-[11px] text-white/40">Active</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-black text-amber-400">{frozenCount}</p>
              <p className="mt-1 text-[11px] text-white/40">Frozen</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-2xl font-black text-rose-400">{expiredCount}</p>
              <p className="mt-1 text-[11px] text-white/40">Expired</p>
            </div>
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Average revenue per membership type
          </p>
          <ul className="mt-2 space-y-2.5">
            {roster.map((row) => (
              <li key={row.plan} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-white/60">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: MEMBERSHIP_COLORS[row.plan] }}
                  />
                  {row.plan}
                </span>
                <span className="text-white/50">
                  {row.count} members · {formatMoneyCompact(row.averageRevenue)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <SectionHeader title="Profit analytics" subtitle="Revenue vs expenses over time" />
      <div className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Revenue vs expenses" subtitle="Monthly comparison">
          <BarChart
            data={revExpData}
            series={[
              { key: 'revenue', color: '#a3e635' },
              { key: 'expenses', color: '#fb7185' },
            ]}
          />
          <div className="mt-4">
            <Legend
              items={[
                { label: 'Revenue', color: '#a3e635' },
                { label: 'Expenses', color: '#fb7185' },
              ]}
            />
          </div>
        </Panel>
        <Panel title="Net income over time" subtitle="Monthly profit">
          <LineChart data={netIncomeByMonth} stroke="#a3e635" height={220} />
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Profit summary" subtitle="Margin and best month in this period">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MetricCard
              label="Monthly profit margin"
              value={`${netMargin.toFixed(1)}%`}
              sub={`${formatMoneyCompact(netIncome)} of ${formatMoneyCompact(aggregate.revenue)} revenue`}
            />
            <MetricCard
              label="Best-performing month"
              value={bestMonth.label}
              tone="amber"
              sub={`${formatMoneyCompact(netIncomeFor(bestMonth))} net income`}
            />
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default FinancesPage

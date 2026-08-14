import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import Legend from '../components/charts/Legend'
import { formatMoney } from '../lib/format'
import {
  aggregateMonths,
  DEFAULT_PERIOD_ID,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_COLORS,
  MEMBERSHIP_COLORS,
  MEMBERSHIP_TYPES,
  MOCK_FINANCE_MONTHS,
  netIncomeFor,
  PERIODS,
  rosterByTypeDetails,
  rosterByTypeDetailsFor,
  rosterStatusCounts,
  rosterStatusCountsFor,
  totalExpenses,
} from '../lib/finances'
import { MOCK_MEMBERS } from '../lib/members'
import DataErrorState from '../components/DataErrorState'
import { dashboardApi } from '../lib/dashboardApi'
import { useSourceData } from '../hooks/useSourceData'

const money = (value) => formatMoney(value).replace(/\.00$/, '')

const pillActive =
  'rounded-full bg-lime-400 px-4 py-2 text-xs font-semibold text-black hover:bg-lime-300'
const pillIdle =
  'rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white'

const TONES = {
  white: 'text-white',
  lime: 'text-lime-400',
  rose: 'text-rose-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
}

function StatCard({ label, value, sub, tone = 'white' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/40">{label}</p>
      <p className={`mt-3 text-2xl font-black tracking-tight ${TONES[tone]}`}>{value}</p>
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

function DonutLegend({ rows, format }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0)
  return (
    <ul className="mt-5 space-y-2.5">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-2 text-white/60">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
            {row.label}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-semibold text-white">{format(row.value)}</span>
            <span className="w-11 text-right text-white/40">
              {((row.value / total) * 100).toFixed(0)}%
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

function FinancesPage() {
  const [periodId, setPeriodId] = useState(DEFAULT_PERIOD_ID)

  const {
    data: financeMonths,
    isLive,
    isError,
    refetch,
  } = useSourceData({
    queryKey: ['finances'],
    queryFn: dashboardApi.finances.overview,
    mockData: MOCK_FINANCE_MONTHS,
    emptyValue: [],
  })
  const { data: members } = useSourceData({
    queryKey: ['members'],
    queryFn: dashboardApi.members.list,
    mockData: MOCK_MEMBERS,
    emptyValue: [],
  })

  const period = PERIODS.find((p) => p.id === periodId)
  const sourceMonths = isLive ? financeMonths : MOCK_FINANCE_MONTHS

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
  const window = aggregateMonths(months)
  const latest = months[months.length - 1]
  const previous = months.length > 1 ? months[months.length - 2] : latest

  const expensesTotal = totalExpenses(window.expenses)
  const netIncome = window.revenue - expensesTotal
  const monthlyRevenue = latest.revenue
  const monthlyExpenses = totalExpenses(latest.expenses)

  const revenueGrowth = previous.revenue
    ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
    : 0

  const netMargin = window.revenue ? (netIncome / window.revenue) * 100 : 0
  const bestMonth = [...months].sort((a, b) => netIncomeFor(b) - netIncomeFor(a))[0]

  const revenueByMonth = months.map((m) => ({ label: m.label, value: m.revenue }))
  const expensesByMonth = months.map((m) => ({ label: m.label, value: totalExpenses(m.expenses) }))
  const revExpData = months.map((m) => ({
    label: m.label,
    revenue: m.revenue,
    expenses: totalExpenses(m.expenses),
  }))
  const netIncomeByMonth = months.map((m) => ({ label: m.label, value: netIncomeFor(m) }))

  const membershipDonut = MEMBERSHIP_TYPES.map((plan) => ({
    label: plan,
    value: window.memberships[plan],
    color: MEMBERSHIP_COLORS[plan],
  })).filter((row) => row.value > 0)

  const mostProfitable = MEMBERSHIP_TYPES.reduce((best, plan) =>
    window.memberships[plan] > window.memberships[best] ? plan : best,
  MEMBERSHIP_TYPES[0])

  const expenseDonut = EXPENSE_CATEGORIES.map((category) => ({
    label: EXPENSE_CATEGORY_LABELS[category],
    value: window.expenses[category],
    color: EXPENSE_COLORS[category],
  })).filter((row) => row.value > 0)

  const staffSalaries = window.expenses.staff_salaries
  const equipmentExpenses =
    window.expenses.equipment_repairs + window.expenses.equipment_purchases
  const staffVsEquipment = [
    { label: 'Staff salaries', value: staffSalaries, color: EXPENSE_COLORS.staff_salaries },
    { label: 'Equipment', value: equipmentExpenses, color: EXPENSE_COLORS.equipment_purchases },
  ]

  const subsTotal = Math.max(window.new_subscriptions + window.renewals, 1)

  const roster = isLive ? rosterByTypeDetailsFor(members) : rosterByTypeDetails()
  const rosterDonut = roster
    .filter((row) => row.count > 0)
    .map((row) => ({ label: row.plan, value: row.count, color: MEMBERSHIP_COLORS[row.plan] }))
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
        <StatCard label="Total revenue" value={money(window.revenue)} tone="lime" />
        <StatCard label="Total expenses" value={money(expensesTotal)} tone="rose" />
        <StatCard
          label="Net income"
          value={money(netIncome)}
          tone={netIncome >= 0 ? 'lime' : 'rose'}
          sub={`${netMargin.toFixed(1)}% margin`}
        />
        <StatCard label="Monthly revenue" value={money(monthlyRevenue)} sub={latest.label} />
        <StatCard label="Monthly expenses" value={money(monthlyExpenses)} sub={latest.label} />
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
          <DonutLegend rows={membershipDonut} format={money} />
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
            <p className="mt-1 text-2xl font-black text-white">{money(window.revenue)}</p>
          </div>
        </Panel>
        <Panel
          className="lg:col-span-2"
          title="New subscriptions vs renewals"
          subtitle="Volume in this period"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">New subscriptions</p>
              <p className="mt-1 text-2xl font-black text-lime-400">
                {window.new_subscriptions}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Renewals</p>
              <p className="mt-1 text-2xl font-black text-sky-400">{window.renewals}</p>
            </div>
          </div>
          <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-lime-400"
              style={{ width: `${(window.new_subscriptions / subsTotal) * 100}%` }}
            />
            <div
              className="h-full bg-sky-400"
              style={{ width: `${(window.renewals / subsTotal) * 100}%` }}
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
          <DonutLegend rows={expenseDonut} format={money} />
        </Panel>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Staff salaries vs equipment expenses" subtitle="The two biggest cost drivers">
          <div className="flex justify-center">
            <DonutChart data={staffVsEquipment} />
          </div>
          <DonutLegend rows={staffVsEquipment} format={money} />
        </Panel>
        <Panel title="Equipment costs" subtitle="Repairs and purchases in this period">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Equipment repair costs</p>
              <p className="mt-1 text-2xl font-black text-amber-400">
                {money(window.expenses.equipment_repairs)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Equipment purchase costs</p>
              <p className="mt-1 text-2xl font-black text-sky-400">
                {money(window.expenses.equipment_purchases)}
              </p>
            </div>
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
              {money(window.memberships[mostProfitable])}
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
                  {money(window.memberships[plan])}
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
                  {row.count} members · {money(row.averageRevenue)}
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
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Monthly profit margin</p>
              <p className="mt-1 text-2xl font-black text-lime-400">
                {netMargin.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-white/40">
                {money(netIncome)} of {money(window.revenue)} revenue
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Best-performing month</p>
              <p className="mt-1 text-2xl font-black text-amber-400">{bestMonth.label}</p>
              <p className="mt-1 text-xs text-white/40">
                {money(netIncomeFor(bestMonth))} net income
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

export default FinancesPage

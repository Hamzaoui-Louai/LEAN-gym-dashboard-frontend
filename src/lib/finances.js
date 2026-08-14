// Laravel API shape: /api/finances/overview returns { period, revenue, expenses, ... }
// Monthly financial series is generated relative to the current month so the
// page always looks "live". Data is deterministic per month (no randomness).

import { MOCK_MEMBERS } from './members'

export const MEMBERSHIP_TYPES = ['Monthly', 'Quarterly', 'Annual', 'Pay-as-you-go']

export const MEMBERSHIP_COLORS = {
  Monthly: '#a3e635',
  Quarterly: '#38bdf8',
  Annual: '#fbbf24',
  'Pay-as-you-go': '#e879f9',
}

export const EXPENSE_CATEGORIES = [
  'staff_salaries',
  'equipment_repairs',
  'equipment_purchases',
  'other',
]

export const EXPENSE_CATEGORY_LABELS = {
  staff_salaries: 'Staff salaries',
  equipment_repairs: 'Equipment repairs',
  equipment_purchases: 'Equipment purchases',
  other: 'Other',
}

export const EXPENSE_COLORS = {
  staff_salaries: '#fb7185',
  equipment_repairs: '#fbbf24',
  equipment_purchases: '#38bdf8',
  other: '#94a3b8',
}

export const PERIODS = [
  { id: 'this_week', label: 'This week', months: 1 },
  { id: 'this_month', label: 'This month', months: 1 },
  { id: 'last_3_months', label: 'Last 3 months', months: 3 },
  { id: 'last_6_months', label: 'Last 6 months', months: 6 },
  { id: 'this_year', label: 'This year', months: 12 },
]

export const DEFAULT_PERIOD_ID = 'last_3_months'

const MONTH_COUNT = 12

const NOW = new Date()

function pad(value) {
  return String(value).padStart(2, '0')
}

function toYearMonth(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

function monthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short' })
}

function wave(index, frequency, phase) {
  return 0.5 + 0.5 * Math.sin(index * frequency + phase)
}

function makeMonth(index) {
  const date = new Date(NOW.getFullYear(), NOW.getMonth() - (MONTH_COUNT - 1 - index), 1)
  const key = toYearMonth(date)

  const revenue = round(9000 * (1 + index * 0.045) * (0.88 + 0.22 * wave(index, 0.9, 2)))

  const rawShares = {
    Monthly: 0.5 + 0.07 * wave(index, 0.6, 1),
    Quarterly: 0.2,
    Annual: 0.18 + 0.05 * wave(index, 0.7, 3),
    'Pay-as-you-go': 0.12,
  }
  const totalShare = Object.values(rawShares).reduce((sum, share) => sum + share, 0)

  const memberships = {}
  let allocated = 0
  for (const [plan, share] of Object.entries(rawShares)) {
    const value = round((share / totalShare) * revenue)
    memberships[plan] = value
    allocated += value
  }
  memberships.Monthly += revenue - allocated

  const expenses = {
    staff_salaries: round(4200 + 240 * wave(index, 0.5, 0)),
    equipment_repairs: round(120 + 260 * wave(index, 1.2, 4)),
    equipment_purchases: index % 4 === 3 ? 1250 : index % 4 === 2 ? 650 : 0,
    other: round(720 + 120 * wave(index, 0.8, 2)),
  }

  return {
    key,
    label: monthLabel(key),
    revenue,
    memberships,
    expenses,
    new_subscriptions: round(13 + 5 * wave(index, 0.7, 1)),
    renewals: round(31 + 9 * wave(index, 0.5, 3)),
  }
}

function round(value) {
  return Math.round(value)
}

export const MOCK_FINANCE_MONTHS = Array.from({ length: MONTH_COUNT }, (_, index) =>
  makeMonth(index),
)

export function aggregateMonths(months) {
  const totals = {
    revenue: 0,
    memberships: Object.fromEntries(MEMBERSHIP_TYPES.map((plan) => [plan, 0])),
    expenses: Object.fromEntries(EXPENSE_CATEGORIES.map((category) => [category, 0])),
    new_subscriptions: 0,
    renewals: 0,
  }
  for (const month of months) {
    totals.revenue += month.revenue
    for (const plan of MEMBERSHIP_TYPES) totals.memberships[plan] += month.memberships[plan]
    for (const category of EXPENSE_CATEGORIES) totals.expenses[category] += month.expenses[category]
    totals.new_subscriptions += month.new_subscriptions
    totals.renewals += month.renewals
  }
  return totals
}

export function totalExpenses(expenses) {
  return Object.values(expenses).reduce((sum, value) => sum + value, 0)
}

export function netIncomeFor(month) {
  return month.revenue - totalExpenses(month.expenses)
}

export function rosterByTypeDetails() {
  return MEMBERSHIP_TYPES.map((plan) => {
    const members = MOCK_MEMBERS.filter((member) => member.membership.plan === plan)
    const averageRevenue = members.length
      ? Math.round(
          members.reduce((sum, member) => sum + member.membership.price, 0) / members.length,
        )
      : 0
    return { plan, count: members.length, averageRevenue }
  })
}

export function rosterByTypeDetailsFor(members) {
  return MEMBERSHIP_TYPES.map((plan) => {
    const roster = members.filter((member) => member.membership.plan === plan)
    const averageRevenue = roster.length
      ? Math.round(
          roster.reduce((sum, member) => sum + member.membership.price, 0) / roster.length,
        )
      : 0
    return { plan, count: roster.length, averageRevenue }
  })
}

export function rosterStatusCounts() {
  return MOCK_MEMBERS.reduce((counts, member) => {
    counts[member.status] = (counts[member.status] ?? 0) + 1
    return counts
  }, {})
}

export function rosterStatusCountsFor(members) {
  return members.reduce((counts, member) => {
    counts[member.status] = (counts[member.status] ?? 0) + 1
    return counts
  }, {})
}

import {
  aggregateMonths,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_COLORS,
  MEMBERSHIP_COLORS,
  MEMBERSHIP_TYPES,
  netIncomeFor,
  totalExpenses,
} from './finances'

export function buildFinanceMetrics({ months, roster }) {
  const aggregate = aggregateMonths(months)
  const latest = months[months.length - 1]
  const previous = months.length > 1 ? months[months.length - 2] : latest

  const expensesTotal = totalExpenses(aggregate.expenses)
  const netIncome = aggregate.revenue - expensesTotal
  const monthlyRevenue = latest.revenue
  const monthlyExpenses = totalExpenses(latest.expenses)

  const revenueGrowth = previous.revenue
    ? ((latest.revenue - previous.revenue) / previous.revenue) * 100
    : 0

  const netMargin = aggregate.revenue ? (netIncome / aggregate.revenue) * 100 : 0
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
    value: aggregate.memberships[plan],
    color: MEMBERSHIP_COLORS[plan],
  })).filter((row) => row.value > 0)

  const mostProfitable = MEMBERSHIP_TYPES.reduce((best, plan) =>
    aggregate.memberships[plan] > aggregate.memberships[best] ? plan : best,
  MEMBERSHIP_TYPES[0])

  const expenseDonut = EXPENSE_CATEGORIES.map((category) => ({
    label: EXPENSE_CATEGORY_LABELS[category],
    value: aggregate.expenses[category],
    color: EXPENSE_COLORS[category],
  })).filter((row) => row.value > 0)

  const equipmentExpenses =
    aggregate.expenses.equipment_repairs + aggregate.expenses.equipment_purchases
  const staffVsEquipment = [
    {
      label: 'Staff salaries',
      value: aggregate.expenses.staff_salaries,
      color: EXPENSE_COLORS.staff_salaries,
    },
    { label: 'Equipment', value: equipmentExpenses, color: EXPENSE_COLORS.equipment_purchases },
  ]

  const subsTotal = Math.max(aggregate.new_subscriptions + aggregate.renewals, 1)

  const rosterDonut = roster
    .filter((row) => row.count > 0)
    .map((row) => ({ label: row.plan, value: row.count, color: MEMBERSHIP_COLORS[row.plan] }))

  return {
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
  }
}

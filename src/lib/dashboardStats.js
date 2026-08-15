import { TODAY } from './checkins'
import {
  MEMBERSHIP_COLORS,
  MEMBERSHIP_TYPES,
  netIncomeFor,
  totalExpenses,
} from './finances'

function isoDaysFromNow(days) {
  const date = new Date(`${TODAY}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

const EXPIRING_MIN = TODAY
const EXPIRING_MAX = isoDaysFromNow(30)

function expiringCount(members) {
  return members.filter((member) => {
    const ends = member.membership?.ends_at
    return ends && ends >= EXPIRING_MIN && ends <= EXPIRING_MAX
  }).length
}

function activeCount(members) {
  return members.filter((member) => member.status === 'active').length
}

function expiredCount(members) {
  return members.filter((member) => member.status === 'expired').length
}

export function computeOverviewStats({ members, staff, equipment, checkins }) {
  return {
    totalMembers: members.length,
    activeMembers: activeCount(members),
    expiringMemberships: expiringCount(members),
    expiredMembers: expiredCount(members),
    totalStaff: staff.length,
    activeStaff: staff.filter((person) => person.status === 'active').length,
    totalEquipment: equipment.length,
    availableEquipment: equipment.filter(
      (item) => item.state === 'operational' || item.state === 'in_use',
    ).length,
    maintenanceEquipment: equipment.filter((item) => item.state === 'under_repair').length,
    brokenEquipment: equipment.filter((item) => item.state === 'out_of_order').length,
    todayCheckins: checkins.filter((visit) => visit.date === TODAY).length,
    insideNow: checkins.filter((visit) => visit.date === TODAY && visit.check_out === null).length,
  }
}

export function computeInsightsStats({ members, checkins, financeMonths }) {
  const latest = financeMonths[financeMonths.length - 1]
  const previous = financeMonths.length > 1 ? financeMonths[financeMonths.length - 2] : latest
  const monthRevenue = latest?.revenue ?? 0
  const previousRevenue = previous?.revenue ?? 0

  const memberById = Object.fromEntries(members.map((member) => [member.id, member]))
  const recentCheckins = checkins
    .slice(0, 5)
    .map((visit) => {
      const member = memberById[visit.member_id]
      if (!member) return null
      return {
        id: visit.id,
        member_id: visit.member_id,
        member: member.name,
        date: visit.date,
        check_in: visit.check_in,
        check_out: visit.check_out,
      }
    })
    .filter(Boolean)

  return {
    activeMembers: activeCount(members),
    expiringMemberships: expiringCount(members),
    expiredMembers: expiredCount(members),
    todayCheckins: checkins.filter((visit) => visit.date === TODAY).length,
    insideNow: checkins.filter((visit) => visit.date === TODAY && visit.check_out === null).length,
    monthRevenue,
    avgMonthlyRevenue: financeMonths.length
      ? Math.round(
          financeMonths.reduce((sum, month) => sum + month.revenue, 0) / financeMonths.length,
        )
      : 0,
    revenueGrowth: previousRevenue
      ? ((monthRevenue - previousRevenue) / previousRevenue) * 100
      : 0,
    membershipRevenue: MEMBERSHIP_TYPES.map((plan) => ({
      plan,
      value: latest?.memberships[plan] ?? 0,
      color: MEMBERSHIP_COLORS[plan],
    })),
    rosterDonut: MEMBERSHIP_TYPES.map((plan) => ({
      label: plan,
      value: members.filter((member) => member.membership?.plan === plan).length,
      color: MEMBERSHIP_COLORS[plan],
    })).filter((row) => row.value > 0),
    recentCheckins,
  }
}

export function computeOperationsStats({ staff, equipment, repairs }) {
  return {
    totalStaff: staff.length,
    activeStaff: staff.filter((person) => person.status === 'active').length,
    monthlyPayroll: staff
      .filter((person) => person.status === 'active')
      .reduce((sum, person) => sum + person.salary, 0),
    recentPayslips: staff
      .flatMap((person) =>
        (person.payslips ?? []).map((payslip) => ({ ...payslip, name: person.name })),
      )
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5),
    totalEquipment: equipment.length,
    availableEquipment: equipment.filter(
      (item) => item.state === 'operational' || item.state === 'in_use',
    ).length,
    maintenanceEquipment: equipment.filter((item) => item.state === 'under_repair').length,
    brokenEquipment: equipment.filter((item) => item.state === 'out_of_order').length,
    recentRepairs: repairs.slice(0, 5),
  }
}

export function computeFinancesStats({ financeMonths }) {
  const latest = financeMonths[financeMonths.length - 1]
  const monthRevenue = latest?.revenue ?? 0
  const monthExpenses = latest ? totalExpenses(latest.expenses) : 0
  const monthNet = latest ? netIncomeFor(latest) : 0

  return {
    monthRevenue,
    monthExpenses,
    monthNet,
    netMargin: monthRevenue ? (monthNet / monthRevenue) * 100 : 0,
    revExpData: financeMonths.slice(-6).map((month) => ({
      label: month.label,
      revenue: month.revenue,
      expenses: totalExpenses(month.expenses),
    })),
  }
}

// Mock data mirroring the future Laravel API shape:
//   GET /api/members -> { data: Member[] }
//   Member: {
//     id, name, email, phone,
//     status: 'active' | 'frozen' | 'expired',
//     joined_at: 'YYYY-MM-DD',
//     membership: { plan, price, started_at, ends_at | null },
//     payments: [{ id, date, plan, amount, method, status: 'paid'|'pending'|'failed' }]
//   }
// MembersPage owns members in one useState — swap that for a react-query
// fetch and these mocks drop out.

export const MEMBERSHIP_PLANS = [
  { id: 'monthly', label: 'Monthly', price: 45, months: 1 },
  { id: 'quarterly', label: 'Quarterly', price: 120, months: 3 },
  { id: 'annual', label: 'Annual', price: 420, months: 12 },
  { id: 'pay_as_you_go', label: 'Pay-as-you-go', price: 10, months: 0 },
]

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

function addMonths(date, months) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function makePayments({ plan, amount, start, count = 6, last = 'pending' }) {
  const methods = ['Card', 'Cash', 'Transfer']
  return Array.from({ length: count }, (_, index) => ({
    id: `${start}-${index}`,
    date: toISO(addMonths(new Date(`${start}T00:00:00`), index)),
    plan,
    amount,
    method: methods[index % methods.length],
    status: index === count - 1 ? last : 'paid',
  }))
}

export const MOCK_MEMBERS = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 014-2201',
    status: 'active',
    joined_at: '2024-03-12',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-07-01',
      ends_at: '2026-07-31',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2026-02-01', count: 6 }),
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    email: 'marcus.johnson@example.com',
    phone: '+1 (555) 014-2202',
    status: 'active',
    joined_at: '2023-11-05',
    membership: {
      plan: 'Annual',
      price: 420,
      started_at: '2026-01-01',
      ends_at: '2026-12-31',
    },
    payments: makePayments({ plan: 'Annual', amount: 420, start: '2024-01-01', count: 3 }),
  },
  {
    id: 3,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 014-2203',
    status: 'active',
    joined_at: '2025-06-18',
    membership: {
      plan: 'Quarterly',
      price: 120,
      started_at: '2026-05-01',
      ends_at: '2026-07-31',
    },
    payments: makePayments({ plan: 'Quarterly', amount: 120, start: '2025-08-01', count: 5 }),
  },
  {
    id: 4,
    name: 'Daniel Osei',
    email: 'daniel.osei@example.com',
    phone: '+1 (555) 014-2204',
    status: 'frozen',
    joined_at: '2024-09-30',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-07-01',
      ends_at: '2026-07-31',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2026-02-01', count: 5, last: 'paid' }),
  },
  {
    id: 5,
    name: 'Emily Novak',
    email: 'emily.novak@example.com',
    phone: '+1 (555) 014-2205',
    status: 'active',
    joined_at: '2025-10-02',
    membership: {
      plan: 'Pay-as-you-go',
      price: 10,
      started_at: '2026-08-01',
      ends_at: null,
    },
    payments: makePayments({ plan: 'Pay-as-you-go', amount: 10, start: '2026-05-01', count: 4, last: 'paid' }),
  },
  {
    id: 6,
    name: 'Tomás Rivera',
    email: 'tomas.rivera@example.com',
    phone: '+1 (555) 014-2206',
    status: 'expired',
    joined_at: '2024-01-22',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-06-01',
      ends_at: '2026-06-30',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2026-01-01', count: 6, last: 'failed' }),
  },
  {
    id: 7,
    name: 'Aisha Bello',
    email: 'aisha.bello@example.com',
    phone: '+1 (555) 014-2207',
    status: 'active',
    joined_at: '2025-03-08',
    membership: {
      plan: 'Annual',
      price: 420,
      started_at: '2026-01-01',
      ends_at: '2026-12-31',
    },
    payments: makePayments({ plan: 'Annual', amount: 420, start: '2025-01-01', count: 2 }),
  },
  {
    id: 8,
    name: 'Liam Fitzgerald',
    email: 'liam.fitzgerald@example.com',
    phone: '+1 (555) 014-2208',
    status: 'active',
    joined_at: '2025-11-14',
    membership: {
      plan: 'Quarterly',
      price: 120,
      started_at: '2026-08-01',
      ends_at: '2026-10-31',
    },
    payments: makePayments({ plan: 'Quarterly', amount: 120, start: '2025-11-01', count: 4 }),
  },
  {
    id: 9,
    name: 'Sofia Marchetti',
    email: 'sofia.marchetti@example.com',
    phone: '+1 (555) 014-2209',
    status: 'frozen',
    joined_at: '2024-07-19',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-07-01',
      ends_at: '2026-07-31',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2026-03-01', count: 4, last: 'paid' }),
  },
  {
    id: 10,
    name: 'Jordan Wright',
    email: 'jordan.wright@example.com',
    phone: '+1 (555) 014-2210',
    status: 'active',
    joined_at: '2025-08-27',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-08-01',
      ends_at: '2026-08-31',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2026-02-01', count: 7 }),
  },
  {
    id: 11,
    name: 'Nina Kowalski',
    email: 'nina.kowalski@example.com',
    phone: '+1 (555) 014-2211',
    status: 'expired',
    joined_at: '2023-05-11',
    membership: {
      plan: 'Monthly',
      price: 45,
      started_at: '2026-05-01',
      ends_at: '2026-05-31',
    },
    payments: makePayments({ plan: 'Monthly', amount: 45, start: '2025-12-01', count: 6, last: 'failed' }),
  },
  {
    id: 12,
    name: 'Omar Haddad',
    email: 'omar.haddad@example.com',
    phone: '+1 (555) 014-2212',
    status: 'active',
    joined_at: '2025-06-30',
    membership: {
      plan: 'Annual',
      price: 420,
      started_at: '2026-06-01',
      ends_at: '2027-05-31',
    },
    payments: makePayments({ plan: 'Annual', amount: 420, start: '2025-06-01', count: 2 }),
  },
  {
    id: 13,
    name: 'Grace Tan',
    email: 'grace.tan@example.com',
    phone: '+1 (555) 014-2213',
    status: 'active',
    joined_at: '2026-08-10',
    membership: {
      plan: 'Pay-as-you-go',
      price: 10,
      started_at: '2026-08-10',
      ends_at: null,
    },
    payments: [],
  },
]

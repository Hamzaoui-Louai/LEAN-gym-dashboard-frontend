// Mock data mirroring the future Laravel API shape:
//   GET /api/staff -> { data: Staff[] }
//   Staff: {
//     id, name, email, phone, role,
//     status: 'active' | 'on_leave' | 'departed',
//     joined_at: 'YYYY-MM-DD',
//     salary: number (monthly),
//     payslips: [{ id, date, period, amount, method, status: 'paid'|'pending'|'failed' }]
//   }
// StaffPage owns staff in one useState — swap that for a react-query
// fetch and these mocks drop out.

export const STAFF_ROLES = [
  'Manager',
  'Personal trainer',
  'Strength coach',
  'Front desk',
  'Cleaning staff',
]

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

function addMonths(date, months) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function makePayslips({ salary, start, count = 5, last = 'pending' }) {
  const methods = ['Card', 'Cash', 'Transfer']
  return Array.from({ length: count }, (_, index) => {
    const date = addMonths(new Date(`${start}T00:00:00`), index)
    return {
      id: `payslip-${start}-${index}`,
      date: toISO(date),
      period: date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      amount: salary,
      method: methods[index % methods.length],
      status: index === count - 1 ? last : 'paid',
    }
  })
}

export const MOCK_STAFF = [
  {
    id: 1,
    name: 'James Carter',
    email: 'james.carter@example.com',
    phone: '+1 (555) 015-3101',
    role: 'Manager',
    status: 'active',
    joined_at: '2023-02-14',
    salary: 3200,
    payslips: makePayslips({ salary: 3200, start: '2026-03-01', count: 6 }),
  },
  {
    id: 2,
    name: 'Lina Fischer',
    email: 'lina.fischer@example.com',
    phone: '+1 (555) 015-3102',
    role: 'Personal trainer',
    status: 'active',
    joined_at: '2024-05-20',
    salary: 1800,
    payslips: makePayslips({ salary: 1800, start: '2026-04-01', count: 5 }),
  },
  {
    id: 3,
    name: 'Andre Silva',
    email: 'andre.silva@example.com',
    phone: '+1 (555) 015-3103',
    role: 'Strength coach',
    status: 'active',
    joined_at: '2024-08-03',
    salary: 2000,
    payslips: makePayslips({ salary: 2000, start: '2026-02-01', count: 7 }),
  },
  {
    id: 4,
    name: 'Mia Patel',
    email: 'mia.patel@example.com',
    phone: '+1 (555) 015-3104',
    role: 'Front desk',
    status: 'on_leave',
    joined_at: '2025-01-11',
    salary: 1400,
    payslips: makePayslips({ salary: 1400, start: '2026-03-01', count: 4 }),
  },
  {
    id: 5,
    name: 'Yusuf Adebayo',
    email: 'yusuf.adebayo@example.com',
    phone: '+1 (555) 015-3105',
    role: 'Personal trainer',
    status: 'active',
    joined_at: '2024-11-27',
    salary: 1700,
    payslips: makePayslips({ salary: 1700, start: '2026-01-01', count: 8 }),
  },
  {
    id: 6,
    name: 'Hannah Lee',
    email: 'hannah.lee@example.com',
    phone: '+1 (555) 015-3106',
    role: 'Cleaning staff',
    status: 'active',
    joined_at: '2025-07-09',
    salary: 1100,
    payslips: makePayslips({ salary: 1100, start: '2026-03-01', count: 6 }),
  },
  {
    id: 7,
    name: 'Omar Khalil',
    email: 'omar.khalil@example.com',
    phone: '+1 (555) 015-3107',
    role: 'Front desk',
    status: 'active',
    joined_at: '2025-04-22',
    salary: 1350,
    payslips: makePayslips({ salary: 1350, start: '2026-02-01', count: 7 }),
  },
  {
    id: 8,
    name: 'Ella Mårtensson',
    email: 'ella.martensson@example.com',
    phone: '+1 (555) 015-3108',
    role: 'Personal trainer',
    status: 'active',
    joined_at: '2023-10-30',
    salary: 1900,
    payslips: makePayslips({ salary: 1900, start: '2026-01-01', count: 8 }),
  },
  {
    id: 9,
    name: 'Dmitri Volkov',
    email: 'dmitri.volkov@example.com',
    phone: '+1 (555) 015-3109',
    role: 'Strength coach',
    status: 'departed',
    joined_at: '2024-03-05',
    salary: 2100,
    payslips: makePayslips({ salary: 2100, start: '2025-11-01', count: 6, last: 'paid' }),
  },
  {
    id: 10,
    name: 'Aria Wilson',
    email: 'aria.wilson@example.com',
    phone: '+1 (555) 015-3110',
    role: 'Manager',
    status: 'active',
    joined_at: '2025-09-16',
    salary: 3400,
    payslips: makePayslips({ salary: 3400, start: '2026-02-01', count: 7 }),
  },
  {
    id: 11,
    name: 'Ben Okafor',
    email: 'ben.okafor@example.com',
    phone: '+1 (555) 015-3111',
    role: 'Cleaning staff',
    status: 'on_leave',
    joined_at: '2026-01-08',
    salary: 1150,
    payslips: makePayslips({ salary: 1150, start: '2026-03-01', count: 4 }),
  },
  {
    id: 12,
    name: 'Chloe Nguyen',
    email: 'chloe.nguyen@example.com',
    phone: '+1 (555) 015-3112',
    role: 'Front desk',
    status: 'active',
    joined_at: '2025-12-04',
    salary: 1450,
    payslips: [],
  },
]

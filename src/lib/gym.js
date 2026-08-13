// Mock data mirroring the future Laravel API shape:
//   GET /api/gym -> { data: Gym }
//   Gym: {
//     id, name, description, address, logo: string | null,
//     email, phone,
//     opens_at: 'HH:MM', closes_at: 'HH:MM',
//     days_open: ['mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun'],
//     status: 'active' | 'inactive',
//     registered_at: 'YYYY-MM-DD'
//   }
// GymProfilePage owns gym in one useState — swap that for a react-query
// fetch and these mocks drop out.

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAY_LABELS = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

export function formatDays(days) {
  if (!days || days.length === 0) return 'Closed'
  if (days.length === DAY_KEYS.length) return 'Every day'

  const sorted = DAY_KEYS.filter((key) => days.includes(key))
  const runs = []
  let start = 0
  for (let i = 1; i <= sorted.length; i += 1) {
    const isRunEnd =
      i === sorted.length ||
      DAY_KEYS.indexOf(sorted[i]) !== DAY_KEYS.indexOf(sorted[i - 1]) + 1
    if (isRunEnd) {
      runs.push(sorted.slice(start, i))
      start = i
    }
  }

  return runs
    .map((run) =>
      run.length === 1
        ? DAY_LABELS[run[0]]
        : `${DAY_LABELS[run[0]]}–${DAY_LABELS[run[run.length - 1]]}`,
    )
    .join(', ')
}

export const MOCK_GYM = {
  id: 1,
  name: 'Lean Fitness Club',
  description:
    'A modern training facility with a full strength floor, cardio zone and functional area — plus personal coaching for every member.',
  address: '48 Fitness Avenue, Springfield',
  logo: null,
  email: 'hello@leanfitness.example',
  phone: '+1 (555) 010-2000',
  opens_at: '06:00',
  closes_at: '23:00',
  days_open: DAY_KEYS,
  status: 'active',
  registered_at: '2022-08-01',
}

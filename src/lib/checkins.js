// Mock data mirroring the future Laravel API shape:
//   GET /api/checkins -> { data: Checkin[] }
//   Checkin: {
//     id, member_id,
//     date: 'YYYY-MM-DD',
//     check_in: 'HH:MM',
//     check_out: 'HH:MM' | null   (null = member is currently inside)
//   }
// CheckInsPage owns checkins in one useState — swap that for a react-query
// fetch and these mocks drop out.

import { MOCK_MEMBERS } from './members'

const now = new Date()

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const TODAY = toISODate(now)

function pad(value) {
  return String(value).padStart(2, '0')
}

export function currentTime() {
  const date = new Date()
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatDuration(checkIn, checkOut) {
  const [ih, im] = checkIn.split(':').map(Number)
  const [oh, om] = checkOut.split(':').map(Number)
  const minutes = oh * 60 + om - (ih * 60 + im)
  if (minutes <= 0) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

function makeTimeString(date, hour, minute) {
  return `${pad(hour)}:${pad(minute)}`
}

let idCounter = 1

function makeVisit(memberId, date, { open = false, checkIn = null, checkOut = null } = {}) {
  const morningHour = 6 + ((memberId * 3) % 4)
  const inTime = checkIn ?? makeTimeString(date, morningHour, 30 + (memberId % 25))
  const outHour = 16 + (memberId % 4)
  const outTime = checkOut ?? makeTimeString(date, outHour, 5 + ((memberId * 7) % 50))
  return {
    id: idCounter,
    member_id: memberId,
    date: toISODate(date),
    check_in: inTime,
    check_out: open ? null : outTime,
  }
}

const generated = []
MOCK_MEMBERS.forEach((member) => {
  const index = member.id - 1
  for (let offset = 1; offset <= 30; offset += 1) {
    if ((offset + index) % 3 !== 0) {
      generated.push(makeVisit(member.id, addDays(now, -offset)))
      idCounter += 1
    }
  }
  if (index % 3 === 0) {
    generated.push(
      makeVisit(member.id, now, {
        open: true,
        checkIn: `0${7 + (index % 2)}:${pad(10 + index)}`,
      }),
    )
  } else if (index % 3 === 1) {
    generated.push(
      makeVisit(member.id, now, {
        checkIn: `07:${pad(15 + index)}`,
        checkOut: currentTime(),
      }),
    )
  }
  idCounter += 1
})

export const MOCK_CHECKINS = generated.sort((a, b) =>
  (b.date + b.check_in).localeCompare(a.date + a.check_in),
)

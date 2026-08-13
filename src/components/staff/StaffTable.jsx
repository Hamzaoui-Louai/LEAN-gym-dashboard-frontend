import { formatDate, formatMoney } from '../../lib/format'
import MemberAvatar from '../members/MemberAvatar'
import { StaffStatusBadge } from './StaffBadges'

function StaffTable({ staff, onView, onEdit, onPayslip }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-white/40">
            <th scope="col" className="px-4 py-3 font-semibold">
              Staff
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Role
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Joined
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Salary
            </th>
            <th scope="col" className="px-6 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {staff.map((person) => (
            <tr
              key={person.id}
              onClick={() => onView(person)}
              className="cursor-pointer transition hover:bg-white/[0.03]"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <MemberAvatar name={person.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {person.name}
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {person.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-white/70">{person.role}</td>
              <td className="px-4 py-4">
                <StaffStatusBadge status={person.status} />
              </td>
              <td className="px-4 py-4 text-white/70">
                {formatDate(person.joined_at)}
              </td>
              <td className="px-4 py-4 text-white/70">
                {formatMoney(person.salary)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onPayslip(person)
                    }}
                    aria-label={`New payslip for ${person.name}`}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-lime-400/30 bg-lime-400/10 px-2.5 py-1.5 text-xs font-semibold text-lime-400 transition hover:bg-lime-400/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                      <path d="M12 17.5v-11" />
                    </svg>
                    Payslip
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onView(person)
                    }}
                    aria-label={`View ${person.name}`}
                    className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onEdit(person)
                    }}
                    aria-label={`Edit ${person.name}`}
                    className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StaffTable

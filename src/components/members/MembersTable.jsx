import { formatDate } from '../../lib/format'
import MemberAvatar from './MemberAvatar'
import { MembershipBadge } from './MemberBadges'

function MembersTable({ members, onView, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-widest text-white/40">
            <th scope="col" className="px-6 py-3 font-semibold">
              Member
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Membership
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Joined
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Renews
            </th>
            <th scope="col" className="px-6 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {members.map((member) => (
            <tr
              key={member.id}
              onClick={() => onView(member)}
              className="cursor-pointer transition hover:bg-white/[0.03]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <MemberAvatar name={member.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-white/40">
                      {member.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-white/70">
                {member.membership.plan}
              </td>
              <td className="px-4 py-4">
                <MembershipBadge status={member.status} />
              </td>
              <td className="px-4 py-4 text-white/70">
                {formatDate(member.joined_at)}
              </td>
              <td className="px-4 py-4 text-white/70">
                {formatDate(member.membership.ends_at)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      onView(member)
                    }}
                    aria-label={`View ${member.name}`}
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
                      onEdit(member)
                    }}
                    aria-label={`Edit ${member.name}`}
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

export default MembersTable

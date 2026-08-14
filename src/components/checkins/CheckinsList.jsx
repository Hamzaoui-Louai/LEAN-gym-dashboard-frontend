import MemberAvatar from '../members/MemberAvatar'

function CheckinsList({ members, insideIds, selectedId, onSelect }) {
  return (
    <ul className="divide-y divide-white/5">
      {members.map((member) => {
        const inside = insideIds.has(member.id)
        const selected = selectedId === member.id
        return (
          <li key={member.id}>
            <div
              onClick={() => onSelect(member.id)}
              className={`flex cursor-pointer items-center gap-3 px-5 py-3.5 transition ${
                selected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
              }`}
            >
              <MemberAvatar name={member.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {member.name}
                </p>
                <p className="truncate text-xs text-white/40">
                  {member.membership.plan}
                </p>
              </div>
              {inside && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[11px] font-semibold text-lime-400">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-lime-400"
                    aria-hidden="true"
                  />
                  In gym
                </span>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(member.id)
                }}
                aria-label={`${selected ? 'Collapse' : 'Expand'} ${member.name}`}
                aria-expanded={selected}
                className={`rounded-lg p-1.5 transition ${
                  selected
                    ? 'bg-white/5 text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${selected ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default CheckinsList

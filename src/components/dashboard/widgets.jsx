const TONES = {
  white: 'text-white',
  lime: 'text-lime-400',
  rose: 'text-rose-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
}

export function Tile({ label, value, sub, tone = 'white', size = 'sm' }) {
  const container = size === 'md' ? 'p-5' : 'p-4'
  const labelClass = size === 'md' ? 'text-xs' : 'text-[11px]'
  const valueClass = size === 'md' ? 'mt-3' : 'mt-2'
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${container}`}>
      <p className={`font-semibold uppercase tracking-widest text-white/40 ${labelClass}`}>
        {label}
      </p>
      <p className={`text-2xl font-black tracking-tight ${TONES[tone]} ${valueClass}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  )
}

export function ShareList({ rows, format }) {
  const max = Math.max(...rows.map((row) => row.value), 1)
  return (
    <ul className="mt-3 space-y-2.5">
      {rows.map((row) => (
        <li key={row.plan}>
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-white/60">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
              {row.plan}
            </span>
            <span className="font-semibold text-white">{format(row.value)}</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.value / max) * 100}%`, backgroundColor: row.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Avatar({ name }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export function InsidePill() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2 py-0.5 text-[11px] font-semibold text-lime-400">
      <span className="h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
      Inside
    </span>
  )
}

export function StatusDot({ status }) {
  const color =
    status === 'paid' ? 'bg-lime-400' : status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />
}

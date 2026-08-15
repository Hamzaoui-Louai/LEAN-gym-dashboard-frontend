const TONES = {
  white: 'text-white',
  lime: 'text-lime-400',
  rose: 'text-rose-400',
  sky: 'text-sky-400',
  amber: 'text-amber-400',
}

function MetricCard({ label, value, sub, tone = 'white' }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-black ${TONES[tone]}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  )
}

export default MetricCard

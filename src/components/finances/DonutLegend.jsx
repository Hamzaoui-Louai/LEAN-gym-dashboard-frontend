function DonutLegend({ rows, format }) {
  const total = rows.reduce((sum, row) => sum + row.value, 0)
  return (
    <ul className="mt-5 space-y-2.5">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center justify-between gap-3 text-xs">
          <span className="inline-flex items-center gap-2 text-white/60">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
            {row.label}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-semibold text-white">{format(row.value)}</span>
            <span className="w-11 text-right text-white/40">
              {((row.value / total) * 100).toFixed(0)}%
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export default DonutLegend

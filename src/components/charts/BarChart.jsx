function BarChart({ data, series, height = 220, className }) {
  const allValues = data.flatMap((row) => series.map((entry) => row[entry.key] ?? 0))
  const max = Math.max(...allValues, 1)

  const groupW = 18
  const H = 52
  const plotBottom = H - 9
  const W = Math.max(data.length, 1) * groupW
  const slot = 5.2
  const gap = series.length > 1 ? 1.4 : 0
  const groupBarsW = series.length * slot + (series.length - 1) * gap
  const startX = (groupW - groupBarsW) / 2

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className ?? 'w-full'}
      style={{ height }}
      role="img"
      aria-label="Bar chart"
    >
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <line
          key={fraction}
          x1="0"
          x2={W}
          y1={plotBottom - plotBottom * fraction}
          y2={plotBottom - plotBottom * fraction}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.3"
        />
      ))}
      {data.map((row, i) => {
        const groupX = i * groupW
        return (
          <g key={row.label}>
            {series.map((entry, j) => {
              const value = row[entry.key] ?? 0
              const barH = (value / max) * plotBottom
              const x = groupX + startX + j * (slot + gap)
              return (
                <rect
                  key={entry.key}
                  x={x}
                  y={plotBottom - barH}
                  width={slot}
                  height={barH}
                  rx="0.8"
                  fill={entry.color}
                  opacity="0.9"
                />
              )
            })}
            <text
              x={groupX + groupW / 2}
              y={H - 2}
              fontSize="3.4"
              fill="rgba(255,255,255,0.45)"
              textAnchor="middle"
            >
              {row.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default BarChart

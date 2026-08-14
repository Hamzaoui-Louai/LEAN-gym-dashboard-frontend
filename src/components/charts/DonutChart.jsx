function DonutChart({ data, size = 168, strokeWidth = 15 }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  if (total <= 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-white/30"
        style={{ height: size }}
      >
        No data
      </div>
    )
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const segments = data.reduce(
    (acc, entry) => {
      const length = (entry.value / total) * circumference
      const offset = acc.length
        ? acc[acc.length - 1].offset + acc[acc.length - 1].length
        : 0
      acc.push({ key: entry.label, color: entry.color, length, offset })
      return acc
    },
    [],
  )

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Donut chart"
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <g transform="rotate(-90 50 50)">
        {segments.map((segment) => (
          <circle
            key={segment.key}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segment.length} ${circumference - segment.length}`}
            strokeDashoffset={-segment.offset}
          />
        ))}
      </g>
    </svg>
  )
}

export default DonutChart

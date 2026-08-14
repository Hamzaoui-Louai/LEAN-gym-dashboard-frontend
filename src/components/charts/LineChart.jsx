import { useId } from 'react'

function LineChart({ data, stroke = '#a3e635', height = 220, className }) {
  const gradientId = useId()
  const values = data.map((row) => row.value)
  const min = Math.min(...values, 0)
  const max = Math.max(...values, 1)
  const range = max - min || 1

  const groupW = 16
  const H = 46
  const padY = 3.5
  const innerH = H - padY * 2 - 8
  const W = Math.max(data.length, 2) * groupW
  const baseline = padY + innerH

  const pointAt = (i) => ({
    x: i * groupW + groupW / 2,
    y: baseline - ((values[i] - min) / range) * innerH,
  })
  const points = data.map((_, i) => pointAt(i))
  const linePath = points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className ?? 'w-full'}
      style={{ height }}
      role="img"
      aria-label="Line chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <line
          key={fraction}
          x1="0"
          x2={W}
          y1={baseline - innerH * fraction}
          y2={baseline - innerH * fraction}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.3"
        />
      ))}
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r="1.3" fill="rgba(9,9,11,0.85)" stroke={stroke} strokeWidth="1" />
      ))}
      {points.map((point, i) =>
        data.length <= 7 || i % 2 === 0 || i === data.length - 1 ? (
          <text
            key={`label-${i}`}
            x={point.x}
            y={H - 2}
            fontSize="3.4"
            fill="rgba(255,255,255,0.45)"
            textAnchor="middle"
          >
            {data[i].label}
          </text>
        ) : null,
      )}
    </svg>
  )
}

export default LineChart

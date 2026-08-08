import { useMemo } from 'react'

function seeded(index, salt) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function makeDrops(count) {
  return Array.from({ length: count }, (_, index) => ({
    left: seeded(index, 1) * 100,
    delay: seeded(index, 2) * 4,
    duration: 1.4 + seeded(index, 3) * 1.8,
    height: 36 + seeded(index, 4) * 64,
    opacity: 0.1 + seeded(index, 5) * 0.2,
  }))
}

function RainBackground({ compact = false }) {
  const drops = useMemo(() => makeDrops(compact ? 16 : 46), [compact])

  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? 'pointer-events-none absolute inset-0 overflow-hidden bg-black'
          : 'pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black'
      }
    >
      {drops.map((drop, index) => (
        <span
          key={index}
          className="absolute top-0 w-px animate-rain-fall bg-lime-400"
          style={{
            left: `${drop.left}%`,
            height: drop.height,
            opacity: compact ? Math.min(0.5, drop.opacity * 1.5) : drop.opacity,
            animationDelay: `-${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default RainBackground

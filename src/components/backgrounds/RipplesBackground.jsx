import { useMemo } from 'react'

function seeded(index, salt) {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function makeRipples(count) {
  return Array.from({ length: count }, (_, index) => ({
    left: seeded(index, 1) * 100,
    top: seeded(index, 2) * 100,
    delay: seeded(index, 3) * 4,
    duration: 2.4 + seeded(index, 4) * 2.2,
    size: 88 + seeded(index, 5) * 96,
    alpha: 0.14 + seeded(index, 6) * 0.14,
  }))
}

function RipplesBackground({ compact = false }) {
  const ripples = useMemo(() => makeRipples(compact ? 6 : 14), [compact])

  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? 'pointer-events-none absolute inset-0 overflow-hidden bg-black'
          : 'pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black'
      }
    >
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="absolute animate-ripple-grow rounded-full border blur-[0.5px]"
          style={{
            left: `${ripple.left}%`,
            top: `${ripple.top}%`,
            width: ripple.size,
            height: ripple.size,
            animationDelay: `-${ripple.delay}s`,
            animationDuration: `${ripple.duration}s`,
            borderColor: `rgb(163 230 53 / ${ripple.alpha})`,
            boxShadow: `0 0 14px 2px rgb(163 230 53 / ${ripple.alpha * 0.45})`,
          }}
        />
      ))}
    </div>
  )
}

export default RipplesBackground

import { useEffect, useRef, useState } from 'react'

const stats = [
  { label: 'Active members', value: '1,248', delta: '+12.5%' },
  { label: 'Avg. monthly revenue', value: '$32,500', delta: '+8.2%' },
  { label: 'Classes held this month', value: '486', delta: '+5.1%' },
  { label: 'Retention rate', value: '87%', delta: '+4.6%' },
]

function StatsSection() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="relative overflow-hidden bg-black py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-lime-400/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-28 top-1/3 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
          Why LEAN
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          Your gym at a glance
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Real numbers from gyms running on LEAN — members, revenue, classes,
          and retention, all in one place.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-lime-400/30 hover:bg-white/10 sm:p-8 ${inView ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-xs font-medium uppercase tracking-widest text-white/50 sm:text-sm">
                {stat.label}
              </p>
              <p className="mt-4 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                {stat.value}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 font-semibold text-lime-400">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 13L13 3M13 3H5M13 3V11" />
                  </svg>
                  {stat.delta}
                </span>
                <span className="text-white/40">vs last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection

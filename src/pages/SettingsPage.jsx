import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { DASHBOARD_BACKGROUNDS } from '../lib/dashboardBackgrounds'
import { useBackground } from '../hooks/useBackground'

const VISIBLE_ON_LOAD = 3

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 text-black"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function SettingsPage() {
  const { backgroundId, setBackgroundId } = useBackground()
  const [expanded, setExpanded] = useState(false)

  const showToggle = DASHBOARD_BACKGROUNDS.length > VISIBLE_ON_LOAD
  const visible = expanded
    ? DASHBOARD_BACKGROUNDS
    : DASHBOARD_BACKGROUNDS.slice(0, VISIBLE_ON_LOAD)

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your account, notifications and preferences."
      />

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            Dashboard background
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/50">
            Pick the animated backdrop shown behind your dashboard. The change
            applies instantly and is saved for next time.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {visible.map((background) => {
              const selected = background.id === backgroundId
              return (
                <button
                  key={background.id}
                  type="button"
                  onClick={() => setBackgroundId(background.id)}
                  aria-pressed={selected}
                  className={`group overflow-hidden rounded-2xl border text-left transition ${
                    selected
                      ? 'border-lime-400 ring-1 ring-lime-400/60'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="relative h-28 overflow-hidden">
                    <background.Background compact />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-lime-400 shadow-lg shadow-lime-400/30">
                        <CheckIcon />
                      </span>
                    )}
                  </div>
                  <div className="border-t border-white/10 bg-black/60 px-3 py-2.5">
                    <span
                      className={`text-sm font-medium ${
                        selected ? 'text-lime-400' : 'text-white/70'
                      }`}
                    >
                      {background.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {showToggle && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-4 text-sm font-medium text-white/60 transition hover:text-white"
            >
              {expanded
                ? 'Show less'
                : `Show all ${DASHBOARD_BACKGROUNDS.length} backgrounds`}
            </button>
          )}
        </section>
      </div>
    </div>
  )
}

export default SettingsPage

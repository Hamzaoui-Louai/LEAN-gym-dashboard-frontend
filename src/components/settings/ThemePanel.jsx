import Panel from '../Panel'
import { DASHBOARD_BACKGROUNDS } from '../../lib/dashboardBackgrounds'
import { VISIBLE_ON_LOAD } from './constants'
import { CheckIcon } from './form'

function ThemePanel({ backgroundId, onSelect, expanded, onToggleExpanded }) {
  const visibleBackgrounds = expanded
    ? DASHBOARD_BACKGROUNDS
    : DASHBOARD_BACKGROUNDS.slice(0, VISIBLE_ON_LOAD)
  const showToggle = DASHBOARD_BACKGROUNDS.length > VISIBLE_ON_LOAD

  return (
    <Panel title="Theme" subtitle="Dashboard background">
      <p className="text-sm leading-relaxed text-white/50">
        Pick the animated backdrop shown behind your dashboard. The change applies instantly
        and is saved for next time.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visibleBackgrounds.map((background) => {
          const selected = background.id === backgroundId
          return (
            <button
              key={background.id}
              type="button"
              onClick={() => onSelect(background.id)}
              aria-pressed={selected}
              className={`group overflow-hidden rounded-2xl border text-left transition ${
                selected
                  ? 'border-lime-400 ring-1 ring-lime-400/60'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div className="relative h-24 overflow-hidden">
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
          onClick={onToggleExpanded}
          className="mt-4 text-sm font-medium text-white/60 transition hover:text-white"
        >
          {expanded ? 'Show less' : `Show all ${DASHBOARD_BACKGROUNDS.length} backgrounds`}
        </button>
      )}
    </Panel>
  )
}

export default ThemePanel

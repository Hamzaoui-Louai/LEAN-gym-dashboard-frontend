import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageTransitionContext } from '../hooks/usePageTransition'

const COVER_MS = 1000
const REVEAL_MS = 2400
const LIME = '#a3e635'
const VIEWBOX_WIDTH = 1440
const VIEWBOX_HEIGHT = 900
const PANEL_SKEW = 14
const PANEL_SHIFT = Math.round(
  Math.tan((PANEL_SKEW * Math.PI) / 180) * VIEWBOX_HEIGHT,
)

function PageTransitionOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[70] overflow-hidden"
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="animate-panel-sweep">
          <g
            style={{
              transformBox: 'fill-box',
              transformOrigin: '0 0',
              transform: `skewX(${PANEL_SKEW}deg)`,
            }}
          >
            <rect
              x={-PANEL_SHIFT}
              y="0"
              width={VIEWBOX_WIDTH + 2 * PANEL_SHIFT}
              height={VIEWBOX_HEIGHT}
              fill={LIME}
            />
          </g>
        </g>

        <g className="animate-panel-sweep">
          <text
            x={VIEWBOX_WIDTH / 2}
            y={VIEWBOX_HEIGHT / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#000"
            fontSize="140"
            fontWeight="900"
            letterSpacing="-4"
          >
            LEAN
          </text>
        </g>
      </svg>
    </div>
  )
}

function PageTransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const phaseRef = useRef('idle')
  const timersRef = useRef([])
  const [phase, setPhaseState] = useState('idle')

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [])

  const setPhase = (next) => {
    phaseRef.current = next
    setPhaseState(next)
  }

  const start = (to) => {
    if (phaseRef.current !== 'idle' || to === location.pathname) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(to)
      window.scrollTo(0, 0)
      return
    }

    setPhase('covering')
    timersRef.current.push(
      setTimeout(() => {
        navigate(to)
        window.scrollTo(0, 0)
        setPhase('revealing')
      }, COVER_MS),
      setTimeout(() => setPhase('idle'), COVER_MS + REVEAL_MS),
    )
  }

  return (
    <PageTransitionContext.Provider value={{ phase, start }}>
      {children}
      {phase !== 'idle' && <PageTransitionOverlay />}
    </PageTransitionContext.Provider>
  )
}

export { PageTransitionProvider }

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { DASHBOARD_PAGES } from '../../lib/dashboardPages'

const SCROLL_MS = 700

const PAGE_INDEX = Object.fromEntries(
  DASHBOARD_PAGES.map((page, index) => [page.path, index]),
)

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function animateEased(duration, onFrame) {
  const startTime = performance.now()
  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1)
    onFrame(progress)
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  requestAnimationFrame(step)
}

export function useScrollTransition({ navigate, pathname }) {
  const [transition, setTransition] = useState(null)
  const contentRef = useRef(null)
  const stagedRef = useRef(null)
  const shellRef = useRef(null)
  const trackRef = useRef(null)
  const initialScrollRef = useRef(0)
  const transitioningRef = useRef(false)
  const animatingRef = useRef(false)
  const navigateRef = useRef(navigate)
  const locationRef = useRef(pathname)

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate])

  useEffect(() => {
    locationRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (!transition) return
    const prevent = (event) => event.preventDefault()
    window.addEventListener('wheel', prevent, { passive: false })
    window.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      window.removeEventListener('wheel', prevent)
      window.removeEventListener('touchmove', prevent)
    }
  }, [transition])

  useLayoutEffect(() => {
    if (!transition) return
    if (animatingRef.current) return
    animatingRef.current = true
    const contentEl = contentRef.current
    const stagedEl = stagedRef.current
    const shellEl = shellRef.current
    const trackEl = trackRef.current
    if (!contentEl || !stagedEl || !shellEl || !trackEl) return

    const contentHeight = contentEl.offsetHeight
    const stagedHeight = stagedEl.offsetHeight
    const contentTop = shellEl.getBoundingClientRect().top + window.scrollY

    shellEl.style.overflow = 'hidden'
    shellEl.style.height = `${contentHeight + stagedHeight}px`
    trackEl.style.willChange = 'transform'

    const startOffset = transition.direction === 'up' ? -stagedHeight : 0
    const endOffset = transition.direction === 'up' ? 0 : -contentHeight

    trackEl.style.transform = `translateY(${startOffset}px)`
    window.scrollTo(0, initialScrollRef.current)

    const finalize = () => {
      const maxScroll = contentTop + stagedHeight - window.innerHeight
      window.scrollTo(0, Math.min(window.scrollY, Math.max(0, maxScroll)))
      contentEl.style.visibility = ''
      flushSync(() => setTransition(null))
      shellEl.style.overflow = ''
      shellEl.style.height = ''
      trackEl.style.transform = ''
      trackEl.style.willChange = ''
      transitioningRef.current = false
      animatingRef.current = false
    }

    const finish = () => {
      contentEl.style.visibility = 'hidden'
      navigateRef.current(transition.target)
      const waitForCommit = (framesLeft) => {
        if (locationRef.current === transition.target || framesLeft <= 0) {
          finalize()
          return
        }
        requestAnimationFrame(() => waitForCommit(framesLeft - 1))
      }
      waitForCommit(120)
    }

    animateEased(SCROLL_MS, (progress) => {
      const eased = easeInOutCubic(progress)
      trackEl.style.transform = `translateY(${
        startOffset + (endOffset - startOffset) * eased
      }px)`
      if (progress === 1) finish()
    })
  }, [transition])

  const requestTransition = (event, targetPath) => {
    const targetIndex = PAGE_INDEX[targetPath]
    const currentIndex = PAGE_INDEX[pathname]
    if (targetIndex === undefined || currentIndex === undefined) return
    if (transitioningRef.current) {
      event.preventDefault()
      return
    }
    if (targetIndex === currentIndex) {
      event.preventDefault()
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    event.preventDefault()
    initialScrollRef.current = window.scrollY
    transitioningRef.current = true
    setTransition({
      direction: targetIndex > currentIndex ? 'down' : 'up',
      target: targetPath,
      component: DASHBOARD_PAGES[targetIndex].component,
    })
  }

  return {
    transition,
    requestTransition,
    contentRef,
    stagedRef,
    shellRef,
    trackRef,
  }
}

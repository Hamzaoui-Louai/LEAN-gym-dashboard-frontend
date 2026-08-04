import { useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'

function LandingPage() {
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return

    const sections = Array.from(document.querySelectorAll('[data-snap-section]'))
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer

    const snap = () => {
      const scrollY = window.scrollY
      const viewportBottom = scrollY + window.innerHeight

      let target = null
      let maxVisible = -1
      for (const section of sections) {
        const visible =
          Math.min(section.offsetTop + section.offsetHeight, viewportBottom) -
          Math.max(section.offsetTop, scrollY)
        if (visible > maxVisible) {
          maxVisible = visible
          target = section
        }
      }

      if (target) {
        const top = target.offsetTop
        if (Math.abs(top - scrollY) > 1) {
          window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
        }
      }
    }

    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(snap, 120)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="bg-black">
      <HeroSection />
      <StatsSection />
    </div>
  )
}

export default LandingPage

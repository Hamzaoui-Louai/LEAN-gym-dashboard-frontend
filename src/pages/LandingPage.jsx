// import { useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import PricingSection from '../components/PricingSection'

function LandingPage() {
  // Scroll snapping is temporarily disabled. To restore, uncomment the
  // `useEffect` import above and the effect below. It snaps to the section
  // that occupies the most of the viewport, on screens >= 1024px only.
  // useEffect(() => {
  //   const desktop = window.matchMedia('(min-width: 1024px)')
  //   const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  //
  //   const sections = Array.from(document.querySelectorAll('[data-snap-section]'))
  //   let timer
  //
  //   const snap = () => {
  //     const scrollY = window.scrollY
  //     const viewportBottom = scrollY + window.innerHeight
  //
  //     let target = null
  //     let maxVisible = -1
  //     for (const section of sections) {
  //       const visible =
  //         Math.min(section.offsetTop + section.offsetHeight, viewportBottom) -
  //         Math.max(section.offsetTop, scrollY)
  //       if (visible > maxVisible) {
  //         maxVisible = visible
  //         target = section
  //       }
  //     }
  //
  //     if (target) {
  //       const top = target.offsetTop
  //       if (Math.abs(top - scrollY) > 1) {
  //         window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' })
  //       }
  //     }
  //   }
  //
  //   const onScroll = () => {
  //     clearTimeout(timer)
  //     timer = setTimeout(snap, 120)
  //   }
  //
  //   const attach = () => window.addEventListener('scroll', onScroll, { passive: true })
  //   const detach = () => window.removeEventListener('scroll', onScroll)
  //
  //   const handleChange = (event) => {
  //     if (event.matches) {
  //       attach()
  //     } else {
  //       clearTimeout(timer)
  //       detach()
  //     }
  //   }
  //
  //   if (desktop.matches) attach()
  //   desktop.addEventListener('change', handleChange)
  //
  //   return () => {
  //     clearTimeout(timer)
  //     detach()
  //     desktop.removeEventListener('change', handleChange)
  //   }
  // }, [])

  return (
    <div className="bg-black">
      <HeroSection />
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-lime-400/25 blur-3xl" />
          <div className="absolute -right-28 top-[38%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>
        <StatsSection />
        <PricingSection />
      </div>
    </div>
  )
}

export default LandingPage

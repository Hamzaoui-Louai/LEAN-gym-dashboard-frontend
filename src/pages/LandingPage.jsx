// import { useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import PricingSection from '../components/PricingSection'
import GlowBackground from '../components/GlowBackground'

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
      <div className="relative">
        <GlowBackground className="sticky top-0 h-dvh" />
        <div className="relative -mt-[100dvh]">
          <StatsSection />
          <PricingSection />
        </div>
      </div>
    </div>
  )
}

export default LandingPage

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Basic',
    price: '$19',
    period: '/month',
    description: 'For solo trainers and small gyms getting started.',
    features: [
      'Up to 100 members',
      'Membership management',
      'Activity tracking',
      'Email support',
    ],
    cta: 'Start free trial',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For growing gyms that want the full picture.',
    features: [
      'Unlimited members',
      'Revenue & analytics',
      'Staff management',
      'Class scheduling',
      'Priority support',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For large operations and multi-location gyms.',
    features: [
      'Everything in Pro',
      'Multi-location support',
      'Equipment maintenance',
      'Custom reporting',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    featured: false,
  },
]

function PricingSection() {
  const [inView, setInView] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!toastOpen) return
    const timer = setTimeout(() => setClosing(true), 5000)
    return () => clearTimeout(timer)
  }, [toastOpen])

  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(() => {
      setToastOpen(false)
      setClosing(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [closing])

  const closeToast = () => {
    if (!toastOpen) return
    setClosing(true)
  }

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
          Pricing
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
          Simple pricing that scales with your gym
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Start free and upgrade when you grow. Every plan includes the core
          dashboard — no hidden fees, cancel anytime.
        </p>

        <div className="mt-12 grid grid-cols-1 items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 text-left backdrop-blur-xl shadow-lg shadow-black/20 transition duration-300 sm:p-8 ${inView ? 'animate-fade-up' : 'opacity-0'} ${
                plan.featured
                  ? 'border-lime-400/40 bg-lime-400/10 hover:border-lime-400/60'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <span className="inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                  Most popular
                </span>
              )}
              <h3 className="mt-4 text-lg font-bold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {plan.description}
              </p>
              <p className="mt-6 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                {plan.price}
                <span className="text-base font-medium text-white/50">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/80">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 h-4 w-4 shrink-0 text-lime-400"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8.5L6.5 12L13 4.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.cta === 'Contact sales' ? (
                <button
                  type="button"
                  onClick={() => {
                    setClosing(false)
                    setToastOpen(true)
                  }}
                  className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wide transition sm:text-base ${
                    plan.featured
                      ? 'bg-lime-400 text-black hover:bg-lime-300'
                      : 'border border-white/15 text-white hover:border-lime-400/50 hover:text-lime-300'
                  }`}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link
                  to="/signup"
                  className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold uppercase tracking-wide transition sm:text-base ${
                    plan.featured
                      ? 'bg-lime-400 text-black hover:bg-lime-300'
                      : 'border border-white/15 text-white hover:border-lime-400/50 hover:text-lime-300'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-white/40 sm:text-sm">
          This is the pricing plan used in this showcase
        </p>
      </div>

      {toastOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm transition-opacity duration-300 ${
            closing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={closeToast}
        >
          <div
            role="alert"
            className={`w-full max-w-md rounded-2xl border border-lime-400/40 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl ${
              closing ? 'animate-fade-out' : 'animate-fade-up'
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-white">Just a showcase</h3>
              <button
                type="button"
                onClick={closeToast}
                aria-label="Close notification"
                className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              This is not a functioning part of the website — it's not meant to
              be part of the showcase.
            </p>
            <button
              type="button"
              onClick={closeToast}
              className="mt-5 rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default PricingSection

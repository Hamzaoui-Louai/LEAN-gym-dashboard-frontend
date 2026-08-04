import LandingBackground from '../components/LandingBackground'

function LandingPage() {
  return (
    <LandingBackground>
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <p
          className="animate-fade-up text-sm font-medium uppercase tracking-[0.35em] text-white/60 sm:text-base"
          style={{ animationDelay: '0s' }}
        >
          Welcome to
        </p>
        <h1
          className="animate-fade-up mt-3 text-6xl font-black leading-none tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ animationDelay: '0.1s' }}
        >
          LEAN
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
          style={{ animationDelay: '0.2s' }}
        >
          LEAN brings your entire gym into a single dashboard — manage member
          subscriptions and activity, track revenue, oversee your staff, and
          stay on top of maintenance, all in one place.
        </p>
        <div
          className="animate-fade-up mt-10 flex flex-col items-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <a
            href="#"
            className="animate-glow inline-block rounded-full bg-lime-400 px-8 py-4 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-lime-300 focus:ring-offset-2 focus:ring-offset-transparent sm:text-base"
          >
            Start free trial
          </a>
          <p className="text-xs text-white/50 sm:text-sm">No credit card required</p>
        </div>
      </section>
    </LandingBackground>
  )
}

export default LandingPage

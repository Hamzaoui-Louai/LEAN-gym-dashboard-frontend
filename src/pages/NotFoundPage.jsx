import TransitionLink from '../components/TransitionLink'
import GlowBackground from '../components/GlowBackground'

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <GlowBackground className="absolute inset-0" />
      <div className="relative flex flex-1 flex-col px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-lime-400">
            LEAN
          </span>
          <TransitionLink
            to="/"
            className="text-sm font-medium text-white/50 transition hover:text-white"
          >
            ← Back to home
          </TransitionLink>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
            Page not found
          </p>
          <h1 className="mt-3 text-6xl font-black tracking-tight text-white sm:text-7xl">
            404
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back to the workout.
          </p>

          <div className="mx-auto mt-10 w-full max-w-xl">
            <TransitionLink
              to="/"
              className="block w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-lime-300"
            >
              Back to home
            </TransitionLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

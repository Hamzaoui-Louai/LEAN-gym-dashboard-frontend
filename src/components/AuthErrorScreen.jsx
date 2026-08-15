import { useNavigate } from 'react-router-dom'

function AuthErrorScreen({
  title = "Couldn't check your session",
  message = "We couldn't reach the server to confirm your session. Check your connection and try again.",
}) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-6 w-6 text-red-400"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
      </div>
      <div>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <p className="mt-1 max-w-md text-sm text-white/60">{message}</p>
      </div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
      >
        Go back
      </button>
    </div>
  )
}

export default AuthErrorScreen

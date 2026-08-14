function DataErrorBanner({ message = "Couldn't load data", onRetry }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-rose-400"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
        <p className="truncate text-sm text-white/80">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full bg-rose-400/20 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/30"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default DataErrorBanner

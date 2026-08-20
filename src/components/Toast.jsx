import { useEffect, useRef } from 'react'

function Toast({ message, duration = 3000, onClose }) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onCloseRef.current?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration])

  if (!message) return null

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 animate-fade-up">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-200 shadow-lg backdrop-blur-md">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-red-400"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <span>{message}</span>
        <button
          type="button"
          onClick={() => onClose?.()}
          className="ml-2 shrink-0 text-red-400/60 transition hover:text-red-200"
          aria-label="Dismiss"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast

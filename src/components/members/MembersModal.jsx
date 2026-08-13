import { useEffect, useId, useRef } from 'react'

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

const SIZE_CLASSES = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

function MembersModal({ open, onClose, title, description, size = 'md', children }) {
  const panelRef = useRef(null)
  const titleId = useId()
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const initial = panel.querySelector(FOCUSABLE)
    initial?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div
        className="relative flex min-h-full items-center justify-center p-4 sm:p-6"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`animate-fade-up relative w-full ${SIZE_CLASSES[size]} rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/60`}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-lg font-bold tracking-tight text-white"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-white/60">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersModal

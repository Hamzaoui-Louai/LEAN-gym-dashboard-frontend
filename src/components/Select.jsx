import { useEffect, useId, useRef, useState } from 'react'

const triggerClass = (open) =>
  `flex w-full items-center justify-between gap-2 rounded-xl border bg-white/5 px-4 py-3 text-left text-sm text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/20 ${
    open ? 'border-lime-400/60' : 'border-white/10'
  }`

function ChevronIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 text-lime-400"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export default function Select({ id, value, onChange, options, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )
  const selectedOption = options[selectedIndex]

  useEffect(() => {
    if (!open) return undefined
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  if (options.length === 0) return null

  const openList = () => {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  const commitOption = (index) => {
    onChange(options[index].value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const moveActive = (delta) => {
    setActiveIndex((current) => {
      const next = current + delta
      if (next < 0) return options.length - 1
      if (next >= options.length) return 0
      return next
    })
  }

  const handleKeyDown = (event) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        openList()
      }
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        commitOption(activeIndex)
        break
      case 'Escape':
        event.stopPropagation()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        className={triggerClass(open)}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={`${listId}-${activeIndex}`}
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#0d0d0d] p-1.5 shadow-2xl shadow-black/60"
        >
          {options.map((option, index) => {
            const selected = option.value === value
            const active = index === activeIndex
            return (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected}
                onClick={() => commitOption(index)}
                onMouseMove={() => setActiveIndex(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active ? 'bg-white/10 text-white' : 'text-white/70'
                } ${selected ? 'font-medium' : ''}`}
              >
                <span className="truncate">{option.label}</span>
                {selected && <CheckIcon />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

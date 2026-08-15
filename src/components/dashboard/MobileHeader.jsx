function MobileHeader({ onMenuOpen }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur lg:hidden">
      <span className="text-lg font-black tracking-tight text-lime-400">
        LEAN
      </span>
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>
    </header>
  )
}

export default MobileHeader

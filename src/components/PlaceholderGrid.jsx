function PlaceholderGrid({ label, rows = 3, cols = 4 }) {
  const squares = Array.from({ length: rows * cols })

  return (
    <div aria-hidden="true">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {label}
        </p>
        <span className="h-2 w-24 rounded-full bg-white/5" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {squares.map((_, index) => (
          <div
            key={index}
            className="h-40 rounded-2xl border border-white/10 bg-white/[0.03] sm:h-44"
          />
        ))}
      </div>
    </div>
  )
}

export default PlaceholderGrid

function buildPages(current, total) {
  const result = []
  if (total <= 7) {
    for (let i = 1; i <= total; i += 1) result.push(i)
    return result
  }
  result.push(1)
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) result.push('gap')
  for (let i = start; i <= end; i += 1) result.push(i)
  if (end < total - 1) result.push('gap')
  result.push(total)
  return result
}

const pageClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-40'
const activeClass =
  'border-lime-400 bg-lime-400 text-black hover:bg-lime-300 hover:text-black'

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={pageClass}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      {pages.map((item, index) =>
        item === 'gap' ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-0.5 text-sm text-white/30"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${pageClass} ${item === page ? activeClass : ''}`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={pageClass}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  )
}

export default Pagination

import { useDataSource } from '../hooks/useDataSource'

const OPTIONS = [
  { id: 'mock', label: 'Mock data' },
  { id: 'api', label: 'Live API' },
]

function DataSourceToggle() {
  const { source, setSource } = useDataSource()

  return (
    <div
      role="group"
      aria-label="Data source"
      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {OPTIONS.map((option) => {
        const active = source === option.id
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setSource(option.id)}
            aria-pressed={active}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              active
                ? 'bg-lime-400 text-black'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default DataSourceToggle

import PlaceholderGrid from './PlaceholderGrid'

function PlaceholderBody({ note }) {
  return (
    <div className="mt-10 space-y-10">
      <PlaceholderGrid label="Overview" />
      <PlaceholderGrid label="Recent activity" />
      <PlaceholderGrid label="Directory" />
      <div className="rounded-2xl border border-dashed border-white/10 p-8">
        <p className="text-sm text-white/50">{note}</p>
      </div>
    </div>
  )
}

export default PlaceholderBody

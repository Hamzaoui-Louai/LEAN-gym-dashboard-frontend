import DataErrorBanner from '../../DataErrorBanner'
import { TileSkeleton } from '../../Skeletons'
import { Tile } from '../widgets'

function OverviewSection({ stats, isPending, isError, onRetry }) {
  if (isPending) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <TileSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-3">
        <DataErrorBanner message="Couldn't load the overview." onRetry={onRetry} />
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <Tile label="Total members" value={stats.totalMembers} />
      <Tile label="Active members" value={stats.activeMembers} tone="lime" />
      <Tile
        label="Expiring memberships"
        value={stats.expiringMemberships}
        tone="amber"
        sub="next 30 days"
      />
      <Tile label="Total staff" value={stats.totalStaff} sub={`${stats.activeStaff} active`} />
      <Tile label="Total equipment" value={stats.totalEquipment} tone="sky" />
      <Tile
        label="Today's check-ins"
        value={stats.todayCheckins}
        tone="lime"
        sub={`${stats.insideNow} inside now`}
      />
    </div>
  )
}

export default OverviewSection

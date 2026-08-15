import DataErrorBanner from '../../DataErrorBanner'
import Panel from '../../Panel'
import { PanelSkeleton } from '../../Skeletons'
import { StatusDot, Tile } from '../widgets'
import { formatMoneyCompact } from '../../../lib/format'

function OperationsSection({ stats, isPending, isError, onRetry }) {
  if (isPending) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-3">
        <DataErrorBanner message="Couldn't load operations." onRetry={onRetry} />
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Panel title="Staff overview" subtitle="Payroll and recent payslips">
        <div className="grid grid-cols-2 gap-3">
          <Tile label="Total staff" value={stats.totalStaff} sub={`${stats.activeStaff} active`} />
          <Tile label="Monthly payroll" value={formatMoneyCompact(stats.monthlyPayroll)} tone="lime" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Recent payslips
        </p>
        <ul className="mt-1 divide-y divide-white/5">
          {stats.recentPayslips.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{row.name}</p>
                <p className="truncate text-xs text-white/40">{row.period}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusDot status={row.status} />
                <span className="text-xs font-semibold text-white/80">{formatMoneyCompact(row.amount)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Equipment overview" subtitle="Fleet status and recent repairs">
        <div className="grid grid-cols-2 gap-3">
          <Tile label="Total equipment" value={stats.totalEquipment} />
          <Tile label="Available" value={stats.availableEquipment} tone="lime" />
          <Tile label="Under maintenance" value={stats.maintenanceEquipment} tone="amber" />
          <Tile label="Broken" value={stats.brokenEquipment} tone="rose" />
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Recent repairs
        </p>
        <ul className="mt-1 divide-y divide-white/5">
          {stats.recentRepairs.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{row.equipment}</p>
                <p className="truncate text-xs text-white/40">{row.issue}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusDot status={row.status} />
                <span className="text-xs font-semibold text-white/80">{formatMoneyCompact(row.cost)}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export default OperationsSection

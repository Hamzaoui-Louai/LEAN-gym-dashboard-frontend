import DataErrorBanner from '../../DataErrorBanner'
import Panel from '../../Panel'
import { PanelSkeleton } from '../../Skeletons'
import BarChart from '../../charts/BarChart'
import Legend from '../../charts/Legend'
import { formatMoneyCompact } from '../../../lib/format'

function FinancesSection({ stats, isPending, isError, onRetry }) {
  if (isPending) {
    return (
      <div className="mt-3">
        <PanelSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-3">
        <DataErrorBanner message="Couldn't load the financial overview." onRetry={onRetry} />
      </div>
    )
  }

  return (
    <div className="mt-3">
      <Panel title="Financial overview" subtitle="This month and the recent trend">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Revenue</p>
              <p className="mt-1 text-2xl font-black text-lime-400">{formatMoneyCompact(stats.monthRevenue)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Expenses</p>
              <p className="mt-1 text-2xl font-black text-rose-400">{formatMoneyCompact(stats.monthExpenses)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/40">Net income</p>
              <p className={`mt-1 text-2xl font-black ${stats.monthNet >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                {formatMoneyCompact(stats.monthNet)}
              </p>
              <p className="mt-1 text-xs text-white/40">{stats.netMargin.toFixed(1)}% margin</p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <BarChart
              data={stats.revExpData}
              series={[
                { key: 'revenue', color: '#a3e635' },
                { key: 'expenses', color: '#fb7185' },
              ]}
              height={220}
            />
            <div className="mt-4">
              <Legend
                items={[
                  { label: 'Revenue', color: '#a3e635' },
                  { label: 'Expenses', color: '#fb7185' },
                ]}
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default FinancesSection

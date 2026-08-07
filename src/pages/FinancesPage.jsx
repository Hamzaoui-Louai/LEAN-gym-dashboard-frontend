import PageHeader from '../components/PageHeader'
import PlaceholderBody from '../components/PlaceholderBody'

function FinancesPage() {
  return (
    <div>
      <PageHeader
        title="Finances"
        description="Track revenue, expenses and financial reports."
      />
      <PlaceholderBody note="Finance reporting module coming soon." />
    </div>
  )
}

export default FinancesPage

import PageHeader from '../components/PageHeader'
import PlaceholderBody from '../components/PlaceholderBody'

function MembersPage() {
  return (
    <div>
      <PageHeader
        title="Members"
        description="Manage your gym's members — profiles, attendance and progress."
      />
      <PlaceholderBody note="Members management module coming soon." />
    </div>
  )
}

export default MembersPage

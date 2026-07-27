import { LeaderboardView } from './LeaderboardView'
import { PendingMatchesView } from './PendingMatchesView'
import { ReportMatchView } from './ReportMatchView'
import { AdminApprovalView } from './AdminApprovalView'
import { UserProfileHeader } from './UserProfileHeader'
import { useMatches } from '../viewmodels/useMatches'
import type { User } from '../models/User'

interface DashboardPageProps {
  currentUser: User
  onSignOut: () => Promise<void>
}

function MemberDashboard({ currentUserId }: { currentUserId: string }) {
  const { activeMembers, pendingMatches, error, report, confirm, cancel } = useMatches(currentUserId)

  return (
    <div style={{ marginTop: '2rem' }}>
      <LeaderboardView />
      <hr />
      <PendingMatchesView
        pendingMatches={pendingMatches}
        activeMembers={activeMembers}
        currentUserId={currentUserId}
        onConfirm={confirm}
        onCancel={cancel}
        error={error}
      />
      <hr />
      <ReportMatchView
        currentUserId={currentUserId}
        activeMembers={activeMembers}
        onReport={report}
        error={error}
      />
    </div>
  )
}

export function DashboardPage({ currentUser, onSignOut }: DashboardPageProps) {
  return (
    <div style={{ padding: '2rem' }}>
      <UserProfileHeader currentUser={currentUser} onSignOut={onSignOut} />

      {currentUser.status === 'active' && <MemberDashboard currentUserId={currentUser.id} />}

      {currentUser.roles.includes('admin') && (
        <div style={{ marginTop: '2rem' }}>
          <AdminApprovalView />
        </div>
      )}
    </div>
  )
}
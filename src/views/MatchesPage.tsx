import { PendingMatchesView } from './PendingMatchesView'
import { ReportMatchView } from './ReportMatchView'
import { useMatches } from '../viewmodels/useMatches'

interface MatchesPageProps {
  currentUserId: string
}

export function MatchesPage({ currentUserId }: MatchesPageProps) {
  const { activeMembers, pendingMatches, error, report, confirm, cancel } = useMatches(currentUserId)

  return (
    <div>
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
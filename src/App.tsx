import { AuthGate } from './views/AuthGate'
import { AdminApprovalView } from './views/AdminApprovalView'
import { ReportMatchView } from './views/ReportMatchView'
import { PendingMatchesView } from './views/PendingMatchesView'
import { useMatches } from './viewmodels/useMatches'
import './App.css'

function MemberDashboard({ currentUserId }: { currentUserId: string }) {
  const { activeMembers, pendingMatches, error, report, confirm, cancel } = useMatches(currentUserId)

  return (
    <div style={{ marginTop: '2rem' }}>
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

function App() {
  return (
    <AuthGate>
      {(currentUser, signOut) => (
        <div style={{ padding: '2rem' }}>
          <h1>Velkommen, {currentUser.name || currentUser.username}!</h1>
          <p>Status: {currentUser.status}</p>
          <p>Roller: {currentUser.roles.join(', ')}</p>
          <p>Rating: {currentUser.rating}</p>
          <button onClick={signOut}>Log ud</button>

          {currentUser.status === 'active' && <MemberDashboard currentUserId={currentUser.id} />}

          {currentUser.roles.includes('admin') && (
            <div style={{ marginTop: '2rem' }}>
              <AdminApprovalView />
            </div>
          )}
        </div>
      )}
    </AuthGate>
  )
}

export default App
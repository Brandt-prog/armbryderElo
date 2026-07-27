import { AuthGate } from './views/AuthGate'
import { DashboardPage } from './views/DashboardPage'
import './App.css'

function App() {
  return (
    <AuthGate>
      {(currentUser, signOut) => (
        <DashboardPage currentUser={currentUser} onSignOut={signOut} />
      )}
    </AuthGate>
  )
}

export default App
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthGate } from './views/AuthGate'
import { Layout } from './views/Layout'
import { LeaderboardPage } from './views/LeaderboardPage'
import { MatchesPage } from './views/MatchesPage'
import { ProfilePage } from './views/ProfilePage'
import { AdminPage } from './views/AdminPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        {(currentUser, signOut) => (
          <Routes>
            <Route element={<Layout currentUser={currentUser} onSignOut={signOut} />}>
              <Route index element={<Navigate to="/leaderboard" replace />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route
                path="/matches"
                element={
                  currentUser.status === 'active' ? (
                    <MatchesPage currentUserId={currentUser.id} />
                  ) : (
                    <Navigate to="/leaderboard" replace />
                  )
                }
              />
              <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
              <Route
                path="/admin"
                element={
                  currentUser.roles.includes('admin') ? (
                    <AdminPage />
                  ) : (
                    <Navigate to="/leaderboard" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/leaderboard" replace />} />
            </Route>
          </Routes>
        )}
      </AuthGate>
    </BrowserRouter>
  )
}

export default App
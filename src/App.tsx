import { AuthGate } from './views/AuthGate'
import './App.css'

function App() {
  return (
    <AuthGate>
      {(currentUser, signOut) => (
        <div style={{ padding: '2rem' }}>
          <h1>Velkommen, {currentUser.name || currentUser.email}!</h1>
          <p>Status: {currentUser.status}</p>
          <p>Roller: {currentUser.roles.join(', ')}</p>
          <p>Rating: {currentUser.rating}</p>
          <button onClick={signOut}>Log ud</button>
        </div>
      )}
    </AuthGate>
  )
}

export default App
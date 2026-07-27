import { PlayerStatsView } from './PlayerStatsView'
import type { User } from '../models/User'

interface ProfilePageProps {
  currentUser: User
}

export function ProfilePage({ currentUser }: ProfilePageProps) {
  return (
    <div>
      <h1>{currentUser.name}</h1>
      <p>Status: {currentUser.status}</p>
      <p>Roller: {currentUser.roles.join(', ')}</p>
      <p>Rating: {currentUser.rating}</p>
      <hr />
      <PlayerStatsView userId={currentUser.id} />
    </div>
  )
}
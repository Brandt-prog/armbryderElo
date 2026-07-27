import type { User } from '../models/User'

interface UserProfileHeaderProps {
  currentUser: User
  onSignOut: () => Promise<void>
}

export function UserProfileHeader({ currentUser, onSignOut }: UserProfileHeaderProps) {
  return (
    <div>
      <h1>Velkommen, {currentUser.name || currentUser.username}!</h1>
      <p>Status: {currentUser.status}</p>
      <p>Roller: {currentUser.roles.join(', ')}</p>
      <p>Rating: {currentUser.rating}</p>
      <button onClick={onSignOut}>Log ud</button>
    </div>
  )
}
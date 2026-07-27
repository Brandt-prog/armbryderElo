import { NavLink } from 'react-router-dom'
import type { User } from '../models/User'

interface NavBarProps {
  currentUser: User
  onSignOut: () => Promise<void>
}

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  marginRight: '1rem',
  fontWeight: isActive ? 'bold' : 'normal',
  textDecoration: isActive ? 'underline' : 'none',
})

export function NavBar({ currentUser, onSignOut }: NavBarProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <NavLink to="/leaderboard" style={linkStyle}>Rangliste</NavLink>
      {currentUser.status === 'active' && (
        <NavLink to="/matches" style={linkStyle}>Kampe</NavLink>
      )}
      <NavLink to="/profile" style={linkStyle}>Min profil</NavLink>
      {currentUser.roles.includes('admin') && (
        <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
      )}
      <button onClick={onSignOut} style={{ marginLeft: 'auto' }}>Log ud</button>
    </nav>
  )
}
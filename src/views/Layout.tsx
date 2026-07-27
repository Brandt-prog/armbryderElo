import { Outlet } from 'react-router-dom'
import { NavBar } from './NavBar'
import type { User } from '../models/User'

interface LayoutProps {
  currentUser: User
  onSignOut: () => Promise<void>
}

export function Layout({ currentUser, onSignOut }: LayoutProps) {
  return (
    <div>
      <NavBar currentUser={currentUser} onSignOut={onSignOut} />
      <div style={{ padding: '2rem' }}>
        <Outlet />
      </div>
    </div>
  )
}
import type { Role } from './Role'
import type { UserStatus } from './UserStatus'

export interface User {
  id: string
  name: string
  email: string
  roles: Role[]
  status: UserStatus

  // Only relevant for members (roles includes 'member')
  rating: number | null
  weight: number | null
  height: number | null

  consentDate: string | null
  createdDate: string
}
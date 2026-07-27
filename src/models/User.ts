import type { Role } from './Role'
import type { UserStatus } from './UserStatus'

export interface User {
  id: string
  name: string
  username: string        // this is a login handle, not a real email
  roles: Role[]
  status: UserStatus

  rating: number | null
  weight: number | null
  height: number | null

  consentDate: string | null
  createdDate: string
}
import { supabase } from '../lib/supabaseClient'
import type { User } from '../models/User'
import type { Role } from '../models/Role'
import type { UserStatus } from '../models/UserStatus'

const TABLE = 'users'

// Shape of a row as it exists in the database (snake_case)
interface UserRow {
  id: string
  name: string
  email: string
  roles: Role[]
  status: UserStatus
  rating: number | null
  weight: number | null
  height: number | null
  consent_date: string | null
  created_date: string
}

function toDomain(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    roles: row.roles,
    status: row.status,
    rating: row.rating,
    weight: row.weight,
    height: row.height,
    consentDate: row.consent_date,
    createdDate: row.created_date,
  }
}

function toRow(user: Partial<User>): Partial<UserRow> {
  const row: Partial<UserRow> = {}
  if (user.id !== undefined) row.id = user.id
  if (user.name !== undefined) row.name = user.name
  if (user.email !== undefined) row.email = user.email
  if (user.roles !== undefined) row.roles = user.roles
  if (user.status !== undefined) row.status = user.status
  if (user.rating !== undefined) row.rating = user.rating
  if (user.weight !== undefined) row.weight = user.weight
  if (user.height !== undefined) row.height = user.height
  if (user.consentDate !== undefined) row.consent_date = user.consentDate
  if (user.createdDate !== undefined) row.created_date = user.createdDate
  return row
}

export const UserRepository = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from(TABLE).select('*')
    if (error) throw error
    return (data as UserRow[]).map(toDomain)
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return toDomain(data as UserRow)
  },

  /**
   * Creates a new user. If `id` is provided (e.g. to match a Supabase Auth
   * user's id when completing a profile after magic link login), it will be
   * used; otherwise the database generates one automatically.
   */
  async create(
    user: Omit<User, 'id' | 'createdDate'> & { id?: string }
  ): Promise<User> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(toRow(user))
      .select()
      .single()
    if (error) throw error
    return toDomain(data as UserRow)
  },

  async update(id: string, changes: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(toRow(changes))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return toDomain(data as UserRow)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  },
}
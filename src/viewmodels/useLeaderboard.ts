import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { UserRepository } from '../repositories/UserRepository'
import type { User } from '../models/User'

export function useLeaderboard() {
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMembers = useCallback(async () => {
    setError(null)
    try {
      const allUsers = await UserRepository.getAll()
      const activeSorted = allUsers
        .filter((u) => u.status === 'active' && u.roles.includes('member'))
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      setMembers(activeSorted)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMembers()

    const channel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        loadMembers()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadMembers])

  return { members, loading, error }
}
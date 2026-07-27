import { useState, useEffect, useCallback } from 'react'
import { UserRepository } from '../repositories/UserRepository'
import type { User } from '../models/User'

export function usePendingMembers() {
  const [pendingMembers, setPendingMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPendingMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const allUsers = await UserRepository.getAll()
      setPendingMembers(allUsers.filter((u) => u.status === 'pending_approval'))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPendingMembers()
  }, [loadPendingMembers])

  const approve = useCallback(
    async (userId: string) => {
      setError(null)
      try {
        await UserRepository.update(userId, { status: 'active' })
        setPendingMembers((prev) => prev.filter((u) => u.id !== userId))
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    []
  )

  const reject = useCallback(
    async (userId: string) => {
      setError(null)
      try {
        // The member never became active, so we simply remove the pending profile.
        await UserRepository.delete(userId)
        setPendingMembers((prev) => prev.filter((u) => u.id !== userId))
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    []
  )

  return { pendingMembers, loading, error, approve, reject, refresh: loadPendingMembers }
}
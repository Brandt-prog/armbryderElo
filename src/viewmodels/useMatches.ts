import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { UserRepository } from '../repositories/UserRepository'
import { MatchRepository } from '../repositories/MatchRepository'
import { reportMatch, confirmMatch, cancelMatch } from '../services/MatchService'
import type { User } from '../models/User'
import type { Match } from '../models/Match'

export function useMatches(currentUserId: string) {
  const [activeMembers, setActiveMembers] = useState<User[]>([])
  const [pendingMatches, setPendingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setError(null)
    try {
      const allUsers = await UserRepository.getAll()
      setActiveMembers(
        allUsers.filter((u) => u.status === 'active' && u.id !== currentUserId)
      )

      const myMatches = await MatchRepository.getByPlayerId(currentUserId)
      setPendingMatches(
        myMatches.filter(
          (m) => m.status === 'pending_confirmation' && m.reportedBy !== currentUserId
        )
      )
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('matches-and-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        loadData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadData])

  const report = useCallback(
    async (opponentId: string, winnerId: string) => {
      setError(null)
      try {
        await reportMatch(currentUserId, opponentId, winnerId, currentUserId)
        // No manual reload needed — the realtime subscription will pick it up
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [currentUserId]
  )

  const confirm = useCallback(
    async (matchId: string) => {
      setError(null)
      try {
        await confirmMatch(matchId, currentUserId)
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
    [currentUserId]
  )

  const cancel = useCallback(async (matchId: string) => {
    setError(null)
    try {
      await cancelMatch(matchId)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }, [])

  return { activeMembers, pendingMatches, loading, error, report, confirm, cancel, refresh: loadData }
}
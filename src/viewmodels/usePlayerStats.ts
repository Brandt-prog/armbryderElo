import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getPlayerStats } from '../services/StatsService'
import type { PlayerStats } from '../services/StatsService'

export function usePlayerStats(userId: string) {
  const [stats, setStats] = useState<PlayerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    setError(null)
    try {
      const result = await getPlayerStats(userId)
      setStats(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadStats()

    const channel = supabase
      .channel(`player-stats-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        loadStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, loadStats])

  return { stats, loading, error }
}